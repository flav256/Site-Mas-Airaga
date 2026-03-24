/**
 * MAS AIRAGA — Structured Content Data
 * Source: Eyragues-Brochure.pdf, contracts, pool waiver docs
 *
 * Used by: guide.js (guest portal)
 * Last updated: 2026-03
 *
 * NOTE: Financial/bank data has been removed from this file.
 *       It lives in Supabase (admin-only access).
 *       WiFi credentials are here but only loaded after token validation.
 */

const MAS_AIRAGA = {

  /* ———————————————————————————————————
     PROPERTY
  ——————————————————————————————————— */
  property: {
    name: "Mas d'Airaga",
    tagline: "Maison de caractere en Provence · Eyragues, Alpilles",
    address: {
      street: "595 Chemin Notre Dame",
      locality: "A cote de la Chapelle Notre Dame du Pieux Zele",
      postcode: "13630",
      city: "Eyragues",
      country: "France",
      gps: { lat: 43.836611, lng: 4.834861 },
      gps_display: "N 43\u00b050'11.80\"  E 4\u00b050'05.50\"",
      maps_url: "https://maps.google.com/?q=43.836611,4.834861",
    },
    built: 2009,
    max_occupants: 10,
    pool: {
      dimensions: "9 m \u00d7 4,5 m",
      cover: "Volet electrique",
      safety_norm: "NF P90-308 — AQUAL Life Hors Sol",
      safety_cert: "Attestation de conformite N\u00b030243992 — APAVE, Fontaine",
      installed: "7 avril 2016",
      installer: "EAUX ET PISCINES (OZEO), ZA de la Gare, St-Remy-de-Provence",
      invoice_ref: "Facture N\u00b0551462 du 15/04/2016",
      maintenance: "Pisciniste intervient une fois par semaine",
      tenant_tasks: [
        "Vider les skimmers chaque jour / Empty skimmers daily",
        "Ne pas toucher a la programmation de la filtration / Do not adjust filtration timer",
        "Laisser le robot dans la piscine en permanence / Leave the cleaning robot in the pool",
        "Aucun animal dans la piscine / No animals in the pool",
      ],
    },
  },

  /* ———————————————————————————————————
     OWNERS — CONTACT
  ——————————————————————————————————— */
  owners: {
    names: "Virginie & Flavien MAIRE",
    phone_france: "+33 6 14 32 57 06",
    phone_abudhabi: "+971 50 204 8428",
    phone_flavien: "+971 50 173 0189",
    email_primary: "virginieduvivier@gmail.com",
    email_flavien: "flavien.maire@gmail.com",
  },

  /* ———————————————————————————————————
     ARRIVAL & DEPARTURE
  ——————————————————————————————————— */
  timing: {
    checkin: {
      from: "16:00",
      to: "22:00",
      note_fr: "Communiquer l'heure d'arrivee la veille. Remise des cles entre 16h et 22h.",
      note_en: "Inform owners of arrival time the day before. Key handover between 4 pm and 10 pm.",
    },
    checkout: {
      by: "10:00",
      note_fr: "Etat des lieux entre 8h et 10h. Rendez-vous a convenir a l'arrivee.",
      note_en: "Inventory check-out between 8 am and 10 am. Time agreed on arrival.",
    },
  },

  /* ———————————————————————————————————
     WIFI & UTILITIES (gated — only shown after token validation)
  ——————————————————————————————————— */
  access: {
    wifi: {
      ssid: "Freebox-61114E",
      password: "regat-permulti3-tolerarem#4-abjicio",
    },
    internet_type: "Haut debit (Starlink + Freebox)",
    tv: "TNT",
  },

  /* ———————————————————————————————————
     ROOMS & EQUIPMENT
  ——————————————————————————————————— */
  rooms: {
    ground_floor: [
      {
        name: "Salon",
        name_en: "Living room",
        description_fr: "2 canapes, 2 fauteuils, table basse, televiseur",
        description_en: "2 sofas, 2 armchairs, coffee table, TV",
      },
      {
        name: "Salle a manger",
        name_en: "Dining room",
        description_fr: "Table 8 personnes, buffet, acces WiFi",
        description_en: "Table for 8, sideboard, WiFi access",
      },
      {
        name: "Cuisine integree",
        name_en: "Kitchen",
        description_fr: "Refrigerateur/congelateur, lave-vaisselle, four, micro-ondes, cafetiere a filtres, Nespresso, bouilloire, grille-pain, plaque induction",
        description_en: "Fridge/freezer, dishwasher, oven, microwave, filter coffee maker, Nespresso, kettle, toaster, induction hob",
      },
      {
        name: "Chambre RdC",
        name_en: "Ground floor bedroom",
        description_fr: "Lit double 150 cm, salle de bain attenante (douche, vasque, WC)",
        description_en: "Double bed 150 cm, ensuite bathroom (shower, basin, WC)",
      },
      {
        name: "Arriere-cuisine",
        name_en: "Back kitchen",
        description_fr: "Table ronde 4 personnes, bonnetiere de rangement",
        description_en: "Round table for 4, storage cupboard",
      },
      {
        name: "Buanderie",
        name_en: "Laundry",
        description_fr: "Congelateur, grand refrigerateur, lave-linge, evier",
        description_en: "Freezer, large fridge, washing machine, sink",
      },
    ],
    first_floor: [
      {
        name: "Chambre 1",
        name_en: "Bedroom 1",
        description_fr: "Lit 2 personnes 160 cm + fauteuil convertible 90 cm",
        description_en: "Double bed 160 cm + convertible armchair (single)",
      },
      {
        name: "Chambre 2",
        name_en: "Bedroom 2",
        description_fr: "Lit 2 personnes 160 cm + fauteuil convertible 90 cm",
        description_en: "Double bed 160 cm + convertible armchair (single)",
      },
      {
        name: "Chambre 3 (suite)",
        name_en: "Bedroom 3 (suite)",
        description_fr: "Lit double 160 cm, salle de bain attenante double douche et double vasque",
        description_en: "Double bed 160 cm, ensuite with double shower and double basin",
      },
      {
        name: "Salle de bain",
        name_en: "Bathroom",
        description_fr: "Baignoire, double vasque",
        description_en: "Bathtub, double basin",
      },
      {
        name: "WC separe",
        name_en: "Separate WC",
        description_fr: "",
        description_en: "",
      },
    ],
    outside: [
      {
        name: "Terrasse couverte",
        name_en: "Covered terrace",
        description_fr: "25 m\u00b2, table pour 10 personnes, plancha a gaz, salon de detente, parasols",
        description_en: "25 m\u00b2, table for 10, gas plancha/griddle, lounge area, parasols",
      },
      {
        name: "Piscine",
        name_en: "Swimming pool",
        description_fr: "9 m \u00d7 4,5 m, volet electrique, pool house avec store electrique, robot de nettoyage",
        description_en: "9 m \u00d7 4.5 m, electric cover, pool house with electric blind and cleaning robot",
      },
      {
        name: "Parking",
        name_en: "Parking",
        description_fr: "4 voitures a l'entree de la propriete",
        description_en: "4 cars at the property entrance",
      },
    ],
    baby_equipment: [
      "Table a langer / Changing table",
      "Lit pliant bebe / Travel cot",
      "Chaise haute / High chair",
    ],
  },

  /* ———————————————————————————————————
     HOUSE RULES
  ——————————————————————————————————— */
  house_rules: {
    fr: [
      "Non-fumeur : il est interdit de fumer a l'interieur de la maison.",
      "Animaux : pas d'animaux sans accord prealable des proprietaires.",
      "Bruit : respectez la tranquillite des voisins, pas de bruit excessif apres 23h.",
      "Proprete : laissez la maison propre et rangee avant votre depart.",
      "Dechets : triez et sortez les poubelles selon les indications fournies.",
      "Capacite : maximum 10 personnes (adultes + enfants).",
      "Piscine : surveillance constante des enfants par un adulte obligatoire.",
      "Robot piscine : ne pas retirer le robot de la piscine.",
      "Skimmers : vider les skimmers une fois par jour.",
      "Pas d'animaux dans la piscine.",
    ],
    en: [
      "Non-smoking: smoking is not allowed inside the house.",
      "Pets: no pets without prior owner approval.",
      "Noise: respect the neighbors — no excessive noise after 11 pm.",
      "Cleanliness: leave the house clean and tidy before departure.",
      "Waste: sort and dispose of waste according to instructions.",
      "Capacity: maximum 10 people (adults + children).",
      "Pool: constant adult supervision of children is mandatory at all times.",
      "Pool robot: do not remove the cleaning robot from the pool.",
      "Skimmers: empty skimmers once a day.",
      "No animals in the pool.",
    ],
  },

  /* ———————————————————————————————————
     DEPARTURE CHECKLIST
  ——————————————————————————————————— */
  departure_checklist: {
    fr: [
      { id: 1, label: "Vider le refrigerateur — jeter tous les aliments perissables" },
      { id: 2, label: "Nettoyer la plancha" },
      { id: 3, label: "Eteindre toutes les climatisations" },
      { id: 4, label: "Fermer toutes les fenetres et portes" },
      { id: 5, label: "Sortir les poubelles (triees) et les deposer au centre de collecte du village" },
      { id: 6, label: "Enlever les draps de tous les lits utilises et les deposer dans la salle de bain" },
      { id: 7, label: "Laver et ranger la vaisselle" },
      { id: 8, label: "Eteindre toutes les lumieres et appareils electriques" },
      { id: 9, label: "Verifier que toutes les portes sont bien verrouillees" },
      { id: 10, label: "Remettre les cles et telecommandes au proprietaire ou son representant" },
    ],
    en: [
      { id: 1, label: "Empty the refrigerator — dispose of all perishable food" },
      { id: 2, label: "Clean the plancha / griddle" },
      { id: 3, label: "Turn off all air conditioning units" },
      { id: 4, label: "Close all windows and doors" },
      { id: 5, label: "Take out all trash (sorted) to the village collection center" },
      { id: 6, label: "Strip all used beds and leave linens in the bathroom" },
      { id: 7, label: "Wash and put away all dishes" },
      { id: 8, label: "Turn off all lights and electrical appliances" },
      { id: 9, label: "Ensure all doors are locked" },
      { id: 10, label: "Return keys and remote controls to the owner or representative" },
    ],
    trash_location_note: {
      fr: "Centre de collecte situe au centre du village, prevu pour les poubelles de fin de location.",
      en: "Collection center at the village center, designated for end-of-rental garbage.",
    },
  },

  /* ———————————————————————————————————
     SAFETY & EMERGENCIES
  ——————————————————————————————————— */
  emergency: {
    fire_extinguisher: {
      fr: "Sous l'evier de la cuisine",
      en: "Under the kitchen sink",
    },
    contacts: [
      {
        name: "Police / Pompiers / SAMU",
        number: "112",
        type: "emergency",
      },
      {
        name: "Medecins d'Eyragues (Dr Gesta, Rogissart & Abarki)",
        address: "6225 Allee les Allees, 13630 Eyragues",
        number: "04 90 94 12 32",
        type: "medical",
      },
      {
        name: "Centre Hospitalier d'Avignon",
        address: "305A Rue Raoul Follereau, 84000 Avignon",
        number: "04 32 75 33 33",
        type: "hospital",
      },
      {
        name: "Virginie & Flavien MAIRE (owners)",
        number: "+971 50 204 8428",
        number_fr: "+33 6 14 32 57 06",
        type: "owner",
      },
    ],
  },

  /* ———————————————————————————————————
     LOCAL AREA GUIDE
  ——————————————————————————————————— */
  local_guide: {
    supermarkets: [
      {
        name: "U Express",
        address: "Les Allees, Eyragues",
        phone: "04 90 94 00 31",
        distance: "village",
      },
      {
        name: "Petit Casino",
        address: "5 Place Jean Jaures, Eyragues",
        phone: "04 90 94 11 16",
        distance: "village",
      },
      {
        name: "Intermarche SUPER",
        address: "11 Av. de la 1ere DFL, Saint-Remy-de-Provence",
        phone: "04 90 92 04 71",
        distance: "~10 min",
      },
    ],
    restaurants: [
      {
        name: "Le Pre Gourmand",
        address: "175 Av. Max Dormoy, Eyragues",
        distance: "village",
      },
      {
        name: "Un Bouchon en Provence",
        address: "2 Av. Henri Barbusse, Eyragues",
        distance: "village",
      },
      {
        name: "Le Cafe du Soleil",
        address: "144 Av. Henri Barbusse, Eyragues",
        distance: "village",
      },
    ],
    market: {
      name: "Marche d'Eyragues",
      location: "Halles couvertes, Place Saint-Paul",
      frequency: "Hebdomadaire / Weekly",
      description_fr: "Fruits, legumes, fleurs, epices, olives, rotisseries.",
      description_en: "Fresh produce, flowers, spices, olives, rotisserie.",
    },
    attractions: [
      { name: "Parc des Poetes", type: "park", distance: "village" },
      { name: "Musee du Patrimoine d'Eyragues", type: "museum", distance: "village" },
      { name: "Bambous en Provence", type: "garden", distance: "nearby" },
      { name: "Bureau des Guides Naturalistes", type: "nature-tour", distance: "region" },
      { name: "Chateau Feodal de Chateaurenard", type: "historic", distance: "~10 min" },
      { name: "Musee Frederic Mistral (Maillane)", type: "museum", distance: "~15 min" },
      { name: "Beauty Institute & Spa Cinq Mondes YRILIS", type: "spa", distance: "nearby" },
      { name: "Classic Bike Esprit Day Tours", type: "cycling", distance: "region" },
      { name: "Les Baux-de-Provence", type: "village", distance: "~20 min" },
      { name: "Saint-Remy-de-Provence", type: "market-town", distance: "~10 min" },
      { name: "Arles", type: "city", distance: "~25 min" },
      { name: "Avignon", type: "city", distance: "~20 min" },
    ],
  },

  /* ———————————————————————————————————
     POOL WAIVER — text for digital check-in
  ——————————————————————————————————— */
  pool_waiver: {
    pool_safety_equipment: {
      fr: "Couverture de securite et dispositif d'accrochage AQUAL Life Hors Sol, conforme a la norme NF P90-308. Attestation de conformite N\u00b030243992 — APAVE. Pose le 7/04/2016 par EAUX ET PISCINES (OZEO), St-Remy-de-Provence.",
      en: "Security cover and snatches 'AQUAL Life Hors Sol', NORM NF P90-308. Conformity agreement N\u00b030243992 — APAVE. Installed 07/04/2016 by EAUX ET PISCINES (OZEO), St-Remy-de-Provence.",
    },
    disclaimer_note: {
      fr: "Ces dispositifs ne sauraient se substituer a la vigilance et a la surveillance que vous devez a votre/vos enfant(s) ou a toute autre personne.",
      en: "This equipment does not prevent from a constant monitoring of children.",
    },
    clauses_en: [
      "I wish to use the pool in the property of Mr/Mrs MAIRE; I recognize and understand that using the Swimming Pool involves certain risks, including risk of injury from equipment malfunction, tripping or falling in the pool area.",
      "I WAIVE ANY AND ALL CLAIMS that I have or may in the future have against Mr/Mrs MAIRE and their representatives.",
      "I RELEASE Mr/Mrs MAIRE from any and all liability for any loss, damage, injury or expense that I or my next of kin may suffer as a result of my participation at the Swimming Pool, INCLUDING NEGLIGENCE ON THE PART OF THE OWNERS.",
      "I HOLD HARMLESS AND INDEMNIFY Mr/Mrs MAIRE from any and all liability from any damage to property or personal injury to any third party resulting from my participation at the Swimming Pool.",
      "I confirm that children will be under constant adult supervision at all times when using or near the pool.",
    ],
    clauses_fr: [
      "Je souhaite utiliser la piscine de la propriete de M./Mme MAIRE ; je reconnais et comprends que l'utilisation de la piscine comporte certains risques.",
      "Je decharge de toute responsabilite M. Flavien MAIRE et Mme Virginie DUVIVIER-MAIRE quant aux risques eventuels que constitue la piscine situee sur ce bien.",
      "Je m'engage a surveiller en permanence les enfants presents, et reconnais que les dispositifs de securite ne se substituent pas a cette surveillance.",
      "Tout dommage materiel ou corporel relatif a l'utilisation de la piscine releve de la responsabilite pleine et entiere du locataire.",
    ],
    legal_ref_fr: "Loi n\u00b02003-9 du 3 janvier 2003 · Decret n\u00b02003-1389 · Decret n\u00b02004-499 · Decret du 16 juillet 2009.",
  },

  /* ———————————————————————————————————
     ARRIVAL TIME SLOTS — for checkin form
  ——————————————————————————————————— */
  arrival_slots: [
    "16:00 — 17:00",
    "17:00 — 18:00",
    "18:00 — 19:00",
    "19:00 — 20:00",
    "20:00 — 21:00",
    "21:00 — 22:00",
    "A preciser / To be confirmed",
  ],

};

if (typeof module !== "undefined") module.exports = MAS_AIRAGA;
