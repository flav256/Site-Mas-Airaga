/* ——————————————————————————————————————————————
   MAS D'AIRAGA — guide.js (v2 — Supabase token auth)
   Replaces the old pin-based gate with magic-link token validation.
   Renders only the modules enabled for the current booking.
   —————————————————————————————————————————————— */

/* ———————————————————————————————————————
   GLOBALS
   ——————————————————————————————————————— */

let currentLang = "fr";
let currentBooking = null;   // populated after token validation
let db = null;               // Supabase client

/* ———————————————————————————————————————
   BOOT — runs on DOMContentLoaded
   ——————————————————————————————————————— */

document.addEventListener("DOMContentLoaded", async function () {
  db = getSupabase();

  // Extract token from URL: ?t=abc123
  const params = new URLSearchParams(window.location.search);
  const token = params.get("t");

  if (!token) {
    showGateError(
      "Lien invalide. Verifiez le lien recu par WhatsApp ou email.",
      "Invalid link. Please check the link you received via WhatsApp or email."
    );
    return;
  }

  // Validate token against Supabase
  try {
    const { data, error } = await db
      .from("bookings")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      showGateError(
        "Lien non reconnu. Contactez le proprietaire.",
        "Link not recognized. Please contact the owner."
      );
      return;
    }

    // Check expiry
    if (data.token_expires && new Date(data.token_expires) < new Date()) {
      showGateError(
        "Ce lien a expire. Contactez le proprietaire pour un nouveau lien.",
        "This link has expired. Contact the owner for a new link."
      );
      return;
    }

    // Success — store booking and open the guide
    currentBooking = data;
    openGuide();

  } catch (err) {
    console.error("Token validation error:", err);
    showGateError(
      "Erreur de connexion. Reessayez dans un instant.",
      "Connection error. Please try again in a moment."
    );
  }
});

/* ———————————————————————————————————————
   GATE UI
   ——————————————————————————————————————— */

function showGateError(msgFr, msgEn) {
  const spinner = document.getElementById("gate-spinner");
  const status = document.getElementById("gate-status");
  const error = document.getElementById("gate-error");
  const hint = document.getElementById("gate-hint");

  if (spinner) spinner.style.display = "none";
  if (status) status.style.display = "none";
  if (error) error.innerHTML = msgFr + "<br><span style='color:var(--ma-text-muted);font-size:12px'>" + msgEn + "</span>";
  if (hint) hint.innerHTML = "WhatsApp: <a href='https://wa.me/971502048428'>+971 50 204 8428</a>";
}

function openGuide() {
  document.getElementById("ma-gate").style.display = "none";
  document.getElementById("ma-guide").style.display = "block";
  applyModules();
  initGuide();
}

/* ———————————————————————————————————————
   MODULE VISIBILITY
   Hides sections whose data-module is not enabled in booking.modules
   ——————————————————————————————————————— */

function applyModules() {
  if (!currentBooking || !currentBooking.modules) return;

  const modules = currentBooking.modules;

  // Hide sections whose module is disabled
  document.querySelectorAll("[data-module]").forEach(function (sec) {
    const mod = sec.getAttribute("data-module");
    if (modules[mod] === false) {
      sec.classList.add("sec--hidden");
    } else {
      sec.classList.remove("sec--hidden");
    }
  });

  // Show check-in CTA only if checkin or arrival module is enabled
  const checkinCta = document.getElementById("checkin-cta");
  if (checkinCta) {
    checkinCta.style.display = (modules.checkin || modules.arrival) ? "" : "none";
  }
}

/* ———————————————————————————————————————
   LANGUAGE TOGGLE
   ——————————————————————————————————————— */

function setLang(lang) {
  currentLang = lang;
  document.body.classList.toggle("lang-en", lang === "en");
  document.getElementById("btn-fr").classList.toggle("lang-btn--active", lang === "fr");
  document.getElementById("btn-en").classList.toggle("lang-btn--active", lang === "en");
  renderHouseRules();
  renderPoolRules();
  renderChecklist();
}

function t(obj) {
  return obj[currentLang] || obj.fr || obj.en || "";
}

