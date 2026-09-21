import { useId } from "react";

type CarArtProps = {
  className?: string;
  width?: number;
  height?: number;
};

export function CamaroArt({
  className,
  width = 360,
  height = 180,
}: CarArtProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 360 180"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="1967 Chevrolet Camaro"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      <ellipse cx="180" cy="138" rx="120" ry="16" fill="rgba(0,0,0,0.25)" />

      <g>
        <path
          d="M58 112 L90 80 L140 62 L220 62 L266 78 L300 112 L318 120 L320 132 L38 132 L35 120 Z"
          fill={`url(#${gradientId})`}
          stroke="#520b0b"
          strokeWidth="2"
        />

        <path
          d="M117 62 L147 40 L196 40 L225 62 Z"
          fill="rgba(255,255,255,0.15)"
          stroke="#7f1d1d"
          strokeWidth="2"
        />

        <path d="M150 40 L162 62 H138 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M200 40 L212 62 H186 Z" fill="rgba(255,255,255,0.08)" />

        <path d="M72 106 H294" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <path d="M95 92 H262" stroke="rgba(255,255,255,0.24)" strokeWidth="2" />

        <path d="M75 112 L55 119" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        <path d="M290 112 L310 118" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

        <circle cx="104" cy="134" r="22" fill="#111827" />
        <circle cx="104" cy="134" r="9" fill="#9ca3af" />
        <circle cx="262" cy="134" r="22" fill="#111827" />
        <circle cx="262" cy="134" r="9" fill="#9ca3af" />
      </g>
    </svg>
  );
}

export function MustangArt({
  className,
  width = 360,
  height = 180,
}: CarArtProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 360 180"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="1965 Ford Mustang"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#f5d77d" />
          <stop offset="100%" stopColor="#d4a52a" />
        </linearGradient>
      </defs>

      <ellipse cx="180" cy="138" rx="120" ry="16" fill="rgba(0,0,0,0.25)" />

      <g>
        <path
          d="M52 110 L88 82 L123 70 L214 70 L264 82 L300 110 L316 120 L318 132 L40 132 L36 120 Z"
          fill={`url(#${gradientId})`}
          stroke="#7a5200"
          strokeWidth="2"
        />

        <path
          d="M124 70 L160 44 L200 44 L240 70 Z"
          fill="rgba(255,255,255,0.12)"
          stroke="#7a5200"
          strokeWidth="2"
        />

        <path d="M148 44 L154 70 H134 Z" fill="rgba(255,255,255,0.08)" />
        <path d="M211 44 L217 70 H197 Z" fill="rgba(255,255,255,0.08)" />

        <path d="M78 101 H291" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <path d="M90 89 H271" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        <path d="M63 111 L46 118" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        <path d="M298 111 L315 118" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

        <circle cx="98" cy="134" r="22" fill="#111827" />
        <circle cx="98" cy="134" r="9" fill="#cbd5e1" />
        <circle cx="260" cy="134" r="22" fill="#111827" />
        <circle cx="260" cy="134" r="9" fill="#cbd5e1" />
      </g>
    </svg>
  );
}

export function F350Art({
  className,
  width = 420,
  height = 200,
}: CarArtProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 420 200"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="2020 Ford F-350 pickup truck"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="154" rx="160" ry="18" fill="rgba(0,0,0,0.26)" />

      <g>
        <path
          d="M44 118 L70 94 L118 86 H241 L283 94 L332 116 L360 118 L376 126 L380 132 L380 138 L32 138 L28 126 L44 118 Z"
          fill={`url(#${gradientId})`}
          stroke="#1e3a8a"
          strokeWidth="2"
        />

        <path
          d="M106 86 L153 52 H260 L301 86 Z"
          fill="rgba(255,255,255,0.12)"
          stroke="#1e3a8a"
          strokeWidth="2"
        />

        <rect x="240" y="94" width="84" height="28" rx="4" fill="rgba(255,255,255,0.12)" />
        <rect x="118" y="94" width="52" height="26" rx="4" fill="rgba(255,255,255,0.1)" />

        <path d="M70 123 H348" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <path d="M90 104 H318" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />

        <path d="M38 119 L18 128" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        <path d="M376 119 L395 128" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

        <circle cx="120" cy="144" r="24" fill="#111827" />
        <circle cx="120" cy="144" r="10" fill="#d1d5db" />
        <circle cx="300" cy="144" r="24" fill="#111827" />
        <circle cx="300" cy="144" r="10" fill="#d1d5db" />
      </g>
    </svg>
  );
}

export function Ram3500Art({
  className,
  width = 420,
  height = 200,
}: CarArtProps) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 420 200"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="1990 Dodge Ram 3500 diesel pickup truck"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="156" rx="160" ry="18" fill="rgba(0,0,0,0.26)" />

      <g>
        <path
          d="M40 121 L78 92 L122 86 H248 L290 94 L336 120 L374 122 L382 130 L382 138 L34 138 L30 126 Z"
          fill={`url(#${gradientId})`}
          stroke="#3b126d"
          strokeWidth="2"
        />

        <path
          d="M108 86 L165 50 H250 L304 86 Z"
          fill="rgba(255,255,255,0.08)"
          stroke="#3b126d"
          strokeWidth="2"
        />

        <rect x="162" y="96" width="118" height="20" rx="3" fill="rgba(255,255,255,0.12)" />
        <rect x="108" y="96" width="42" height="20" rx="3" fill="rgba(255,255,255,0.11)" />

        <path d="M72 121 H356" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
        <path d="M100 103 H316" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        <path d="M38 120 L16 128" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
        <path d="M378 120 L398 128" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />

        <circle cx="118" cy="146" r="24" fill="#111827" />
        <circle cx="118" cy="146" r="10" fill="#d1d5db" />
        <circle cx="304" cy="146" r="24" fill="#111827" />
        <circle cx="304" cy="146" r="10" fill="#d1d5db" />
      </g>
    </svg>
  );
}
