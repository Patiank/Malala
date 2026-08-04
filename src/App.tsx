import React, { useState, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ImageRevealBackground } from './components/ImageRevealBackground';
import { Drawers } from './components/Drawers';
import { Toast } from './components/Toast';
import { DrawerType, ToastNotice } from './types';
import { useData } from './data/useData';
import { Language } from './lib/translations';

export default function App() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('malala_lang');
      if (saved === 'en' || saved === 'id') return saved;
    }
    return 'id';
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('malala_saved_ids');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse savedIds from localStorage:', e);
      }
    }
    return [];
  });
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const dataStore = useData();

  // Sync lang to localStorage
  const handleToggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'id' ? 'en' : 'id';
      if (typeof window !== 'undefined') {
        localStorage.setItem('malala_lang', next);
      }
      return next;
    });
  }, []);

  // Sync savedIds to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('malala_saved_ids', JSON.stringify(savedIds));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
    }
  }, [savedIds]);

  const showToast = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const handleOpenDrawer = useCallback((type: DrawerType) => {
    setActiveDrawer(type);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  const handleToggleSave = useCallback(
    (id: string, title: string) => {
      setSavedIds((prev) => {
        const isSaved = prev.includes(id);
        if (isSaved) {
          showToast(lang === 'en' ? `Removed from Saved: "${title}"` : `Dihapus dari Favorit: "${title}"`);
          return prev.filter((item) => item !== id);
        } else {
          showToast(lang === 'en' ? `Saved to Favorites: "${title}"` : `Disimpan ke Favorit: "${title}"`);
          return [...prev, id];
        }
      });
    },
    [showToast, lang]
  );

  return (
    <div className="min-h-screen bg-white text-black font-jakarta flex flex-col justify-between relative overflow-x-hidden">
      {/* Spotlight Mask Background */}
      <ImageRevealBackground
        bgMediaType={dataStore.appSettings.bgMediaType}
        baseImage={dataStore.appSettings.baseImage}
        revealImage={dataStore.appSettings.revealImage}
        baseVideo={dataStore.appSettings.baseVideo}
      />

      {/* Fixed Vertical Hot Info Trigger (Far Left) */}
      <button
        onClick={() => handleOpenDrawer('hotinfo')}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-red-600 hover:bg-black text-white transition-all duration-300 py-4 px-2.5 rounded-r-xl flex flex-col items-center gap-3 shadow-2xl group border border-l-0 border-red-700 hover:border-gray-900 cursor-pointer focus:outline-none select-none ${
          activeDrawer === 'hotinfo' ? 'bg-black ring-2 ring-red-500' : ''
        }`}
        title={lang === 'en' ? 'Hot Info & Latest News' : 'Hot Info & Berita Terbaru'}
        aria-label="Hot Info & Berita Terbaru"
      >
        <span className="relative flex items-center justify-center">
          <Flame className="w-4.5 h-4.5 text-yellow-300 group-hover:scale-125 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
        </span>
        <span
          className="font-orbitron font-extrabold text-[10px] sm:text-[11px] tracking-[0.2em] text-white uppercase select-none"
          style={{ writingMode: 'vertical-lr' }}
        >
          Hot Info & Berita Terbaru
        </span>
      </button>

      {/* Header (Logo & Nav) */}
      <Header
        activeDrawer={activeDrawer}
        onOpenDrawer={handleOpenDrawer}
        onCloseDrawer={handleCloseDrawer}
        savedCount={savedIds.length}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Hero */}
      <Hero onOpenDrawer={handleOpenDrawer} lang={lang} />

      {/* Drawers */}
      <Drawers
        activeDrawer={activeDrawer}
        onClose={handleCloseDrawer}
        onOpenDrawer={handleOpenDrawer}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
        dataStore={dataStore}
        lang={lang}
      />

      {/* Toast Notifications */}
      <Toast
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