/* ———————————————————————————————————————
   WIFI REVEAL (quick strip tap)
   ——————————————————————————————————————— */

function revealWifi(el) {
  var pop = document.getElementById("wifi-pop");
  var d = MAS_AIRAGA.access.wifi;
  var tapLabel = el.querySelector(".strip__value--tap");
  if (pop.style.display === "flex") {
    pop.style.display = "none";
    if (tapLabel) tapLabel.style.display = "";
  } else {
    document.getElementById("wifi-ssid-pop").textContent = d.ssid;
    document.getElementById("wifi-pass-pop").textContent = d.password;
    pop.style.display = "flex";
    if (tapLabel) tapLabel.style.display = "none";
  }
}

/* ———————————————————————————————————————
   INIT — runs after gate opens
   ——————————————————————————————————————— */

function initGuide() {
  var d = MAS_AIRAGA;

  // Personalized guest name
  if (currentBooking && currentBooking.guest_name) {
    var heroGuest = document.getElementById("hero-guest");
    if (heroGuest) {
      heroGuest.textContent = currentBooking.guest_name;
    }
  }

  // Owner contacts
  var wa = "https://wa.me/" + d.owners.phone_abudhabi.replace(/\D/g, "");
  document.getElementById("wa-btn").href = wa;
  document.getElementById("tel-btn").href = "tel:" + d.owners.phone_france;

  // WiFi card (section)
  document.getElementById("wifi-ssid").textContent = d.access.wifi.ssid;
  document.getElementById("wifi-pass").textContent = d.access.wifi.password;

  renderRooms();
  renderPoolRules();
  renderHouseRules();
  renderEmergencyContacts();
  renderLocalGuide();
  renderChecklist();
  initArrivalTime();
  initCheckin();
}

/* ———————————————————————————————————————
   ROOMS
   ——————————————————————————————————————— */

function renderRooms() {
  var r = MAS_AIRAGA.rooms;
  var out = document.getElementById("rooms-container");
  if (!out) return;

  var groups = [
    { title_fr: "Rez-de-chaussee", title_en: "Ground floor", items: r.ground_floor },
    { title_fr: "Premier etage",   title_en: "First floor",  items: r.first_floor },
    { title_fr: "Exterieur",       title_en: "Outside",      items: r.outside },
  ];

  out.innerHTML = groups.map(function (g) {
    return '<div class="room-group">' +
      '<h4 class="room-group__title">' +
        '<span class="fr">' + g.title_fr + '</span>' +
        '<span class="en">' + g.title_en + '</span>' +
      '</h4>' +
      g.items.map(function (item) {
        return '<div class="room-item">' +
          '<span class="room-item__name">' +
            '<span class="fr">' + item.name + '</span>' +
            '<span class="en">' + (item.name_en || item.name) + '</span>' +
          '</span>' +
          '<span class="room-item__desc">' +
            '<span class="fr">' + item.description_fr + '</span>' +
            '<span class="en">' + (item.description_en || item.description_fr) + '</span>' +
          '</span>' +
        '</div>';
      }).join("") +
    '</div>';
  }).join("");

  // Baby equipment note
  if (r.baby_equipment && r.baby_equipment.length) {
    out.innerHTML += '<div class="infocard" style="margin-top:0.25rem">' +
      '<h3 class="infocard__label fr">Equipement bebe disponible</h3>' +
      '<h3 class="infocard__label en">Baby equipment available</h3>' +
      '<ul class="rule-list" style="margin-top:0.25rem">' +
        r.baby_equipment.map(function (i) { return '<li>' + i + '</li>'; }).join("") +
      '</ul>' +
    '</div>';
  }
}

/* ———————————————————————————————————————
   POOL RULES
   ——————————————————————————————————————— */

function renderPoolRules() {
  var el = document.getElementById("pool-rules");
  if (!el) return;
  var rules = currentLang === "en"
    ? MAS_AIRAGA.property.pool.tenant_tasks.map(function (t) { return t.split(" / ").pop(); })
    : MAS_AIRAGA.property.pool.tenant_tasks.map(function (t) { return t.split(" / ")[0]; });
  el.innerHTML = rules.map(function (r) { return '<li>' + r + '</li>'; }).join("");
}

