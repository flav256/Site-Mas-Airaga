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
    tagline: "Maison de caractere en Provence \u00b7 Eyragues, Alpilles",
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
      safety_device: "Couverture de securite AQUAL Life Hors Sol",
      safety_norm: "NF P90-308",
      safety_cert: "Attestation de conformite N\u00b030243992 \u2014 APAVE, 17 Bd Paul Langevin, 38600 Fontaine",
      safety_manufacturer: "AQUALIFE, 5 rue Levavasseur Grand St Charles, 66000 Perpignan",
      installed: "7 avril 2016",
      installer: "EAUX ET PISCINES (OZEO), ZA de la Gare, 8 allee de Jonquerolles, 13210 St-Remy-de-Provence",
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
      ssid: "MasAiraga",
      password: "zazbIg-cutpud-2qygzo",
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
      "Noise: respect the neighbors \u2014 no excessive noise after 11 pm.",
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
      { id: 1, label: "Vider le refrigerateur \u2014 jeter tous les aliments perissables" },
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
      { id: 1, label: "Empty the refrigerator \u2014 dispose of all perishable food" },
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
    /* Practical: supermarkets & restaurants near the house */
    supermarkets: [
      { name: "U Express", address: "Les Allees, Eyragues", phone: "04 90 94 00 31", distance: "village" },
      { name: "Petit Casino", address: "5 Place Jean Jaures, Eyragues", phone: "04 90 94 11 16", distance: "village" },
      { name: "Intermarche SUPER", address: "11 Av. de la 1ere DFL, Saint-Remy-de-Provence", phone: "04 90 92 04 71", distance: "~10 min" },
    ],
    restaurants: [
      { name: "Le Pre Gourmand", address: "175 Av. Max Dormoy, Eyragues", distance: "village" },
      { name: "Un Bouchon en Provence", address: "2 Av. Henri Barbusse, Eyragues", distance: "village" },
      { name: "Le Cafe du Soleil", address: "144 Av. Henri Barbusse, Eyragues", distance: "village" },
    ],
    market: {
      name: "Marche d'Eyragues",
      location: "Halles couvertes, Place Saint-Paul",
      frequency: "Hebdomadaire / Weekly",
      description_fr: "Fruits, legumes, fleurs, epices, olives, rotisseries.",
      description_en: "Fresh produce, flowers, spices, olives, rotisserie.",
    },
    /* Rich categorized guide — matches around.html */
    categories: [
      {
        title_fr: "Eyragues \u2014 Notre village",
        title_en: "Eyragues \u2014 Our village",
        items: [
          { name: "Terre de Provence", url: "https://www.myterredeprovence.fr/Eyragues", desc_fr: "Decouvrez Eyragues, village authentique des Alpilles. Histoire, patrimoine et vie locale.", desc_en: "Discover Eyragues, an authentic Alpilles village. History, heritage and local life." },
          { name: "Office de Tourisme", url: "https://www.eyragues.fr/tourisme.php", desc_fr: "Informations touristiques officielles, visites guidees et decouverte du village.", desc_en: "Official tourist info, guided tours and village discovery." },
          { name: "Journal Farandole", url: "http://www.journal-farandole.com/", desc_fr: "Tous les evenements et loisirs de la region. Agenda culturel complet.", desc_en: "All regional events and leisure. Full cultural calendar." },
        ],
      },
      {
        title_fr: "Sites historiques",
        title_en: "Historic sites",
        items: [
          { name: "Saint-Remy-de-Provence", url: "https://www.saint-remy-de-provence.com", distance: "4 km", desc_fr: "Village pittoresque, marche le mercredi, boutiques artisanales, site de Glanum et monastere Saint-Paul-de-Mausole.", desc_en: "Picturesque village, Wednesday market, artisan shops, Glanum ruins and Saint-Paul-de-Mausole monastery." },
          { name: "Les Baux-de-Provence", url: "https://www.lesbauxdeprovence.com", distance: "12 km", desc_fr: "Village perche classe Plus beaux villages de France. Chateau medieval, Carrieres de Lumieres.", desc_en: "Hilltop village, one of the Most Beautiful Villages of France. Medieval castle, Carrieres de Lumieres." },
          { name: "Avignon", url: "https://avignon-tourisme.com", distance: "15 km", desc_fr: "Cite des Papes, Palais des Papes, Pont d'Avignon, Festival en juillet. Centre historique UNESCO.", desc_en: "City of Popes, Papal Palace, Pont d'Avignon, Festival in July. UNESCO historic centre." },
          { name: "Arles", url: "https://www.arlestourisme.com", distance: "25 km", desc_fr: "Amphitheatre romain, Fondation Van Gogh. Marches mercredi et samedi.", desc_en: "Roman amphitheatre, Van Gogh Foundation. Markets Wednesday and Saturday." },
        ],
      },
      {
        title_fr: "Vignobles & Gastronomie",
        title_en: "Wine & Food",
        items: [
          { name: "Chateauneuf-du-Pape", url: "https://www.chateauneuf.com", distance: "30 km", desc_fr: "Vignobles reputes, degustations de vins AOC, caves et domaines viticoles.", desc_en: "Renowned vineyards, AOC wine tastings, cellars and estates." },
          { name: "Cotes du Rhone", url: "https://www.vins-rhone.com", desc_fr: "Route des vins, domaines familiaux. Gigondas, Vacqueyras, Beaumes-de-Venise.", desc_en: "Wine route, family estates. Gigondas, Vacqueyras, Beaumes-de-Venise." },
          { name: "Marches Provencaux", url: "https://www.provenceguide.com/marches-provence", desc_fr: "Saint-Remy (mercredi), Eyragues (jeudi), Avignon (samedi), Arles (mercredi/samedi).", desc_en: "Saint-Remy (Wednesday), Eyragues (Thursday), Avignon (Saturday), Arles (Wed/Sat)." },
        ],
      },
      {
        title_fr: "Nature & Activites",
        title_en: "Nature & Activities",
        items: [
          { name: "Parc Naturel des Alpilles", url: "https://www.parc-alpilles.fr", desc_fr: "Randonnees pedestres et VTT, circuits balises, faune et flore mediterraneennes.", desc_en: "Hiking and mountain biking, marked trails, Mediterranean flora and fauna." },
          { name: "Camargue", url: "https://www.camargue.fr", distance: "40 km", desc_fr: "Reserve naturelle, flamants roses, chevaux blancs. Saintes-Maries-de-la-Mer, plages.", desc_en: "Nature reserve, flamingos, white horses. Saintes-Maries-de-la-Mer, beaches." },
          { name: "Luberon", url: "https://www.luberon-apt.fr", distance: "50 km", desc_fr: "Gordes, Roussillon, Abbaye de Senanque, champs de lavande (juin-juillet).", desc_en: "Gordes, Roussillon, Senanque Abbey, lavender fields (June-July)." },
        ],
      },
      {
        title_fr: "Culture & Evenements",
        title_en: "Culture & Events",
        items: [
          { name: "Festival d'Avignon", url: "https://www.festival-avignon.com", desc_fr: "Juillet \u2014 Theatre, danse, musique. Plus grand festival de theatre au monde.", desc_en: "July \u2014 Theatre, dance, music. World's largest theatre festival." },
          { name: "Carrieres de Lumieres", url: "https://www.carrieres-lumieres.com", desc_fr: "Les Baux \u2014 Spectacle multimedia immersif dans d'anciennes carrieres.", desc_en: "Les Baux \u2014 Immersive multimedia show in former quarries." },
          { name: "Van Gogh Trail", url: "https://vangoghroute.com/france/saint-remy/", desc_fr: "Saint-Remy & Arles \u2014 Sur les traces de Van Gogh, lieux peints par l'artiste.", desc_en: "Saint-Remy & Arles \u2014 Follow Van Gogh's footsteps, sites painted by the artist." },
        ],
      },
    ],
  },

  /* ———————————————————————————————————
     POOL WAIVER — full liability waiver (from decharge_piscine.pdf)
     5 sections matching the official paper document
  ——————————————————————————————————— */
  pool_waiver: {
    title_fr: "Fiche de decharge de responsabilite \u2013 Utilisation piscine",
    title_en: "Waiver and release of liability \u2013 Swimming pool use",
    subtitle: "595 Chemin Notre Dame, 13630 Eyragues",
    sections_fr: [
      {
        num: 1,
        title: "Equipement de securite",
        text: "La piscine dispose de tous les equipements de securite requis par la loi :",
        items: [
          "Couverture de securite et dispositif d'accrochage \u00ab AQUAL Life Hors Sol \u00bb, conforme a la norme NF P90-308.",
          "AQUALIFE \u2013 5 rue Levavasseur Grand St Charles, 66000 Perpignan, France.",
          "Attestation de conformite N\u00b030243992, APAVE, 17 Bd Paul Langevin, 38600 Fontaine.",
          "Installee le 07/04/2016 par EAUX ET PISCINES (OZEO), ZA de la Gare, 8 allee de Jonquerolles, 13210 St-Remy-de-Provence. Facture N\u00b0551462 du 15/04/2016.",
        ],
      },
      {
        num: 2,
        title: "Rappel des regles de securite",
        text: "Ces equipements ne sauraient se substituer a une surveillance constante des enfants.",
        items: [
          "La surveillance active et constante d'un adulte responsable est obligatoire pendant toute utilisation de la piscine.",
          "Aucun systeme de securite (couverture, barriere, alarme, etc.) ne remplace la vigilance humaine.",
          "L'acces a la piscine est interdit aux enfants sans accompagnement d'un adulte sachant nager.",
          "Les jeux violents, plongeons ou courses autour de la piscine sont interdits.",
          "Ne pas laisser de jouets dans ou autour du bassin en dehors des periodes de baignade.",
        ],
      },
      {
        num: 3,
        title: "Acceptation des risques et decharge de responsabilite",
        text: "Le locataire reconnait et comprend que l'utilisation de la piscine comporte certains risques, notamment le risque de blessure resultant d'un eventuel dysfonctionnement des equipements, de glissade ou de chute aux abords du bassin. Le locataire accepte les conditions suivantes :",
        items: [
          "Renoncer a toute reclamation presente ou future contre M. et Mme MAIRE et leurs representants.",
          "Degager M. et Mme MAIRE de toute responsabilite pour toute perte, dommage, blessure ou depense que le locataire ou ses proches pourraient subir du fait de l'utilisation de la piscine, Y COMPRIS EN CAS DE NEGLIGENCE DES PROPRIETAIRES.",
          "Garantir et indemniser M. et Mme MAIRE de toute responsabilite pour tout dommage materiel ou corporel subi par un tiers du fait de l'utilisation de la piscine.",
          "Le present accord est effectif et contraignant pour les heritiers, executeurs testamentaires, administrateurs et ayants droit du locataire.",
        ],
      },
      {
        num: 5,
        title: "Engagement du locataire",
        text: "En signant ce document, le locataire s'engage a :",
        items: [
          "respecter toutes les consignes de securite ci-dessus,",
          "ne jamais desactiver ou neutraliser le dispositif de couverture de securite en dehors des periodes de baignade,",
          "informer immediatement le proprietaire en cas de dysfonctionnement ou d'incident lie a la piscine,",
          "remettre en etat initial tout element de securite apres manipulation.",
        ],
      },
    ],
    sections_en: [
      {
        num: 1,
        title: "Safety Equipment",
        text: "The swimming pool has all the necessary security equipment as per legal requirements:",
        items: [
          "Security cover and snatches \u00ab AQUAL Life Hors Sol \u00bb, NORM NF P90-308.",
          "AQUALIFE \u2013 5 rue Levavasseur Grand St Charles, 66000 Perpignan, France.",
          "Conformity agreement N\u00b030243992, APAVE, 17 Bd Paul Langevin, 38600 Fontaine.",
          "Installed on 07/04/2016 by EAUX ET PISCINES (OZEO), ZA de la Gare, 8 allee de Jonquerolles, 13210 St-Remy-de-Provence. Invoice N\u00b0551462 dated 15/04/2016.",
        ],
      },
      {
        num: 2,
        title: "Reminder of Safety Rules",
        text: "This equipment does not prevent from a constant monitoring of the children.",
        items: [
          "Active and constant supervision by a responsible adult is mandatory during any use of the pool.",
          "No safety system (cover, barrier, alarm, etc.) replaces human vigilance.",
          "Access to the pool is forbidden to children without the presence of an adult who can swim.",
          "Rough play, diving or running around the pool are prohibited.",
          "Do not leave toys in or around the pool outside swimming periods.",
        ],
      },
      {
        num: 3,
        title: "Assumption of Risk and Release of Liability",
        text: "The tenant recognizes and understands that using the swimming pool involves certain risks, including but not limited to the risk of injury resulting from possible malfunction of equipment, tripping or falling in the pool area. The tenant hereby agrees as follows:",
        items: [
          "TO WAIVE ANY AND ALL CLAIMS that the tenant has or may in the future have against Mr/Mrs MAIRE and their representatives.",
          "TO RELEASE Mr/Mrs MAIRE from any and all liability for any loss, damage, injury or expense that the tenant or next of kin may suffer as a result of participation at the swimming pool, INCLUDING NEGLIGENCE ON THE PART OF THE OWNERS.",
          "TO HOLD HARMLESS AND INDEMNIFY Mr/Mrs MAIRE from any and all liability for any damage to property or personal injury to any third party resulting from participation at the swimming pool.",
          "This agreement shall be effective and binding upon the tenant's heirs, next of kin, executors, administrators and assigns.",
        ],
      },
      {
        num: 5,
        title: "Tenant's Commitment",
        text: "By signing this document, the tenant agrees to:",
        items: [
          "comply with all the above safety instructions,",
          "never deactivate or neutralize the security cover system outside swimming periods,",
          "immediately inform the owner in case of malfunction or pool-related incident,",
          "restore any safety element to its original state after manipulation.",
        ],
      },
    ],
    children_title_fr: "4. Enfants presents pendant la location",
    children_title_en: "4. Children Present During Rental",
    sign_off_fr: "J'AI LU ET COMPRIS CE DOCUMENT. En le signant, je renonce a certains droits legaux que moi-meme ou mes heritiers, executeurs testamentaires et ayants droit pourrions avoir contre les proprietaires.",
    sign_off_en: "I HAVE READ AND UNDERSTOOD THIS AGREEMENT. I AM AWARE THAT BY SIGNING THIS AGREEMENT, I AM WAIVING CERTAIN LEGAL RIGHTS WHICH I OR MY HEIRS, NEXT OF KIN, EXECUTORS, ADMINISTRATORS AND ASSIGNS MAY HAVE AGAINST THE OWNERS.",
  },

  /* ———————————————————————————————————
     RENTAL CONTRACT — full 15-article contract (from seasonal rental contract PDF)
  ——————————————————————————————————— */
  rental_contract: {
    title_fr: "Contrat de Location Saisonniere Meuble",
    title_en: "Furnished Seasonal Rental Agreement",
    preamble_fr: "Entre les soussignes :",
    preamble_en: "Between the undersigned:",
    owner_label_fr: "Le Bailleur",
    owner_label_en: "The Landlord",
    owner_text: "Monsieur et Madame Flavien et Virginie MAIRE",
    owner_address: "Park View Al Saadiyat Island Apt 714, Abu Dhabi, Emirats Arabes Unis",
    owner_phones: "+971 502048428 / +33 6 14325706 / +971 501730189",
    owner_email: "virginieduvivier@gmail.com",
    tenant_label_fr: "Le Locataire",
    tenant_label_en: "The Tenant",
    property_desc_fr: "Maison d'habitation meublee situee au 595 Chemin Notre Dame, a cote de la Chapelle Notre Dame du Pieux Zele, 13630 Eyragues, France. Coordonnees GPS : N 43\u00b050'11.80\" ; E 4\u00b050'05.50''. Construction 2009. Surface habitable : 185 m\u00b2. Rez-de-chaussee : salon, salle a manger, cuisine equipee, 1 chambre avec salle de bain, arriere-cuisine, buanderie. Premier etage : 3 chambres (dont 1 suite avec salle de bain double douche/vasque), 1 salle de bain avec baignoire, WC separe. Exterieur : terrasse couverte 25 m\u00b2 avec plancha a gaz, piscine 9m x 4,5m avec volet electrique et pool house, parking 4 voitures. Equipement bebe disponible.",
    property_desc_en: "Furnished residential property at 595 Chemin Notre Dame, next to the Chapelle Notre Dame du Pieux Zele, 13630 Eyragues, France. GPS: N 43\u00b050'11.80\"; E 4\u00b050'05.50''. Built 2009. Living area: 185 m\u00b2. Ground floor: living room, dining room, fitted kitchen, 1 bedroom with ensuite, back kitchen, laundry. First floor: 3 bedrooms (including 1 suite with double shower/basin ensuite), 1 bathroom with bathtub, separate WC. Exterior: 25 m\u00b2 covered terrace with gas plancha, 9m x 4.5m pool with electric cover and pool house, parking for 4 cars. Baby equipment available.",
    max_occupants: 10,
    security_deposit: 1500,
    cleaning_rate_per_hour: 25,
    tourist_tax_per_person_per_night: 0.99,
    tourist_tax_authority_fr: "Communaute de Communes Vallee des Baux-Alpilles",
    tourist_tax_authority_en: "Vallee des Baux-Alpilles Community of Communes",
    clauses_fr: [
      { title: "Objet du contrat", text: "Les locaux objet du present contrat sont loues meubles a titre saisonnier. Les parties conviennent que leurs droits et obligations respectifs seront regis par les stipulations du present contrat, par l'arrete du 28 decembre 1976 modifie et a defaut par les dispositions du code civil." },
      { title: "Designation du logement", text: "Adresse : 595 Chemin Notre Dame, 13630 Eyragues, France. Coordonnees GPS : N 43\u00b050'11.80\" ; E 4\u00b050'05.50''. Maison de 185 m\u00b2 comprenant : Rez-de-chaussee (salon, salle a manger, cuisine equipee, 1 chambre avec salle de bain, arriere-cuisine, buanderie), Premier etage (3 chambres dont 1 suite avec salle de bain, 1 salle de bain, WC), Exterieur (terrasse couverte 25 m\u00b2 avec plancha, piscine 9m x 4,5m avec volet electrique et pool house, parking 4 voitures). Equipement bebe disponible (table a langer, lit pliant, chaise haute)." },
      { title: "Piscine", text: "La piscine est par nature un endroit dangereux. Elle ne doit pas etre utilisee par les enfants sans la surveillance directe d'un adulte. Cette surveillance est de la responsabilite du locataire. La presence d'un dispositif de securite conforme a la legislation ne dispense pas d'une surveillance directe par des adultes et ne peut s'y substituer. Tout dommage materiel ou corporel relatif a l'utilisation de la piscine releve de la responsabilite pleine et entiere du locataire. Une decharge de responsabilite (en annexe) doit etre remplie et signee lors de l'etat des lieux d'entree. Un contrat d'entretien est en place : le pisciniste intervient une fois par semaine. Le locataire ne doit pas intervenir sur la programmation de filtration et doit laisser le robot dans la piscine en permanence. Les skimmers doivent etre vides quotidiennement. Aucun animal n'est autorise dans la piscine." },
      { title: "Etat des lieux et inventaire", text: "Un etat des lieux et un inventaire du mobilier sont remis au locataire lors de l'entree dans le logement, et seront annexes au present contrat. A defaut de contestation par le Locataire dans un delai de 48 heures suivant l'entree, l'etat des lieux sera repute accepte sans reserve. Un etat des lieux de sortie sera etabli par les parties a la fin de la location." },
      { title: "Duree de la location", text: "Le Bailleur loue au Locataire le logement pour la periode indiquee ci-dessus. La location ne pourra pas etre prorogee sauf accord prealable et ecrit du bailleur. La remise des cles ne peut se faire qu'entre 16h00 et 22h00. L'heure d'arrivee doit etre communiquee au bailleur la veille. Le Locataire s'engage a avoir integralement libere le logement avant 10h00 le jour du depart, et a remettre au Bailleur l'ensemble des clefs et telecommandes." },
      { title: "Prix et charges", text: "Le loyer est fixe selon les conditions convenues entre les parties. Il comprend les charges locatives : eau de ville et de pompage, chauffage (climatisation reversible), air conditionne, acces Internet haut debit (Starlink) et WiFi, television TNT, linge de maison et draps fournis (serviettes de plage NON fournies), menage, entretien de la piscine et du jardin." },
      { title: "Reservation et versement des arrhes", text: "Le Locataire retourne le present contrat paraphe et signe accompagne du versement d'arrhes correspondant a 25% du montant de la location. Ce versement ne sera pas rembourse en cas d'annulation. Seul le contrat signe par les deux parties constituera acceptation du present contrat par le bailleur." },
      { title: "Paiement du solde", text: "Le solde (75%) sera verse par le locataire 30 jours avant la date d'arrivee dans la maison." },
      { title: "Taxe de sejour", text: "Conformement a la legislation francaise, une taxe de sejour est due par chaque occupant adulte pour chaque nuit passee dans le logement. Cette taxe est collectee par le bailleur pour le compte de la Communaute de Communes Vallee des Baux-Alpilles, qui en est l'autorite percevante. Le montant total de la taxe figure dans le recapitulatif financier ci-dessus et s'ajoute au loyer." },
      { title: "Depot de garantie", text: "Au plus tard lors de l'entree dans les lieux, le locataire remettra 1 500 \u20ac a titre de depot de garantie. Cette somme sera restituee dans un delai de 4 jours apres l'etat des lieux de sortie, si aucune degradation n'est constatee. Le locataire s'engage a rendre les lieux dans un etat de proprete acceptable (ne necessitant pas plus de 3 heures de menage). Bareme de nettoyage supplementaire : 25 \u20ac par heure." },
      { title: "Cession et sous-location", text: "Le present contrat est conclu intuitu personae au profit du seul locataire identifie en tete du contrat. Toute cession, sous-location totale ou partielle, ou mise a disposition meme gratuite est rigoureusement interdite." },
      { title: "Obligations du locataire", text: "Le Locataire usera paisiblement du logement loue et du mobilier. Il est interdit de fumer dans la maison. Les animaux ne sont pas autorises sauf accord entre locataire et proprietaire. Le bruit doit etre respectueux des voisins. Le nombre maximum de personnes est de 10. Le locataire s'engage a rendre les lieux dans un etat propre : placards et poubelles vides, refrigerateurs vides de dechets, sanitaires, appareils electromenagers, barbecue et plancha nettoyes." },
      { title: "Annulation", text: "La signature du contrat engage les deux parties de maniere irrevocable. Desistement du locataire : plus de 15 jours avant le debut \u2014 perte des arrhes verses ; moins de 15 jours \u2014 perte de l'integralite des sommes versees. Il est vivement conseille de souscrire une assurance annulation. Desistement du bailleur : plus de 8 semaines avant \u2014 le bailleur versera le double des arrhes ; moins de 8 semaines \u2014 pas de desistement possible sauf force majeure." },
      { title: "Assurances", text: "Le locataire s'engage a s'assurer contre les risques locatifs (incendie, degats des eaux) et a produire avant l'entree dans les lieux un exemplaire de la police d'assurance. Le locataire doit fournir une preuve d'assurance responsabilite civile pour l'ensemble des personnes occupant la maison pendant la duree de la location." },
      { title: "Resiliation de plein droit", text: "En cas de manquement par le Locataire a l'une de ses obligations contractuelles, le present bail sera resilie de plein droit. Cette resiliation prendra effet apres un delai de 48 heures apres une sommation restee infructueuse." },
      { title: "Loi applicable et juridiction", text: "Le present contrat est regi par le droit francais. En cas de litige, le tribunal de la circonscription judiciaire ou se trouve le lieu loue sera seul competent." },
    ],
    clauses_en: [
      { title: "Purpose of the contract", text: "The premises are rented furnished on a seasonal basis. The parties agree that their rights and obligations shall be governed by this contract, the decree of 28 December 1976 as amended, and the French Civil Code." },
      { title: "Property description", text: "Address: 595 Chemin Notre Dame, 13630 Eyragues, France. GPS: N 43\u00b050'11.80\"; E 4\u00b050'05.50''. 185 m\u00b2 house comprising: Ground floor (living room, dining room, fitted kitchen, 1 bedroom with ensuite, back kitchen, laundry), First floor (3 bedrooms including 1 suite with ensuite, 1 bathroom, WC), Exterior (25 m\u00b2 covered terrace with plancha, 9m x 4.5m pool with electric cover and pool house, parking for 4 cars). Baby equipment available (changing table, travel cot, high chair)." },
      { title: "Pool", text: "The pool is inherently dangerous. It must not be used by children without direct adult supervision. This supervision is the tenant's responsibility. Safety devices do not replace direct supervision by adults. Any material or bodily damage related to pool use is the full responsibility of the tenant. A liability waiver (appended) must be completed and signed at check-in. A maintenance contract is in place: pool technician visits weekly. The tenant must not adjust the filtration schedule and must leave the robot in the pool at all times. Skimmers must be emptied daily. No animals in the pool." },
      { title: "Inventory and condition report", text: "An inventory and condition report will be provided at check-in and appended to this contract. If not contested within 48 hours, they shall be deemed accepted without reservation. A check-out report will be established by both parties." },
      { title: "Duration", text: "The landlord rents the property to the tenant for the period indicated above. The rental may not be extended without prior written agreement. Key handover between 4:00 pm and 10:00 pm. The tenant must inform the landlord of arrival time the day before. The tenant undertakes to vacate the property by 10:00 am on departure day and return all keys and remote controls." },
      { title: "Price and charges", text: "The rental price is set as agreed between the parties. It includes: mains water and well water, heating (reversible air conditioning), air conditioning, high-speed internet (Starlink) and WiFi, TNT television, household linen and sheets (beach towels NOT provided), cleaning, pool and garden maintenance." },
      { title: "Booking and deposit", text: "The tenant returns the signed contract with a deposit of 25% of the total rental amount. This deposit is non-refundable in case of cancellation. Only the contract signed by both parties constitutes acceptance." },
      { title: "Balance payment", text: "The balance (75%) must be paid 30 days before the arrival date." },
      { title: "Tourist tax", text: "In accordance with French law, a tourist tax (taxe de sejour) is due per adult occupant per night spent at the property. This tax is collected by the landlord on behalf of the Vallee des Baux-Alpilles Community of Communes, which is the receiving authority. The total amount of the tax is shown in the financial summary above and is added to the rental price." },
      { title: "Security deposit", text: "Upon arrival, the tenant shall provide \u20ac1,500 as a security deposit. This sum will be returned within 4 days after the check-out inspection, provided no damage is found. The tenant must return the property in an acceptable state of cleanliness (requiring no more than 3 hours of cleaning). Additional cleaning rate: \u20ac25 per hour." },
      { title: "Assignment and subletting", text: "This contract is entered into on the basis of the tenant's personal identity. Any assignment, subletting (total or partial), or making the property available to others \u2014 even free of charge \u2014 is strictly prohibited." },
      { title: "Tenant obligations", text: "The tenant shall use the property and furnishings peacefully. No smoking inside the house. No pets without prior agreement. Respect neighbors' tranquility. Maximum 10 occupants. The tenant must return the property clean: cupboards and bins emptied, fridges cleared, bathrooms, appliances, barbecue and plancha cleaned." },
      { title: "Cancellation", text: "The signed contract is irrevocable. Tenant cancellation: more than 15 days before arrival \u2014 loss of deposit; less than 15 days \u2014 full amount due. Cancellation insurance is strongly recommended. Landlord cancellation: more than 8 weeks before \u2014 double the deposit; less than 8 weeks \u2014 no cancellation except force majeure." },
      { title: "Insurance", text: "The tenant must be insured against rental risks (fire, water damage) and provide proof of insurance before check-in. Civil liability insurance is required for all occupants." },
      { title: "Automatic termination", text: "In case of breach by the tenant of any contractual obligation, the lease shall be terminated automatically after 48 hours following an unsuccessful formal notice." },
      { title: "Applicable law and jurisdiction", text: "This contract is governed by French law. Any dispute shall be submitted to the competent court in the jurisdiction where the property is located." },
    ],
    signature_note_fr: "Lu et approuve \u2013 En signant ci-dessous, je declare avoir lu et accepte l'ensemble des conditions du present contrat de location saisonniere.",
    signature_note_en: "Read and approved \u2013 By signing below, I declare that I have read and accept all the terms and conditions of this seasonal rental agreement.",
  },

  /* ———————————————————————————————————
     ARRIVAL TIME SLOTS — for checkin form
  ——————————————————————————————————— */
  arrival_slots: [
    "16:00 \u2014 17:00",
    "17:00 \u2014 18:00",
    "18:00 \u2014 19:00",
    "19:00 \u2014 20:00",
    "20:00 \u2014 21:00",
    "21:00 \u2014 22:00",
    "A preciser / To be confirmed",
  ],

};

if (typeof module !== "undefined") module.exports = MAS_AIRAGA;
