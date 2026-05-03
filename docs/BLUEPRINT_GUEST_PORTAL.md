# Mas Airaga — Guest Portal Blueprint

> **Version**: 2.0
> **Created**: 2026-03-24
> **Branch**: `v2-guest-portal`
> **Safety tag**: `v1.0-stable` (run `git checkout v1.0-stable` to restore the original site)

---

## 1. Overview

A **private guest portal** at `mas-airaga.com/guest/?t=<token>` that replaces the paper welcome booklet with a digital, modular experience. Owners (Virginie & Flavien) control which modules each guest sees via an admin dashboard.

### Principles
- **No changes to the public site** — `index.html`, `gallery.html`, `contact.html`, `location.html`, `around.html`, `styles.css`, `script.js` are untouched
- **Same branding** — Provence palette, Playfair Display + Manrope fonts
- **Vanilla HTML/CSS/JS** — no framework, consistent with existing site
- **Supabase** — backend for auth, token validation, storage, and data
- **Modular** — every feature is on/off per booking

---

## 2. URL Structure

```
mas-airaga.com/                    → public site (existing, UNCHANGED)
mas-airaga.com/guest/?t=<token>    → guest portal (token-validated)
mas-airaga.com/admin/              → owner dashboard (Supabase email auth)
```

All hosted on GitHub Pages. Supabase called client-side. No server to deploy.

---

## 3. File Structure

```
Site-Mas-Airaga/
├── index.html                 ← UNCHANGED
├── gallery.html               ← UNCHANGED
├── contact.html               ← UNCHANGED
├── location.html              ← UNCHANGED
├── around.html                ← UNCHANGED
├── styles.css                 ← UNCHANGED
├── script.js                  ← UNCHANGED
├── CNAME                      ← UNCHANGED
│
├── guest/
│   ├── index.html             ← token gate → loads enabled modules
│   ├── guide.css              ← guest portal styles
│   ├── guide.js               ← token auth + module rendering
│   └── mas-airaga-content.js  ← static content (NO bank details)
│
├── admin/
│   ├── index.html             ← Supabase email/password login
│   ├── admin.css
│   └── admin.js               ← CRUD bookings, toggle modules, generate links
│
├── shared/
│   └── supabase-config.js     ← Supabase URL + anon key (public, safe)
│
└── docs/
    └── BLUEPRINT_GUEST_PORTAL.md  ← this file
```

---

## 4. Supabase Schema

### `bookings` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | auto-generated |
| guest_name | text NOT NULL | |
| guest_email | text | optional |
| guest_phone | text | WhatsApp number |
| checkin_date | date NOT NULL | |
| checkout_date | date NOT NULL | |
| num_guests | int | |
| weekly_rate | numeric | |
| deposit | numeric | |
| token | text UNIQUE | random URL-safe string |
| token_expires | timestamptz | checkout_date + 48h |
| modules | jsonb | see below |
| notes | text | internal notes |
| status | text | draft / sent / active / archived |
| created_at | timestamptz | auto |

**modules jsonb default:**
```json
{
  "guide": true,
  "checkin": false,
  "arrival": false,
  "contract": false,
  "checkout": false
}
```

### `checkin_data` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK→bookings | |
| guests_info | jsonb | [{name, dob, address}] |
| id_photo_url | text | Supabase Storage path |
| arrival_slot | text | selected time slot |
| pool_waiver_signed | boolean | |
| pool_waiver_sig | text | typed name or base64 signature |
| house_rules_accepted | boolean | |
| signed_at | timestamptz | |
| submitted_at | timestamptz | auto |

### `contract_data` table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK→bookings | |
| contract_html | text | snapshot of generated contract |
| signature | text | base64 canvas signature |
| signed_at | timestamptz | |
| ip_address | text | |

### Row-Level Security (RLS)
- **Guests**: can SELECT their own booking (matched by token), INSERT/UPDATE their own checkin_data and contract_data
- **Admins**: full access via Supabase auth (email/password login)
- **Anonymous**: no access

---

## 5. The 5 Toggleable Modules

