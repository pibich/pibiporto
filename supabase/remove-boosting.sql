-- Migration: remove the boosting feature (2026-07-23).
-- The /boosting page and all boosting/games/testimonials code were removed —
-- boosting now lives on a separate website. schema.sql no longer creates these
-- objects, but existing databases still have them. Run this once in the
-- Supabase Dashboard → SQL Editor to drop the leftover tables and column.

-- Boosting service game list.
drop table if exists public.games;

-- Boosting page testimonial screenshots.
drop table if exists public.testimonials;

-- Boosting open/close status; settings now only holds the profile picture.
alter table public.settings drop column if exists boosting_open;
