import React, { useState } from 'react';
import { Bookmark, Sparkles, Download, Map, Globe, Menu, X } from 'lucide-react';
import { DrawerType, AppSettings } from '../types';
import { Language, translations } from '../lib/translations';

interface HeaderProps {
  activeDrawer: DrawerType;
  onOpenDrawer: (type: DrawerType) => void;
  onCloseDrawer: () => void;
  savedCount: number;
  lang: Language;
  onToggleLang: () => void;
  onMouseEnterHotInfo?: () => void;
  onMouseLeaveHotInfo?: () => void;
  appSettings?: AppSettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeDrawer,
  onOpenDrawer,
  onCloseDrawer,
  savedCount,
  lang,
  onToggleLang,
  onMouseEnterHotInfo,
  onMouseLeaveHotInfo,
  appSettings,
}) => {
  const t = translations[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const heroTextColor = appSettings?.heroTextColor || '#000000';
  const heroTextShadow = appSettings?.heroTextShadow !== false;

  const shadowValue = heroTextShadow
    ? heroTextColor.toLowerCase() === '#ffffff' || heroTextColor.toLowerCase() === '#fff'
      ? '0 2px 10px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)'
      : '0 2px 8px rgba(255,255,255,0.8), 0 0 2px rgba(255,255,255,0.9)'
    : undefined;

  const headerTextStyle: React.CSSProperties = {
    color: heroTextColor,
    textShadow: shadowValue,
  };

  const handleNavClick = (type: DrawerType) => {
    onOpenDrawer(type);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className="z-50 relative flex flex-col md:flex-row items-center justify-between w-full select-none bg-white/90 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
      style={{
        paddingInline: 'var(--pad-x)',
        paddingTop: 'var(--header-pt)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Logo (Left) */}
        <button
          onClick={onCloseDrawer}
          className="font-orbitron font-black tracking-[0.15em] flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity text-left focus:outline-none"
          style={{ fontSize: 'var(--logo)' }}
          aria-label="WEST SUMATRA TOURISM"
        >
          <div className="flex items-baseline gap-0.5">
            <span style={headerTextStyle} className="transition-colors duration-300">MALALA</span>
            <span className="text-red-600 font-extrabold lowercase tracking-tight">.travel</span>
            <span
              className="font-normal leading-none inline-block -mt-0.5 ml-0.5"
              style={{ fontSize: 'var(--logo-deg)', color: heroTextColor, opacity: 0.7 }}
            >
              ˚
            </span>
          </div>
          <span
            className="font-jakarta text-[9px] tracking-[0.25em] font-semibold -mt-1 uppercase transition-colors duration-300"
            style={{ color: heroTextColor, opacity: 0.75, textShadow: shadowValue }}
          >
            {t.logoTagline}
          </span>
        </button>

        {/* Mobile Menu Toggle & Essentials */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-gray-300 bg-white hover:border-black transition-all cursor-pointer font-jakarta shadow-2xs"
            title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
          >
            <Globe className="w-3.5 h-3.5 text-red-600" />
            <div className="flex items-center gap-0.5 text-[10px] font-extrabold tracking-wider uppercase">
              <span className={`px-1 py-0.2 rounded ${lang === 'id' ? 'bg-black text-white' : 'text-gray-400'}`}>
                ID
              </span>
              <span className="text-gray-300 font-normal">|</span>
              <span className={`px-1 py-0.2 rounded ${lang === 'en' ? 'bg-black text-white' : 'text-gray-400'}`}>
                EN
              </span>
            </div>
          </button>
          
          <button
            onClick={() => handleNavClick('saved')}
            className="relative cursor-pointer p-1"
          >
            <Bookmark strokeWidth={2} className="w-5 h-5" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white font-orbitron font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                {savedCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Nav Links (Desktop + Mobile Dropdown) */}
      <nav
        className={`${
          isMobileMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row absolute md:relative top-full left-0 w-full md:w-auto bg-white md:bg-transparent shadow-xl md:shadow-none p-4 md:p-0 gap-4 md:gap-[var(--gap-nav)] font-jakarta font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] items-start md:items-center text-black border-t md:border-none border-gray-100 z-50`}
        style={{ fontSize: 'var(--nav)' }}
      >
        <button
          onClick={() => handleNavClick('destinations')}
          className={`px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
            activeDrawer === 'destinations'
              ? 'bg-red-600 text-white border-red-600 font-bold'
              : 'border-transparent hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          style={activeDrawer !== 'destinations' ? headerTextStyle : undefined}
        >
          {t.navDestinations}
        </button>

        <button
          onClick={() => handleNavClick('culture')}
          className={`px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
            activeDrawer === 'culture'
              ? 'bg-red-600 text-white border-red-600 font-bold'
              : 'border-transparent hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          style={activeDrawer !== 'culture' ? headerTextStyle : undefined}
        >
          {t.navCulture}
        </button>

        <button
          onClick={() => handleNavClick('culinary')}
          className={`px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
            activeDrawer === 'culinary'
              ? 'bg-red-600 text-white border-red-600 font-bold'
              : 'border-transparent hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          style={activeDrawer !== 'culinary' ? headerTextStyle : undefined}
        >
          {t.navCulinary}
        </button>

        <button
          onClick={() => handleNavClick('events')}
          className={`px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
            activeDrawer === 'events'
              ? 'bg-red-600 text-white border-red-600 font-bold'
              : 'border-transparent hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          style={activeDrawer !== 'events' ? headerTextStyle : undefined}
        >
          {t.navEvents}
        </button>

        <button
          onClick={() => handleNavClick('download')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border transition-all duration-200 cursor-pointer ${
            activeDrawer === 'download'
              ? 'bg-red-600 text-white border-red-600 font-bold'
              : 'border-transparent hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          style={activeDrawer !== 'download' ? headerTextStyle : undefined}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.navDownloads}</span>
        </button>

        <button
          onClick={() => handleNavClick('map')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] transition-all duration-200 cursor-pointer group shadow-2xs ${
            activeDrawer === 'map'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-emerald-600 text-white border-emerald-600 hover:bg-red-600 hover:border-red-600'
          }`}
          style={{ fontSize: 'var(--nav)' }}
        >
          <Map className="w-3.5 h-3.5 text-white transition-colors" />
          <span>{t.navMap}</span>
        </button>

        {/* UNI MALA AI Assistant Link */}
        <button
          onClick={() => handleNavClick('formai')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] bg-black text-white border-black hover:bg-gray-800 hover:border-gray-800 transition-all duration-200 cursor-pointer shadow-2xs ${
            activeDrawer === 'formai' ? 'ring-2 ring-offset-1 ring-black shadow-md' : ''
          }`}
          style={{ fontSize: 'var(--nav)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>{t.navUniMala}</span>
        </button>

        <span className="text-gray-300 font-light select-none hidden md:inline">|</span>

        {/* Desktop Language Switcher Button with Globe Logo & ID | EN Side-By-Side */}
        <button
          onClick={onToggleLang}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-300 bg-white hover:border-black transition-all cursor-pointer font-jakarta shadow-2xs group"
          title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3.5 h-3.5 text-red-600 transition-transform group-hover:rotate-12" />
          <div className="flex items-center gap-1 text-[10px] font-extrabold tracking-wider uppercase">
            <span className={`px-1.5 py-0.5 rounded transition-colors ${lang === 'id' ? 'bg-black text-white font-black' : 'text-gray-500 group-hover:text-black'}`}>
              ID
            </span>
            <span className="text-gray-300 font-normal">|</span>
            <span className={`px-1.5 py-0.5 rounded transition-colors ${lang === 'en' ? 'bg-black text-white font-black' : 'text-gray-500 group-hover:text-black'}`}>
              EN
            </span>
          </div>
        </button>

        {/* Desktop Favorites Bookmark Icon Button */}
        <button
          onClick={() => handleNavClick('saved')}
          className="hidden md:flex relative hover:opacity-60 transition-opacity cursor-pointer items-center justify-center p-1"
          aria-label={`${t.navSaved} (${savedCount})`}
          title={t.savedTitle}
          style={{ color: heroTextColor, filter: shadowValue ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' : undefined }}
        >
          <Bookmark
            strokeWidth={1.75}
            style={{ width: 'var(--icon)', height: 'var(--icon)' }}
          />
          {savedCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-black text-white font-orbitron font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
              {savedCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
};
