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
  return (
    <svg
      viewBox="0 0 320 370"
      style={{ width: typeof size === 'number' ? `${size}px` : size, height: 'auto' }}
      className={`inline-block filter drop-shadow-md ${className}`}
      aria-label="Logo Resmi Pemerintah Provinsi Sumatera Barat"
      role="img"
    >
      {/* 1. Outer Black Shield Border */}
      <path
        d="M 20 10 L 300 10 L 282 340 L 160 365 L 38 340 Z"
        fill="#000000"
      />

      {/* 2. White Margin Border */}
      <path
        d="M 26 16 L 294 16 L 277 335 L 160 359 L 43 335 Z"
        fill="#ffffff"
      />

      {/* 3. Main Green Body Shield */}
      <path
        d="M 32 22 L 288 22 L 272 330 L 160 353 L 48 330 Z"
        fill="#3ca655"
      />

      {/* 4. Top Red Banner Header */}
      <path
        d="M 32 22 L 288 22 L 282 66 L 38 66 Z"
        fill="#ed1c24"
        stroke="#ffffff"
        strokeWidth="3"
      />

      {/* 5. Header Text SUMATERA BARAT */}
      <text
        x="160"
        y="53"
        textAnchor="middle"
        fill="#fff200"
        fontSize="24"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        letterSpacing="1.2"
      >
        SUMATERA BARAT
      </text>

      {/* 6. Yellow Star (Bintang Emas) */}
      <polygon
        points="160,78 163.5,88 174,88 165.5,94.5 168.5,105 160,98.5 151.5,105 154.5,94.5 146,88 156.5,88"
        fill="#fff200"
      />

      {/* 7. Black Rumah Gadang Silhouette with 4 Sharp Curved Gonjong Roof Peaks */}
      <path
        d="M 68 112 C 72 170 88 190 120 205 
           L 120 178 C 114 160 114 140 108 128
           C 118 152 130 168 145 178
           L 145 120 L 175 120 L 175 178
           C 190 168 202 152 212 128
           C 206 140 206 160 200 178
           L 200 205 C 232 190 248 170 252 112
           C 246 165 235 210 230 224
           L 90 224 C 85 210 74 165 68 112 Z"
        fill="#000000"
      />

      {/* 8. White Tiered Tower / Gonjong Mesjid in Center */}
      {/* Tier 1 (Bottom Tier) */}
      <path d="M 122 205 Q 160 190 198 205 L 190 190 Q 160 180 130 190 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      {/* Tier 2 (Middle Tier) */}
      <path d="M 130 190 Q 160 176 190 190 L 182 174 Q 160 164 138 174 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      {/* Tier 3 (Top Tier Peak) */}
      <path d="M 138 174 Q 160 152 182 174 C 172 152 166 138 160 115 C 154 138 148 152 138 174 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />

      {/* 9. Red Base Structure (Rumah Gadang Bottom Frame) */}
      <rect x="94" y="215" width="132" height="32" rx="4" fill="#000000" stroke="#ed1c24" strokeWidth="4" />
      <line x1="94" y1="231" x2="226" y2="231" stroke="#ed1c24" strokeWidth="3" />
      <line x1="138" y1="215" x2="138" y2="247" stroke="#ed1c24" strokeWidth="3" />
      <line x1="182" y1="215" x2="182" y2="247" stroke="#ed1c24" strokeWidth="3" />

      {/* 10. 4 Parallel White Water Waves */}
      <g stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M 54 260 Q 80 250 106 260 T 158 260 T 210 260 T 266 260" />
        <path d="M 54 272 Q 80 262 106 272 T 158 272 T 210 272 T 266 272" />
        <path d="M 54 284 Q 80 274 106 284 T 158 284 T 210 284 T 266 284" />
        <path d="M 54 296 Q 80 286 106 296 T 158 296 T 210 296 T 266 296" />
      </g>

      {/* 11. Yellow Scroll Ribbon at Bottom */}
      <path
        d="M 85 308 Q 160 326 235 308
           C 255 308 255 332 235 332
           Q 160 348 85 332
           C 65 332 65 308 85 308 Z"
        fill="#fff200"
        stroke="#000000"
        strokeWidth="3.5"
      />
      {/* Scroll End Flaps */}
      <path d="M 85 308 C 70 308 75 328 85 332 C 95 328 92 312 85 308 Z" fill="#e6db00" stroke="#000000" strokeWidth="2" />
      <path d="M 235 308 C 250 308 245 328 235 332 C 225 328 228 312 235 308 Z" fill="#e6db00" stroke="#000000" strokeWidth="2" />

      {/* 12. Ribbon Motto Text TUAH SAKATO */}
      <text
        x="160"
        y="329"
        textAnchor="middle"
        fill="#ed1c24"
        fontSize="17"
        fontWeight="900"
        fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
        letterSpacing="2"
      >
        TUAH SAKATO
      </text>
    </svg>
  );
};
