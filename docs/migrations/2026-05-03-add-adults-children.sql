-- ============================================
-- Migration: split num_guests into num_adults + num_children
-- Date: 2026-05-03
-- Run once in Supabase Dashboard → SQL Editor → New query
-- ============================================

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS num_adults   int,
  ADD COLUMN IF NOT EXISTS num_children int;

-- Backfill: assume existing bookings are all adults until edited.
UPDATE bookings
SET num_adults = num_guests
WHERE num_adults IS NULL AND num_guests IS NOT NULL;

UPDATE bookings
SET num_children = 0
WHERE num_children IS NULL;
