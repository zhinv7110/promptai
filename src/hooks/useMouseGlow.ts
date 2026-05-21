'use client';

import { useEffect, useRef } from 'react';

interface UseMouseGlowOptions {
  smoothing?: number;
  propX?: string;
  propY?: string;
}

export function useMouseGlow(options: UseMouseGlowOptions = {}) {
  const {
    smoothing = 0.06,
    propX = '--mouse-x',
    propY = '--mouse-y',
  } = options;

  const ref = useRef<HTMLElement>(null);
  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });
  const rafId = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rect = el.getBoundingClientRect();

    const handleMove = (e: PointerEvent) => {
      target.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const handleResize = () => {
      rect = el.getBoundingClientRect();
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(el);

    const tick = () => {
      const cx = current.current.x + (target.current.x - current.current.x) * smoothing;
      const cy = current.current.y + (target.current.y - current.current.y) * smoothing;
      current.current = { x: cx, y: cy };
      el.style.setProperty(propX, String(cx));
      el.style.setProperty(propY, String(cy));
      rafId.current = requestAnimationFrame(tick);
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    el.style.setProperty(propX, '0.5');
    el.style.setProperty(propY, '0.5');
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('pointermove', handleMove);
      observer.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [smoothing, propX, propY]);

  return ref;
}