/* ———————————————————————————————————————
   HOUSE RULES
   ——————————————————————————————————————— */

function renderHouseRules() {
  var el = document.getElementById("house-rules");
  if (!el) return;
  var rules = currentLang === "en"
    ? MAS_AIRAGA.house_rules.en
    : MAS_AIRAGA.house_rules.fr;
  el.innerHTML = rules.map(function (r) { return '<li>' + r + '</li>'; }).join("");
}

/* ———————————————————————————————————————
   EMERGENCY CONTACTS
   ——————————————————————————————————————— */

function renderEmergencyContacts() {
  var el = document.getElementById("emergency-contacts");
  if (!el) return;
  var contacts = MAS_AIRAGA.emergency.contacts;

  el.innerHTML = contacts.map(function (c) {
    var isEmergency = c.type === "emergency";
    return '<div class="contact-card ' + (isEmergency ? "contact-card--emergency" : "") + '">' +
      '<p class="contact-card__type">' + typeLabel(c.type) + '</p>' +
      '<p class="contact-card__name">' + c.name + '</p>' +
      (c.address ? '<p class="contact-card__addr">' + c.address + '</p>' : "") +
      '<a class="contact-card__num" href="tel:' + (c.number || "").replace(/\s/g, "") + '">' + c.number + '</a>' +
      (c.number_fr ? '<br><a class="contact-card__num" href="tel:' + c.number_fr.replace(/\s/g, "") + '" style="font-size:13px">' + c.number_fr + '</a>' : "") +
    '</div>';
  }).join("");
}

function typeLabel(type) {
  var labels = {
    emergency: "Urgences",
    medical:   currentLang === "en" ? "Doctor" : "Medecin",
    hospital:  currentLang === "en" ? "Hospital" : "Hopital",
    owner:     currentLang === "en" ? "Owners" : "Proprietaires",
  };
  return labels[type] || type;
}

/* ———————————————————————————————————————
   LOCAL GUIDE
   ——————————————————————————————————————— */

function renderLocalGuide() {
  var lg = MAS_AIRAGA.local_guide;

  // Supermarkets
  var smEl = document.getElementById("supermarkets");
  if (smEl) {
    smEl.innerHTML = lg.supermarkets.map(function (s) {
      return '<div class="local-item">' +
        '<span class="local-item__name">' + s.name + '</span>' +
        '<span class="local-item__dist">' + s.distance + '</span>' +
      '</div>' +
      (s.phone ? '<div class="local-item" style="padding-top:0;border-bottom:none">' +
        '<span class="local-item__dist" style="font-size:11px">' + s.address + '</span>' +
        '<a class="local-item__phone" href="tel:' + s.phone.replace(/\s/g, "") + '">' + s.phone + '</a>' +
      '</div>' : "");
    }).join("");
  }

  // Restaurants
  var restEl = document.getElementById("restaurants");
  if (restEl) {
    restEl.innerHTML = lg.restaurants.map(function (r) {
      return '<div class="local-item">' +
        '<span class="local-item__name">' + r.name + '</span>' +
        '<span class="local-item__dist">' + r.address + '</span>' +
      '</div>';
    }).join("");
  }

  // Market
  var mktEl = document.getElementById("market-block");
  if (mktEl) {
    var m = lg.market;
    mktEl.innerHTML = '<div class="market-block">' +
      '<p class="market-block__name">' + m.name + '</p>' +
      '<p class="market-block__freq">' + m.location + ' · ' + m.frequency + '</p>' +
      '<p class="market-block__desc fr">' + m.description_fr + '</p>' +
      '<p class="market-block__desc en">' + m.description_en + '</p>' +
    '</div>';
  }

  // Attractions
  var attEl = document.getElementById("attractions");
  if (attEl) {
    attEl.innerHTML = '<div class="attractions-grid">' +
      lg.attractions.map(function (a) {
        return '<div class="attraction-item">' +
          '<span class="attraction-item__name">' + a.name + '</span>' +
          '<span class="attraction-item__dist">' + a.distance + '</span>' +
        '</div>';
      }).join("") +
    '</div>';
  }
}

