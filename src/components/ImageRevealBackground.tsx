import React, { useEffect, useRef, useState } from 'react';
import { BG_IMAGE_1, BG_IMAGE_2 } from '../data/content';

interface ImageRevealBackgroundProps {
  bgMediaType?: 'image' | 'video';
  baseImage?: string;
  revealImage?: string;
  baseVideo?: string;
}

export const ImageRevealBackground: React.FC<ImageRevealBackgroundProps> = ({
  bgMediaType = 'image',
  baseImage = BG_IMAGE_1,
  revealImage = BG_IMAGE_2,
  baseVideo = '',
}) => {
  const isVideo = bgMediaType === 'video' && Boolean(baseVideo && baseVideo.trim());
  const revealRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);

  const mouseRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
  });

  const smoothRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
  });

  const gridOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [gridCellSize, setGridCellSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
    }
    return 48;
  });

  useEffect(() => {
    const handleResize = () => {
      setGridCellSize(Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028))));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isVideo) return; // Skip spotlight reveal animation loop if media is video

    let lastUserTouch = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      lastUserTouch = Date.now();
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        lastUserTouch = Date.now();
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
    };

    window.addEventListener('resize', updateSize);

    let animId: number;
    let autoAngle = 0;

    const loop = () => {
      const now = Date.now();
      if (now - lastUserTouch > 2000) {
        autoAngle += 0.008;
        const orbitRadiusX = width * 0.25;
        const orbitRadiusY = height * 0.2;
        mouseRef.current = {
          x: width / 2 + Math.cos(autoAngle) * orbitRadiusX,
          y: height / 2 + Math.sin(autoAngle * 1.3) * orbitRadiusY,
        };
      }

      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * 0.1;
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * 0.1;

      const cx = smoothRef.current.x;
      const cy = smoothRef.current.y;

      const radius = Math.round(Math.min(750, Math.max(220, window.innerWidth * 0.32)));

      if (revealRef.current) {
        const maskStr = `radial-gradient(circle ${radius}px at ${cx}px ${cy}px, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.12) 88%, rgba(0,0,0,0) 100%)`;
        revealRef.current.style.maskImage = maskStr;
        revealRef.current.style.webkitMaskImage = maskStr;
      }

      const normX = (cx / (width || 1)) - 0.5;
      const normY = (cy / (height || 1)) - 0.5;

      gridOffsetRef.current.x += (normX * 16 - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (normY * 16 - gridOffsetRef.current.y) * 0.06;

      if (patternRef.current) {
        patternRef.current.setAttribute('x', gridOffsetRef.current.x.toFixed(2));
        patternRef.current.setAttribute('y', gridOffsetRef.current.y.toFixed(2));
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animId);
    };
  }, [isVideo]);

  if (isVideo) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        {/* Background Video MP4 (No Reveal Effect) */}
        <video
          src={baseVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        {/* Subtle Parallax SVG Grid Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
          <defs>
            <pattern
              id="lgpsm-grid-pattern-video"
              width={gridCellSize}
              height={gridCellSize}
              patternUnits="userSpaceOnUse"
              x="0"
              y="0"
            >
              <path
                d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lgpsm-grid-pattern-video)" />
        </svg>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url(${baseImage})` }}
      />

      {/* 2. Reveal Layer clipped by canvas gradient spotlight */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url(${revealImage})` }}
      />

      {/* 3. Subtle Parallax SVG Grid Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <defs>
          <pattern
            id="lgpsm-grid-pattern"
            ref={patternRef}
            width={gridCellSize}
            height={gridCellSize}
            patternUnits="userSpaceOnUse"
            x="0"
            y="0"
          >
            <path
              d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#lgpsm-grid-pattern)" />
      </svg>
    </div>
  );
};
