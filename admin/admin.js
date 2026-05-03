/* ——————————————————————————————————————————————
   MAS D'AIRAGA — admin.js
   Owner dashboard: Supabase auth + booking CRUD + link generation
   —————————————————————————————————————————————— */

let db = null;
let currentUser = null;
let allBookings = [];         // cached after loadBookings
let currentFilter = "upcoming"; // "upcoming" | "all" | "past"
let calendarBaseDate = new Date(); // first month shown in calendar

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

  // Forgot password handler
  document.getElementById("forgot-btn").addEventListener("click", handleForgotPassword);

  // Password recovery: when Supabase redirects back here, it fires PASSWORD_RECOVERY
  db.auth.onAuthStateChange(function (event) {
    if (event === "PASSWORD_RECOVERY") promptNewPassword();
  });

  // Logout handler
  document.getElementById("logout-btn").addEventListener("click", handleLogout);

  // Booking form
  document.getElementById("booking-form").addEventListener("submit", handleCreateBooking);

  // Close WhatsApp dropdowns on outside click
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".wa-dropdown")) {
      document.querySelectorAll(".wa-dropdown__menu--open").forEach(function (m) {
        m.classList.remove("wa-dropdown__menu--open");
      });
    }
  });
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

async function handleForgotPassword() {
  var email = document.getElementById("login-email").value.trim();
  var errorEl = document.getElementById("login-error");
  var infoEl = document.getElementById("login-info");
  errorEl.textContent = "";
  infoEl.textContent = "";

  if (!email) {
    errorEl.textContent = "Enter your email above first.";
    return;
  }

  var redirectTo = window.location.origin + "/admin/";
  var { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
  if (error) {
    errorEl.textContent = error.message;
    return;
  }

  infoEl.textContent = "Check your inbox — a reset link has been sent.";
}

async function promptNewPassword() {
  var infoEl = document.getElementById("login-info");
  var errorEl = document.getElementById("login-error");
  var newPwd = window.prompt("Set a new password (min 6 characters):");
  if (!newPwd) return;
  if (newPwd.length < 6) {
    errorEl.textContent = "Password must be at least 6 characters.";
    return;
  }
  var { error } = await db.auth.updateUser({ password: newPwd });
  if (error) {
    errorEl.textContent = error.message;
    return;
  }
  infoEl.textContent = "Password updated. You can sign in now.";
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
   COMPUTE DISPLAY STATUS (Feature 1)
   ——————————————————————————————————————— */

function computeDisplayStatus(booking, today) {
  var isPast = booking.checkout_date < today;

  // Check contract signed
  var hasSigned = false;
  if (booking.contract_data && booking.contract_data.length > 0) {
    hasSigned = !!booking.contract_data[0].signed_at;
  }

  // Check checked-in
  var hasCheckedIn = false;
  if (booking.checkin_data && booking.checkin_data.length > 0) {
    hasCheckedIn = !!booking.checkin_data[0].house_rules_accepted;
  }

  // Determine primary status
  var status;
  if (hasSigned) {
    status = "signed";
  } else if (hasCheckedIn) {
    status = "checked-in";
  } else if (booking.status === "sent") {
    status = "sent";
  } else {
    status = "draft";
  }

  return { status: status, isPast: isPast };
}

/* ———————————————————————————————————————
   LOAD & RENDER BOOKINGS
   ——————————————————————————————————————— */

async function loadBookings() {
  var container = document.getElementById("bookings-list");
  container.innerHTML = '<p class="text-muted">Loading...</p>';

  var { data, error } = await db
    .from("bookings")
    .select("*, checkin_data(arrival_slot, house_rules_accepted, pool_waiver_signed, guests_info, signed_at), contract_data(signed_at)")
    .order("checkin_date", { ascending: true })
    .limit(50);

  if (error) {
    container.innerHTML = '<p class="text-muted">Error loading bookings: ' + error.message + '</p>';
    return;
  }

  if (!data || data.length === 0) {
    allBookings = [];
    renderAnalytics();
    renderCalendar();
    container.innerHTML = '<p class="text-muted">No bookings yet. Create one above.</p>';
    return;
  }

  allBookings = data;
  renderAnalytics();
  renderCalendar();
  renderBookings();
}

function renderBookings() {
  var container = document.getElementById("bookings-list");
  var today = new Date().toISOString().slice(0, 10);

  // Filter
  var filtered = allBookings.filter(function (b) {
    if (currentFilter === "upcoming") return b.checkout_date >= today;
    if (currentFilter === "past") return b.checkout_date < today;
    return true; // "all"
  });

  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted">No ' + currentFilter + ' bookings.</p>';
    return;
  }

  container.innerHTML = filtered.map(function (b) {
    var guestUrl = window.location.origin + "/guest/?t=" + b.token;
    var modules = b.modules || {};
    var modNames = ["guide", "checkin", "arrival", "contract", "checkout"];

    var computed = computeDisplayStatus(b, today);
    var displayStatus = computed.status;
    var isPast = computed.isPast;

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

    // Status badge: show both past + primary status if past
    var statusBadges = '';
    if (isPast) {
      statusBadges = '<span class="booking-card__status booking-card__status--past">past</span> ';
    }
    statusBadges += '<span class="booking-card__status booking-card__status--' + displayStatus + '">' + displayStatus + '</span>';

    // WhatsApp dropdown with reminder options
    var waDropdown =
      '<div class="wa-dropdown">' +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="toggleWaDropdown(event)">WhatsApp &#9662;</button>' +
        '<div class="wa-dropdown__menu">' +
          '<button class="wa-dropdown__item" onclick="sendWhatsApp(\'' + b.token + '\', \'' + escapeHtml(b.guest_name) + '\', \'' + (b.guest_phone || '') + '\')">Send welcome link</button>' +
          '<button class="wa-dropdown__item" onclick="sendCheckinReminder(\'' + b.token + '\', \'' + escapeHtml(b.guest_name) + '\', \'' + (b.guest_phone || '') + '\', \'' + b.checkin_date + '\')">Reminder: Check-in</button>' +
          '<button class="wa-dropdown__item" onclick="sendContractReminder(\'' + b.token + '\', \'' + escapeHtml(b.guest_name) + '\', \'' + (b.guest_phone || '') + '\')">Reminder: Contract</button>' +
        '</div>' +
      '</div>';

    return '<div class="booking-card' + (isPast ? ' booking-card--past' : '') + '" id="booking-' + b.id + '">' +
      '<div class="booking-card__header">' +
        '<div>' +
          '<div class="booking-card__name">' + escapeHtml(b.guest_name) + '</div>' +
          '<div class="booking-card__dates">' + b.checkin_date + ' &rarr; ' + b.checkout_date +
            (b.num_guests ? ' &middot; ' + b.num_guests + ' guests' : '') +
          '</div>' +
        '</div>' +
        '<div>' + statusBadges + '</div>' +
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
        '<button class="booking-card__note-btn" data-bid="' + b.id + '" onclick="toggleNoteEdit(this.dataset.bid)">' +
          (b.notes ? 'Edit note' : '+ Add note') +
        '</button>' +
      '</div>' +
      '<a class="booking-card__link" href="' + guestUrl + '" target="_blank">' + guestUrl + '</a>' +
      '<div class="booking-card__actions">' +
        '<button class="admin-btn admin-btn--small" onclick="copyLink(\'' + b.token + '\')">Copy link</button>' +
        waDropdown +
        '<button class="admin-btn admin-btn--small admin-btn--ghost" onclick="markSent(\'' + b.id + '\')">Mark sent</button>' +
        '<button class="admin-btn admin-btn--small admin-btn--danger" onclick="deleteBooking(\'' + b.id + '\', \'' + escapeHtml(b.guest_name) + '\')">Delete</button>' +
      '</div>' +
    '</div>';
  }).join("");
}

/* ———————————————————————————————————————
   ANALYTICS (Feature 5)
   ——————————————————————————————————————— */

function renderAnalytics() {
  var container = document.getElementById("analytics-bar");
  var today = new Date().toISOString().slice(0, 10);

  var total = allBookings.length;
  var upcoming = 0;
  var checkinsCompleted = 0;
  var contractsSigned = 0;

  allBookings.forEach(function (b) {
    if (b.checkout_date >= today) upcoming++;
    if (b.checkin_data && b.checkin_data.length > 0 && b.checkin_data[0].house_rules_accepted) checkinsCompleted++;
    if (b.contract_data && b.contract_data.length > 0 && b.contract_data[0].signed_at) contractsSigned++;
  });

  container.innerHTML =
    '<div class="analytics-card">' +
      '<div class="analytics-card__value">' + total + '</div>' +
      '<div class="analytics-card__label">Total bookings</div>' +
    '</div>' +
    '<div class="analytics-card">' +
      '<div class="analytics-card__value">' + upcoming + '</div>' +
      '<div class="analytics-card__label">Upcoming</div>' +
    '</div>' +
    '<div class="analytics-card">' +
      '<div class="analytics-card__value">' + checkinsCompleted + '</div>' +
      '<div class="analytics-card__label">Check-ins done</div>' +
    '</div>' +
    '<div class="analytics-card">' +
      '<div class="analytics-card__value">' + contractsSigned + '</div>' +
      '<div class="analytics-card__label">Contracts signed</div>' +
    '</div>';
}

/* ———————————————————————————————————————
   FILTER TABS (Feature 3)
   ——————————————————————————————————————— */

function setFilter(filter) {
  currentFilter = filter;
  // Update active tab
  document.querySelectorAll(".filter-tab").forEach(function (tab) {
    tab.classList.toggle("filter-tab--active", tab.dataset.filter === filter);
  });
  renderBookings();
}

/* ———————————————————————————————————————
   BOOKING CALENDAR (Feature 2)
   ——————————————————————————————————————— */

function renderCalendar() {
  var section = document.getElementById("calendar-section");
  if (allBookings.length === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";

  var baseYear = calendarBaseDate.getFullYear();
  var baseMonth = calendarBaseDate.getMonth();

  // Title
  var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  document.getElementById("calendar-title").textContent =
    monthNames[baseMonth] + " " + baseYear + " / " +
    monthNames[(baseMonth + 1) % 12] + " " + (baseMonth === 11 ? baseYear + 1 : baseYear);

  var container = document.getElementById("calendar-months");
  container.innerHTML = renderMonth(baseYear, baseMonth) + renderMonth(
    baseMonth === 11 ? baseYear + 1 : baseYear,
    (baseMonth + 1) % 12
  );
}

function renderMonth(year, month) {
  var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var dayNames = ["Mo","Tu","We","Th","Fr","Sa","Su"];
  var today = new Date().toISOString().slice(0, 10);

  var firstDay = new Date(year, month, 1);
  var daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday=0 start
  var startDay = (firstDay.getDay() + 6) % 7;

  // Build booked-day map for this month: date -> { name, id }
  var bookedMap = {};
  allBookings.forEach(function (b) {
    var start = new Date(b.checkin_date + "T00:00:00");
    var end = new Date(b.checkout_date + "T00:00:00");
    var cursor = new Date(start);
    while (cursor <= end) {
      var key = cursor.toISOString().slice(0, 10);
      if (cursor.getFullYear() === year && cursor.getMonth() === month) {
        bookedMap[key] = { name: b.guest_name, id: b.id };
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  var html = '<div>' +
    '<div class="calendar-month__title">' + monthNames[month] + ' ' + year + '</div>' +
    '<div class="calendar-grid">';

  // Day headers
  dayNames.forEach(function (d) {
    html += '<div class="calendar-grid__head">' + d + '</div>';
  });

  // Empty cells before first day
  for (var i = 0; i < startDay; i++) {
    html += '<div class="calendar-day calendar-day--empty"></div>';
  }

  // Days
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    var classes = "calendar-day";
    var title = "";

    if (dateStr === today) classes += " calendar-day--today";

    if (bookedMap[dateStr]) {
      var bk = bookedMap[dateStr];
      classes += " calendar-day--booked";

      // Determine if start, mid, or end
      var prevDate = new Date(year, month, d - 1);
      var nextDate = new Date(year, month, d + 1);
      var prevKey = prevDate.toISOString().slice(0, 10);
      var nextKey = nextDate.toISOString().slice(0, 10);
      var hasPrev = !!bookedMap[prevKey];
      var hasNext = !!bookedMap[nextKey];

      if (!hasPrev && hasNext) classes += " calendar-day--booked-start";
      else if (hasPrev && hasNext) classes += " calendar-day--booked-mid";
      else if (hasPrev && !hasNext) classes += " calendar-day--booked-end";

      html += '<div class="' + classes + '" data-booking-id="' + bk.id + '" onclick="scrollToBooking(\'' + bk.id + '\')">' +
        '<span class="cal-day__num">' + d + '</span>' +
        '<span class="cal-day__tip">' + escapeHtml(bk.name) + '</span>' +
      '</div>';
    } else {
      html += '<div class="' + classes + '">' + d + '</div>';
    }
  }

  html += '</div></div>';
  return html;
}

function calendarNavigate(direction) {
  calendarBaseDate.setMonth(calendarBaseDate.getMonth() + direction);
  renderCalendar();
}

function scrollToBooking(bookingId) {
  // Switch to "All" filter to ensure card is visible
  setFilter("all");
  setTimeout(function () {
    var card = document.getElementById("booking-" + bookingId);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    // Flash highlight
    card.classList.add("booking-card--highlight");
    setTimeout(function () { card.classList.remove("booking-card--highlight"); }, 2000);
  }, 50);
}

/* ———————————————————————————————————————
   WHATSAPP MESSAGES (Feature 4)
   ——————————————————————————————————————— */

function toggleWaDropdown(e) {
  e.stopPropagation();
  var menu = e.target.closest(".wa-dropdown").querySelector(".wa-dropdown__menu");
  // Close all others first
  document.querySelectorAll(".wa-dropdown__menu--open").forEach(function (m) {
    if (m !== menu) m.classList.remove("wa-dropdown__menu--open");
  });
  menu.classList.toggle("wa-dropdown__menu--open");
}

function sendWhatsApp(token, guestName, guestPhone) {
  var url = window.location.origin + "/guest/?t=" + token;
  var phone = guestPhone.replace(/\D/g, "");
  var message = encodeURIComponent(
    "Bonjour " + guestName + " ! \ud83c\udfe1\n\n" +
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

function sendCheckinReminder(token, guestName, guestPhone, checkinDate) {
  var url = window.location.origin + "/guest/?t=" + token;
  var phone = guestPhone.replace(/\D/g, "");
  var dateObj = new Date(checkinDate + "T00:00:00");
  var formattedDate = dateObj.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  var message = encodeURIComponent(
    "Bonjour " + guestName + " ! \ud83c\udf1e\n\n" +
    "A gentle reminder: your stay at Mas d'Airaga begins on " + formattedDate + ".\n\n" +
    "Check-in is from 4:00 PM. Address: Mas d'Airaga, Uzes, Gard.\n\n" +
    "Please complete your online check-in before arrival:\n" +
    url + "\n\n" +
    "See you soon!\nVirginie & Flavien"
  );
  var waUrl = phone
    ? "https://wa.me/" + phone + "?text=" + message
    : "https://wa.me/?text=" + message;
  window.open(waUrl, "_blank");
}

function sendContractReminder(token, guestName, guestPhone) {
  var url = window.location.origin + "/guest/?t=" + token;
  var phone = guestPhone.replace(/\D/g, "");

  var message = encodeURIComponent(
    "Bonjour " + guestName + " ! \ud83d\udcdd\n\n" +
    "A quick reminder to sign the rental contract for your stay at Mas d'Airaga.\n\n" +
    "You can review and sign it here:\n" +
    url + "\n\n" +
    "Thank you!\nVirginie & Flavien"
  );
  var waUrl = phone
    ? "https://wa.me/" + phone + "?text=" + message
    : "https://wa.me/?text=" + message;
  window.open(waUrl, "_blank");
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

async function markSent(bookingId) {
  await db.from("bookings").update({ status: "sent" }).eq("id", bookingId);
  loadBookings();
}

/* ———————————————————————————————————————
   DELETE BOOKING
   ——————————————————————————————————————— */

function deleteBooking(bookingId, guestName) {
  var existing = document.getElementById("confirm-modal");
  if (existing) existing.remove();

  var modal = document.createElement("div");
  modal.id = "confirm-modal";
  modal.className = "modal-overlay";
  modal.innerHTML =
    '<div class="modal-card" style="max-width:380px">' +
      '<div class="modal-header" style="background:#C0392B">' +
        '<div class="modal-check" style="background:rgba(255,255,255,0.2);font-size:18px">&#10005;</div>' +
        '<h2 class="modal-title">Delete booking?</h2>' +
        '<p class="modal-sub">' + escapeHtml(guestName) + '</p>' +
      '</div>' +
      '<div class="modal-body" style="text-align:center">' +
        '<p style="font-size:13px;color:var(--ma-text-mid)">This will permanently delete the booking, all check-in data, and the signed contract. This cannot be undone.</p>' +
      '</div>' +
      '<div class="modal-actions" style="flex-direction:row;gap:0.75rem">' +
        '<button class="admin-btn admin-btn--ghost" style="flex:1" onclick="closeConfirmModal()">Cancel</button>' +
        '<button class="admin-btn admin-btn--small" style="flex:1;background:#C0392B;color:#fff;padding:0.6rem 1rem;font-size:14px" onclick="confirmDelete(\'' + bookingId + '\')">Delete</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);
}

function closeConfirmModal() {
  var m = document.getElementById("confirm-modal");
  if (m) m.remove();
}

async function confirmDelete(bookingId) {
  var btn = document.querySelector("#confirm-modal .admin-btn:last-child");
  if (btn) { btn.disabled = true; btn.textContent = "Deleting..."; }
  await db.from("bookings").delete().eq("id", bookingId);
  closeConfirmModal();
  loadBookings();
}

/* ———————————————————————————————————————
   NOTES (admin-only, per booking)
   ——————————————————————————————————————— */

function toggleNoteEdit(bookingId) {
  var container = document.getElementById("notes-" + bookingId);
  if (!container) return;

  // Get existing note text from the DOM
  var noteTextEl = container.querySelector(".booking-card__note-text");
  var currentNote = noteTextEl ? noteTextEl.textContent : "";

  container.innerHTML =
    '<textarea class="admin-input booking-card__note-textarea" id="note-input-' + bookingId + '" placeholder="Add a note (only visible to admins)...">' + escapeHtml(currentNote) + '</textarea>' +
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
