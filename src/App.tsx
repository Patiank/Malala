import React, { useState, useCallback } from 'react';
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
        baseImage={dataStore.appSettings.baseImage}
        revealImage={dataStore.appSettings.revealImage}
      />

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
