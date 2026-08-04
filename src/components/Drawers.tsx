import React, { useState } from 'react';
import { X, Bookmark, BookmarkCheck, Sparkles, Send, MapPin, Calendar, Clock, ChevronRight, RefreshCw, Check, Edit3, Trash2, Plus, Youtube, PlayCircle, Flame, Download, ExternalLink, Share2, CheckCircle } from 'lucide-react';
import { DrawerType, Destination, CultureItem, CulinaryItem, EventItem, FormAIResponse } from '../types';
import { AdminPanel } from './AdminPanel';
import { Language, translations } from '../lib/translations';

const triggerDownload = (filename: string, content: string, mimeType: string = 'application/octet-stream') => {
  if (!content) return;
  const trimmed = content.trim();

  // Case 1: Data URL (e.g. data:image/png;base64,... or data:application/pdf;base64,...)
  if (trimmed.startsWith('data:')) {
    try {
      const parts = trimmed.split(',');
      const meta = parts[0];
      const raw = parts[1];

      if (meta.includes('base64')) {
        const decoded = atob(raw);
        const u8arr = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          u8arr[i] = decoded.charCodeAt(i);
        }
        const detectedMime = meta.split(':')[1]?.split(';')[0] || mimeType;
        const blob = new Blob([u8arr], { type: detectedMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'downloaded_file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {
      console.warn("Failed to decode base64 data URL, falling back to direct href link:", err);
      const a = document.createElement('a');
      a.href = trimmed;
      a.download = filename || 'downloaded_file';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
  }

  // Case 2: Web URL (http:// or https://)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const a = document.createElement('a');
    a.href = trimmed;
    a.target = '_blank';
    a.download = filename || 'downloaded_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Case 3: Raw SVG string or Plain text
  const blob = new Blob([trimmed], { type: mimeType || 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'downloaded_file';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getGoogleMapsUrl = (input?: string) => {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
};

const HOT_INFO_ITEMS = [
  {
    id: 'hi1',
    title: 'Peringatan Cuaca & Update Jalur Kelok 9',
    category: 'Cuaca & Jalur',
    date: 'Hari Ini, 16:30 WIB',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    content: 'Jalur utama Bukittinggi - Payakumbuh via Kelok 9 terpantau ramai lancar. BMKG Minangkabau memprakirakan potensi hujan ringan sore hingga malam hari. Pengendara diimbau berhati-hati.',
    locationQuery: 'Kelok 9 Sumatera Barat',
    isUrgent: true,
  },
  {
    id: 'hi2',
    title: 'Bazar Kuliner Rendang & Festival Budaya Minang 2026',
    category: 'Event Mendatang',
    date: '12 - 15 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    content: 'Pesta ragam olahan Rendang Minang dari 19 Kabupaten/Kota bertempat di Pelataran Jam Gadang Bukittinggi. Menampilkan 100 varian rendang dan pertunjukan musik Saluang & Pacu Jawi.',
    locationQuery: 'Jam Gadang Bukittinggi',
    isUrgent: false,
  },
  {
    id: 'hi3',
    title: 'Wisata Bahari Mentawai: Puncak Musim Surfing 2026',
    category: 'Berita Utama',
    date: 'Agustus - Oktober 2026',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    content: 'Gelombang ombak kelas dunia di Pulau Sipora & Siberut Mentawai memasuki puncak musim surfing. Kapal Cepat Mentawai Fast melayani pelayaran reguler dari Pelabuhan Muaro Padang.',
    locationQuery: 'Pelabuhan Muaro Padang',
    isUrgent: false,
  },
  {
    id: 'hi4',
    title: 'Himbauan Pendakian & Rekomendasi Jalur Aman Gunung Marapi',
    category: 'Himbauan Wisata',
    date: 'Update Resmi BPBD',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    content: 'Pendakian Gunung Marapi direkomendasikan terbatas hingga radius aman 3 km dari kawah utama. Wisatawan disarankan mengunjungi alternatif destinasi Lembah Harau dan Gunung Singgalang.',
    locationQuery: 'Lembah Harau Sumatera Barat',
    isUrgent: true,
  },
  {
    id: 'hi5',
    title: 'Peresmian Spot Glamping & Shuttle Listrik Harau Sky',
    category: 'Berita Utama',
    date: 'Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    content: 'Kawasan wisata Lembah Harau meresmikan 15 unit Glamping ramah lingkungan berlatar tebing granit 300m dengan armada shuttle listrik gratis untuk pengunjung.',
    locationQuery: 'Lembah Harau Payakumbuh',
    isUrgent: false,
  },
];

const DOWNLOAD_ITEMS = [
  {
    id: 'dl1',
    title: 'Logo Resmi MALALA & Pariwisata Sumbar',
    category: 'Logo & Brand Kit',
    type: 'SVG Package',
    size: '1.2 MB',
    description: 'Logo resmi Dinas Pariwisata Sumatera Barat & Logo Vektor MALALA (Format SVG High Resolution).',
    filename: 'Logo_Resmi_Malala_Wisata_Sumbar.svg',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
  <rect width="800" height="400" fill="#000000"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-weight="900" font-size="52" letter-spacing="8">MALALA˚</text>
  <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#A1A1AA" font-family="sans-serif" font-weight="600" font-size="18" letter-spacing="4">WEST SUMATRA TOURISM BOARD</text>
</svg>`,
    mimeType: 'image/svg+xml'
  },
  {
    id: 'dl2',
    title: 'E-Booklet Panduan Pariwisata Sumbar 2026',
    category: 'E-Booklet PDF',
    type: 'Document PDF (24 Halaman)',
    size: '4.8 MB',
    description: 'Buku panduan digital resmi berisi peta destinasi, informasi budaya Minangkabau, ragam kuliner khas, dan tips perjalanan aman.',
    filename: 'E-Booklet_Panduan_Wisata_Sumbar_2026.pdf',
    content: `E-BOOKLET PANDUAN RESMI PARIWISATA SUMATERA BARAT 2026
DINAS PARIWISATA PROVINSI SUMATERA BARAT

1. DESTINASI UTAMA: Jam Gadang, Ngarai Sianok, Lembah Harau, Danau Maninjau, Istano Pagaruyung, Kepulauan Mentawai.
2. BUDAYA & TRADISI: Rumah Gadang, Tari Piring, Pacu Jawi, Pencak Silat Kumango.
3. KULINER: Rendang Daging, Sate Padang, Teh Talua, Ayam Pop, Dendeng Balado.`,
    mimeType: 'application/pdf'
  },
  {
    id: 'dl3',
    title: 'Leaflet Peta Destinasi Wisata Ranah Minang',
    category: 'Leaflet & Map',
    type: 'Printable Map High-Res',
    size: '3.2 MB',
    description: 'Leaflet lipat memuat rute perjalanan, lokasi Rumah Makan Padang, dan titik koordinat objek wisata.',
    filename: 'Leaflet_Peta_Destinasi_Sumbar.pdf',
    content: `LEAFLET PETA WISATA SUMATERA BARAT 2026
* Rute Jalur Utara: Padang -> Padang Panjang -> Bukittinggi -> Payakumbuh -> Lembah Harau.
* Rute Jalur Selatan: Padang -> Mandeh -> Solok -> Danau Singkarak.
* Rute Kepulauan: Pelabuhan Muaro Padang -> Kapal Cepat Mentawai Fast.`,
    mimeType: 'application/pdf'
  },
  {
    id: 'dl4',
    title: 'Flyer Calendar of Events Pariwisata 2026',
    category: 'Flyer Event',
    type: 'HD Image & Calendar',
    size: '2.5 MB',
    description: 'Poster digital jadwal festival kebudayaan, perlombaan olahraga air, dan pagelaran musik tradisional.',
    filename: 'Calendar_of_Events_Sumbar_2026.pdf',
    content: `CALENDAR OF EVENTS SUMATERA BARAT 2026
- Maret: Festival Pacu Jawi Tanah Datar
- Mei: Mentawai Pro Surfing Championship
- Juli: Festival Danau Singkarak & Tour de Singkarak
- Agustus: Bazar Rendang & Pacu Itik Payakumbuh
- Desember: Fest Malam Tahun Baru Jam Gadang Bukittinggi`,
    mimeType: 'application/pdf'
  },
  {
    id: 'dl5',
    title: 'Infografis & Peta Kuliner Rendang Minang',
    category: 'Infografis Kuliner',
    type: 'Printable Infographic',
    size: '2.1 MB',
    description: 'Panduan peta rasa rendang dari 19 Kabupaten/Kota, filosofi bahan olahan kelapa & rempah khas Minang.',
    filename: 'Peta_Kuliner_Rendang_Minang.pdf',
    content: `PETA KULINER RENDANG MINANGKABAU
1. Rendang Daging - Payakumbuh & Bukittinggi
2. Rendang Lokan (Kerang) - Pesisir Selatan
3. Rendang Belut - Tanah Datar
4. Rendang Itik - Agam
5. Rendang Pakis & Jamur - Solok`,
    mimeType: 'application/pdf'
  }
];

interface DrawersProps {
  activeDrawer: DrawerType;
  onClose: () => void;
  savedIds: string[];
  onToggleSave: (id: string, title: string) => void;
  dataStore: any;
  lang?: Language;
}

export const Drawers: React.FC<DrawersProps> = ({
  activeDrawer,
  onClose,
  savedIds,
  onToggleSave,
  dataStore,
  lang = 'id',
}) => {
  const {
    destinations, updateDestinations,
    cultureItems, updateCultureItems,
    culinaryItems, updateCulinaryItems,
    eventItems, updateEventItems
  } = dataStore;

  // Category filter state for destinations
  const [destCategory, setDestCategory] = useState<string>('Semua');

  // Selected item modal/detail view
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedCulture, setSelectedCulture] = useState<CultureItem | null>(null);
  const [selectedCulinary, setSelectedCulinary] = useState<CulinaryItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Hot Info & Download state
  const [hotInfoCategory, setHotInfoCategory] = useState<string>('Semua');
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // FormAI state
  const [formAiTab, setFormAiTab] = useState<'generator' | 'chat'>('generator');
  const [itineraryForm, setItineraryForm] = useState<any>({
    durasiHari: 3,
    profilWisatawan: {
      jumlahOrang: 2,
      kategori: 'pasangan',
      asal: 'domestik',
    },
    preferensiMinat: {
      kategoriWisata: [],
      tingkatAktivitas: 'sedang',
      suasanaRamai: false,
    },
    logistik: {
      titikKeberangkatan: '',
      moda: 'kendaraan_pribadi',
      radiusMaksimalKm: 100,
    },
    anggaran: {
      rentang: 'menengah',
      alokasi: { akomodasiPersen: 35, makanPersen: 25, tiketPersen: 20, transportasiPersen: 20 },
    },
    akomodasi: {
      jenis: ['hotel'],
      lokasiPreferensi: '',
    },
    waktuKunjungan: {
      tanggalMulai: '',
      tanggalSelesai: '',
    },
    kebutuhanKhusus: {
      preferensiMakanan: [],
      alergiMakanan: [],
      aksesibilitasFisik: false,
    },
    outputPreferensi: {
      formatItinerary: 'per_hari',
      tingkatDetail: 'lengkap_kuliner_oleholeh',
    },
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<FormAIResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handlePrintA4Itinerary = () => {
    if (!aiResponse) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Gagal membuka jendela cetak. Silakan izinkan pop-up di browser Anda.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rencana Wisata Sumatera Barat - MALALA.travel</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #18181b;
            background: #ffffff;
            line-height: 1.5;
            margin: 0;
            padding: 20px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #18181b;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .brand {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .brand span { color: #dc2626; }
          .tagline {
            font-size: 11px;
            color: #52525b;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 700;
            margin-top: 2px;
          }
          .official-badge {
            background-color: #18181b;
            color: #ffffff;
            font-size: 9px;
            font-weight: 800;
            padding: 6px 12px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .hero-banner {
            background-color: #f4f4f5;
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 18px;
            font-weight: 800;
            color: #09090b;
            margin: 0 0 6px 0;
            text-transform: uppercase;
          }
          .summary {
            font-size: 12px;
            color: #3f3f46;
            margin: 0;
            line-height: 1.6;
          }
          .day-card {
            border: 1px solid #d4d4d8;
            border-radius: 8px;
            padding: 14px;
            margin-bottom: 16px;
            page-break-inside: avoid;
            background: #ffffff;
          }
          .day-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #f4f4f5;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .day-badge {
            background: #18181b;
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: uppercase;
          }
          .day-title {
            font-size: 13px;
            font-weight: 800;
            color: #09090b;
            text-transform: uppercase;
            margin: 0;
          }
          .activity-item {
            margin-bottom: 10px;
            font-size: 11px;
            border-left: 2px solid #e4e4e7;
            padding-left: 10px;
          }
          .activity-time {
            font-weight: 800;
            color: #18181b;
          }
          .activity-text {
            color: #27272a;
            margin-top: 2px;
          }
          .activity-tips {
            font-size: 10px;
            font-style: italic;
            background: #f4f4f5;
            padding: 4px 8px;
            border-radius: 4px;
            margin-top: 4px;
            color: #52525b;
          }
          .culinary-box {
            background-color: #fefce8;
            border: 1px solid #fef08a;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            color: #854d0e;
            margin-top: 10px;
            font-weight: 600;
          }
          .tips-section {
            background: #fafafa;
            border: 1px solid #e4e4e7;
            border-radius: 8px;
            padding: 14px;
            margin-top: 20px;
            page-break-inside: avoid;
          }
          .tips-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            margin: 0 0 8px 0;
            color: #09090b;
          }
          .tips-list {
            margin: 0;
            padding-left: 18px;
            font-size: 11px;
            color: #3f3f46;
          }
          .tips-list li { margin-bottom: 4px; }
          .footer {
            margin-top: 24px;
            padding-top: 12px;
            border-top: 1px solid #e4e4e7;
            text-align: center;
            font-size: 9px;
            color: #a1a1aa;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .no-print-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #dc2626;
            color: white;
            border: none;
            padding: 12px 24px;
            font-weight: bold;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            font-size: 13px;
            z-index: 9999;
          }
          @media print {
            .no-print-btn { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <div class="brand">MALALA<span>.travel</span></div>
              <div class="tagline">Panduan Wisata Sumatera Barat Berbasis AI</div>
            </div>
            <div class="official-badge">UNI MALA AI ITINERARY</div>
          </div>

          <div class="hero-banner">
            <h1 class="title">${aiResponse.title}</h1>
            <p class="summary">${aiResponse.summary}</p>
          </div>

          ${aiResponse.itinerary.map(day => `
            <div class="day-card">
              <div class="day-header">
                <span class="day-badge">HARI ${day.day}</span>
                <h3 class="day-title">${day.title}</h3>
              </div>
              <div>
                ${day.activities.map(act => `
                  <div class="activity-item">
                    <div class="activity-time">⏰ ${act.time} — ${act.location}</div>
                    <div class="activity-text">${act.activity}</div>
                    ${act.tips ? `<div class="activity-tips">💡 ${act.tips}</div>` : ''}
                  </div>
                `).join('')}
              </div>
              ${day.culinaryRecommendation ? `
                <div class="culinary-box">
                  🍲 <strong>Rekomendasi Kuliner:</strong> ${day.culinaryRecommendation}
                </div>
              ` : ''}
            </div>
          `).join('')}

          ${aiResponse.localTips && aiResponse.localTips.length > 0 ? `
            <div class="tips-section">
              <h4 class="tips-title">Kearifan Lokal & Etika Minangkabau</h4>
              <ul class="tips-list">
                ${aiResponse.localTips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <div class="footer">
            Dibuat secara otomatis oleh UNI MALA AI pada ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} &bull; MALALA.travel &bull; Ukuran Standar Cetak Kertas A4
          </div>

          <button class="no-print-btn" onclick="window.print()">🖨️ Cetak / Simpan PDF A4</button>
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 600);
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const updateForm = (path: string[], value: any) => {
    setItineraryForm((prev: any) => {
      const newState = { ...prev };
      let current = newState;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newState;
    });
  };

  // UNI MALA AI Chatbot state
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    {
      sender: 'ai',
      text: 'Saluang & Ranah Minang! Saya UNI MALA AI Sumbar, asisten resmi pariwisata Sumatera Barat. Ada yang bisa saya bantu terkait destinasi wisata, kuliner Rendang, atau kebudayaan Minangkabau?',
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const getDrawerTitle = () => {
    const isEn = lang === 'en';
    switch (activeDrawer) {
      case 'destinations':
        return isEn ? 'Featured Destinations' : 'Destinasi Wisata MALALA';
      case 'culture':
        return isEn ? 'Minangkabau Culture & Heritage' : 'Seni & Budaya Minang';
      case 'culinary':
        return isEn ? 'Authentic West Sumatra Culinary' : 'Kuliner Authentic';
      case 'events':
        return isEn ? 'Events & Festivals' : 'Event & Festival';
      case 'formai':
        return isEn ? 'UNI MALA AI Travel Assistant' : 'UNI MALA AI Sumbar';
      case 'saved':
        return isEn ? 'My Saved Favorites' : 'Destinasi Favorit Saya';
      case 'admin':
        return 'Admin Data Management';
      case 'hotinfo':
        return isEn ? 'Hot Info & Travel Updates' : 'Hot Info & Berita Wisata';
      case 'download':
        return isEn ? 'Media Kit & Download Center' : 'Pusat Unduhan & Asset';
      default:
        return '';
    }
  };

  const getDrawerSubtitle = () => {
    const isEn = lang === 'en';
    switch (activeDrawer) {
      case 'destinations':
        return isEn ? 'Explore natural landscapes, geoparks & heritage villages' : 'Pesona Alam, Geopark & Desa Wisata Ranah Minang';
      case 'culture':
        return isEn ? 'Traditional Rumah Gadang architecture, arts & heritage' : 'Warisan Rumah Gadang, Ukiran & Seni Tradisi';
      case 'culinary':
        return isEn ? 'Authentic Rendang, Padang Satay & traditional flavors' : 'Rendang, Sate Padang & Cita Rasa Khas';
      case 'events':
        return isEn ? 'Cultural calendar & sports tourism events' : 'Kalender Budaya & Olahraga Parawisata';
      case 'formai':
        return isEn ? 'AI-powered itinerary builder & official travel assistant' : 'Rencana Perjalanan AI & Asisten Pariwisata Resmi';
      case 'saved':
        return isEn ? 'Your saved destinations and cultural highlights' : 'Daftar Destinasi & Kebudayaan yang Disimpan';
      case 'admin':
        return 'Admin Panel';
      case 'hotinfo':
        return isEn ? 'Live updates, weather, traffic routes & tourism notices' : 'Update Terkini, Cuaca, Jalur & Pengumuman Pariwisata Sumbar';
      case 'download':
        return isEn ? 'Download official logos, travel guide booklets & flyers' : 'Unduh Logo Resmi, Booklet, Leaflet & Flyer Wisata Sumbar';
      default:
        return '';
    }
  };

  // Filtered destinations
  const filteredDestinations = destCategory === 'Semua'
    ? destinations
    : destinations.filter((d: Destination) => d.category === destCategory);

  // Handle FormAI Itinerary Generation
  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itineraryForm,
          language: lang,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal memproses AI itinerary.');
      }

      const data: FormAIResponse = await res.json();
      setAiResponse(data);
    } catch (err: any) {
      setAiError(err.message || 'Terjadi kesalahan saat memanggil UNI MALA AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle UNI MALA AI Chat Submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userText = chatMessage.trim();
    setChatMessage('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal merespon.');
      }

      const data = await res.json();
      setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        { sender: 'ai', text: 'Maaf, terjadi masalah saat menghubungi UNI MALA AI. Mohon coba lagi beberapa saat.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Get saved destination/culture objects
  const savedDestinationsList = destinations.filter((d: Destination) => savedIds.includes(d.id));
  const savedCultureList = cultureItems.filter((c: CultureItem) => savedIds.includes(c.id));

  if (!activeDrawer) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[60] transition-opacity duration-300 animate-fade-in cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer Outer Wrapper - TAKES UP HALF THE SCREEN (w-full md:w-1/2 lg:w-1/2) */}
      <div
        className={`fixed top-0 bottom-0 z-[70] w-full md:w-1/2 lg:w-1/2 bg-white shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
          activeDrawer === 'hotinfo'
            ? 'left-0 border-r border-gray-200'
            : 'right-0 border-l border-gray-200'
        }`}
      >
        
        {/* Header Drawer */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-extrabold text-black uppercase tracking-wider text-base sm:text-lg">
                {getDrawerTitle()}
              </h2>
              {activeDrawer === 'formai' && (
                <span className="bg-black text-white font-orbitron font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  AI Powered
                </span>
              )}
              {activeDrawer === 'hotinfo' && (
                <span className="bg-red-600 text-white font-orbitron font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                  <Flame className="w-2.5 h-2.5 text-yellow-300 fill-current animate-pulse" />
                  Live Update
                </span>
              )}
              {activeDrawer === 'download' && (
                <span className="bg-black text-white font-orbitron font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                  <Download className="w-2.5 h-2.5 text-green-400" />
                  Media Kit
                </span>
              )}
            </div>
            <p className="font-jakarta text-gray-500 text-xs mt-0.5">
              {getDrawerSubtitle()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* =================================================== */}
          {/* 1. DESTINASI WISATA DRAWER                          */}
          {/* =================================================== */}
          {activeDrawer === 'destinations' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-jakarta">
                {[
                  { val: 'Semua', label: translations[lang].catAll },
                  { val: 'Danau & Gunung', label: translations[lang].catLakeMountain },
                  { val: 'Lembah & Geopark', label: translations[lang].catValleyGeopark },
                  { val: 'Pantai & Bahari', label: translations[lang].catBeachMarine },
                  { val: 'Desa Wisata', label: translations[lang].catVillage }
                ].map(cat => (
                  <button
                    key={cat.val}
                    onClick={() => setDestCategory(cat.val)}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      destCategory === cat.val
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Destination Cards - 2 COLUMN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDestinations.map((dest) => {
                  const isSaved = savedIds.includes(dest.id);
                  const isEn = lang === 'en';
                  return (
                    <div
                      key={dest.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-black transition-all bg-white group flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                          <img
                            src={dest.imageUrl}
                            alt={isEn && dest.titleEn ? dest.titleEn : dest.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                            {isEn && dest.categoryEn ? dest.categoryEn : dest.category}
                          </div>

                          {/* Bookmark Button */}
                          <button
                            onClick={() => onToggleSave(dest.id, isEn && dest.titleEn ? dest.titleEn : dest.title)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all cursor-pointer ${
                              isSaved
                                ? 'bg-black text-white border-black'
                                : 'bg-white/90 text-gray-700 border-gray-200 hover:text-black hover:bg-white'
                            }`}
                            title={isSaved ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
                          >
                            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {/* Card Info */}
                        <div className="p-3.5 space-y-2">
                          <div className="text-gray-400 font-jakarta text-[11px] flex items-center gap-1 font-semibold">
                            <MapPin className="w-3 h-3 text-black" />
                            {isEn && dest.regencyEn ? dest.regencyEn : dest.regency}
                          </div>
                          <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-xs sm:text-sm line-clamp-2">
                            {isEn && dest.titleEn ? dest.titleEn : dest.title}
                          </h3>
                          <p className="font-jakarta text-gray-600 text-[11px] leading-relaxed line-clamp-2">
                            {isEn && dest.descriptionEn ? dest.descriptionEn : dest.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="px-3.5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[10px] font-jakarta">
                        <span className="flex items-center gap-1 text-gray-500 font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {isEn && dest.bestTimeEn ? dest.bestTimeEn : dest.bestTime}
                        </span>
                        <button
                          onClick={() => setSelectedDestination(dest)}
                          className="font-bold text-black hover:underline uppercase flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>{translations[lang].btnDetail}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* 2. SENI & BUDAYA MINANG DRAWER                     */}
          {/* =================================================== */}
          {activeDrawer === 'culture' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cultureItems.map((item: CultureItem) => {
                const isSaved = savedIds.includes(item.id);
                const isEn = lang === 'en';
                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-xs hover:border-black transition-all group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={isEn && item.titleEn ? item.titleEn : item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 bg-black/75 text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                          {isEn && item.categoryEn ? item.categoryEn : item.category}
                        </span>
                        <button
                          onClick={() => onToggleSave(item.id, isEn && item.titleEn ? item.titleEn : item.title)}
                          className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all cursor-pointer ${
                            isSaved
                              ? 'bg-black text-white border-black'
                              : 'bg-white/90 text-gray-700 border-gray-200 hover:text-black hover:bg-white'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-xs sm:text-sm">
                          {isEn && item.titleEn ? item.titleEn : item.title}
                        </h3>
                        <p className="font-jakarta text-gray-600 text-[11px] leading-relaxed line-clamp-3">
                          {isEn && item.descriptionEn ? item.descriptionEn : item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-0.5">
                      <span className="font-jakarta font-bold text-[9px] text-gray-400 uppercase tracking-widest block">
                        {isEn ? 'MINANG PHILOSOPHY' : 'FALSAFAH MINANG'}
                      </span>
                      <p className="font-jakarta italic text-black font-semibold text-[11px] line-clamp-2 pb-2">
                        "{isEn && item.philosophyEn ? item.philosophyEn : item.philosophy}"
                      </p>
                      <div className="flex justify-end pt-2 border-t border-gray-200">
                        <button
                          onClick={() => setSelectedCulture(item)}
                          className="font-bold text-black text-[10px] uppercase flex items-center gap-0.5 hover:underline cursor-pointer"
                        >
                          {translations[lang].btnDetail}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================== */}
          {/* 3. KULINER AUTHENTIC DRAWER                        */}
          {/* =================================================== */}
          {activeDrawer === 'culinary' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {culinaryItems.map((cul: CulinaryItem) => {
                const isEn = lang === 'en';
                return (
                  <div
                    key={cul.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-xs hover:border-black transition-all group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={cul.imageUrl}
                          alt={isEn && cul.titleEn ? cul.titleEn : cul.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-2 left-2 bg-black/75 text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                          {isEn && cul.typeEn ? cul.typeEn : cul.type}
                        </span>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div className="text-gray-400 font-jakarta text-[10px] uppercase tracking-wider font-semibold">
                          {isEn ? 'Origin:' : 'Asal:'} {isEn && cul.originEn ? cul.originEn : cul.origin}
                        </div>
                        <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-xs sm:text-sm">
                          {isEn && cul.titleEn ? cul.titleEn : cul.title}
                        </h3>
                        <p className="font-jakarta text-gray-600 text-[11px] leading-relaxed line-clamp-3">
                          {isEn && cul.descriptionEn ? cul.descriptionEn : cul.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] font-jakarta flex items-center justify-between">
                      <div>
                        <span className="font-bold text-black">{isEn ? 'Flavor Profile:' : 'Profil Rasa:'} </span>
                        <span className="text-gray-600 line-clamp-1 block sm:inline">{isEn && cul.flavorProfileEn ? cul.flavorProfileEn : cul.flavorProfile}</span>
                      </div>
                      <button
                        onClick={() => setSelectedCulinary(cul)}
                        className="font-bold text-black text-[10px] uppercase flex items-center gap-0.5 hover:underline cursor-pointer shrink-0"
                      >
                        {translations[lang].btnDetail}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================== */}
          {/* 4. EVENT & FESTIVAL DRAWER                          */}
          {/* =================================================== */}
          {activeDrawer === 'events' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventItems.map((ev: EventItem) => {
                const isEn = lang === 'en';
                return (
                  <div
                    key={ev.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-xs hover:border-black transition-all group"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
                        <img
                          src={ev.imageUrl}
                          alt={isEn && ev.titleEn ? ev.titleEn : ev.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2 bg-black/80 text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                          <Calendar className="w-3 h-3" />
                          {isEn && ev.scheduleEn ? ev.scheduleEn : ev.schedule}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2">
                        <div className="text-gray-400 font-jakarta text-[10px] flex items-center gap-1 font-semibold">
                          <MapPin className="w-3 h-3 text-black" />
                          {isEn && ev.locationEn ? ev.locationEn : ev.location}
                        </div>
                        <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-xs sm:text-sm">
                          {isEn && ev.titleEn ? ev.titleEn : ev.title}
                        </h3>
                        <p className="font-jakarta text-gray-600 text-[11px] leading-relaxed line-clamp-3">
                          {isEn && ev.descriptionEn ? ev.descriptionEn : ev.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] font-jakarta text-gray-500 flex items-center justify-between">
                      <span className="uppercase tracking-widest font-semibold">{isEn ? 'Official Event' : 'Event Resmi'}</span>
                      <button
                        onClick={() => setSelectedEvent(ev)}
                        className="font-bold text-black text-[10px] uppercase flex items-center gap-0.5 hover:underline cursor-pointer shrink-0"
                      >
                        {translations[lang].btnDetail}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =================================================== */}
          {/* 5. FORMAI SUMATERA BARAT (AI ITINERARY & CHAT)      */}
          {/* =================================================== */}
          {activeDrawer === 'formai' && (
            <div className="space-y-6">
              {/* FormAI Mode Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setFormAiTab('generator')}
                  className={`py-2 px-3 rounded-md text-xs font-jakarta font-bold uppercase transition-all cursor-pointer ${
                    formAiTab === 'generator'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {translations[lang].tabGenerator}
                </button>
                <button
                  onClick={() => setFormAiTab('chat')}
                  className={`py-2 px-3 rounded-md text-xs font-jakarta font-bold uppercase transition-all cursor-pointer ${
                    formAiTab === 'chat'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {translations[lang].tabChat}
                </button>
              </div>

              {/* MODE 1: ITINERARY GENERATOR */}
              {formAiTab === 'generator' && (
                <div className="space-y-6">
                  <form onSubmit={handleGenerateItinerary} className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                        {translations[lang].fieldDaysForm}
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5, 7].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => updateForm(['durasiHari'], num)}
                            className={`flex-1 py-1.5 rounded text-xs font-orbitron font-bold transition-all cursor-pointer ${
                              itineraryForm.durasiHari === num
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-200 text-black hover:border-black'
                            }`}
                          >
                            {num} {lang === 'en' ? 'Days' : 'Hari'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                          {translations[lang].fieldTravelerType}
                        </label>
                        <select
                          value={itineraryForm.profilWisatawan.kategori}
                          onChange={(e) => updateForm(['profilWisatawan', 'kategori'], e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                        >
                          <option value="individu">{translations[lang].optSolo}</option>
                          <option value="pasangan">{translations[lang].optCouple}</option>
                          <option value="keluarga_anak">{translations[lang].optFamilyKids}</option>
                          <option value="lansia">{translations[lang].optFamilyElders}</option>
                          <option value="rombongan">{translations[lang].optGroup}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                          {translations[lang].fieldNumPeople}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={itineraryForm.profilWisatawan.jumlahOrang}
                          onChange={(e) => updateForm(['profilWisatawan', 'jumlahOrang'], parseInt(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                        {translations[lang].fieldInterestsForm}
                      </label>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {[
                          { val: 'alam', label: lang === 'en' ? 'Nature' : 'Alam' },
                          { val: 'budaya_sejarah', label: lang === 'en' ? 'Culture & History' : 'Budaya & Sejarah' },
                          { val: 'religi', label: lang === 'en' ? 'Religious' : 'Religi' },
                          { val: 'kuliner', label: lang === 'en' ? 'Culinary' : 'Kuliner' },
                          { val: 'petualangan', label: lang === 'en' ? 'Adventure' : 'Petualangan' },
                          { val: 'edukasi', label: lang === 'en' ? 'Education' : 'Edukasi' }
                        ].map((minat) => {
                          const isSelected = itineraryForm.preferensiMinat.kategoriWisata.includes(minat.val);
                          return (
                            <button
                              key={minat.val}
                              type="button"
                              onClick={() => {
                                const list = itineraryForm.preferensiMinat.kategoriWisata;
                                updateForm(['preferensiMinat', 'kategoriWisata'], isSelected ? list.filter((i: string) => i !== minat.val) : [...list, minat.val]);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-jakarta transition-all cursor-pointer capitalize ${
                                isSelected
                                  ? 'bg-black text-white font-bold'
                                  : 'bg-white border border-gray-200 text-gray-600 hover:border-black'
                              }`}
                            >
                              {isSelected ? `✓ ${minat.label}` : minat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                          {translations[lang].fieldActivityLevel}
                        </label>
                        <select
                          value={itineraryForm.preferensiMinat.tingkatAktivitas}
                          onChange={(e) => updateForm(['preferensiMinat', 'tingkatAktivitas'], e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                        >
                          <option value="santai">{translations[lang].optRelaxed}</option>
                          <option value="sedang">{translations[lang].optModerate}</option>
                          <option value="ekstrem">{translations[lang].optExtreme}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                          {translations[lang].fieldBudgetForm}
                        </label>
                        <select
                          value={itineraryForm.anggaran.rentang}
                          onChange={(e) => updateForm(['anggaran', 'rentang'], e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                        >
                          <option value="hemat">{translations[lang].optBudget}</option>
                          <option value="menengah">{translations[lang].optStandard}</option>
                          <option value="mewah">{translations[lang].optPremium}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-jakarta font-bold uppercase tracking-wider text-black mb-1.5">
                        Kebutuhan Khusus / Alergi Makanan
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: alergi udang, butuh akses kursi roda..."
                        value={itineraryForm.kebutuhanKhusus.alergiMakanan.join(', ')}
                        onChange={(e) => updateForm(['kebutuhanKhusus', 'alergiMakanan'], e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full bg-black text-white py-3 rounded-lg font-jakarta font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{translations[lang].btnGenerating}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-yellow-300" />
                          <span>{translations[lang].btnGenerate}</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* AI Response Results */}
                  {aiError && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs font-jakarta rounded-md border border-red-200">
                      {aiError}
                    </div>
                  )}

                  {aiResponse && (
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <div className="bg-black text-white p-4 rounded-xl space-y-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-yellow-300" />
                          <span className="font-orbitron font-bold text-xs uppercase tracking-widest text-gray-300">
                            {lang === 'en' ? 'UNI MALA AI Official Trip Itinerary' : 'Rencana Wisata Resmi UNI MALA AI'}
                          </span>
                        </div>
                        <h3 className="font-orbitron font-bold text-base uppercase text-white">
                          {aiResponse.title}
                        </h3>
                        <p className="font-jakarta text-xs text-gray-300 pt-1">
                          {aiResponse.summary}
                        </p>

                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={handlePrintA4Itinerary}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-jakarta font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>{translations[lang].btnPrintA4}</span>
                          </button>
                        </div>
                      </div>

                      {/* Itinerary Days */}
                      <div className="space-y-4">
                        {aiResponse.itinerary.map((day) => (
                          <div key={day.day} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-white">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <span className="bg-black text-white font-orbitron font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                                HARI {day.day}
                              </span>
                              <h4 className="font-orbitron font-bold text-xs uppercase text-black">
                                {day.title}
                              </h4>
                            </div>

                            <div className="space-y-2.5">
                              {day.activities.map((act, i) => (
                                <div key={i} className="text-xs font-jakarta space-y-1">
                                  <div className="flex items-center justify-between font-bold text-black">
                                    <span>{act.time} — {act.location}</span>
                                  </div>
                                  <p className="text-gray-600">{act.activity}</p>
                                  {act.tips && (
                                    <p className="text-[11px] text-gray-500 italic bg-gray-50 p-1.5 rounded border border-gray-100">
                                      💡 {act.tips}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>

                            {day.culinaryRecommendation && (
                              <div className="pt-2 border-t border-gray-100 text-xs font-jakarta text-black bg-yellow-50 p-2 rounded">
                                <span className="font-bold">🍲 Kuliner Hari Ini: </span>
                                <span>{day.culinaryRecommendation}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Local Tips */}
                      {aiResponse.localTips && aiResponse.localTips.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2 text-xs font-jakarta">
                          <h4 className="font-bold text-black uppercase tracking-wider">
                            Kearifan Lokal & Etika Minangkabau
                          </h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-700">
                            {aiResponse.localTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: CHATBOT AI MINANG GUIDE */}
              {formAiTab === 'chat' && (
                <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                  {/* Chat Messages Log */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {chatHistory.map((item, index) => (
                      <div
                        key={index}
                        className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-xl text-xs font-jakarta leading-relaxed ${
                            item.sender === 'user'
                              ? 'bg-black text-white rounded-br-none'
                              : 'bg-white border border-gray-200 text-gray-800 shadow-xs rounded-bl-none'
                          }`}
                        >
                          {item.sender === 'ai' && (
                            <div className="flex items-center gap-1 font-orbitron font-bold text-[10px] text-gray-400 uppercase mb-1">
                              <Sparkles className="w-2.5 h-2.5 text-black" />
                              UNI MALA AI
                            </div>
                          )}
                          <p className="whitespace-pre-wrap">{item.text}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 p-3 rounded-xl text-xs font-jakarta text-gray-500 flex items-center gap-2">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>{lang === 'en' ? 'UNI MALA AI is typing...' : 'UNI MALA AI sedang mengetik respon...'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleChatSubmit} className="p-2 bg-white border-t border-gray-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={translations[lang].chatInputPlaceholder}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg p-2.5 text-xs font-jakarta text-black focus:outline-none focus:border-black"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatMessage.trim()}
                      className="bg-black text-white p-2.5 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* =================================================== */}
          {/* 6. SAVED FAVORITES DRAWER                          */}
          {/* =================================================== */}
          {activeDrawer === 'saved' && (
            <div className="space-y-4">
              {savedIds.length === 0 ? (
                <div className="py-16 text-center text-gray-400 space-y-2">
                  <Bookmark className="w-10 h-10 mx-auto text-gray-300 stroke-1" />
                  <p className="font-jakarta font-medium text-sm text-black uppercase tracking-wider">
                    {lang === 'en' ? 'No Saved Items' : 'Belum Ada Destinasi Disimpan'}
                  </p>
                  <p className="font-jakarta text-xs text-gray-400 max-w-xs mx-auto">
                    {translations[lang].savedEmpty}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedDestinationsList.map(dest => (
                    <div key={dest.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="h-28 w-full overflow-hidden bg-gray-100">
                          <img src={dest.imageUrl} alt={dest.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 space-y-1">
                          <span className="bg-black text-white text-[9px] font-jakarta font-bold px-2 py-0.5 rounded uppercase">
                            {dest.category}
                          </span>
                          <h4 className="font-orbitron font-bold text-xs text-black pt-1">{dest.title}</h4>
                          <p className="font-jakarta text-[11px] text-gray-500">{dest.regency}</p>
                        </div>
                      </div>
                      <div className="p-2.5 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => onToggleSave(dest.id, dest.title)}
                          className="text-[11px] text-red-500 font-jakarta font-bold hover:underline cursor-pointer"
                        >
                          {lang === 'en' ? 'Remove' : 'Hapus'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {savedCultureList.map(cul => (
                    <div key={cul.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="h-28 w-full overflow-hidden bg-gray-100">
                          <img src={cul.imageUrl} alt={cul.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 space-y-1">
                          <span className="bg-gray-100 text-black text-[9px] font-jakarta font-bold px-2 py-0.5 rounded uppercase">
                            {lang === 'en' ? 'Culture' : 'Seni & Budaya'}
                          </span>
                          <h4 className="font-orbitron font-bold text-xs text-black pt-1">{cul.title}</h4>
                          <p className="font-jakarta text-[11px] text-gray-500">{cul.category}</p>
                        </div>
                      </div>
                      <div className="p-2.5 border-t border-gray-100 flex justify-end">
                        <button
                          onClick={() => onToggleSave(cul.id, cul.title)}
                          className="text-[11px] text-red-500 font-jakarta font-bold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================== */}
          {/* 7. ADMIN MANAGEMENT DRAWER                          */}
          {/* =================================================== */}
          {activeDrawer === 'admin' && (
            <AdminPanel dataStore={dataStore} />
          )}

          {/* =================================================== */}
          {/* 8. HOT INFO & UPDATE TERBARU (LEFT DRAWER)        */}
          {/* =================================================== */}
          {activeDrawer === 'hotinfo' && (
            <div className="space-y-6">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-jakarta">
                {['Semua', 'Berita Utama', 'Cuaca & Jalur', 'Event Mendatang', 'Himbauan Wisata'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setHotInfoCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      hotInfoCategory === cat
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Hot Info Items List */}
              <div className="space-y-4">
                {(dataStore.hotInfoItems && dataStore.hotInfoItems.length > 0 ? dataStore.hotInfoItems : HOT_INFO_ITEMS)
                  .filter((item: any) => hotInfoCategory === 'Semua' || item.category === hotInfoCategory)
                  .map((item: any) => {
                    const isEn = lang === 'en';
                    return (
                      <div
                        key={item.id}
                        className={`border rounded-lg overflow-hidden bg-white shadow-xs transition-all ${
                          item.tag === 'Penting' || item.isUrgent ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {item.imageUrl && (
                          <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                            <img
                              src={item.imageUrl}
                              alt={isEn && item.titleEn ? item.titleEn : item.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/80 text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded backdrop-blur-xs">
                              {isEn && item.categoryEn ? item.categoryEn : item.category}
                            </div>
                            {(item.tag === 'Penting' || item.isUrgent) && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white font-jakarta font-extrabold text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                <Flame className="w-3 h-3 text-yellow-300 fill-current" />
                                {isEn && item.tagEn ? item.tagEn : (item.tag || 'Urgent')}
                              </div>
                            )}
                            {item.date && (
                              <div className="absolute bottom-2 left-2 bg-black/60 text-gray-200 font-jakarta text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
                                {isEn && item.dateEn ? item.dateEn : item.date}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="p-4 space-y-2">
                          <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-sm leading-snug">
                            {isEn && item.titleEn ? item.titleEn : item.title}
                          </h3>
                          <p className="font-jakarta text-gray-700 text-xs leading-relaxed">
                            {isEn && item.descriptionEn ? item.descriptionEn : (item.description || item.content)}
                          </p>

                          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                            {(item.actionUrl || item.locationQuery) ? (
                              <a
                                href={getGoogleMapsUrl(item.actionUrl || item.locationQuery)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all font-jakarta font-bold text-xs uppercase cursor-pointer"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{translations[lang].btnMap}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : <div />}

                            <button
                              onClick={() => {
                                const textToShare = `${isEn && item.titleEn ? item.titleEn : item.title}\n${isEn && item.descriptionEn ? item.descriptionEn : (item.description || item.content)}`;
                                if (navigator.share) {
                                  navigator.share({ title: isEn && item.titleEn ? item.titleEn : item.title, text: textToShare, url: window.location.href });
                                } else {
                                  navigator.clipboard.writeText(textToShare);
                                  alert('Tautan informasi berhasil disalin!');
                                }
                              }}
                              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors cursor-pointer"
                              title="Bagikan Info Ini"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* =================================================== */}
          {/* 9. PUSAT UNDUHAN & ASSET WISATA (RIGHT DRAWER)     */}
          {/* =================================================== */}
          {activeDrawer === 'download' && (
            <div className="space-y-6">
              {downloadSuccessMessage && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-xs font-jakarta flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{downloadSuccessMessage}</span>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-jakarta text-xs text-gray-600 space-y-1">
                <p className="font-bold text-black uppercase tracking-wider">{lang === 'en' ? 'Official Media Kit & Assets' : 'Materi Promosi Resmi'}</p>
                <p>{lang === 'en' ? 'Download West Sumatra tourism promotional assets, media kits, booklets, and travel guides.' : 'Unduh materi promosi pariwisata Sumatera Barat untuk kebutuhan publikasi, media kit, pemandu wisata, atau informasi perjalanan Anda.'}</p>
              </div>

              <div className="space-y-4">
                {(dataStore.downloadItems && dataStore.downloadItems.length > 0 ? dataStore.downloadItems : DOWNLOAD_ITEMS).map((item: any) => {
                  const isEn = lang === 'en';
                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white hover:border-black transition-all flex flex-col justify-between space-y-3 shadow-xs group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-black text-white font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                            {isEn && item.categoryEn ? item.categoryEn : item.category}
                          </span>
                          <span className="text-gray-400 font-jakarta text-[10px] font-semibold">
                            {item.size}
                          </span>
                        </div>
                        <h3 className="font-orbitron font-bold text-black uppercase tracking-wide text-xs sm:text-sm">
                          {isEn && item.titleEn ? item.titleEn : item.title}
                        </h3>
                        <p className="font-jakarta text-gray-600 text-xs leading-relaxed">
                          {isEn && item.descriptionEn ? item.descriptionEn : item.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-jakarta font-semibold uppercase">
                          Format: {isEn && item.typeEn ? item.typeEn : item.type}
                        </span>
                        <button
                          onClick={() => {
                            triggerDownload(item.filename, item.content, item.mimeType);
                            setDownloadSuccessMessage(isEn ? `Successfully downloaded "${item.titleEn || item.title}"` : `Berhasil mengunduh "${item.title}"`);
                            setTimeout(() => setDownloadSuccessMessage(null), 4000);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-black text-white font-jakarta font-bold text-xs uppercase hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-green-400" />
                          <span>{isEn ? 'Download File' : 'Unduh File'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center font-jakarta text-[10px] text-gray-500 uppercase tracking-widest shrink-0">
          Dinas Pariwisata Provinsi Sumatera Barat © 2026 — Visit Wonderful West Sumatra
        </div>
      </div>

      {/* MODAL INFORMATION DIALOG FOR DESTINATIONS */}
      {selectedDestination && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-scale-up space-y-4 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDestination(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="-mx-6 -mt-6 mb-4 h-48 overflow-hidden bg-gray-100 relative">
              <img
                src={selectedDestination.imageUrl}
                alt={selectedDestination.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="bg-white text-black font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                  {lang === 'en' && selectedDestination.categoryEn ? selectedDestination.categoryEn : selectedDestination.category}
                </span>
                <h3 className="font-orbitron font-bold text-base uppercase text-white pt-1 drop-shadow-xs">
                  {lang === 'en' && selectedDestination.titleEn ? selectedDestination.titleEn : selectedDestination.title}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-jakarta text-xs text-gray-500 flex items-center gap-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {lang === 'en' && selectedDestination.locationDetailsEn ? selectedDestination.locationDetailsEn : selectedDestination.locationDetails}
              </p>
            </div>

            <p className="font-jakarta text-xs text-gray-700 leading-relaxed pt-2 border-t border-gray-100">
              {lang === 'en' && selectedDestination.descriptionEn ? selectedDestination.descriptionEn : selectedDestination.description}
            </p>

            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <h4 className="font-jakarta font-bold text-xs uppercase text-black tracking-wider">
                {lang === 'en' ? 'Highlights' : 'Daya Tarik Utama (Highlights)'}
              </h4>
              <ul className="space-y-1 text-xs font-jakarta text-gray-700">
                {(lang === 'en' && selectedDestination.highlightsEn ? selectedDestination.highlightsEn : selectedDestination.highlights).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-xs font-jakarta pt-2">
              <span className="text-gray-500">{lang === 'en' ? 'Best Time to Visit:' : 'Waktu Terbaik Berkunjung:'}</span>
              <span className="font-bold text-black">{lang === 'en' && selectedDestination.bestTimeEn ? selectedDestination.bestTimeEn : selectedDestination.bestTime}</span>
            </div>

            {getGoogleMapsUrl(selectedDestination.mapUrl) && (
              <a
                href={getGoogleMapsUrl(selectedDestination.mapUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2 shadow-xs"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{translations[lang].btnOpenMap}</span>
              </a>
            )}

            {selectedDestination.videoUrl && (
              <a
                href={selectedDestination.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF0000] text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-red-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2"
              >
                <Youtube className="w-4 h-4" />
                {lang === 'en' ? 'Watch Video (YouTube)' : 'Tonton Video (YouTube)'}
              </a>
            )}

            <button
              onClick={() => setSelectedDestination(null)}
              className="w-full bg-black text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {translations[lang].btnClose}
            </button>
          </div>
        </div>
      )}

      {/* MODAL INFORMATION DIALOG FOR CULTURE */}
      {selectedCulture && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-scale-up space-y-4 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCulture(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="-mx-6 -mt-6 mb-4 h-48 overflow-hidden bg-gray-100 relative">
              <img
                src={selectedCulture.imageUrl}
                alt={selectedCulture.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="bg-white text-black font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                  {lang === 'en' && selectedCulture.categoryEn ? selectedCulture.categoryEn : selectedCulture.category}
                </span>
                <h3 className="font-orbitron font-bold text-base uppercase text-white pt-1 drop-shadow-xs">
                  {lang === 'en' && selectedCulture.titleEn ? selectedCulture.titleEn : selectedCulture.title}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-jakarta text-xs text-gray-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {lang === 'en' ? 'Origin:' : 'Asal:'} {lang === 'en' && selectedCulture.originEn ? selectedCulture.originEn : selectedCulture.origin}
              </p>
            </div>

            <p className="font-jakarta text-xs text-gray-700 leading-relaxed pt-2 border-t border-gray-100">
              {lang === 'en' && selectedCulture.descriptionEn ? selectedCulture.descriptionEn : selectedCulture.description}
            </p>

            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <h4 className="font-jakarta font-bold text-xs uppercase text-black tracking-wider">
                {lang === 'en' ? 'Minang Philosophy' : 'Falsafah Minang'}
              </h4>
              <p className="font-jakarta italic text-black font-semibold text-xs">
                "{lang === 'en' && selectedCulture.philosophyEn ? selectedCulture.philosophyEn : selectedCulture.philosophy}"
              </p>
            </div>

            {getGoogleMapsUrl(selectedCulture.mapUrl) && (
              <a
                href={getGoogleMapsUrl(selectedCulture.mapUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2 shadow-xs"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{translations[lang].btnOpenMap}</span>
              </a>
            )}

            {selectedCulture.videoUrl && (
              <a
                href={selectedCulture.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF0000] text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-red-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2"
              >
                <Youtube className="w-4 h-4" />
                {lang === 'en' ? 'Watch Video (YouTube)' : 'Tonton Video (YouTube)'}
              </a>
            )}

            <button
              onClick={() => setSelectedCulture(null)}
              className="w-full bg-black text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {translations[lang].btnClose}
            </button>
          </div>
        </div>
      )}

      {/* MODAL INFORMATION DIALOG FOR CULINARY */}
      {selectedCulinary && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-scale-up space-y-4 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCulinary(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="-mx-6 -mt-6 mb-4 h-48 overflow-hidden bg-gray-100 relative">
              <img
                src={selectedCulinary.imageUrl}
                alt={selectedCulinary.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="bg-white text-black font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">
                  {lang === 'en' && selectedCulinary.typeEn ? selectedCulinary.typeEn : selectedCulinary.type}
                </span>
                <h3 className="font-orbitron font-bold text-base uppercase text-white pt-1 drop-shadow-xs">
                  {lang === 'en' && selectedCulinary.titleEn ? selectedCulinary.titleEn : selectedCulinary.title}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-jakarta text-xs text-gray-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {lang === 'en' ? 'Origin:' : 'Asal:'} {lang === 'en' && selectedCulinary.originEn ? selectedCulinary.originEn : selectedCulinary.origin}
              </p>
            </div>

            <p className="font-jakarta text-xs text-gray-700 leading-relaxed pt-2 border-t border-gray-100">
              {lang === 'en' && selectedCulinary.descriptionEn ? selectedCulinary.descriptionEn : selectedCulinary.description}
            </p>

            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center">
              <span className="font-jakarta font-bold text-xs uppercase text-black tracking-wider">
                {lang === 'en' ? 'Flavor Profile:' : 'Profil Rasa:'}
              </span>
              <span className="text-gray-600 font-jakarta text-xs">{lang === 'en' && selectedCulinary.flavorProfileEn ? selectedCulinary.flavorProfileEn : selectedCulinary.flavorProfile}</span>
            </div>

            {getGoogleMapsUrl(selectedCulinary.mapUrl) && (
              <a
                href={getGoogleMapsUrl(selectedCulinary.mapUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2 shadow-xs"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{translations[lang].btnOpenMap}</span>
              </a>
            )}

            {selectedCulinary.videoUrl && (
              <a
                href={selectedCulinary.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF0000] text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-red-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2"
              >
                <Youtube className="w-4 h-4" />
                {lang === 'en' ? 'Watch Video (YouTube)' : 'Tonton Video (YouTube)'}
              </a>
            )}

            <button
              onClick={() => setSelectedCulinary(null)}
              className="w-full bg-black text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {translations[lang].btnClose}
            </button>
          </div>
        </div>
      )}

      {/* MODAL INFORMATION DIALOG FOR EVENTS */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 animate-scale-up space-y-4 p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="-mx-6 -mt-6 mb-4 h-48 overflow-hidden bg-gray-100 relative">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <span className="bg-white text-black font-jakarta font-bold text-[9px] uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1 w-max">
                  <Calendar className="w-3 h-3" />
                  {lang === 'en' && selectedEvent.scheduleEn ? selectedEvent.scheduleEn : selectedEvent.schedule}
                </span>
                <h3 className="font-orbitron font-bold text-base uppercase text-white pt-1 drop-shadow-xs">
                  {lang === 'en' && selectedEvent.titleEn ? selectedEvent.titleEn : selectedEvent.title}
                </h3>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-jakarta text-xs text-gray-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {lang === 'en' && selectedEvent.locationEn ? selectedEvent.locationEn : selectedEvent.location}
              </p>
            </div>

            <p className="font-jakarta text-xs text-gray-700 leading-relaxed pt-2 border-t border-gray-100">
              {lang === 'en' && selectedEvent.descriptionEn ? selectedEvent.descriptionEn : selectedEvent.description}
            </p>

            {getGoogleMapsUrl(selectedEvent.mapUrl) && (
              <a
                href={getGoogleMapsUrl(selectedEvent.mapUrl)!}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-blue-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2 shadow-xs"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>{translations[lang].btnOpenMap}</span>
              </a>
            )}

            {selectedEvent.videoUrl && (
              <a
                href={selectedEvent.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#FF0000] text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-red-700 transition-colors cursor-pointer flex justify-center items-center gap-2 mt-2"
              >
                <Youtube className="w-4 h-4" />
                {lang === 'en' ? 'Watch Video (YouTube)' : 'Tonton Video (YouTube)'}
              </a>
            )}

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full bg-black text-white py-2.5 rounded-lg font-jakarta font-bold uppercase text-xs hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {translations[lang].btnClose}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
