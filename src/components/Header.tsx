import React, { useState } from 'react';
import { Bookmark, Sparkles, Download, Globe, Menu, X } from 'lucide-react';
import { DrawerType } from '../types';
import { Language, translations } from '../lib/translations';

interface HeaderProps {
  activeDrawer: DrawerType;
  onOpenDrawer: (type: DrawerType) => void;
  onCloseDrawer: () => void;
  savedCount: number;
  lang: Language;
  onToggleLang: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeDrawer,
  onOpenDrawer,
  onCloseDrawer,
  savedCount,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          className="font-orbitron font-black text-black tracking-[0.15em] flex flex-col items-start cursor-pointer hover:opacity-80 transition-opacity text-left focus:outline-none"
          style={{ fontSize: 'var(--logo)' }}
          aria-label="WEST SUMATRA TOURISM"
        >
          <div className="flex items-baseline gap-0.5">
            <span>MALALA</span>
            <span className="text-red-600 font-extrabold lowercase tracking-tight">.travel</span>
            <span
              className="font-normal leading-none inline-block -mt-0.5 ml-0.5 text-gray-500"
              style={{ fontSize: 'var(--logo-deg)' }}
            >
              ˚
            </span>
          </div>
          <span className="font-jakarta text-[9px] tracking-[0.25em] text-gray-400 font-semibold -mt-1 uppercase">
            {t.logoTagline}
          </span>
        </button>

        {/* Mobile Menu Toggle & Essentials */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-300 bg-gray-50 hover:bg-black hover:text-white transition-all cursor-pointer font-bold text-[10px] tracking-wider uppercase font-jakarta"
          >
            <Globe className="w-3 h-3 text-gray-500" />
            <span>{lang === 'id' ? 'ID' : 'EN'}</span>
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
          className={`hover:opacity-50 transition-opacity cursor-pointer ${
            activeDrawer === 'destinations' ? 'underline underline-offset-4 font-bold' : ''
          }`}
        >
          {t.navDestinations}
        </button>

        <button
          onClick={() => handleNavClick('culture')}
          className={`hover:opacity-50 transition-opacity cursor-pointer ${
            activeDrawer === 'culture' ? 'underline underline-offset-4 font-bold' : ''
          }`}
        >
          {t.navCulture}
        </button>

        <button
          onClick={() => handleNavClick('culinary')}
          className={`hover:opacity-50 transition-opacity cursor-pointer ${
            activeDrawer === 'culinary' ? 'underline underline-offset-4 font-bold' : ''
          }`}
        >
          {t.navCulinary}
        </button>

        <button
          onClick={() => handleNavClick('events')}
          className={`hover:opacity-50 transition-opacity cursor-pointer ${
            activeDrawer === 'events' ? 'underline underline-offset-4 font-bold' : ''
          }`}
        >
          {t.navEvents}
        </button>

        <button
          onClick={() => handleNavClick('download')}
          className={`inline-flex items-center gap-1 hover:opacity-50 transition-opacity cursor-pointer ${
            activeDrawer === 'download' ? 'underline underline-offset-4 font-bold' : ''
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.navDownloads}</span>
        </button>

        {/* UNI MALA AI Assistant Link */}
        <button
          onClick={() => handleNavClick('formai')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 md:px-2.5 md:py-1 rounded bg-black text-white hover:bg-gray-800 transition-all cursor-pointer font-bold ${
            activeDrawer === 'formai' ? 'ring-2 ring-offset-1 ring-black' : ''
          }`}
          style={{ fontSize: 'var(--micro)' }}
        >
          <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
          <span>{t.navUniMala}</span>
        </button>

        <span className="text-gray-300 font-light select-none hidden md:inline">|</span>

        {/* Desktop Language Switcher Button */}
        <button
          onClick={onToggleLang}
          className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-300 bg-gray-50 hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer font-bold text-[10px] tracking-wider uppercase font-jakarta"
          title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3 h-3 text-gray-500 group-hover:text-white" />
          <span>{lang === 'id' ? 'ID' : 'EN'}</span>
        </button>

        {/* Desktop Favorites Bookmark Icon Button */}
        <button
          onClick={() => handleNavClick('saved')}
          className="hidden md:flex relative hover:opacity-60 transition-opacity cursor-pointer items-center justify-center p-1"
          aria-label={`${t.navSaved} (${savedCount})`}
          title={t.savedTitle}
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
