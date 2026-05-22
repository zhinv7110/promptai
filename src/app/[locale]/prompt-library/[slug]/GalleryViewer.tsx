'use client';

import { useState } from 'react';
import ImageLightbox from '@/components/ui/ImageLightbox';

export default function GalleryViewer({ images, locale }: { images: string[]; locale: string }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (images.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
        {images.map((url, i) => (
          <button
            key={url}
            onClick={() => openLightbox(i)}
            className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square hover:ring-2 hover:ring-purple-500/50 transition-all"
          >
            <img
              src={url}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
