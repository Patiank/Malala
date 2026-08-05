import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Compass, Download, Map, X } from 'lucide-react';
import { CheckerboardGrid, WireframeGlobe, CornerBracket } from './CustomIcons';
import { DrawerType, AppSettings } from '../types';
import { Language, translations } from '../lib/translations';

interface HeroProps {
  onOpenDrawer: (type: DrawerType) => void;
  lang: Language;
  appSettings?: AppSettings;
}

export const Hero: React.FC<HeroProps> = ({ onOpenDrawer, lang, appSettings }) => {
  const t = translations[lang];
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);

  const heroTextColor = appSettings?.heroTextColor || '#000000';
  const heroTextShadow = appSettings?.heroTextShadow !== false;

  const shadowValue = heroTextShadow
    ? heroTextColor.toLowerCase() === '#ffffff' || heroTextColor.toLowerCase() === '#fff'
      ? '0 2px 10px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)'
      : '0 2px 8px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.9)'
    : undefined;

  const heroTextStyle: React.CSSProperties = {
    color: heroTextColor,
    textShadow: shadowValue,
  };

  const bracketStyle: React.CSSProperties = {
    color: heroTextColor,
    filter: shadowValue ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' : undefined,
  };

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
          <div style={bracketStyle} className="flex items-center gap-3">
            <CornerBracket type="TL" />
          </div>

          {/* Main Headline */}
          <h1
            className="font-orbitron font-black uppercase tracking-[0.06em] leading-[1.04] select-none pt-1 transition-colors duration-300"
            style={{ ...heroTextStyle, fontSize: 'var(--headline)' }}
          >
            <div>DISCOVER</div>
            <div>WEST SUMATRA</div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span>PARADISE</span>
              <CheckerboardGrid style={{ color: heroTextColor }} className="transition-colors duration-300" />
            </div>
          </h1>

          {/* Subtitle / Description */}
          <p
            className="font-jakarta max-w-xl text-xs sm:text-sm font-medium leading-relaxed pt-1 transition-colors duration-300"
            style={heroTextStyle}
          >
            {t.heroDesc}
          </p>

          {/* Bottom-Left Corner Bracket */}
          <div style={bracketStyle} className="pb-1">
            <CornerBracket type="BL" />
          </div>

          {/* Action Buttons Row */}
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

            {/* Mulai Jelajah Main Button - Opens Destinations Sub-menu directly */}
            <button
              onClick={() => onOpenDrawer('destinations')}
              className="group inline-flex items-center justify-center border border-gray-400 bg-white/90 backdrop-blur-xs rounded-md font-jakarta font-bold uppercase tracking-[0.16em] text-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 cursor-pointer focus:outline-none shadow-sm"
              style={{
                fontSize: 'var(--body)',
                paddingInline: 'var(--btn-px)',
                paddingBlock: 'var(--btn-py)',
                gap: 'var(--btn-gap)',
              }}
            >
              <Compass className="w-4.5 h-4.5 text-red-600 group-hover:text-white transition-colors animate-pulse" />
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
          <div style={bracketStyle} className="absolute top-0 left-0">
            <CornerBracket type="TL" />
          </div>
          <div style={bracketStyle} className="absolute top-0 right-0">
            <CornerBracket type="TR" />
          </div>
          <div style={bracketStyle} className="absolute bottom-0 left-0">
            <CornerBracket type="BL" />
          </div>
          <div style={bracketStyle} className="absolute bottom-0 right-0">
            <CornerBracket type="BR" />
          </div>

          {/* Official Tourism Board Metadata */}
          <div className="flex flex-col space-y-4">
            <div style={{ color: heroTextColor }} className="flex items-center justify-between transition-colors duration-300">
              <WireframeGlobe />
            </div>

            <div
              className="font-jakarta font-bold uppercase tracking-[0.16em] leading-tight transition-colors duration-300"
              style={{ ...heroTextStyle, fontSize: 'var(--body)' }}
            >
              <div>DINAS PARIWISATA</div>
              <div
                onClick={() => onOpenDrawer('admin')}
                className="cursor-text"
                title=" "
              >
                PROVINSI SUMATERA BARAT.
              </div>
              <div style={{ color: heroTextColor, opacity: 0.75 }} className="font-normal text-xs mt-1.5 tracking-normal normal-case transition-colors duration-300">
                {lang === 'en'
                  ? 'Official Tourism Portal for West Sumatra.'
                  : 'Portal Resmi Pariwisata Provinsi Sumatera Barat.'}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Category Selector Modal (Opens upon clicking Mulai Jelajah) */}
      {isExploreModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-jakarta">
          <div className="bg-white w-full max-w-4xl rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-gray-200 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-6 h-6 text-red-600 animate-spin-slow" />
                  <h3 className="font-orbitron font-extrabold text-lg sm:text-xl text-black uppercase tracking-wider">
                    {lang === 'en' ? 'Explore West Sumatra Categories' : 'Pilih Kategori Jelajah Wisata'}
                  </h3>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {lang === 'en' 
                    ? 'Select what you want to explore in Minangkabau Land' 
                    : 'Silakan pilih kategori pariwisata Sumatera Barat yang ingin Anda jelajahi'}
                </p>
              </div>

              <button
                onClick={() => setIsExploreModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid 6 Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. Destinasi */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('destinations'); }}
                className="group bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-xl p-5 hover:shadow-lg hover:border-red-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    🏔️
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navDestinations}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Jelajahi danau, gunung, pantai bahari, desa wisata, dan pesona alam Sumbar.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka Destinasi</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* 2. Kebudayaan */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('culture'); }}
                className="group bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navCulture}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Seni tari, arsitektur Rumah Gadang, tradisi adat, dan filosofi Minangkabau.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka Kebudayaan</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* 3. Kuliner */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('culinary'); }}
                className="group bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-xl p-5 hover:shadow-lg hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    🍲
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navCulinary}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Kelezatan Rendang warisan UNESCO, Sate Padang, Teh Talua, & kudapan khas.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka Kuliner</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* 4. Event */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('events'); }}
                className="group bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    📅
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navEvents}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Jadwal festival budaya, Pacu Jawi, Tour de Singkarak, & event tahunan.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka Jadwal Event</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* 5. Unduhan */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('download'); }}
                className="group bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    📥
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navDownloads}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Unduh media kit, leaflet wisata, dan E-Booklet panduan pariwisata PDF.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                  <span>Buka Unduhan PDF</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              {/* 6. Peta Interaktif */}
              <div 
                onClick={() => { setIsExploreModalOpen(false); onOpenDrawer('map'); }}
                className="group bg-gradient-to-br from-red-100 to-white border border-red-300 rounded-xl p-5 hover:shadow-lg hover:border-red-600 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-700 text-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    🗺️
                  </div>
                  <h4 className="font-orbitron font-bold text-sm text-black uppercase tracking-wider">
                    {t.navMap}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tampilan peta interaktif Minangkabau dengan lokasi realtime titik wisata.
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-bold text-red-700 group-hover:translate-x-1 transition-transform">
                  <span>Buka Peta Interaktif</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
