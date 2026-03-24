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
    .select("*, checkin_data(arrival_slot, house_rules_accepted, pool_waiver_signed, guests_info, signed_at)")
    .order("checkin_date", { ascending: true })
    .limit(50);

  if (error) {
    container.innerHTML = '<p class="text-muted">Error loading bookings: ' + error.message + '</p>';
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-muted">No bookings yet. Create one above.</p>';
    return;
  }

  // Sort: upcoming first, then past
  var today = new Date().toISOString().slice(0, 10);

  container.innerHTML = data.map(function (b) {
    var guestUrl = window.location.origin + "/guest/?t=" + b.token;
    var modules = b.modules || {};
    var modNames = ["guide", "checkin", "arrival", "contract", "checkout"];
    var isPast = b.checkout_date < today;

    // Extract checkin data from joined table
    var arrivalSlot = null;
    var checkinDone = false;
    var guestCount = 0;
    if (b.checkin_data && b.checkin_data.length > 0) {
      var cd = b.checkin_data[0];
      arrivalSlot = cd.arrival_slot;
      checkinDone = !!cd.house_rules_accepted;
      if (cd.guests_info) {
        guestCount = Array.isArray(cd.guests_info) ? cd.guests_info.length : 0;
      }
    }

    return '<div class="booking-card' + (isPast ? ' booking-card--past' : '') + '">' +
      '<div class="booking-card__header">' +
        '<div>' +
          '<div class="booking-card__name">' + escapeHtml(b.guest_name) + '</div>' +
          '<div class="booking-card__dates">' + b.checkin_date + ' &rarr; ' + b.checkout_date +
            (b.num_guests ? ' &middot; ' + b.num_guests + ' guests' : '') +
          '</div>' +
        '</div>' +
        '<span class="booking-card__status booking-card__status--' + (b.status || 'draft') + '">' +
          (b.status || 'draft') +
        '</span>' +
      '</div>' +
      (arrivalSlot ? '<div class="booking-card__arrival">Arrival: <strong>' + escapeHtml(arrivalSlot) + '</strong></div>' : '') +
      (checkinDone ? '<div class="booking-card__checkin-done">Check-in complete' + (guestCount ? ' &middot; ' + guestCount + ' guests' : '') + ' <button class="checkin-view-btn" onclick="viewCheckinDetails(\'' + b.id + '\')">View</button></div>' : '') +
      '<div class="booking-card__modules">' +
        modNames.map(function (m) {
          return '<span class="booking-card__mod ' + (!modules[m] ? 'booking-card__mod--off' : '') + '">' + m + '</span>';
        }).join("") +
      '</div>' +
      // Notes
      '<div class="booking-card__notes" id="notes-' + b.id + '">' +
        (b.notes ? '<div class="booking-card__note-text">' + escapeHtml(b.notes) + '</div>' : '') +
        '<button class="booking-card__note-btn" onclick="toggleNoteEdit(\'' + b.id + '\', ' + JSON.stringify(escapeHtml(b.notes || '')) + ')">' +
          (b.notes ? 'Edit note' : '+ Add note') +
        '</button>' +
      '</div>' +
      '<a class="booking-card__link" href="' + guestUrl + '" target="_blank">' + guestUrl + '</a>' +
      '<div class="booking-card__actions">' +
        '<button class="admin-btn admin-btn--small" onclick="copyLink(\'' + b.token + '\')">Copy link</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="sendWhatsApp(\'' + b.token + '\', \'' + escapeHtml(b.guest_name) + '\', \'' + (b.guest_phone || '') + '\')">Send WhatsApp</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="markSent(\'' + b.id + '\')">Mark sent</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--danger" onclick="deleteBooking(\'' + b.id + '\', \'' + escapeHtml(b.guest_name) + '\')">Delete</button>' +
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
  var modal2 = document.getElementById("checkin-modal");
  if (modal2) modal2.remove();
}

/* ———————————————————————————————————————
   VIEW CHECK-IN DETAILS MODAL
   ——————————————————————————————————————— */

async function viewCheckinDetails(bookingId) {
  // Fetch full checkin data
  var { data, error } = await db
    .from("checkin_data")
    .select("*")
    .eq("booking_id", bookingId)
    .limit(1);

  if (error || !data || data.length === 0) {
    alert("No check-in data found.");
    return;
  }

  var cd = data[0];

  // Also get booking name
  var { data: bookingData } = await db
    .from("bookings")
    .select("guest_name, checkin_date, checkout_date")
    .eq("id", bookingId)
    .single();

  // Also get contract data if exists
  var contractHtml = "";
  try {
    var { data: contractData } = await db
      .from("contract_data")
      .select("signature, signed_at")
      .eq("booking_id", bookingId)
      .limit(1);
    if (contractData && contractData.length > 0 && contractData[0].signed_at) {
      var ct = contractData[0];
      contractHtml = '<div class="checkin-detail-section">' +
        '<h4 class="checkin-detail-label">Contract</h4>' +
        '<p>Signed &#10003;' + (ct.signature ? ' — <em>' + escapeHtml(ct.signature) + '</em>' : '') + '</p>' +
        '<p class="text-muted" style="font-size:11px">Signed: ' + new Date(ct.signed_at).toLocaleString() + '</p>' +
      '</div>';
    }
  } catch (e) { /* no contract data */ }

  var bName = bookingData ? bookingData.guest_name : "Guest";
  var bDates = bookingData ? bookingData.checkin_date + " \u2192 " + bookingData.checkout_date : "";

  // Build guests table
  var guestsHtml = "";
  if (cd.guests_info && Array.isArray(cd.guests_info)) {
    guestsHtml = '<table class="checkin-detail-table">' +
      '<tr><th>Name</th><th>Date of birth</th></tr>' +
      cd.guests_info.map(function (g) {
        return '<tr><td>' + escapeHtml(g.name) + '</td><td>' + (g.dob || '\u2014') + '</td></tr>';
      }).join("") +
    '</table>';
  }

  // Get signed URL for ID photo if exists
  var idPhotoHtml = "";
  if (cd.id_photo_url) {
    try {
      var { data: signedData } = await db.storage
        .from("checkin-documents")
        .createSignedUrl(cd.id_photo_url, 3600); // 1h expiry
      if (signedData && signedData.signedUrl) {
        idPhotoHtml = '<div class="checkin-detail-section">' +
          '<h4 class="checkin-detail-label">ID Photo</h4>' +
          '<a href="' + signedData.signedUrl + '" target="_blank" rel="noopener">' +
            '<img src="' + signedData.signedUrl + '" style="max-width:100%;max-height:250px;border-radius:6px;border:1px solid var(--ma-border);margin-top:0.25rem">' +
          '</a>' +
        '</div>';
      }
    } catch (e) {
      idPhotoHtml = '<div class="checkin-detail-section"><h4 class="checkin-detail-label">ID Photo</h4><p class="text-muted" style="font-size:12px">Uploaded: ' + escapeHtml(cd.id_photo_url) + ' (cannot preview)</p></div>';
    }
  }

  // Pool waiver detail — show full clauses + signature
  var waiverHtml = '<div class="checkin-detail-section">' +
    '<h4 class="checkin-detail-label">Pool waiver</h4>';
  if (cd.pool_waiver_signed) {
    waiverHtml += '<div class="checkin-waiver-preview">' +
      '<p style="font-size:11px;color:var(--ma-text-muted);margin-bottom:0.5rem;font-style:italic">' +
        'Waiver clauses accepted:' +
      '</p>' +
      '<ol style="font-size:11px;color:var(--ma-text-muted);padding-left:1.25rem;margin:0 0 0.5rem">';
    // Show EN clauses (admin is always EN)
    var clauses = [
      "Use of pool involves risks including injury from equipment, tripping or falling.",
      "Waiver of all claims against Mr/Mrs MAIRE and their representatives.",
      "Release from liability for any loss, damage, injury or expense.",
      "Hold harmless and indemnify from any third party damage or injury.",
      "Children under constant adult supervision at all times near the pool."
    ];
    clauses.forEach(function (c) { waiverHtml += '<li>' + c + '</li>'; });
    waiverHtml += '</ol>' +
      '<p><strong>Signature:</strong> <em style="font-size:16px;color:var(--ma-purple)">' + escapeHtml(cd.pool_waiver_sig) + '</em></p>' +
      (cd.signed_at ? '<p class="text-muted" style="font-size:11px">Signed: ' + new Date(cd.signed_at).toLocaleString() + '</p>' : '') +
    '</div>';
  } else {
    waiverHtml += '<p>Not signed</p>';
  }
  waiverHtml += '</div>';

  // Build modal
  var existing = document.getElementById("checkin-modal");
  if (existing) existing.remove();

  var modal = document.createElement("div");
  modal.id = "checkin-modal";
  modal.className = "modal-overlay";
  modal.innerHTML =
    '<div class="modal-card">' +
      '<div class="modal-header">' +
        '<h2 class="modal-title">Check-in Details</h2>' +
        '<p class="modal-sub">' + escapeHtml(bName) + ' &middot; ' + bDates + '</p>' +
      '</div>' +
      '<div class="modal-body" style="max-height:60vh;overflow-y:auto">' +
        '<div class="checkin-detail-section">' +
          '<h4 class="checkin-detail-label">Guests (' + (cd.guests_info ? cd.guests_info.length : 0) + ')</h4>' +
          guestsHtml +
        '</div>' +
        (cd.arrival_slot ? '<div class="checkin-detail-section"><h4 class="checkin-detail-label">Arrival time</h4><p>' + escapeHtml(cd.arrival_slot) + '</p></div>' : '') +
        '<div class="checkin-detail-section">' +
          '<h4 class="checkin-detail-label">House rules</h4>' +
          '<p>' + (cd.house_rules_accepted ? 'Accepted &#10003;' : 'Not accepted') + '</p>' +
        '</div>' +
        waiverHtml +
        idPhotoHtml +
        contractHtml +
        '<div class="checkin-detail-section">' +
          '<p class="text-muted" style="font-size:11px">Submitted: ' + (cd.submitted_at ? new Date(cd.submitted_at).toLocaleString() : '\u2014') + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="modal-actions">' +
        '<button class="admin-btn admin-btn--ghost" onclick="closeModal()">Close</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
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
   DELETE BOOKING
   ——————————————————————————————————————— */

async function deleteBooking(bookingId, guestName) {
  if (!confirm("Delete booking for " + guestName + "?\n\nThis will also delete all check-in data and cannot be undone.")) {
    return;
  }
  await db.from("bookings").delete().eq("id", bookingId);
  loadBookings();
}

/* ———————————————————————————————————————
   NOTES (admin-only, per booking)
   ——————————————————————————————————————— */

function toggleNoteEdit(bookingId, currentNote) {
  var container = document.getElementById("notes-" + bookingId);
  if (!container) return;

  container.innerHTML =
    '<textarea class="admin-input booking-card__note-textarea" id="note-input-' + bookingId + '" placeholder="Add a note (only visible to admins)...">' + (currentNote || '') + '</textarea>' +
    '<div style="display:flex;gap:0.4rem;margin-top:0.3rem">' +
      '<button class="admin-btn admin-btn--small" onclick="saveNote(\'' + bookingId + '\')">Save</button>' +
      '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="loadBookings()">Cancel</button>' +
    '</div>';

  document.getElementById("note-input-" + bookingId).focus();
}

async function saveNote(bookingId) {
  var input = document.getElementById("note-input-" + bookingId);
  if (!input) return;

  var note = input.value.trim() || null;
  await db.from("bookings").update({ notes: note }).eq("id", bookingId);
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
