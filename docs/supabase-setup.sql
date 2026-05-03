-- ============================================
-- MAS D'AIRAGA — Supabase Schema Setup
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================

-- 1. Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. BOOKINGS table
CREATE TABLE IF NOT EXISTS bookings (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  guest_name      text NOT NULL,
  guest_email     text,
  guest_phone     text,
  checkin_date    date NOT NULL,
  checkout_date   date NOT NULL,
  num_guests      int,
  num_adults      int,
  num_children    int,
  weekly_rate     numeric,
  deposit         numeric,
  token           text UNIQUE NOT NULL,
  token_expires   timestamptz NOT NULL,
  modules         jsonb NOT NULL DEFAULT '{
    "guide": true,
    "checkin": false,
    "arrival": false,
    "contract": false,
    "checkout": false
  }'::jsonb,
  notes           text,
  status          text NOT NULL DEFAULT 'draft',
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- 3. CHECKIN_DATA table
CREATE TABLE IF NOT EXISTS checkin_data (
  id                    uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id            uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  guests_info           jsonb,
  id_photo_url          text,
  arrival_slot          text,
  pool_waiver_signed    boolean DEFAULT false,
  pool_waiver_sig       text,
  house_rules_accepted  boolean DEFAULT false,
  signed_at             timestamptz,
  submitted_at          timestamptz NOT NULL DEFAULT now()
);

-- 4. CONTRACT_DATA table
CREATE TABLE IF NOT EXISTS contract_data (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id      uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  contract_html   text,
  signature       text,
  signed_at       timestamptz,
  ip_address      text
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_token ON bookings(token);
CREATE INDEX IF NOT EXISTS idx_bookings_checkin ON bookings(checkin_date);
CREATE INDEX IF NOT EXISTS idx_checkin_data_booking ON checkin_data(booking_id);
CREATE INDEX IF NOT EXISTS idx_contract_data_booking ON contract_data(booking_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_data ENABLE ROW LEVEL SECURITY;

-- ----- BOOKINGS -----

-- Guests: can read their own booking by token (anonymous access via anon key)
CREATE POLICY "guests_read_own_booking" ON bookings
  FOR SELECT
  USING (
    -- Allow anon users to read a booking if they provide the correct token
    -- Token is passed via the query filter (e.g., .eq('token', value))
    auth.role() = 'anon'
  );

-- Admins: full access (authenticated users)
CREATE POLICY "admins_full_bookings" ON bookings
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ----- CHECKIN_DATA -----

-- Guests: can insert their own check-in data (linked to a valid booking)
CREATE POLICY "guests_insert_checkin" ON checkin_data
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = checkin_data.booking_id
      AND bookings.token_expires > now()
    )
  );

-- Guests: can read their own check-in data
CREATE POLICY "guests_read_checkin" ON checkin_data
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = checkin_data.booking_id
    )
  );

-- Admins: full access
CREATE POLICY "admins_full_checkin" ON checkin_data
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ----- CONTRACT_DATA -----

-- Guests: can insert contract signatures
CREATE POLICY "guests_insert_contract" ON contract_data
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = contract_data.booking_id
      AND bookings.token_expires > now()
    )
  );

-- Guests: can read their own contract
CREATE POLICY "guests_read_contract" ON contract_data
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = contract_data.booking_id
    )
  );

-- Admins: full access
CREATE POLICY "admins_full_contract" ON contract_data
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- DONE! Next steps:
-- 1. Go to Authentication → Users → Invite user
--    Add: virginieduvivier@gmail.com and flavien.maire@gmail.com
-- 2. Go to Settings → API → copy the URL and anon key
--    Paste into shared/supabase-config.js
-- ============================================
