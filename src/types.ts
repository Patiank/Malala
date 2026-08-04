export type DrawerType =
  | 'destinations'  // Wisata Alam & Populer
  | 'culture'       // Seni & Budaya Minangkabau
  | 'culinary'      // Wisata Kuliner & Rendang
  | 'events'        // Festival & Event Pariwisata
  | 'formai'        // FormAI / AI Tourism Assistant
  | 'saved'         // Destinasi Favorit Disimpan
  | 'admin'
  | 'hotinfo'       // Hot Info / Update Berita Wisata
  | 'download'      // Unduh Asset, Booklet, Leaflet, Flyer
  | 'map'           // Peta Interaktif Sumatera Barat
  | null;

export interface Destination {
  id: string;
  title: string;
  titleEn?: string;
  category: 'Alam' | 'Danau & Gunung' | 'Lembah & Geopark' | 'Pantai & Bahari' | 'Desa Wisata';
  categoryEn?: string;
  regency: string; // e.g. Bukittinggi, Tanah Datar, Mentawai, Solok, Limapuluh Kota
  tag: string;
  tagEn?: string;
  description: string;
  descriptionEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  bestTime: string;
  bestTimeEn?: string;
  locationDetails: string;
  locationDetailsEn?: string;
  imageUrl: string;
  isPopular?: boolean;
  videoUrl?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}

export interface CultureItem {
  id: string;
  title: string;
  titleEn?: string;
  category: 'Arsitektur' | 'Tari & Musik' | 'Seni Beladiri' | 'Kain & Kerajinan' | 'Tradisi Adat';
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  philosophy: string;
  philosophyEn?: string;
  origin: string;
  originEn?: string;
  imageUrl: string;
  videoUrl?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}

export interface CulinaryItem {
  id: string;
  title: string;
  titleEn?: string;
  type: 'Makanan Utama' | 'Minuman Tradisional' | 'Kudapan Khas';
  typeEn?: string;
  origin: string;
  originEn?: string;
  description: string;
  descriptionEn?: string;
  flavorProfile: string;
  flavorProfileEn?: string;
  imageUrl: string;
  videoUrl?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}

export interface EventItem {
  id: string;
  title: string;
  titleEn?: string;
  schedule: string;
  scheduleEn?: string;
  location: string;
  locationEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl: string;
  videoUrl?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}

export interface DownloadItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  type: string;
  typeEn?: string;
  size: string;
  description: string;
  descriptionEn?: string;
  filename: string;
  content: string;
  mimeType: string;
}

export interface HotInfoItem {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  dateEn?: string;
  category: string;
  categoryEn?: string;
  description: string;
  descriptionEn?: string;
  imageUrl?: string;
  tag?: string;
  tagEn?: string;
  actionUrl?: string;
}

export interface AppSettings {
  bgMediaType?: 'image' | 'video';
  baseImage?: string;
  revealImage?: string;
  baseVideo?: string;
}

export interface FormAIItineraryActivity {
  time: string;
  location: string;
  activity: string;
  tips: string;
}

export interface FormAIItineraryDay {
  day: number;
  title: string;
  activities: FormAIItineraryActivity[];
  culinaryRecommendation: string;
}

export interface FormAIResponse {
  title: string;
  summary: string;
  itinerary: FormAIItineraryDay[];
  localTips: string[];
}

export interface ToastNotice {
  id: string;
  message: string;
}

export type KategoriWisatawan =
  | "individu"
  | "pasangan"
  | "keluarga_anak"
  | "lansia"
  | "disabilitas"
  | "rombongan";

export type AsalWisatawan = "domestik" | "mancanegara";

export type MinatWisata =
  | "alam"
  | "budaya_sejarah"
  | "religi"
  | "kuliner"
  | "petualangan"
  | "edukasi";

export type TingkatAktivitas = "santai" | "sedang" | "ekstrem";

export type ModaTransportasi =
  | "kendaraan_pribadi"
  | "sewa_mobil"
  | "transportasi_umum";

export type RentangBudget = "hemat" | "menengah" | "mewah";

export type JenisAkomodasi = "hotel" | "homestay" | "resort";

export type FormatItinerary = "per_jam" | "per_hari" | "fleksibel";

export interface ProfilWisatawan {
  jumlahOrang: number;
  kategori: KategoriWisatawan;
  asal: AsalWisatawan;
}

export interface PreferensiMinat {
  kategoriWisata: MinatWisata[];
  tingkatAktivitas: TingkatAktivitas;
  suasanaRamai: boolean;
}

export interface Logistik {
  titikKeberangkatan: string;
  moda: ModaTransportasi;
  radiusMaksimalKm: number;
}

export interface Anggaran {
  rentang: RentangBudget;
  alokasi: {
    akomodasiPersen: number;
    makanPersen: number;
    tiketPersen: number;
    transportasiPersen: number;
  };
}

export interface Akomodasi {
  jenis: JenisAkomodasi[];
  lokasiPreferensi: string;
}

export interface WaktuKunjungan {
  tanggalMulai: string;
  tanggalSelesai: string;
}

export interface KebutuhanKhusus {
  preferensiMakanan: string[];
  alergiMakanan: string[];
  aksesibilitasFisik: boolean;
}

export interface OutputPreferensi {
  formatItinerary: FormatItinerary;
  tingkatDetail: "hanya_destinasi_utama" | "lengkap_kuliner_oleholeh";
}

export interface ItineraryFormState {
  durasiHari: number;
  profilWisatawan: ProfilWisatawan;
  preferensiMinat: PreferensiMinat;
  logistik: Logistik;
  anggaran: Anggaran;
  akomodasi: Akomodasi;
  waktuKunjungan: WaktuKunjungan;
  kebutuhanKhusus: KebutuhanKhusus;
  outputPreferensi: OutputPreferensi;
}
