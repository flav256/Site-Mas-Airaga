/* ——————————————————————————————————————————————
   MAS D'AIRAGA — guide.js (v2 — Supabase token auth)
   Replaces the old pin-based gate with magic-link token validation.
   Renders only the modules enabled for the current booking.
   —————————————————————————————————————————————— */

/* ———————————————————————————————————————
   GLOBALS
   ——————————————————————————————————————— */

var currentLang = "fr";      // fr | en | nl | de
var currentBooking = null;
var db = null;

// NL/DE → EN for content, but keeps UI labels separate
function contentLang() {
  return (currentLang === "fr") ? "fr" : "en";
}

/* ———————————————————————————————————————
   SMALL UI LABELS — NL & DE translations
   ——————————————————————————————————————— */

var UI = {
  fr: {
    welcomeHome: "Bienvenue chez vous",
    arrivalTime: "Heure d'arriv\u00e9e",
    onlineCheckin: "Enregistrement en ligne",
    rentalContract: "Contrat de location",
    yourArrival: "Votre arriv\u00e9e",
    theHouse: "La maison",
    thePool: "La piscine",
    houseRules: "R\u00e8gles de la maison",
    emergency: "Urgences & contacts",
    aroundMas: "Autour du Mas",
    departure: "Avant votre d\u00e9part",
    footerWish: "Nous vous souhaitons un s\u00e9jour merveilleux.",
    checkin: "Arriv\u00e9e",
    checkout: "D\u00e9part",
    fillIn: "Compl\u00e9ter",
    sending: "Envoi en cours...",
    downloadWaiver: "T\u00e9l\u00e9charger la d\u00e9charge sign\u00e9e (PDF)",
    downloadContract: "T\u00e9l\u00e9charger le contrat sign\u00e9 (PDF)",
    addChild: "+ Ajouter un enfant",
    addGuest: "+ Ajouter un voyageur",
    childName: "Prenom & Nom",
    childAge: "Age",
    guestName: "Nom complet",
    guestDob: "Date de naissance",
  },
  en: {
    welcomeHome: "Welcome home",
    arrivalTime: "Arrival time",
    onlineCheckin: "Online check-in",
    rentalContract: "Rental agreement",
    yourArrival: "Your arrival",
    theHouse: "The house",
    thePool: "The pool",
    houseRules: "House rules",
    emergency: "Emergency & contacts",
    aroundMas: "Around the Mas",
    departure: "Before you leave",
    footerWish: "We wish you a wonderful stay.",
    checkin: "Check-in",
    checkout: "Check-out",
    fillIn: "Fill in",
    sending: "Sending...",
    downloadWaiver: "Download signed waiver (PDF)",
    downloadContract: "Download signed contract (PDF)",
    addChild: "+ Add a child",
    addGuest: "+ Add a guest",
    childName: "First & Last Name",
    childAge: "Age",
    guestName: "Full name",
    guestDob: "Date of birth",
  },
  nl: {
    welcomeHome: "Welkom thuis",
    arrivalTime: "Aankomsttijd",
    onlineCheckin: "Online check-in",
    rentalContract: "Huurovereenkomst",
    yourArrival: "Uw aankomst",
    theHouse: "Het huis",
    thePool: "Het zwembad",
    houseRules: "Huisregels",
    emergency: "Noodgevallen & contact",
    aroundMas: "Rond het Mas",
    departure: "Voor vertrek",
    footerWish: "Wij wensen u een heerlijk verblijf.",
    checkin: "Inchecken",
    checkout: "Uitchecken",
    fillIn: "Invullen",
    sending: "Verzenden...",
    downloadWaiver: "Ondertekende verklaring downloaden (PDF)",
    downloadContract: "Ondertekend contract downloaden (PDF)",
    addChild: "+ Kind toevoegen",
    addGuest: "+ Gast toevoegen",
    childName: "Voor- & achternaam",
    childAge: "Leeftijd",
    guestName: "Volledige naam",
    guestDob: "Geboortedatum",
  },
  de: {
    welcomeHome: "Willkommen zu Hause",
    arrivalTime: "Ankunftszeit",
    onlineCheckin: "Online Check-in",
    rentalContract: "Mietvertrag",
    yourArrival: "Ihre Ankunft",
    theHouse: "Das Haus",
    thePool: "Der Pool",
    houseRules: "Hausordnung",
    emergency: "Notfall & Kontakte",
    aroundMas: "Rund ums Mas",
    departure: "Vor Ihrer Abreise",
    footerWish: "Wir w\u00fcnschen Ihnen einen wunderbaren Aufenthalt.",
    checkin: "Check-in",
    checkout: "Check-out",
    fillIn: "Ausf\u00fcllen",
    sending: "Senden...",
    downloadWaiver: "Unterschriebene Erkl\u00e4rung herunterladen (PDF)",
    downloadContract: "Unterschriebenen Vertrag herunterladen (PDF)",
    addChild: "+ Kind hinzuf\u00fcgen",
    addGuest: "+ Gast hinzuf\u00fcgen",
    childName: "Vor- & Nachname",
    childAge: "Alter",
    guestName: "Vollst\u00e4ndiger Name",
    guestDob: "Geburtsdatum",
  },
};

