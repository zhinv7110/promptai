// Supabase Storage utilities for prompt images
import { createClient } from '@/lib/supabase/client';

const COVER_BUCKET = 'prompt-images';
const GALLERY_BUCKET = 'prompt-gallery';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function getStorage() {
  return createClient().storage;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
}

function generatePath(prefix: string, fileName: string): string {
  const ts = Date.now();
  const ext = fileName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${prefix}/${ts}-${sanitizeFileName(fileName)}.${ext}`;
}

export async function uploadCoverImage(file: File): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: jpg, png, webp');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Max 5MB');
  }

  const path = generatePath('covers', file.name);
  const { data, error } = await getStorage()
    .from(COVER_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: true });

  if (error) throw new Error(error.message);

  const { data: urlData } = getStorage()
    .from(COVER_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function uploadGalleryImage(file: File): Promise<string | null> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: jpg, png, webp');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large. Max 5MB');
  }

  const path = generatePath('gallery', file.name);
  const { data, error } = await getStorage()
    .from(GALLERY_BUCKET)
    .upload(path, file, { cacheControl: '31536000', upsert: true });

  if (error) throw new Error(error.message);

  const { data: urlData } = getStorage()
    .from(GALLERY_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = getStorage().from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  // Extract path from public URL
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
  if (!match) return;
  const [, bucket, path] = match;
  await getStorage().from(bucket).remove([path]);
}

export { COVER_BUCKET, GALLERY_BUCKET, ALLOWED_TYPES, MAX_FILE_SIZE };
