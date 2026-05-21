'use client';

export default function HeroBackground() {
  // Pseudo-random deterministic particle positions to avoid hydration mismatch
  const particles = Array.from({ length: 12 }, (_, i) => ({
    left: `${8 + ((i * 37 + 13) % 84)}%`,
    top: `${20 + ((i * 23 + 7) % 60)}%`,
    delay: `${(i * 0.7).toFixed(1)}s`,
    duration: `${6 + (i % 4) * 2}s`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Layer 1: Deep background base — always dark */}
      <div className="absolute inset-0 bg-[#0A0A1A]" />

      {/* Layer 2: Aurora blob 1 — indigo/purple, upper-left */}
      <div
        className="aurora-blob animate-aurora-float-1"
        style={{
          width: '800px',
          height: '800px',
          top: '-160px',
          left: '-80px',
          background: 'rgba(99, 102, 241, 0.25)',
          filter: 'blur(120px)',
        }}
      />

      {/* Layer 3: Aurora blob 2 — purple, upper-right */}
      <div
        className="aurora-blob animate-aurora-float-2"
        style={{
          width: '600px',
          height: '600px',
          top: '40px',
          right: '-80px',
          left: 'auto',
          background: 'rgba(139, 92, 246, 0.20)',
          filter: 'blur(100px)',
        }}
      />

      {/* Layer 4: Aurora blob 3 — cyan, lower-left */}
      <div
        className="aurora-blob animate-aurora-float-3"
        style={{
          width: '500px',
          height: '500px',
          bottom: '-80px',
          left: '30%',
          top: 'auto',
          background: 'rgba(56, 189, 248, 0.15)',
          filter: 'blur(100px)',
        }}
      />

      {/* Layer 5: Mouse-following light bloom */}
      <div
        className="aurora-bloom animate-bloom-breathe"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          filter: 'blur(80px)',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.20), rgba(99, 102, 241, 0.10), transparent)',
          left: 'calc(var(--mouse-x, 0.5) * 100%)',
          top: 'calc(var(--mouse-y, 0.5) * 100%)',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Layer 6: Subtle particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* Layer 7: Vignette — darken edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 26, 0.5) 100%)',
        }}
      />

      {/* Layer 8: Bottom blend fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32"
        style={{
          background: 'linear-gradient(to top, rgba(255,255,255,0.03), transparent)',
        }}
      />

      {/* Subtle top light */}
      <div
        className="absolute top-0 inset-x-0 h-64"
        style={{
          background: 'linear-gradient(to bottom, rgba(99, 102, 241, 0.04), transparent)',
        }}
      />
    </div>
  );
}