function ui(key) {
  return (UI[currentLang] && UI[currentLang][key]) || UI.en[key] || UI.fr[key] || key;
}

/* ———————————————————————————————————————
   BOOT — runs on DOMContentLoaded
   ——————————————————————————————————————— */

document.addEventListener("DOMContentLoaded", async function () {
  db = getSupabase();

  // Detect language: saved > browser > default FR
  var savedLang = localStorage.getItem("ma-guide-lang");
  var validLangs = ["fr", "en", "nl", "de"];
  if (savedLang && validLangs.indexOf(savedLang) !== -1) {
    currentLang = savedLang;
  } else {
    var bl = (navigator.language || "").substring(0, 2);
    if (validLangs.indexOf(bl) !== -1) currentLang = bl;
  }
  applyLang(currentLang);

  // Language button listeners
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  // Extract token from URL: ?t=abc123
  var params = new URLSearchParams(window.location.search);
  var token = params.get("t");

  if (!token) {
    showGateError(
      "Lien invalide. Verifiez le lien recu par WhatsApp ou email.",
      "Invalid link. Please check the link you received via WhatsApp or email."
    );
    return;
  }

  // Validate token against Supabase
  try {
    var { data, error } = await db
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
  var spinner = document.getElementById("gate-spinner");
  var status = document.getElementById("gate-status");
  var error = document.getElementById("gate-error");
  var hint = document.getElementById("gate-hint");

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
  buildNav();
  initScrollSpy();
}

/* ———————————————————————————————————————
   MODULE VISIBILITY
   ——————————————————————————————————————— */

function applyModules() {
  if (!currentBooking || !currentBooking.modules) return;
  var modules = currentBooking.modules;

  document.querySelectorAll("[data-module]").forEach(function (sec) {
    var mod = sec.getAttribute("data-module");
    if (modules[mod] === false) {
      sec.classList.add("sec--hidden");
    } else {
      sec.classList.remove("sec--hidden");
    }
  });

  var checkinCta = document.getElementById("checkin-cta");
  if (checkinCta) {
    checkinCta.style.display = (modules.checkin || modules.arrival) ? "" : "none";
  }
}

/* ———————————————————————————————————————
   LANGUAGE TOGGLE
   ——————————————————————————————————————— */

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("ma-guide-lang", lang);
  applyLang(lang);
  renderHouseRules();
  renderPoolRules();
  renderChecklist();
  renderCheckinWaiver();
  renderContract();
  renderRooms();
  renderEmergencyContacts();
  renderLocalGuide();
  buildNav();
  // Update dates in hero
  if (currentBooking && currentBooking.checkin_date && currentBooking.checkout_date) {
    var heroDates = document.getElementById("hero-dates");
    if (heroDates) {
      var opts = { day: "numeric", month: "long", year: "numeric" };
      var loc = { fr: "fr-FR", en: "en-GB", nl: "nl-NL", de: "de-DE" }[currentLang] || "fr-FR";
      var ci = new Date(currentBooking.checkin_date + "T12:00:00");
      var co = new Date(currentBooking.checkout_date + "T12:00:00");
      heroDates.textContent = ci.toLocaleDateString(loc, opts) + " \u2192 " + co.toLocaleDateString(loc, opts);
    }
  }
}

function applyLang(lang) {
  currentLang = lang;
  // NL/DE use English content, so toggle body.lang-en for those too
  document.body.classList.toggle("lang-en", lang !== "fr");
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.classList.toggle("lang-btn--active", btn.getAttribute("data-lang") === lang);
  });
}

function t(obj) {
  return obj[currentLang] || obj[contentLang()] || obj.fr || obj.en || "";
}

/* ———————————————————————————————————————
   NAVIGATION — grouped horizontal scrolling
   ——————————————————————————————————————— */

// Map section IDs to grouped nav labels
var NAV_GROUPS = [
  // group 1: actions
  { ids: ["sec-arrival-time", "sec-checkin", "sec-contract"], labelKey: "onlineCheckin", icon: "\u270d" },
  // group 2: the house
  { ids: ["sec-arrival", "sec-house", "sec-pool"], labelKey: "theHouse", icon: "\u2302" },
  // group 3: info
  { ids: ["sec-rules", "sec-emergency", "sec-local"], labelKey: "aroundMas", icon: "\u2139" },
  // group 4: departure
  { ids: ["sec-departure"], labelKey: "departure", icon: "\u2708" },
];