| # | Module Key | Guest Experience | Data Collected |
|---|-----------|-----------------|----------------|
| 1 | `guide` | House info, WiFi, rooms, pool rules, local guide, emergency contacts | None (read-only) |
| 2 | `checkin` | ID upload, guest list with DOB, pool waiver signature | ID photo, guest info, signed waiver |
| 3 | `arrival` | Time slot picker → WhatsApp confirmation | Selected slot |
| 4 | `contract` | Rental contract (auto-filled) + e-signature | Signature + timestamp |
| 5 | `checkout` | Interactive departure checklist + "all done" button | Checklist state, completion notification |

---

## 6. Guest Flow

```
Virginie creates booking in /admin/
    ↓
Toggles modules: ☑ guide  ☑ checkin  ☑ arrival  ☐ contract  ☑ checkout
    ↓
Clicks "Send link" → pre-filled WhatsApp message opens
    ↓
Guest receives: "Your Mas Airaga welcome portal: mas-airaga.com/guest/?t=a8f3c..."
    ↓
Guest opens link → Supabase validates token + checks expiry
    ↓
Portal renders ONLY the enabled modules
    ↓
Token expires 48h after checkout_date
```

---

## 7. Security

- **Guest access**: token in URL → validated against Supabase `bookings.token` + `token_expires`
- **Admin access**: Supabase email/password auth (Virginie + Flavien only)
- **Sensitive data**: bank/financial details NOT in client-side JS — only in Supabase, fetched for contract generation
- **WiFi credentials**: in `mas-airaga-content.js`, loaded only after token validation
- **ID photos**: Supabase Storage with private bucket, accessed via signed URLs
- **`<meta name="robots" content="noindex, nofollow">`** on all guest/admin pages
- **No changes to public site** — existing SEO and functionality preserved

---

## 8. Phased Delivery

### Phase 1 — Foundation ← START HERE
- [ ] Supabase project setup (free tier)
- [ ] Create tables + RLS policies
- [ ] `shared/supabase-config.js`
- [ ] Move existing guide files to `guest/`
- [ ] Refactor `guest/guide.js`: replace pin gate with Supabase token validation
- [ ] Remove `financial.bank` from `mas-airaga-content.js`
- [ ] Admin login page (Supabase email auth)
- [ ] Admin: create booking → auto-generate token
- [ ] Admin: toggle modules per booking
- [ ] Admin: "Send link" → pre-filled WhatsApp `wa.me/` URL
- [ ] Guest portal: show/hide sections based on `modules` jsonb

### Phase 2 — Check-in + Arrival
- [ ] Check-in form (guest names, DOB, address)
- [ ] ID photo upload (Supabase Storage, private bucket)
- [ ] Pool waiver display + signature capture (canvas)
- [ ] House rules acknowledgement checkbox
- [ ] Arrival time slot picker
- [ ] Submit → store in `checkin_data`
- [ ] Admin: view check-in submissions per booking

### Phase 3 — Contract + Checkout
- [ ] Contract template engine (auto-fill from booking + content data)
- [ ] Digital signature canvas
- [ ] Store signed contract in `contract_data`
- [ ] Checkout "all done" → WhatsApp notification to owners
- [ ] Optional: PDF export of signed contract (html2pdf.js)

### Phase 4 — Polish & Automation
- [ ] Admin: booking calendar view
- [ ] Admin: status badges (draft / sent / opened / checked-in / checked-out)
- [ ] WhatsApp Business API integration (automated link sending + reminders)
- [ ] Booking archive / history
- [ ] Analytics (how many guests opened, completed check-in, etc.)

---

## 9. Sensitive Data Migration

| Data | Current location | Target |
|------|-----------------|--------|
| WiFi credentials | `mas-airaga-content.js` | Keep (gated by token) |
| Bank IBAN/BIC | `mas-airaga-content.js` | Move to Supabase (admin-only) |
| Financial rates | `mas-airaga-content.js` | Move to Supabase (used in contract generation) |
| Pool waiver text | `mas-airaga-content.js` | Keep (needed for guest-facing waiver) |
| Owner phone numbers | `mas-airaga-content.js` | Keep (shown in guest guide) |

---

## 10. Rollback Plan

The public site is fully protected:
- **Tag `v1.0-stable`**: `git checkout v1.0-stable` restores the exact state before any guest portal work
- **Branch `v2-guest-portal`**: all new work happens here, merged to `main` only when ready
- **No existing files modified**: all new code goes in `guest/`, `admin/`, `shared/`, `docs/`