/* ———————————————————————————————————————
   DEPARTURE CHECKLIST (interactive)
   ——————————————————————————————————————— */

function getCheckedState() {
  try { return JSON.parse(sessionStorage.getItem("ma_checklist") || "{}"); }
  catch (e) { return {}; }
}

function saveCheckedState(state) {
  sessionStorage.setItem("ma_checklist", JSON.stringify(state));
}

function renderChecklist() {
  var el = document.getElementById("departure-checklist");
  if (!el) return;

  var items = currentLang === "en"
    ? MAS_AIRAGA.departure_checklist.en
    : MAS_AIRAGA.departure_checklist.fr;

  var state = getCheckedState();

  el.innerHTML = items.map(function (item) {
    var done = !!state[item.id];
    return '<div class="checklist__item ' + (done ? "checklist__item--done" : "") + '"' +
      ' onclick="toggleCheck(' + item.id + ')"' +
      ' role="checkbox" aria-checked="' + done + '" tabindex="0"' +
      ' onkeydown="if(event.key===\'Enter\'||event.key===\' \')toggleCheck(' + item.id + ')">' +
      '<div class="checklist__box"></div>' +
      '<span class="checklist__num">' + item.id + '.</span>' +
      '<span class="checklist__label">' + item.label + '</span>' +
    '</div>';
  }).join("");

  // Trash note
  var trashEl = document.getElementById("trash-note");
  if (trashEl) {
    var note = MAS_AIRAGA.departure_checklist.trash_location_note;
    trashEl.textContent = currentLang === "en" ? note.en : note.fr;
  }
}

function toggleCheck(id) {
  var state = getCheckedState();
  state[id] = !state[id];
  saveCheckedState(state);
  renderChecklist();
}

/* ———————————————————————————————————————
   ARRIVAL TIME MODULE
   ——————————————————————————————————————— */

var selectedArrivalSlot = null;

