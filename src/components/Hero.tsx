import React from 'react';
import { ArrowUpRight, Sparkles, Compass, MapPin, Flame } from 'lucide-react';
import { CheckerboardGrid, WireframeGlobe, CornerBracket } from './CustomIcons';
import { DrawerType } from '../types';
import { Language, translations } from '../lib/translations';

interface HeroProps {
  onOpenDrawer: (type: DrawerType) => void;
  lang: Language;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDrawer, lang }) => {
  const t = translations[lang];

  return (
    <>
      <main
        className="flex-1 flex flex-col lg:flex-row justify-between items-stretch lg:items-center z-10 relative px-[var(--pad-x)]"
        style={{
          paddingBlock: 'var(--main-py)',
          gap: 'var(--section-gap)',
        }}
      >
        {/* Left Block (Headline & Action Buttons) */}
        <div className="flex flex-col justify-center items-start space-y-3.5 max-w-4xl">
          {/* Top-Left Corner Bracket */}
          <div className="text-black flex items-center gap-3">
            <CornerBracket type="TL" />
          </div>

          {/* Main Headline */}
          <h1
            className="font-orbitron font-black text-black uppercase tracking-[0.06em] leading-[1.04] select-none pt-1"
            style={{ fontSize: 'var(--headline)' }}
          >
            <div>DISCOVER</div>
            <div>WEST SUMATRA</div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span>PARADISE</span>
              <CheckerboardGrid className="text-black" />
            </div>
          </h1>

        {/* Subtitle / Description */}
        <p className="font-jakarta text-gray-700 max-w-xl text-xs sm:text-sm font-medium leading-relaxed pt-1">
          {t.heroDesc}
        </p>

        {/* Bottom-Left Corner Bracket */}
        <div className="text-black pb-1">
          <CornerBracket type="BL" />
        </div>

        {/* Action Buttons Row (UNI MALA AI & Explore) */}
        <div className="flex items-center gap-3 flex-wrap pt-2">
          {/* UNI MALA AI Assistant Primary CTA */}
          <button
            onClick={() => onOpenDrawer('formai')}
            className="group inline-flex items-center justify-center bg-black text-white border border-black rounded-md font-jakarta font-bold uppercase tracking-[0.16em] hover:bg-gray-800 transition-all duration-200 cursor-pointer focus:outline-none shadow-sm"
            style={{
              fontSize: 'var(--body)',
              paddingInline: 'var(--btn-px)',
              paddingBlock: 'var(--btn-py)',
              gap: 'var(--btn-gap)',
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>{t.heroBtnAiPlanner}</span>
            <ArrowUpRight
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
          </button>

          {/* Destinasi Button */}
          <button
            onClick={() => onOpenDrawer('destinations')}
            className="group inline-flex items-center justify-center border border-gray-400 rounded-md font-jakarta font-semibold uppercase tracking-[0.16em] text-black hover:bg-black hover:text-white hover:border-black transition-all duration-200 cursor-pointer focus:outline-none"
            style={{
              fontSize: 'var(--body)',
              paddingInline: 'var(--btn-px)',
              paddingBlock: 'var(--btn-py)',
              gap: 'var(--btn-gap)',
            }}
          >
            <Compass className="w-4 h-4" />
            <span>{t.heroBtnExplore}</span>
          </button>
        </div>
      </div>

      {/* Right Lower Feature Block */}
      <div
        className="self-start lg:self-end mt-8 lg:mt-0 relative flex flex-col justify-between"
        style={{
          minWidth: 'var(--feature-min)',
          padding: 'var(--feature-pad)',
        }}
      >
        {/* Absolute Corner Brackets framing the box */}
        <div className="absolute top-0 left-0 text-black">
          <CornerBracket type="TL" />
        </div>
        <div className="absolute top-0 right-0 text-black">
          <CornerBracket type="TR" />
        </div>
        <div className="absolute bottom-0 left-0 text-black">
          <CornerBracket type="BL" />
        </div>
        <div className="absolute bottom-0 right-0 text-black">
          <CornerBracket type="BR" />
        </div>

        {/* Globe & Official Tourism Board Metadata */}
        <div className="flex flex-col space-y-4">
          <div className="text-black flex items-center justify-between">
            <WireframeGlobe />
            <div className="flex items-center gap-1.5 text-xs font-jakarta font-semibold text-gray-500 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded">
              <MapPin className="w-3 h-3 text-black" />
              <span>RANAH MINANG</span>
            </div>
          </div>

          <div
            className="font-jakarta font-bold uppercase tracking-[0.16em] text-black leading-tight"
            style={{ fontSize: 'var(--body)' }}
          >
            <div>DINAS PARIWISATA</div>
            <div
              onClick={() => onOpenDrawer('admin')}
              className="cursor-text"
              title=" "
            >
              PROVINSI SUMATERA BARAT.
            </div>
            <div className="text-gray-500 font-normal text-xs mt-1.5 tracking-normal normal-case">
              {lang === 'en'
                ? 'Official Tourism Portal for West Sumatra — Land of Minangkabau Culture & Wonders.'
                : 'Portal Resmi Pariwisata Provinsi Sumatera Barat — Surga Wisata & Budaya Minangkabau.'}
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};
