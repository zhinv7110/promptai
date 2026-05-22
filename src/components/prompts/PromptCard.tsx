'use client';

import Link from 'next/link';
import { Heart, Eye, Copy, Check, Star, Sparkles } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';

interface PromptCardProps {
  title: string;
  description?: string | null;
  model: string;
  likes: number;
  views: number;
  tags: string[];
  slug: string;
  locale: string;
  promptText?: string;
  coverImage?: string | null;
  galleryImages?: string[] | null;
  isPremium?: boolean;
  isFeatured?: boolean;
}

export default function PromptCard({
  title, description, model, likes, views, tags, slug, locale,
  promptText, coverImage, galleryImages, isPremium, isFeatured,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(0);
  const hoverTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const allImages = [coverImage, ...(galleryImages || [])].filter(Boolean) as string[];
  const hasMultiple = allImages.length > 1;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(promptText || title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startHoverCycle = useCallback(() => {
    if (!hasMultiple) return;
    hoverTimer.current = setInterval(() => {
      setHoverIdx((prev) => (prev + 1) % allImages.length);
    }, 1500);
  }, [hasMultiple, allImages.length]);

  const stopHoverCycle = useCallback(() => {
    if (hoverTimer.current) {
      clearInterval(hoverTimer.current);
      hoverTimer.current = null;
    }
    setHoverIdx(0);
  }, []);

  const modelLabel = model === 'stable-diffusion' ? 'SD' : model === 'dalle3' ? 'DALL·E 3' : model.charAt(0).toUpperCase() + model.slice(1);

  return (
    <Link
      href={`/${locale}/prompt-library/${slug}`}
      className="group block rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 card-glow card-zoom"
      onMouseEnter={startHoverCycle}
      onMouseLeave={stopHoverCycle}
    >
      {/* Image area */}
      <div className="relative parallax-container h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500">
        {allImages.length > 0 ? (
          <>
            {/* Base image (cover or first) */}
            <img
              src={allImages[0]}
              alt={title}
              className="parallax-image absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* Crossfading gallery images */}
            {hasMultiple && allImages.slice(1).map((img, i) => (
              <img
                key={img}
                src={img}
                alt={`${title} ${i + 2}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: hoverIdx === i + 1 ? 1 : 0 }}
                loading="lazy"
              />
            ))}
          </>
        ) : (
          /* Gradient fallback when no image */
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500" />
        )}

        {/* Gradient overlay for text readability */}
        <div className="gradient-overlay-bottom absolute inset-0 z-10" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-xs text-white font-medium">
            {modelLabel}
          </span>
          {isPremium && (
            <span className="px-2 py-0.5 rounded-md bg-amber-400/80 backdrop-blur-sm text-xs text-amber-900 font-medium flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-current" /> Premium
            </span>
          )}
        </div>

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-md bg-purple-500/80 backdrop-blur-sm text-xs text-white flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5" /> Featured
          </div>
        )}

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <h3 className="text-white font-semibold text-sm leading-snug line-clamp-1 drop-shadow-lg">
            {title}
          </h3>
          {description && (
            <p className="text-white/80 text-xs mt-0.5 line-clamp-1 drop-shadow">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 flex flex-col gap-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-400">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats + Copy */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-3 w-3" /> {likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3 w-3" /> {views}
          </span>
          <button
            onClick={handleCopy}
            className="ml-auto p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors spring-hover"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </Link>
  );
}