async function initArrivalTime() {
  var slotsEl = document.getElementById("arrival-slots");
  if (!slotsEl) return;

  // Check if already submitted (look in checkin_data)
  if (currentBooking && db) {
    try {
      var { data } = await db
        .from("checkin_data")
        .select("arrival_slot")
        .eq("booking_id", currentBooking.id)
        .not("arrival_slot", "is", null)
        .limit(1);

      if (data && data.length > 0 && data[0].arrival_slot) {
        showArrivalConfirmed(data[0].arrival_slot);
        return;
      }
    } catch (e) {
      // Continue with form if query fails
    }
  }

  // Render time slot buttons
  var slots = MAS_AIRAGA.arrival_slots;
  slotsEl.innerHTML = slots.map(function (slot, i) {
    var isTbc = i === slots.length - 1;
    return '<div class="arrival-slot' + (isTbc ? ' arrival-slot--tbc' : '') + '"' +
      ' onclick="selectArrivalSlot(this, \'' + slot.replace(/'/g, "\\'") + '\')"' +
      ' role="radio" tabindex="0"' +
      ' onkeydown="if(event.key===\'Enter\'||event.key===\' \')selectArrivalSlot(this, \'' + slot.replace(/'/g, "\\'") + '\')">' +
      slot +
    '</div>';
  }).join("");
}

function selectArrivalSlot(el, slot) {
  selectedArrivalSlot = slot;

  // Update visual selection
  document.querySelectorAll(".arrival-slot").forEach(function (s) {
    s.classList.remove("arrival-slot--selected");
  });
  el.classList.add("arrival-slot--selected");

  // Enable submit button
  document.getElementById("arrival-submit-btn").disabled = false;
}

async function submitArrivalTime() {
  if (!selectedArrivalSlot || !currentBooking || !db) return;

  var btn = document.getElementById("arrival-submit-btn");
  btn.disabled = true;
  btn.innerHTML = '<span class="fr">Envoi en cours...</span><span class="en">Sending...</span>';
  // Re-apply lang visibility
  if (currentLang === "en") {
    btn.querySelector(".fr").style.display = "none";
    btn.querySelector(".en").style.display = "inline";
  } else {
    btn.querySelector(".en").style.display = "none";
    btn.querySelector(".fr").style.display = "inline";
  }

  try {
    // Upsert into checkin_data
    var { error } = await db.from("checkin_data").insert({
      booking_id: currentBooking.id,
      arrival_slot: selectedArrivalSlot,
    });

    if (error) {
      // Might already have a row — try update
      await db.from("checkin_data")
        .update({ arrival_slot: selectedArrivalSlot })
        .eq("booking_id", currentBooking.id);
    }

    showArrivalConfirmed(selectedArrivalSlot);

  } catch (err) {
    console.error("Failed to save arrival time:", err);
    btn.disabled = false;
    btn.innerHTML = '<span class="fr">Confirmer l\'heure d\'arriv\u00e9e</span><span class="en">Confirm arrival time</span>';
  }
}

function showArrivalConfirmed(slot) {
  var formState = document.getElementById("arrival-form-state");
  var confirmedState = document.getElementById("arrival-confirmed-state");
  var slotDisplay = document.getElementById("arrival-confirmed-slot");

  if (formState) formState.style.display = "none";
  if (confirmedState) confirmedState.style.display = "block";
  if (slotDisplay) slotDisplay.textContent = slot;
}

/* ———————————————————————————————————————
   ONLINE CHECK-IN MODULE
   ——————————————————————————————————————— */

var guestRowCount = 0;

async function initCheckin() {
  var formState = document.getElementById("checkin-form-state");
  if (!formState) return;

  // Check if already submitted
  if (currentBooking && db) {
    try {
      var { data } = await db
        .from("checkin_data")
        .select("house_rules_accepted, pool_waiver_signed")
        .eq("booking_id", currentBooking.id)
        .limit(1);

      if (data && data.length > 0 && data[0].house_rules_accepted) {
        document.getElementById("checkin-form-state").style.display = "none";
        document.getElementById("checkin-confirmed-state").style.display = "block";
        return;
      }
    } catch (e) { /* continue with form */ }
  }

  // Render house rules in checkin section
  renderCheckinHouseRules();

  // Render pool waiver text
  renderCheckinWaiver();

  // Add initial guest rows (2 by default)
  addGuestRow();
  addGuestRow();

  // ID file preview
  var fileInput = document.getElementById("checkin-id-file");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var preview = document.getElementById("checkin-id-preview");
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          preview.innerHTML = '<img src="' + e.target.result + '" alt="ID preview">';
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

function renderCheckinHouseRules() {
  var el = document.getElementById("checkin-house-rules");
  if (!el) return;
  var rules = currentLang === "en"
    ? MAS_AIRAGA.house_rules.en
    : MAS_AIRAGA.house_rules.fr;
  el.innerHTML = rules.map(function (r) { return '<li>' + r + '</li>'; }).join("");
}

function renderCheckinWaiver() {
  var el = document.getElementById("checkin-waiver-text");
  if (!el) return;
  var clauses = currentLang === "en"
    ? MAS_AIRAGA.pool_waiver.clauses_en
    : MAS_AIRAGA.pool_waiver.clauses_fr;
  var disclaimer = currentLang === "en"
    ? MAS_AIRAGA.pool_waiver.disclaimer_note.en
    : MAS_AIRAGA.pool_waiver.disclaimer_note.fr;

  el.innerHTML = '<p><em>' + disclaimer + '</em></p>' +
    '<ol>' + clauses.map(function (c) { return '<li>' + c + '</li>'; }).join("") + '</ol>';
}

function addGuestRow() {
  guestRowCount++;
  var container = document.getElementById("checkin-guests-list");
  if (!container) return;

  var row = document.createElement("div");
  row.className = "guest-row";
  row.id = "guest-row-" + guestRowCount;
  row.innerHTML =
    '<div>' +
      '<div class="guest-row__label">' + (currentLang === "en" ? "Full name" : "Nom complet") + '</div>' +
      '<input type="text" class="checkin-input guest-name" placeholder="' + (currentLang === "en" ? "First Last" : "Pr\u00e9nom Nom") + '">' +
    '</div>' +
    '<div>' +
      '<div class="guest-row__label">' + (currentLang === "en" ? "Date of birth" : "Date de naissance") + '</div>' +
      '<input type="date" class="checkin-input guest-dob">' +
    '</div>' +
    (guestRowCount > 1 ? '<button type="button" class="guest-row__remove" onclick="removeGuestRow(' + guestRowCount + ')">&times;</button>' : '<div></div>');

  container.appendChild(row);
}

function removeGuestRow(id) {
  var row = document.getElementById("guest-row-" + id);
  if (row) row.remove();
}

async function submitCheckin() {
  var errorEl = document.getElementById("checkin-error");
  errorEl.textContent = "";

  // Validate
  var rulesAccepted = document.getElementById("checkin-rules-accept").checked;
  var waiverAccepted = document.getElementById("checkin-waiver-accept").checked;
  var sigName = document.getElementById("checkin-sig-name").value.trim();

  if (!rulesAccepted) {
    errorEl.textContent = currentLang === "en"
      ? "Please accept the house rules."
      : "Veuillez accepter les r\u00e8gles de la maison.";
    return;
  }

  if (!waiverAccepted || !sigName) {
    errorEl.textContent = currentLang === "en"
      ? "Please sign the pool waiver (enter your name and check the box)."
      : "Veuillez signer la d\u00e9charge piscine (entrez votre nom et cochez la case).";
    return;
  }

  // Collect guest info
  var guestRows = document.querySelectorAll(".guest-row");
  var guestsInfo = [];
  guestRows.forEach(function (row) {
    var name = row.querySelector(".guest-name");
    var dob = row.querySelector(".guest-dob");
    if (name && name.value.trim()) {
      guestsInfo.push({
        name: name.value.trim(),
        dob: dob ? dob.value : null,
      });
    }
  });

  if (guestsInfo.length === 0) {
    errorEl.textContent = currentLang === "en"
      ? "Please enter at least one guest name."
      : "Veuillez entrer au moins un nom de voyageur.";
    return;
  }

  var btn = document.getElementById("checkin-submit-btn");
  btn.disabled = true;
  btn.textContent = currentLang === "en" ? "Sending..." : "Envoi en cours...";

  try {
    // Upload ID photo if provided
    var idPhotoUrl = null;
    var fileInput = document.getElementById("checkin-id-file");
    if (fileInput && fileInput.files && fileInput.files[0]) {
      var file = fileInput.files[0];
      var ext = file.name.split(".").pop();
      var path = "id-photos/" + currentBooking.id + "." + ext;

      var { error: uploadError } = await db.storage
        .from("checkin-documents")
        .upload(path, file, { upsert: true });

      if (!uploadError) {
        idPhotoUrl = path;
      }
    }

    // Check if checkin_data row already exists (from arrival time)
    var { data: existing } = await db
      .from("checkin_data")
      .select("id")
      .eq("booking_id", currentBooking.id)
      .limit(1);

    var checkinPayload = {
      guests_info: guestsInfo,
      house_rules_accepted: true,
      pool_waiver_signed: true,
      pool_waiver_sig: sigName,
      signed_at: new Date().toISOString(),
      id_photo_url: idPhotoUrl,
    };

    if (existing && existing.length > 0) {
      // Update existing row
      await db.from("checkin_data")
        .update(checkinPayload)
        .eq("booking_id", currentBooking.id);
    } else {
      // Insert new row
      checkinPayload.booking_id = currentBooking.id;
      await db.from("checkin_data").insert(checkinPayload);
    }

    // Show confirmed state
    document.getElementById("checkin-form-state").style.display = "none";
    document.getElementById("checkin-confirmed-state").style.display = "block";

  } catch (err) {
    console.error("Check-in submission error:", err);
    errorEl.textContent = currentLang === "en"
      ? "Error submitting. Please try again."
      : "Erreur lors de l'envoi. Veuillez r\u00e9essayer.";
    btn.disabled = false;
    btn.textContent = currentLang === "en" ? "Submit check-in" : "Envoyer l'enregistrement";
  }
}
