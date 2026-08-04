import React, { useEffect, useRef, useState } from 'react';
import { X, Map, MapPin, Compass, Landmark, Utensils, Calendar, ChevronRight, Layers } from 'lucide-react';
import L from 'leaflet';
import { Destination, CultureItem, CulinaryItem, EventItem } from '../types';
import { Language, translations } from '../lib/translations';

interface InteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  destinations: Destination[];
  cultureItems: CultureItem[];
  culinaryItems: CulinaryItem[];
  eventItems: EventItem[];
  onSelectDestination: (item: Destination) => void;
  onSelectCulture: (item: CultureItem) => void;
  onSelectCulinary: (item: CulinaryItem) => void;
  onSelectEvent: (item: EventItem) => void;
}

type MapFilterCategory = 'all' | 'destinations' | 'culture' | 'culinary' | 'events';

export const InteractiveMapModal: React.FC<InteractiveMapModalProps> = ({
  isOpen,
  onClose,
  lang,
  destinations,
  cultureItems,
  culinaryItems,
  eventItems,
  onSelectDestination,
  onSelectCulture,
  onSelectCulinary,
  onSelectEvent,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeFilter, setActiveFilter] = useState<MapFilterCategory>('all');

  const isEn = lang === 'en';
  const t = translations[lang];

  // Helper to create custom HTML pin marker icons
  const createPinIcon = (color: string, label: string, iconSymbol: string) => {
    return L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="
          background-color: ${color};
          color: white;
          padding: 5px 9px;
          border-radius: 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid #ffffff;
          white-space: nowrap;
          cursor: pointer;
          transform: translate(-50%, -100%);
        ">
          <span>${iconSymbol}</span>
          <span>${label}</span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  };

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Initialize Leaflet map instance centered on West Sumatra if not created yet
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-0.7893, 100.6506],
        zoom: 8,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | MALALA.travel',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    if (!map || !markersGroup) return;

    // Clear old markers before drawing filtered set
    markersGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    // Helper to build popup DOM element with direct click event binding
    const buildPopupContent = (
      imageUrl: string,
      tagText: string,
      tagColor: string,
      titleText: string,
      onDetailClick: () => void
    ) => {
      const container = document.createElement('div');
      container.className = 'font-jakarta space-y-2 p-1 min-w-[200px]';

      const imgWrapper = document.createElement('div');
      imgWrapper.style.cssText = 'height: 100px; width: 100%; border-radius: 6px; overflow: hidden; background: #f3f4f6; margin-bottom: 6px;';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = titleText;
      img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
      imgWrapper.appendChild(img);

      const tag = document.createElement('div');
      tag.style.cssText = `font-size: 9px; font-weight: 800; text-transform: uppercase; color: ${tagColor}; letter-spacing: 0.05em;`;
      tag.textContent = tagText;

      const title = document.createElement('div');
      title.style.cssText = "font-family: 'Orbitron', sans-serif; font-size: 12px; font-weight: 800; color: #000; text-transform: uppercase; line-height: 1.2;";
      title.textContent = titleText;

      const btn = document.createElement('button');
      btn.style.cssText = 'width: 100%; margin-top: 8px; background: #000; color: #fff; border: none; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;';
      btn.innerHTML = `<span>${translations[lang].btnDetail}</span> <span>&rarr;</span>`;
      
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDetailClick();
      };

      container.appendChild(imgWrapper);
      container.appendChild(tag);
      container.appendChild(title);
      container.appendChild(btn);

      return container;
    };

    // Helper to get GPS coordinates with smart text matching fallback
    const getCoordinates = (item: any) => {
      const lat = Number(item.lat);
      const lng = Number(item.lng);
      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return { lat, lng };
      }

      const text = `${item.regency || ''} ${item.location || ''} ${item.origin || ''} ${item.title || ''}`.toLowerCase();
      
      if (text.includes('bukittinggi') || text.includes('agam') || text.includes('lawang') || text.includes('kapau')) 
        return { lat: -0.304987, lng: 100.369434 };
      if (text.includes('harau') || text.includes('payakumbuh') || text.includes('lima puluh kota') || text.includes('itik')) 
        return { lat: -0.103000, lng: 100.662000 };
      if (text.includes('tanah datar') || text.includes('pariangan') || text.includes('batusangkar') || text.includes('pagaruyung') || text.includes('pacu jawi') || text.includes('lamang')) 
        return { lat: -0.450000, lng: 100.490000 };
      if (text.includes('pariaman') || text.includes('tabuik')) 
        return { lat: -0.625000, lng: 100.120000 };
      if (text.includes('mentawai')) 
        return { lat: -2.133333, lng: 99.550000 };
      if (text.includes('solok') || text.includes('alahan panjang') || text.includes('singkarak') || text.includes('tour de singkarak')) 
        return { lat: -0.798333, lng: 100.653889 };
      if (text.includes('padang panjang')) 
        return { lat: -0.468889, lng: 100.398056 };
      if (text.includes('sijunjung') || text.includes('silokek')) 
        return { lat: -0.720000, lng: 101.000000 };
      if (text.includes('pesisir selatan') || text.includes('mandeh') || text.includes('carocok')) 
        return { lat: -1.250000, lng: 100.450000 };
      if (text.includes('padang')) 
        return { lat: -0.947222, lng: 100.417222 };

      const hash = (item.id || item.title || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const jitterLat = ((hash % 100) - 50) * 0.005;
      const jitterLng = (((hash * 7) % 100) - 50) * 0.005;
      return { lat: -0.7893 + jitterLat, lng: 100.6506 + jitterLng };
    };

    // 1. Destinations Markers (Red Pin)
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      destinations.forEach((item) => {
        const coords = getCoordinates(item);
        const title = isEn && item.titleEn ? item.titleEn : item.title;
        const category = isEn && item.categoryEn ? item.categoryEn : item.category;
        const regency = isEn && item.regencyEn ? item.regencyEn : item.regency;
        const icon = createPinIcon('#dc2626', title.length > 18 ? `${title.slice(0, 18)}...` : title, '🏔️');

        const marker = L.marker([coords.lat, coords.lng], { icon });
        const popupEl = buildPopupContent(
          item.imageUrl,
          `📍 ${category} • ${regency}`,
          '#dc2626',
          title,
          () => onSelectDestination(item)
        );

        marker.bindPopup(popupEl);
        markersGroup.addLayer(marker);
        bounds.extend([coords.lat, coords.lng]);
      });
    }

    // 2. Culture Markers (Purple Pin)
    if (activeFilter === 'all' || activeFilter === 'culture') {
      cultureItems.forEach((item) => {
        const coords = getCoordinates(item);
        const title = isEn && item.titleEn ? item.titleEn : item.title;
        const origin = isEn && item.originEn ? item.originEn : item.origin;
        const icon = createPinIcon('#9333ea', title.length > 18 ? `${title.slice(0, 18)}...` : title, '🏛️');

        const marker = L.marker([coords.lat, coords.lng], { icon });
        const popupEl = buildPopupContent(
          item.imageUrl,
          `🏛️ BUDAYA • ${origin}`,
          '#9333ea',
          title,
          () => onSelectCulture(item)
        );

        marker.bindPopup(popupEl);
        markersGroup.addLayer(marker);
        bounds.extend([coords.lat, coords.lng]);
      });
    }

    // 3. Culinary Markers (Amber Pin)
    if (activeFilter === 'all' || activeFilter === 'culinary') {
      culinaryItems.forEach((item) => {
        const coords = getCoordinates(item);
        const title = isEn && item.titleEn ? item.titleEn : item.title;
        const origin = isEn && item.originEn ? item.originEn : item.origin;
        const icon = createPinIcon('#d97706', title.length > 18 ? `${title.slice(0, 18)}...` : title, '🍲');

        const marker = L.marker([coords.lat, coords.lng], { icon });
        const popupEl = buildPopupContent(
          item.imageUrl,
          `🍲 KULINER • ${origin}`,
          '#d97706',
          title,
          () => onSelectCulinary(item)
        );

        marker.bindPopup(popupEl);
        markersGroup.addLayer(marker);
        bounds.extend([coords.lat, coords.lng]);
      });
    }

    // 4. Events Markers (Blue Pin)
    if (activeFilter === 'all' || activeFilter === 'events') {
      eventItems.forEach((item) => {
        const coords = getCoordinates(item);
        const title = isEn && item.titleEn ? item.titleEn : item.title;
        const schedule = isEn && item.scheduleEn ? item.scheduleEn : item.schedule;
        const icon = createPinIcon('#2563eb', title.length > 18 ? `${title.slice(0, 18)}...` : title, '📅');

        const marker = L.marker([coords.lat, coords.lng], { icon });
        const popupEl = buildPopupContent(
          item.imageUrl,
          `📅 EVENT • ${schedule}`,
          '#2563eb',
          title,
          () => onSelectEvent(item)
        );

        marker.bindPopup(popupEl);
        markersGroup.addLayer(marker);
        bounds.extend([coords.lat, coords.lng]);
      });
    }

    // Invalidate map size to render tiles correctly in modal container
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [isOpen, activeFilter, destinations, cultureItems, culinaryItems, eventItems, isEn, lang, onSelectCulture, onSelectCulinary, onSelectDestination, onSelectEvent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-6xl h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-gray-200 relative">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-red-600" />
              <h2 className="font-orbitron font-extrabold text-black uppercase tracking-wider text-base sm:text-lg">
                {t.mapTitle}
              </h2>
              <span className="bg-black text-white font-orbitron font-bold text-[9px] px-2 py-0.5 rounded uppercase">
                Interactive View
              </span>
            </div>
            <p className="font-jakarta text-gray-500 text-xs mt-0.5">
              {t.mapSubtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup Peta"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Filter Pills Top Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2 overflow-x-auto scrollbar-none font-jakarta text-xs shrink-0">
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Filter Pin:
          </span>

          {[
            { key: 'all', label: isEn ? 'All Locations' : 'Semua Lokasi', color: 'bg-black text-white' },
            { key: 'destinations', label: isEn ? 'Destinations (Red Pin)' : 'Destinasi (Pin Merah)', color: 'bg-red-600 text-white' },
            { key: 'culture', label: isEn ? 'Culture (Purple Pin)' : 'Budaya (Pin Ungu)', color: 'bg-purple-600 text-white' },
            { key: 'culinary', label: isEn ? 'Culinary (Amber Pin)' : 'Kuliner (Pin Oranye)', color: 'bg-amber-600 text-white' },
            { key: 'events', label: isEn ? 'Events (Blue Pin)' : 'Event (Pin Biru)', color: 'bg-blue-600 text-white' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveFilter(item.key as MapFilterCategory)}
              className={`px-3 py-1.5 rounded-full font-bold uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === item.key
                  ? `${item.color} shadow-xs scale-105`
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-black'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Leaflet Map Canvas Container */}
        <div className="flex-1 w-full h-full relative bg-gray-100">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        {/* Footer info legend bar */}
        <div className="px-6 py-2.5 bg-gray-900 text-white font-jakarta text-[10px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" /> Wisata Alam</span>
            <span className="flex items-center gap-1 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Budaya Minang</span>
            <span className="flex items-center gap-1 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" /> Rendang & Kuliner</span>
            <span className="flex items-center gap-1 font-semibold"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Event Festival</span>
          </div>
          <span className="text-gray-400 font-mono hidden sm:inline">Peta Digital Pariwisata Sumatera Barat &copy; 2026</span>
        </div>
      </div>
    </div>
  );
};
