/* ——————————————————————————————————————————————
   MAS D'AIRAGA — admin.js
   Owner dashboard: Supabase auth + booking CRUD + link generation
   —————————————————————————————————————————————— */

let db = null;
let currentUser = null;

/* ———————————————————————————————————————
   BOOT
   ——————————————————————————————————————— */

document.addEventListener("DOMContentLoaded", async function () {
  db = getSupabase();
  if (!db) {
    document.getElementById("login-error").textContent = "Supabase not configured. Update shared/supabase-config.js";
    return;
  }

  // Check existing session
  var { data: { session } } = await db.auth.getSession();
  if (session) {
    currentUser = session.user;
    showDashboard();
  }

  // Login handler
  document.getElementById("login-btn").addEventListener("click", handleLogin);
  document.getElementById("login-password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") handleLogin();
  });

  // Logout handler
  document.getElementById("logout-btn").addEventListener("click", handleLogout);

  // Booking form
  document.getElementById("booking-form").addEventListener("submit", handleCreateBooking);
});

/* ———————————————————————————————————————
   AUTH
   ——————————————————————————————————————— */

async function handleLogin() {
  var email = document.getElementById("login-email").value.trim();
  var password = document.getElementById("login-password").value;
  var errorEl = document.getElementById("login-error");
  errorEl.textContent = "";

  if (!email || !password) {
    errorEl.textContent = "Email and password required.";
    return;
  }

  var { data, error } = await db.auth.signInWithPassword({ email: email, password: password });
  if (error) {
    errorEl.textContent = error.message;
    return;
  }

  currentUser = data.user;
  showDashboard();
}

async function handleLogout() {
  await db.auth.signOut();
  currentUser = null;
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("admin-login").style.display = "flex";
}

function showDashboard() {
  document.getElementById("admin-login").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  document.getElementById("admin-user").textContent = currentUser.email;
  loadBookings();
}

/* ———————————————————————————————————————
   TOKEN GENERATION
   ——————————————————————————————————————— */

function generateToken() {
  // Crypto-random URL-safe token (24 chars)
  var array = new Uint8Array(18);
  crypto.getRandomValues(array);
  return Array.from(array, function (b) { return b.toString(36); }).join("").slice(0, 24);
}

/* ———————————————————————————————————————
   CREATE BOOKING
   ——————————————————————————————————————— */

async function handleCreateBooking(e) {
  e.preventDefault();
  var form = e.target;
  var submitBtn = form.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  var token = generateToken();
  var checkoutDate = new Date(form.checkout_date.value);
  var tokenExpires = new Date(checkoutDate.getTime() + 48 * 60 * 60 * 1000); // +48h

  var booking = {
    guest_name: form.guest_name.value.trim(),
    guest_email: form.guest_email.value.trim() || null,
    guest_phone: form.guest_phone.value.trim() || null,
    checkin_date: form.checkin_date.value,
    checkout_date: form.checkout_date.value,
    num_guests: parseInt(form.num_guests.value) || null,
    token: token,
    token_expires: tokenExpires.toISOString(),
    status: "draft",
    modules: {
      guide: form.mod_guide.checked,
      checkin: form.mod_checkin.checked,
      arrival: form.mod_arrival.checked,
      contract: form.mod_contract.checked,
      checkout: form.mod_checkout.checked,
    },
  };

  var { data, error } = await db.from("bookings").insert([booking]).select().single();

  submitBtn.disabled = false;
  submitBtn.textContent = "Create Booking & Generate Link";

  if (error) {
    alert("Error creating booking: " + error.message);
    return;
  }

  form.reset();
  form.mod_guide.checked = true; // re-check default
  loadBookings();

  // Show success modal with link + actions
  var guestUrl = window.location.origin + "/guest/?t=" + data.token;
  showSuccessModal(data, guestUrl);
}

/* ———————————————————————————————————————
   LOAD & RENDER BOOKINGS
   ——————————————————————————————————————— */

