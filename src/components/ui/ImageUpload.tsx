'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, GripVertical, ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { ALLOWED_TYPES, MAX_FILE_SIZE } from '@/lib/storage';

interface ImageUploadProps {
  coverImage: string | null;
  galleryImages: string[];
  onCoverChange: (url: string | null) => void;
  onGalleryChange: (urls: string[]) => void;
  isZh?: boolean;
}

export default function ImageUpload({
  coverImage,
  galleryImages,
  onCoverChange,
  onGalleryChange,
  isZh,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState<'cover' | 'gallery' | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const validate = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) return isZh ? '仅支持 JPG、PNG、WebP' : 'Only JPG, PNG, WebP allowed';
    if (file.size > MAX_FILE_SIZE) return isZh ? '文件最大 5MB' : 'Max 5MB';
    return null;
  };

  const uploadToStorage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (!data.url) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleCoverUpload = useCallback(async (file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError('');
    setUploading('cover');
    try {
      const url = await uploadToStorage(file);
      onCoverChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
    setUploading(null);
  }, [onCoverChange]);

  const handleGalleryUpload = useCallback(async (files: FileList) => {
    setError('');
    const valid: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const err = validate(files[i]);
      if (err) { setError(err); return; }
      valid.push(files[i]);
    }
    setUploading('gallery');
    try {
      const urls = await Promise.all(valid.map((f) => uploadToStorage(f)));
      onGalleryChange([...galleryImages, ...urls]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    }
    setUploading(null);
  }, [galleryImages, onGalleryChange]);

  const removeCover = () => onCoverChange(null);
  const removeGallery = (index: number) => {
    const next = [...galleryImages];
    next.splice(index, 1);
    onGalleryChange(next);
  };

  const moveGallery = (from: number, to: number) => {
    const next = [...galleryImages];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onGalleryChange(next);
  };

  const th = (en: string, zh: string) => isZh ? zh : en;

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {th('Cover Image', '封面图片')}
        </label>
        {coverImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <img src={coverImage} alt="Cover" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => coverInputRef.current?.click()} className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors text-xs">
                {th('Replace', '替换')}
              </button>
              <button type="button" onClick={removeCover} className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors text-xs">
                {th('Remove', '删除')}
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging('cover'); }}
            onDragLeave={() => setDragging(null)}
            onDrop={(e) => { e.preventDefault(); setDragging(null); const f = e.dataTransfer.files[0]; if (f) handleCoverUpload(f); }}
            onClick={() => coverInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              dragging === 'cover'
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/30'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}
          >
            {uploading === 'cover' ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                <span className="text-sm text-zinc-500">{th('Uploading...', '上传中...')}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30">
                  <Upload className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {th('Drop cover image here or click to browse', '拖拽封面图到此处或点击选择')}
                </p>
                <p className="text-xs text-zinc-400">JPG, PNG, WebP — {th('max 5MB', '最大 5MB')}</p>
              </div>
            )}
          </div>
        )}
        <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
      </div>

      {/* Gallery Images */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          {th('Gallery Images', '画廊图片')} ({galleryImages.length})
        </label>
        <div className="flex flex-wrap gap-3">
          {galleryImages.map((url, i) => (
            <div
              key={`${url}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={() => { if (dragIndex !== null && dragIndex !== i) moveGallery(dragIndex, i); setDragIndex(null); }}
              className="relative group w-24 h-24 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-grab active:cursor-grabbing"
            >
              <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button type="button" onClick={() => removeGallery(i)} className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="absolute top-1 left-1 p-0.5 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-3 w-3" />
              </div>
            </div>
          ))}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging('gallery'); }}
            onDragLeave={() => setDragging(null)}
            onDrop={(e) => { e.preventDefault(); setDragging(null); handleGalleryUpload(e.dataTransfer.files); }}
            onClick={() => galleryInputRef.current?.click()}
            className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
              dragging === 'gallery'
                ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/30'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700'
            }`}
          >
            {uploading === 'gallery' ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            ) : (
              <>
                <ImageIcon className="h-5 w-5 text-zinc-400" />
                <span className="text-xs text-zinc-400">+</span>
              </>
            )}
          </div>
        </div>
        <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => { const files = e.target.files; if (files) handleGalleryUpload(files); }} />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
