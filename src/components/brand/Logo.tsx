// Thaumary AI Brand Logo — magical + futuristic
export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer ring */}
      <circle cx="16" cy="16" r="14" stroke="url(#logoGrad)" strokeWidth="2" fill="none" opacity="0.8" />
      {/* Inner shape — stylized "T" merged with sparkle */}
      <path
        d="M10 10h12M16 10v12M10 22l6-6M22 22l-6-6"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logoGlow)"
      />
      {/* Sparkle dots */}
      <circle cx="22" cy="10" r="1.5" fill="#8B5CF6" opacity="0.6" />
      <circle cx="10" cy="22" r="1.5" fill="#38BDF8" opacity="0.6" />
    </svg>
  );
}

export function LogoFull({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Logo className="h-7 w-7" />
      <span className="gradient-text font-bold text-lg tracking-tight">
        Thaumary
      </span>
    </span>
  );
}