async function loadBookings() {
  var container = document.getElementById("bookings-list");
  container.innerHTML = '<p class="text-muted">Loading...</p>';

  var { data, error } = await db
    .from("bookings")
    .select("*")
    .order("checkin_date", { ascending: false })
    .limit(50);

  if (error) {
    container.innerHTML = '<p class="text-muted">Error loading bookings: ' + error.message + '</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-muted">No bookings yet. Create one above.</p>';
    return;
  }

  container.innerHTML = data.map(function (b) {
    var guestUrl = window.location.origin + "/guest/?t=" + b.token;
    var modules = b.modules || {};
    var modNames = ["guide", "checkin", "arrival", "contract", "checkout"];

    return '<div class="booking-card">' +
      '<div class="booking-card__header">' +
        '<div>' +
          '<div class="booking-card__name">' + escapeHtml(b.guest_name) + '</div>' +
          '<div class="booking-card__dates">' + b.checkin_date + ' → ' + b.checkout_date +
            (b.num_guests ? ' · ' + b.num_guests + ' guests' : '') +
          '</div>' +
        '</div>' +
        '<span class="booking-card__status booking-card__status--' + (b.status || 'draft') + '">' +
          (b.status || 'draft') +
        '</span>' +
      '</div>' +
      '<div class="booking-card__modules">' +
        modNames.map(function (m) {
          return '<span class="booking-card__mod ' + (!modules[m] ? 'booking-card__mod--off' : '') + '">' + m + '</span>';
        }).join("") +
      '</div>' +
      '<a class="booking-card__link" href="' + guestUrl + '" target="_blank">' + guestUrl + '</a>' +
      '<div class="booking-card__actions">' +
        '<button class="admin-btn admin-btn--small" onclick="copyLink(\'' + b.token + '\')">Copy link</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="sendWhatsApp(\'' + b.token + '\', \'' + escapeHtml(b.guest_name) + '\', \'' + (b.guest_phone || '') + '\')">Send WhatsApp</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="markSent(\'' + b.id + '\')">Mark sent</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

/* ———————————————————————————————————————
   ACTIONS
   ——————————————————————————————————————— */

/* ———————————————————————————————————————
   SUCCESS MODAL — replaces ugly alert()
   ——————————————————————————————————————— */

function showSuccessModal(booking, guestUrl) {
  // Remove existing modal if any
  var existing = document.getElementById("success-modal");
  if (existing) existing.remove();

  var enabledMods = Object.entries(booking.modules || {})
    .filter(function (e) { return e[1]; })
    .map(function (e) { return e[0]; });

  var modal = document.createElement("div");
  modal.id = "success-modal";
  modal.className = "modal-overlay";
  modal.innerHTML =
    '<div class="modal-card">' +
      '<div class="modal-header">' +
        '<div class="modal-check">&#10003;</div>' +
        '<h2 class="modal-title">Booking created</h2>' +
        '<p class="modal-sub">' + escapeHtml(booking.guest_name) + ' &middot; ' +
          booking.checkin_date + ' &rarr; ' + booking.checkout_date + '</p>' +
      '</div>' +
      '<div class="modal-body">' +
        '<label class="form-label">Guest link</label>' +
        '<div class="modal-link-box">' +
          '<input type="text" class="admin-input modal-link-input" value="' + guestUrl + '" readonly id="modal-link-input">' +
          '<button class="admin-btn admin-btn--small" onclick="modalCopyLink()">Copy</button>' +
        '</div>' +
        '<p class="modal-mods">Modules: ' + enabledMods.join(', ') + '</p>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button class="admin-btn admin-btn--primary" onclick="modalSendWhatsApp(\'' + booking.token + '\', \'' + escapeHtml(booking.guest_name) + '\', \'' + (booking.guest_phone || '') + '\')">Send via WhatsApp</button>' +
        '<button class="admin-btn admin-btn--ghost" onclick="modalOpenGuest(\'' + guestUrl + '\')">Preview guest page</button>' +
        '<button class="admin-btn admin-btn--ghost" onclick="closeModal()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
  // Select link text for easy copy
  setTimeout(function () {
    document.getElementById("modal-link-input").select();
  }, 100);
}

function modalCopyLink() {
  var input = document.getElementById("modal-link-input");
  navigator.clipboard.writeText(input.value).then(function () {
    var btn = input.nextElementSibling;
    btn.textContent = "Copied!";
    setTimeout(function () { btn.textContent = "Copy"; }, 2000);
  });
}

function modalSendWhatsApp(token, guestName, guestPhone) {
  sendWhatsApp(token, guestName, guestPhone);
}

function modalOpenGuest(url) {
  window.open(url, "_blank");
}

function closeModal() {
  var modal = document.getElementById("success-modal");
  if (modal) modal.remove();
}

function copyLink(token) {
  var url = window.location.origin + "/guest/?t=" + token;
  navigator.clipboard.writeText(url).then(function () {
    // Brief visual feedback on the button
    event.target.textContent = "Copied!";
    setTimeout(function () { event.target.textContent = "Copy link"; }, 2000);
  });
}

function sendWhatsApp(token, guestName, guestPhone) {
  var url = window.location.origin + "/guest/?t=" + token;
  var phone = guestPhone.replace(/\D/g, "");
  var message = encodeURIComponent(
    "Bonjour " + guestName + " ! 🏡\n\n" +
    "Voici votre guide de bienvenue pour le Mas d'Airaga :\n" +
    url + "\n\n" +
    "Here is your welcome guide for Mas d'Airaga.\n\n" +
    "Virginie & Flavien"
  );
  var waUrl = phone
    ? "https://wa.me/" + phone + "?text=" + message
    : "https://wa.me/?text=" + message;
  window.open(waUrl, "_blank");
}

async function markSent(bookingId) {
  await db.from("bookings").update({ status: "sent" }).eq("id", bookingId);
  loadBookings();
}

/* ———————————————————————————————————————
   UTILITY
   ——————————————————————————————————————— */

function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
