import React from 'react';

export const CheckerboardGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  // 4 rows of 3.8x3.8 black squares; even rows shifted by 2.25.
  const squares: { x: number; y: number }[] = [];
  const rows = [0, 4.5, 9, 13.5];
  
  rows.forEach((y, rowIndex) => {
    const shift = rowIndex % 2 === 1 ? 2.25 : 0;
    const count = rowIndex % 2 === 1 ? 4 : 5;
    for (let i = 0; i < count; i++) {
      const x = shift + i * 8.3;
      if (x + 3.8 <= 36.5) {
        squares.push({ x, y });
      }
    }
  });

  return (
    <svg
      viewBox="0 0 36 18"
      style={{ width: 'var(--checker-w)', height: 'var(--checker-h)' }}
      className={`inline-block translate-y-[2px] align-middle ${className}`}
      aria-hidden="true"
    >
      {squares.map((sq, idx) => (
        <rect
          key={idx}
          x={sq.x}
          y={sq.y}
          width="3.8"
          height="3.8"
          fill="currentColor"
        />
      ))}
    </svg>
  );
};

export const WireframeGlobe: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      style={{ width: 'var(--globe)', height: 'var(--globe)' }}
      className={`stroke-current fill-none ${className}`}
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {/* Outer Circle */}
      <circle cx="32" cy="32" r="28" />
      {/* Equator & Meridian Lines */}
      <line x1="4" y1="32" x2="60" y2="32" />
      <line x1="32" y1="4" x2="32" y2="60" />
      {/* Horizontal Ellipses */}
      <ellipse cx="32" cy="32" rx="28" ry="11" />
      <ellipse cx="32" cy="32" rx="28" ry="20" />
      {/* Vertical Ellipses */}
      <ellipse cx="32" cy="32" rx="11" ry="28" />
      <ellipse cx="32" cy="32" rx="20" ry="28" />
    </svg>
  );
};

export interface CornerBracketProps {
  type: 'TL' | 'TR' | 'BL' | 'BR';
  className?: string;
  sizeVar?: boolean;
}

export const CornerBracket: React.FC<CornerBracketProps> = ({ type, className = '', sizeVar = true }) => {
  const paths = {
    TL: 'M0 11.5V0.5H11.5',
    TR: 'M0.5 0.5H11.5V11.5',
    BL: 'M0 0.5V11.5H11.5',
    BR: 'M0.5 11.5H11.5V0.5',
  };

  const style = sizeVar ? { width: 'var(--corner)', height: 'var(--corner)' } : undefined;

  return (
    <svg
      viewBox="0 0 12 12"
      style={style}
      className={`stroke-current fill-none ${className}`}
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={paths[type]} />
    </svg>
  );
};

export const PemprovSumbarLogo: React.FC<{ className?: string; size?: number | string }> = ({ className = '', size = 52 }) => {
  return (
    <svg
      viewBox="0 0 100 120"
      style={{ width: typeof size === 'number' ? `${size}px` : size, height: 'auto' }}
      className={`inline-block filter drop-shadow-md ${className}`}
      aria-label="Logo Pemerintah Provinsi Sumatera Barat"
      role="img"
    >
      {/* Outer Shield Outline */}
      <path
        d="M 50 5 L 90 25 C 90 75 75 105 50 115 C 25 105 10 75 10 25 Z"
        fill="#047857"
        stroke="#f59e0b"
        strokeWidth="3"
      />
      {/* Inner Gold Shield Border */}
      <path
        d="M 50 10 L 85 28 C 85 72 71 100 50 109 C 29 100 15 72 15 28 Z"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="1.5"
      />

      {/* Rumah Gadang Gonjong Roof Peaks */}
      {/* Center Peak */}
      <path d="M 50 18 C 47 35 44 48 35 55 L 65 55 C 56 48 53 35 50 18 Z" fill="#b91c1c" stroke="#fbbf24" strokeWidth="1" />
      {/* Left Outer Peak */}
      <path d="M 22 28 C 26 42 32 50 38 55 L 20 55 C 22 45 22 36 22 28 Z" fill="#b91c1c" stroke="#fbbf24" strokeWidth="1" />
      {/* Right Outer Peak */}
      <path d="M 78 28 C 74 42 68 50 62 55 L 80 55 C 78 45 78 36 78 28 Z" fill="#b91c1c" stroke="#fbbf24" strokeWidth="1" />

      {/* Gold Star at Top Center */}
      <polygon
        points="50,22 52,27 57,27 53,30 55,35 50,32 45,35 47,30 43,27 48,27"
        fill="#fbbf24"
      />

      {/* Keris Minangkabau in Center */}
      <path d="M 50 38 L 52 50 L 48 62 L 52 75 L 50 82 L 48 75 L 52 62 L 48 50 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />

      {/* Padi & Kapas / Gelombang Water Waves */}
      <path d="M 25 85 Q 50 75 75 85 Q 50 95 25 85 Z" fill="#1e3a8a" opacity="0.9" />
      <path d="M 22 88 Q 50 96 78 88" stroke="#ffffff" strokeWidth="1.5" fill="none" />
      <path d="M 28 93 Q 50 100 72 93" stroke="#fbbf24" strokeWidth="1.5" fill="none" />

      {/* Tuah Sakato Text Ribbon at Base */}
      <path d="M 24 98 Q 50 105 76 98 L 73 105 Q 50 111 27 105 Z" fill="#ffffff" stroke="#18181b" strokeWidth="0.8" />
      <text
        x="50"
        y="104.5"
        textAnchor="middle"
        fill="#000000"
        fontSize="5"
        fontWeight="900"
        fontFamily="sans-serif"
        letterSpacing="0.4"
      >
        TUAH SAKATO
      </text>
    </svg>
  );
};