function buildNav() {
  var linksEl = document.getElementById("guide-nav-links");
  if (!linksEl) return;

  var html = "";
  var first = true;

  NAV_GROUPS.forEach(function (group) {
    // Check if any section in this group is visible
    var visibleId = null;
    for (var i = 0; i < group.ids.length; i++) {
      var sec = document.getElementById(group.ids[i]);
      if (sec && !sec.classList.contains("sec--hidden")) {
        visibleId = group.ids[i];
        break;
      }
    }
    if (!visibleId) return;

    if (!first) {
      html += '<span class="guide-nav__sep">\u00b7</span>';
    }
    first = false;

    html += '<a class="guide-nav__link" href="#' + visibleId +
      '" data-nav-ids="' + group.ids.join(",") +
      '" onclick="navClick(event, \'' + visibleId + '\')">' +
      ui(group.labelKey) + '</a>';
  });

  linksEl.innerHTML = html;
}

function navClick(e, id) {
  e.preventDefault();
  var el = document.getElementById(id);
  if (el) {
    var topbarH = 42;
    var navH = 36;
    var y = el.getBoundingClientRect().top + window.scrollY - topbarH - navH;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function initScrollSpy() {
  var onScroll = function () {
    var links = document.querySelectorAll(".guide-nav__link");
    if (!links.length) return;

    var scrollY = window.scrollY + 120;
    var activeLink = null;

    links.forEach(function (link) {
      var ids = (link.getAttribute("data-nav-ids") || "").split(",");
      for (var i = 0; i < ids.length; i++) {
        var sec = document.getElementById(ids[i]);
        if (sec && !sec.classList.contains("sec--hidden") && sec.offsetTop <= scrollY) {
          activeLink = link;
        }
      }
    });

    links.forEach(function (l) { l.classList.remove("active"); });
    if (activeLink) activeLink.classList.add("active");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
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

  // Personalized guest name + dates
  if (currentBooking) {
    if (currentBooking.guest_name) {
      var heroGuest = document.getElementById("hero-guest");
      if (heroGuest) heroGuest.textContent = currentBooking.guest_name;
    }
    if (currentBooking.checkin_date && currentBooking.checkout_date) {
      var heroDates = document.getElementById("hero-dates");
      if (heroDates) {
        var opts = { day: "numeric", month: "long", year: "numeric" };
        var ci = new Date(currentBooking.checkin_date + "T12:00:00");
        var co = new Date(currentBooking.checkout_date + "T12:00:00");
        var loc = { fr: "fr-FR", en: "en-GB", nl: "nl-NL", de: "de-DE" }[currentLang] || "fr-FR";
        heroDates.textContent = ci.toLocaleDateString(loc, opts) + " \u2192 " + co.toLocaleDateString(loc, opts);
      }
    }
  }

  // Owner contacts
  var wa = "https://wa.me/" + d.owners.phone_abudhabi.replace(/\D/g, "");
  document.getElementById("wa-btn").href = wa;
  document.getElementById("tel-btn").href = "tel:" + d.owners.phone_france;

  // WiFi card
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
  initContract();
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

  var cl = contentLang();

  out.innerHTML = groups.map(function (g) {
    return '<div class="room-group">' +
      '<h4 class="room-group__title">' + (cl === "en" ? g.title_en : g.title_fr) + '</h4>' +
      g.items.map(function (item) {
        return '<div class="room-item">' +
          '<span class="room-item__name">' + (cl === "en" ? (item.name_en || item.name) : item.name) + '</span>' +
          '<span class="room-item__desc">' + (cl === "en" ? (item.description_en || item.description_fr) : item.description_fr) + '</span>' +
        '</div>';
      }).join("") +
    '</div>';
  }).join("");

  if (r.baby_equipment && r.baby_equipment.length) {
    out.innerHTML += '<div class="infocard" style="margin-top:0.25rem">' +
      '<h3 class="infocard__label">' + (cl === "en" ? "Baby equipment available" : "Equipement bebe disponible") + '</h3>' +
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
  var cl = contentLang();
  var rules = cl === "en"
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
  var rules = contentLang() === "en" ? MAS_AIRAGA.house_rules.en : MAS_AIRAGA.house_rules.fr;
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
  var cl = contentLang();
  var labels = {
    emergency: "Urgences",
    medical:   cl === "en" ? "Doctor" : "Medecin",
    hospital:  cl === "en" ? "Hospital" : "Hopital",
    owner:     cl === "en" ? "Owners" : "Proprietaires",
  };
  return labels[type] || type;
}

/* ———————————————————————————————————————
   LOCAL GUIDE
   ——————————————————————————————————————— */

function renderLocalGuide() {
  var lg = MAS_AIRAGA.local_guide;
  var cl = contentLang();

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

  var restEl = document.getElementById("restaurants");
  if (restEl) {
    restEl.innerHTML = lg.restaurants.map(function (r) {
      return '<div class="local-item">' +
        '<span class="local-item__name">' + r.name + '</span>' +
        '<span class="local-item__dist">' + r.address + '</span>' +
      '</div>';
    }).join("");
  }

  var mktEl = document.getElementById("market-block");
  if (mktEl) {
    var m = lg.market;
    mktEl.innerHTML = '<div class="market-block">' +
      '<p class="market-block__name">' + m.name + '</p>' +
      '<p class="market-block__freq">' + m.location + ' \u00b7 ' + m.frequency + '</p>' +
      '<p class="market-block__desc">' + (cl === "en" ? m.description_en : m.description_fr) + '</p>' +
    '</div>';
  }

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

  var cl = contentLang();
  var items = cl === "en" ? MAS_AIRAGA.departure_checklist.en : MAS_AIRAGA.departure_checklist.fr;
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

  var trashEl = document.getElementById("trash-note");
  if (trashEl) {
    var note = MAS_AIRAGA.departure_checklist.trash_location_note;
    trashEl.textContent = cl === "en" ? note.en : note.fr;
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
    } catch (e) { /* continue */ }
  }

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
  document.querySelectorAll(".arrival-slot").forEach(function (s) {
    s.classList.remove("arrival-slot--selected");
  });
  el.classList.add("arrival-slot--selected");
  document.getElementById("arrival-submit-btn").disabled = false;
}

async function submitArrivalTime() {
  if (!selectedArrivalSlot || !currentBooking || !db) return;

  var btn = document.getElementById("arrival-submit-btn");
  btn.disabled = true;
  btn.textContent = ui("sending");

  try {
    var { error } = await db.from("checkin_data").insert({
      booking_id: currentBooking.id,
      arrival_slot: selectedArrivalSlot,
    });

    if (error) {
      await db.from("checkin_data")
        .update({ arrival_slot: selectedArrivalSlot })
        .eq("booking_id", currentBooking.id);
    }

    showArrivalConfirmed(selectedArrivalSlot);
  } catch (err) {
    console.error("Failed to save arrival time:", err);
    btn.disabled = false;
    btn.textContent = ui("arrivalTime");
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
var childRowCount = 0;

async function initCheckin() {
  var formState = document.getElementById("checkin-form-state");
  if (!formState) return;

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
    } catch (e) { /* continue */ }
  }

  renderCheckinHouseRules();
  renderCheckinWaiver();
  addGuestRow();
  addGuestRow();

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
  var rules = contentLang() === "en" ? MAS_AIRAGA.house_rules.en : MAS_AIRAGA.house_rules.fr;
  el.innerHTML = rules.map(function (r) { return '<li>' + r + '</li>'; }).join("");
}

function renderCheckinWaiver() {
  var el = document.getElementById("checkin-waiver-text");
  if (!el) return;

  var pw = MAS_AIRAGA.pool_waiver;
  var cl = contentLang();
  var sections = cl === "en" ? pw.sections_en : pw.sections_fr;
  var signOff = cl === "en" ? pw.sign_off_en : pw.sign_off_fr;
  var title = cl === "en" ? pw.title_en : pw.title_fr;

  var html = '<h4 style="text-align:center;margin-bottom:0.5rem">' + title + '</h4>' +
    '<p style="text-align:center;font-size:11px;margin-bottom:0.75rem">' + pw.subtitle + '</p>';

  sections.forEach(function (sec) {
    html += '<h4>' + sec.num + '. ' + sec.title + '</h4>';
    if (sec.text) html += '<p>' + sec.text + '</p>';
    if (sec.items) {
      html += '<ul>' + sec.items.map(function (item) {
        return '<li>' + item + '</li>';
      }).join("") + '</ul>';
    }
  });

  html += '<h4>' + (cl === "en" ? pw.children_title_en : pw.children_title_fr) + '</h4>';
  html += '<p style="font-style:italic;font-size:11px">' +
    (cl === "en" ? 'Please fill in the children section below.' : 'Veuillez remplir la section enfants ci-dessous.') + '</p>';
  html += '<div class="waiver-signoff">' + signOff + '</div>';

  el.innerHTML = html;
}

/* Children rows for waiver section 4 */

function addChildRow() {
  childRowCount++;
  var container = document.getElementById("children-list");
  if (!container) return;

  var row = document.createElement("div");
  row.className = "child-row";
  row.id = "child-row-" + childRowCount;
  row.innerHTML =
    '<div>' +
      '<div class="child-row__label">' + ui("childName") + '</div>' +
      '<input type="text" class="checkin-input child-name" placeholder="' + ui("childName") + '">' +
    '</div>' +
    '<div>' +
      '<div class="child-row__label">' + ui("childAge") + '</div>' +
      '<input type="number" class="checkin-input child-age" min="0" max="17" placeholder="0">' +
    '</div>' +
    '<button type="button" class="child-row__remove" onclick="removeChildRow(' + childRowCount + ')">&times;</button>';

  container.appendChild(row);
}

function removeChildRow(id) {
  var row = document.getElementById("child-row-" + id);
  if (row) row.remove();
}

function getChildrenData() {
  var children = [];
  document.querySelectorAll(".child-row").forEach(function (row) {
    var name = row.querySelector(".child-name");
    var age = row.querySelector(".child-age");
    if (name && name.value.trim()) {
      children.push({ name: name.value.trim(), age: age ? parseInt(age.value) || null : null });
    }
  });
  return children;
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
      '<div class="guest-row__label">' + ui("guestName") + '</div>' +
      '<input type="text" class="checkin-input guest-name" placeholder="' + ui("guestName") + '">' +
    '</div>' +
    '<div>' +
      '<div class="guest-row__label">' + ui("guestDob") + '</div>' +
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
  var cl = contentLang();

  var rulesAccepted = document.getElementById("checkin-rules-accept").checked;
  var waiverAccepted = document.getElementById("checkin-waiver-accept").checked;
  var sigName = document.getElementById("checkin-sig-name").value.trim();

  if (!rulesAccepted) {
    errorEl.textContent = cl === "en"
      ? "Please accept the house rules."
      : "Veuillez accepter les r\u00e8gles de la maison.";
    return;
  }

  if (!waiverAccepted || !sigName) {
    errorEl.textContent = cl === "en"
      ? "Please sign the pool waiver (enter your name and check the box)."
      : "Veuillez signer la d\u00e9charge piscine (entrez votre nom et cochez la case).";
    return;
  }

  var guestRows = document.querySelectorAll(".guest-row");
  var guestsInfo = [];
  guestRows.forEach(function (row) {
    var name = row.querySelector(".guest-name");
    var dob = row.querySelector(".guest-dob");
    if (name && name.value.trim()) {
      guestsInfo.push({ name: name.value.trim(), dob: dob ? dob.value : null });
    }
  });

  if (guestsInfo.length === 0) {
    errorEl.textContent = cl === "en"
      ? "Please enter at least one guest name."
      : "Veuillez entrer au moins un nom de voyageur.";
    return;
  }

  var childrenData = getChildrenData();

  var btn = document.getElementById("checkin-submit-btn");
  btn.disabled = true;
  btn.textContent = ui("sending");

  try {
    var idPhotoUrl = null;
    var fileInput = document.getElementById("checkin-id-file");
    if (fileInput && fileInput.files && fileInput.files[0]) {
      var file = fileInput.files[0];
      var ext = file.name.split(".").pop();
      var path = "id-photos/" + currentBooking.id + "." + ext;
      var { error: uploadError } = await db.storage
        .from("checkin-documents")
        .upload(path, file, { upsert: true });
      if (!uploadError) idPhotoUrl = path;
    }

    var { data: existing } = await db
      .from("checkin_data")
      .select("id")
      .eq("booking_id", currentBooking.id)
      .limit(1);

    var checkinPayload = {
      guests_info: { adults: guestsInfo, children: childrenData },
      house_rules_accepted: true,
      pool_waiver_signed: true,
      pool_waiver_sig: sigName,
      signed_at: new Date().toISOString(),
      id_photo_url: idPhotoUrl,
    };

    // Store for PDF generation
    window._lastWaiverData = {
      signature: sigName,
      children: childrenData,
      guests: guestsInfo,
      signedAt: new Date().toISOString(),
    };

    if (existing && existing.length > 0) {
      await db.from("checkin_data")
        .update(checkinPayload)
        .eq("booking_id", currentBooking.id);
    } else {
      checkinPayload.booking_id = currentBooking.id;
      await db.from("checkin_data").insert(checkinPayload);
    }

    document.getElementById("checkin-form-state").style.display = "none";
    document.getElementById("checkin-confirmed-state").style.display = "block";

  } catch (err) {
    console.error("Check-in submission error:", err);
    errorEl.textContent = cl === "en"
      ? "Error submitting. Please try again."
      : "Erreur lors de l'envoi. Veuillez r\u00e9essayer.";
    btn.disabled = false;
    btn.textContent = cl === "en" ? "Submit check-in" : "Envoyer l'enregistrement";
  }
}

/* ———————————————————————————————————————
   CONTRACT MODULE
   ——————————————————————————————————————— */

async function initContract() {
  var docEl = document.getElementById("contract-doc");
  if (!docEl) return;

  if (currentBooking && db) {
    try {
      var { data } = await db
        .from("contract_data")
        .select("signed_at, signature")
        .eq("booking_id", currentBooking.id)
        .limit(1);

      if (data && data.length > 0 && data[0].signed_at) {
        window._lastContractData = { signature: data[0].signature, signedAt: data[0].signed_at };
        document.getElementById("contract-form-state").style.display = "none";
        document.getElementById("contract-confirmed-state").style.display = "block";
        return;
      }
    } catch (e) { /* continue */ }
  }

  renderContract();
}

function renderContract() {
  var docEl = document.getElementById("contract-doc");
  if (!docEl || !currentBooking) return;

  var rc = MAS_AIRAGA.rental_contract;
  var cl = contentLang();
  var isEn = cl === "en";
  var b = currentBooking;

  var opts = { day: "numeric", month: "long", year: "numeric" };
  var loc = { fr: "fr-FR", en: "en-GB", nl: "nl-NL", de: "de-DE" }[currentLang] || "fr-FR";
  var ciDate = new Date(b.checkin_date + "T12:00:00").toLocaleDateString(loc, opts);
  var coDate = new Date(b.checkout_date + "T12:00:00").toLocaleDateString(loc, opts);

  var ci = new Date(b.checkin_date);
  var co = new Date(b.checkout_date);
  var nights = Math.round((co - ci) / (1000 * 60 * 60 * 24));
  var weeks = Math.ceil(nights / 7);
  var totalAmount = b.weekly_rate ? (b.weekly_rate * weeks) : null;
  var arrhes = totalAmount ? Math.round(totalAmount * 0.25) : null;
  var solde = totalAmount && arrhes ? (totalAmount - arrhes) : null;

  var clauses = isEn ? rc.clauses_en : rc.clauses_fr;

  docEl.innerHTML =
    '<div class="contract-doc__title">' + (isEn ? rc.title_en : rc.title_fr) + '</div>' +
    '<p style="text-align:center;font-size:12px;color:var(--ma-text-muted);margin-bottom:1rem">' +
      (isEn ? 'From ' : 'Du ') + ciDate + (isEn ? ' to ' : ' au ') + coDate + '</p>' +

    '<div class="contract-doc__parties">' +
      '<p class="contract-doc__party-label">' + (isEn ? rc.owner_label_en : rc.owner_label_fr) + '</p>' +
      '<p class="contract-doc__party-name">' + rc.owner_text + '</p>' +
      '<p style="font-size:12px;color:var(--ma-text-muted)">' + rc.owner_address + '</p>' +
      '<p style="font-size:11px;color:var(--ma-text-muted)">' + rc.owner_email + '</p>' +
    '</div>' +

    '<div class="contract-doc__parties">' +
      '<p class="contract-doc__party-label">' + (isEn ? rc.tenant_label_en : rc.tenant_label_fr) + '</p>' +
      '<p class="contract-doc__party-name">' + escapeHtml(b.guest_name) + '</p>' +
      (b.guest_email ? '<p style="font-size:12px;color:var(--ma-text-muted)">' + escapeHtml(b.guest_email) + '</p>' : '') +
      (b.guest_phone ? '<p style="font-size:11px;color:var(--ma-text-muted)">' + escapeHtml(b.guest_phone) + '</p>' : '') +
    '</div>' +

    '<div style="margin-bottom:1rem;padding:0.75rem;background:var(--ma-bg);border-radius:var(--radius-sm);font-size:12px;color:var(--ma-text-muted)">' +
      (isEn ? 'This contract is established for a maximum of ' + rc.max_occupants + ' occupants (adults + children).'
             : 'Le present contrat est etabli pour un maximum de ' + rc.max_occupants + ' occupants (enfants + adultes).') +
    '</div>' +

    '<div style="margin-bottom:1rem">' +
      contractDetail(isEn ? 'Check-in' : 'Arriv\u00e9e', ciDate) +
      contractDetail(isEn ? 'Check-out' : 'D\u00e9part', coDate) +
      contractDetail(isEn ? 'Duration' : 'Dur\u00e9e', nights + (isEn ? ' nights' : ' nuits')) +
      (b.num_guests ? contractDetail(isEn ? 'Guests' : 'Voyageurs', b.num_guests) : '') +
      (totalAmount ? contractDetail(isEn ? 'Total rental' : 'Loyer total', totalAmount.toLocaleString("fr-FR") + ' \u20ac') : '') +
      (arrhes ? contractDetail(isEn ? 'Deposit (25%)' : 'Arrhes (25%)', arrhes.toLocaleString("fr-FR") + ' \u20ac') : '') +
      (solde ? contractDetail(isEn ? 'Balance due' : 'Solde d\u00fb', solde.toLocaleString("fr-FR") + ' \u20ac') : '') +
    '</div>' +

    '<div class="contract-doc__property">' + (isEn ? rc.property_desc_en : rc.property_desc_fr) + '</div>' +

    clauses.map(function (c, i) {
      return '<div class="contract-doc__clause">' +
        '<p class="contract-doc__clause-title">Article ' + (i + 1) + ' \u2014 ' + c.title + '</p>' +
        '<p class="contract-doc__clause-text">' + c.text + '</p>' +
      '</div>';
    }).join("") +

    '<div style="margin-top:1rem;padding:0.75rem;background:var(--ma-purple-light);border-radius:var(--radius-sm);font-size:12px;font-style:italic;color:var(--ma-text-mid)">' +
      (isEn ? rc.signature_note_en : rc.signature_note_fr) + '</div>';
}

function contractDetail(label, val) {
  return '<div class="contract-doc__detail">' +
    '<span class="contract-doc__detail-label">' + label + '</span>' +
    '<span class="contract-doc__detail-val">' + val + '</span></div>';
}

function escapeHtml(str) {
  if (!str) return "";
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function submitContract() {
  var errorEl = document.getElementById("contract-error");
  errorEl.textContent = "";
  var cl = contentLang();

  var accepted = document.getElementById("contract-accept").checked;
  var sigName = document.getElementById("contract-sig-name").value.trim();

  if (!accepted || !sigName) {
    errorEl.textContent = cl === "en"
      ? "Please enter your name and accept the contract terms."
      : "Veuillez entrer votre nom et accepter les conditions du contrat.";
    return;
  }

  var btn = document.getElementById("contract-submit-btn");
  btn.disabled = true;
  btn.textContent = ui("sending");

  try {
    var contractHtml = document.getElementById("contract-doc").innerHTML;
    var now = new Date().toISOString();

    var { error } = await db.from("contract_data").insert({
      booking_id: currentBooking.id,
      contract_html: contractHtml,
      signature: sigName,
      signed_at: now,
    });

    if (error) throw error;

    window._lastContractData = { signature: sigName, signedAt: now };

    document.getElementById("contract-form-state").style.display = "none";
    document.getElementById("contract-confirmed-state").style.display = "block";

  } catch (err) {
    console.error("Contract submission error:", err);
    errorEl.textContent = cl === "en"
      ? "Error submitting. Please try again."
      : "Erreur lors de l\u2019envoi. Veuillez r\u00e9essayer.";
    btn.disabled = false;
    btn.textContent = cl === "en" ? "Sign the contract" : "Signer le contrat";
  }
}

/* ———————————————————————————————————————
   PDF GENERATION (jsPDF)
   ——————————————————————————————————————— */

function getPdfLib() {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  if (window.jsPDF) return window.jsPDF;
  return null;
}

function pdfAddText(doc, text, size, style, margin, pageW, yRef) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style || "normal");
  var lines = doc.splitTextToSize(text, pageW);
  for (var i = 0; i < lines.length; i++) {
    if (yRef.y > 275) { doc.addPage(); yRef.y = 20; }
    doc.text(lines[i], margin, yRef.y);
    yRef.y += size * 0.45;
  }
  yRef.y += 2;
}

function downloadContractPdf() {
  var JSPDF = getPdfLib();
  if (!JSPDF) { alert("PDF library not loaded. Please reload the page."); return; }

  var doc = new JSPDF({ unit: "mm", format: "a4" });
  var rc = MAS_AIRAGA.rental_contract;
  var b = currentBooking;
  var cl = contentLang();
  var isEn = cl === "en";
  var margin = 20;
  var pageW = 170;
  var yRef = { y: 20 };

  function add(text, size, style) { pdfAddText(doc, text, size, style, margin, pageW, yRef); }

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(isEn ? rc.title_en : rc.title_fr, 105, yRef.y, { align: "center" });
  yRef.y += 10;

  // Dates
  var loc = { fr: "fr-FR", en: "en-GB", nl: "nl-NL", de: "de-DE" }[currentLang] || "fr-FR";
  var opts = { day: "numeric", month: "long", year: "numeric" };
  var ciDate = new Date(b.checkin_date + "T12:00:00").toLocaleDateString(loc, opts);
  var coDate = new Date(b.checkout_date + "T12:00:00").toLocaleDateString(loc, opts);
  add((isEn ? "From " : "Du ") + ciDate + (isEn ? " to " : " au ") + coDate, 10, "italic");
  yRef.y += 3;

  // Owner
  add((isEn ? rc.owner_label_en : rc.owner_label_fr).toUpperCase(), 9, "bold");
  add(rc.owner_text, 10, "normal");
  add(rc.owner_address, 9, "normal");
  add(rc.owner_email, 9, "normal");
  yRef.y += 3;

  // Tenant
  add((isEn ? rc.tenant_label_en : rc.tenant_label_fr).toUpperCase(), 9, "bold");
  add(b.guest_name || "", 10, "normal");
  if (b.guest_email) add(b.guest_email, 9, "normal");
  yRef.y += 3;

  // Details
  var ci = new Date(b.checkin_date);
  var co = new Date(b.checkout_date);
  var nights = Math.round((co - ci) / (1000 * 60 * 60 * 24));
  add((isEn ? "Duration: " : "Duree: ") + nights + (isEn ? " nights" : " nuits"), 10, "normal");
  if (b.num_guests) add((isEn ? "Guests: " : "Voyageurs: ") + b.num_guests, 10, "normal");
  if (b.weekly_rate) {
    var weeks = Math.ceil(nights / 7);
    var total = b.weekly_rate * weeks;
    add((isEn ? "Total rental: " : "Loyer total: ") + total.toLocaleString("fr-FR") + " \u20ac", 10, "normal");
  }
  yRef.y += 4;

  // Property
  doc.setDrawColor(200);
  doc.line(margin, yRef.y, margin + pageW, yRef.y);
  yRef.y += 5;
  add(isEn ? rc.property_desc_en : rc.property_desc_fr, 9, "normal");
  yRef.y += 4;

  // Clauses
  var clauses = isEn ? rc.clauses_en : rc.clauses_fr;
  clauses.forEach(function (c, i) {
    add("Article " + (i + 1) + " \u2014 " + c.title, 10, "bold");
    add(c.text, 9, "normal");
    yRef.y += 2;
  });

  // Signature
  yRef.y += 5;
  if (yRef.y > 250) { doc.addPage(); yRef.y = 20; }
  doc.setDrawColor(200);
  doc.line(margin, yRef.y, margin + pageW, yRef.y);
  yRef.y += 8;

  var sigData = window._lastContractData || {};
  add(isEn ? rc.signature_note_en : rc.signature_note_fr, 9, "italic");
  yRef.y += 4;
  add((isEn ? "Signed by: " : "Signe par: ") + (sigData.signature || ""), 10, "bold");
  if (sigData.signedAt) {
    var signDate = new Date(sigData.signedAt);
    add((isEn ? "Date: " : "Date: ") + signDate.toLocaleDateString(loc, opts) + " " + signDate.toLocaleTimeString(loc), 9, "normal");
  }

  doc.save("Contrat-" + (b.guest_name || "location").replace(/\s+/g, "-") + ".pdf");
}

function downloadWaiverPdf() {
  var JSPDF = getPdfLib();
  if (!JSPDF) { alert("PDF library not loaded. Please reload the page."); return; }

  var doc = new JSPDF({ unit: "mm", format: "a4" });
  var pw = MAS_AIRAGA.pool_waiver;
  var b = currentBooking;
  var cl = contentLang();
  var isEn = cl === "en";
  var margin = 20;
  var pageW = 170;
  var yRef = { y: 20 };

  function add(text, size, style) { pdfAddText(doc, text, size, style, margin, pageW, yRef); }

  // Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(isEn ? pw.title_en : pw.title_fr, 105, yRef.y, { align: "center" });
  yRef.y += 7;
  add(pw.subtitle, 10, "normal");
  yRef.y += 5;

  // Sections
  var sections = isEn ? pw.sections_en : pw.sections_fr;
  sections.forEach(function (sec) {
    add(sec.num + ". " + sec.title, 11, "bold");
    if (sec.text) add(sec.text, 9, "normal");
    if (sec.items) {
      sec.items.forEach(function (item) {
        add("\u2022 " + item, 9, "normal");
      });
    }
    yRef.y += 2;
  });

  // Section 4: Children
  yRef.y += 3;
  add(isEn ? pw.children_title_en : pw.children_title_fr, 11, "bold");
  yRef.y += 2;

  var sigData = window._lastWaiverData || {};
  var children = sigData.children || [];

  if (children.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(isEn ? "First & Last Name" : "Prenom & Nom de l'enfant", margin, yRef.y);
    doc.text(isEn ? "Age" : "Age", margin + 130, yRef.y);
    yRef.y += 5;
    doc.setFont("helvetica", "normal");
    children.forEach(function (child) {
      doc.text(child.name || "", margin, yRef.y);
      doc.text(String(child.age || ""), margin + 130, yRef.y);
      yRef.y += 5;
    });
  } else {
    add(isEn ? "(No children declared)" : "(Aucun enfant declare)", 9, "italic");
  }

  // Sign-off
  yRef.y += 5;
  doc.setDrawColor(200);
  doc.line(margin, yRef.y, margin + pageW, yRef.y);
  yRef.y += 8;
  add(isEn ? pw.sign_off_en : pw.sign_off_fr, 9, "italic");
  yRef.y += 5;
  add((isEn ? "Signed by: " : "Signe par: ") + (sigData.signature || ""), 10, "bold");
  if (sigData.signedAt) {
    var loc = { fr: "fr-FR", en: "en-GB", nl: "nl-NL", de: "de-DE" }[currentLang] || "fr-FR";
    var opts = { day: "numeric", month: "long", year: "numeric" };
    var signDate = new Date(sigData.signedAt);
    add("Eyragues, " + signDate.toLocaleDateString(loc, opts), 9, "normal");
  }

  doc.save("Decharge-Piscine-" + (b.guest_name || "").replace(/\s+/g, "-") + ".pdf");
}
