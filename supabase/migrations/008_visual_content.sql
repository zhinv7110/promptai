-- Migration 008: Visual Content System
-- Adds cover image, gallery, negative prompt, generation settings, and featured flag to prompts table

ALTER TABLE prompts
  ADD COLUMN IF NOT EXISTS cover_image text,
  ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS aspect_ratio text,
  ADD COLUMN IF NOT EXISTS negative_prompt text,
  ADD COLUMN IF NOT EXISTS generation_settings jsonb,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create storage buckets if they don't exist
-- Note: Buckets must be created via Supabase Dashboard or Management API
-- Run this in SQL Editor:
-- SELECT supabase.storage.create_bucket('prompt-images', '{ "public": true, "allowedMimeTypes": ["image/jpeg", "image/png", "image/webp"], "fileSizeLimit": 5242880 }');
-- SELECT supabase.storage.create_bucket('prompt-gallery', '{ "public": true, "allowedMimeTypes": ["image/jpeg", "image/png", "image/webp"], "fileSizeLimit": 5242880 }');
