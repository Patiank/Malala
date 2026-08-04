import React from 'react';
import { ArrowUpRight, Sparkles, Compass, MapPin, Flame, Download, Map } from 'lucide-react';
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

        {/* Action Buttons Row (UNI MALA AI & Explore Menu) */}
        <div className="flex flex-col items-start gap-4 pt-2 w-full">
          <div className="flex items-center gap-3 flex-wrap">
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

            {/* Mulai Jelajah Main Button */}
            <button
              onClick={() => onOpenDrawer('destinations')}
              className="group inline-flex items-center justify-center border border-gray-400 bg-white/80 backdrop-blur-xs rounded-md font-jakarta font-semibold uppercase tracking-[0.16em] text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 cursor-pointer focus:outline-none shadow-2xs"
              style={{
                fontSize: 'var(--body)',
                paddingInline: 'var(--btn-px)',
                paddingBlock: 'var(--btn-py)',
                gap: 'var(--btn-gap)',
              }}
            >
              <Compass className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" />
              <span>{t.heroBtnExplore}</span>
            </button>
          </div>

          {/* Expanded Category Jelajah Bar */}
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-gray-200/80 w-full max-w-3xl font-jakarta">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-red-600" />
              <span>Kategori Jelajah:</span>
            </span>

            <button
              onClick={() => onOpenDrawer('destinations')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-black font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <span>🏔️</span>
              <span>{t.navDestinations}</span>
            </button>

            <button
              onClick={() => onOpenDrawer('culture')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-black font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <span>🏛️</span>
              <span>{t.navCulture}</span>
            </button>

            <button
              onClick={() => onOpenDrawer('culinary')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-black font-bold hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <span>🍲</span>
              <span>{t.navCulinary}</span>
            </button>

            <button
              onClick={() => onOpenDrawer('events')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-black font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <span>📅</span>
              <span>{t.navEvents}</span>
            </button>

            <button
              onClick={() => onOpenDrawer('download')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-gray-300 text-black font-bold hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <Download className="w-3 h-3 text-emerald-600 group-hover:text-white" />
              <span>{t.navDownloads}</span>
            </button>

            <button
              onClick={() => onOpenDrawer('map')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 border border-red-200 text-red-700 font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-2xs text-[11px] uppercase tracking-wider"
            >
              <Map className="w-3 h-3 text-red-600" />
              <span>{t.navMap}</span>
            </button>
          </div>
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
