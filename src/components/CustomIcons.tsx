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

export const PemprovSumbarLogo: React.FC<{ className?: string; size?: number | string }> = ({ className = '', size = 56 }) => {
  const widthStyle = typeof size === 'number' ? `${size}px` : size;
  return (
    <img
      src="/logo_sumbar.png"
      alt="Logo Resmi Pemerintah Provinsi Sumatera Barat"
      style={{ width: widthStyle, height: 'auto' }}
      className={`inline-block filter drop-shadow-md object-contain select-none ${className}`}
    />
  );
};
