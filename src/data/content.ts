import { Destination, CultureItem, CulinaryItem, EventItem, DownloadItem, HotInfoItem } from '../types';

export const RAW_BG_IMAGE_1 = "https://drive.google.com/file/d/15YQ1KiIdWOO216udJAHNZP4dmR5CNKf-/view?usp=drive_link";
export const RAW_BG_IMAGE_2 = "https://drive.google.com/file/d/1sKE9Y3NKIh6wwIQMsy5zYEQtROna5H1f/view?usp=drive_link";

export function getDirectDriveUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:')) return url;
  // Match /file/d/ID or id=ID
  const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) {
    return `https://lh3.googleusercontent.com/d/${matchFileD[1]}`;
  }
  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) {
    return `https://lh3.googleusercontent.com/d/${matchIdParam[1]}`;
  }
  return url;
}

export const BG_IMAGE_1 = getDirectDriveUrl(RAW_BG_IMAGE_1);
export const BG_IMAGE_2 = getDirectDriveUrl(RAW_BG_IMAGE_2);

export const HOT_INFO_ITEMS: HotInfoItem[] = [
  {
    id: 'hi1',
    title: 'Peringatan Cuaca & Update Jalur Kelok 9',
    category: 'Cuaca & Jalur',
    date: 'Hari Ini, 16:30 WIB',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    description: 'Jalur utama Bukittinggi - Payakumbuh via Kelok 9 terpantau ramai lancar. BMKG Minangkabau memprakirakan potensi hujan ringan sore hingga malam hari. Pengendara diimbau berhati-hati.',
    tag: 'Penting',
    actionUrl: 'https://maps.google.com/?q=Kelok+9+Sumatera+Barat',
  },
  {
    id: 'hi2',
    title: 'Bazar Kuliner Rendang & Festival Budaya Minang 2026',
    category: 'Event Mendatang',
    date: '12 - 15 Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description: 'Pesta ragam olahan Rendang Minang dari 19 Kabupaten/Kota bertempat di Pelataran Jam Gadang Bukittinggi. Menampilkan 100 varian rendang dan pertunjukan musik Saluang & Pacu Jawi.',
    tag: 'Festival',
    actionUrl: 'https://maps.google.com/?q=Jam+Gadang+Bukittinggi',
  },
  {
    id: 'hi3',
    title: 'Wisata Bahari Mentawai: Puncak Musim Surfing 2026',
    category: 'Berita Utama',
    date: 'Agustus - Oktober 2026',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    description: 'Gelombang ombak kelas dunia di Pulau Sipora & Siberut Mentawai memasuki puncak musim surfing. Kapal Cepat Mentawai Fast melayani pelayaran reguler dari Pelabuhan Muaro Padang.',
    tag: 'Surfing',
    actionUrl: 'https://maps.google.com/?q=Pelabuhan+Muaro+Padang',
  },
  {
    id: 'hi4',
    title: 'Himbauan Pendakian & Rekomendasi Jalur Aman Gunung Marapi',
    category: 'Himbauan Wisata',
    date: 'Update Resmi BPBD',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Pendakian Gunung Marapi direkomendasikan terbatas hingga radius aman 3 km dari kawah utama. Wisatawan disarankan mengunjungi alternatif destinasi Lembah Harau dan Gunung Singgalang.',
    tag: 'BPBD Info',
    actionUrl: 'https://maps.google.com/?q=Lembah+Harau+Sumatera+Barat',
  },
  {
    id: 'hi5',
    title: 'Peresmian Spot Glamping & Shuttle Listrik Harau Sky',
    category: 'Berita Utama',
    date: 'Agustus 2026',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    description: 'Kawasan wisata Lembah Harau meresmikan 15 unit Glamping ramah lingkungan berlatar tebing granit 300m dengan armada shuttle listrik gratis untuk pengunjung.',
    tag: 'Destinasi Baru',
    actionUrl: 'https://maps.google.com/?q=Lembah+Harau+Payakumbuh',
  },
];

export const DOWNLOAD_ITEMS: DownloadItem[] = [
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

export const DESTINATIONS: Destination[] = [
  {
    id: 'd1',
    title: 'JAM GADANG & HIGHLAND BUKITTINGGI',
    titleEn: 'JAM GADANG CLOCK TOWER & HIGHLAND BUKITTINGGI',
    category: 'Danau & Gunung',
    categoryEn: 'Lakes & Mountains',
    regency: 'Kota Bukittinggi',
    tag: 'IKON SEJARAH & HERITAGE',
    tagEn: 'HISTORIC ICON & HERITAGE',
    description: 'Menara jam megah berkubah khas Rumah Gadang setinggi 26 meter yang didirikan tahun 1926. Dikelilingi udara sejuk pegunungan Marapi dan Singgalang, pasar seni, dan benteng bersejarah.',
    descriptionEn: 'A magnificent 26-meter clock tower featuring a traditional Rumah Gadang roof built in 1926. Surrounded by cool mountain air from Mount Marapi and Singgalang, art markets, and historic fortresses.',
    highlights: ['Menara Jam Abad ke-20 dengan Mesin Langka Vortmann', 'Panorama Gunung Singgalang & Marapi', 'Pusat Kuliner Nasi Kapau Pasar Atas'],
    highlightsEn: ['20th Century Clock Tower with Rare Vortmann Engine', 'Panoramic Views of Mount Singgalang & Marapi', 'Pasar Atas Nasi Kapau Culinary Hub'],
    bestTime: 'Sepanjang Tahun (Pagi & Malam Hari)',
    bestTimeEn: 'Year-round (Morning & Evening)',
    locationDetails: 'Pusat Kota Bukittinggi, Sumatera Barat',
    locationDetailsEn: 'Bukittinggi City Center, West Sumatra',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    mapUrl: 'https://maps.google.com/?q=Jam+Gadang+Bukittinggi',
  },
  {
    id: 'd2',
    title: 'LEMBAH HARAU & TEBING GRANIT CANYON',
    titleEn: 'HARAU VALLEY & GRANITE CLIFF CANYON',
    category: 'Lembah & Geopark',
    categoryEn: 'Valleys & Geoparks',
    regency: 'Kabupaten Lima Puluh Kota',
    tag: 'SURGA TEBING GRANIT',
    tagEn: 'GRANITE CLIFF PARADISE',
    description: 'Lembah hijau subur yang dijepit oleh tebing-tebing batu granit vertikal setinggi 100 hingga 300 meter. Memiliki belasan air terjun alami dan pemandangan persawahan nan asri.',
    descriptionEn: 'A lush green valley flanked by vertical granite cliffs towering 100 to 300 meters high. Features numerous natural waterfalls and scenic rice fields.',
    highlights: ['Panjat Tebing & Trekking Canyon', 'Air Terjun Sarasah Bunta & Aka Barayun', 'Sawah Subur di Kaki Tebing Granit'],
    highlightsEn: ['Rock Climbing & Canyon Trekking', 'Sarasah Bunta & Aka Barayun Waterfalls', 'Fertile Rice Fields at Granite Footsteps'],
    bestTime: 'Mei - Oktober (Musim Cerah)',
    bestTimeEn: 'May - October (Dry Season)',
    locationDetails: 'Kecamatan Harau, Lima Puluh Kota',
    locationDetailsEn: 'Harau District, Lima Puluh Kota',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    mapUrl: 'https://maps.google.com/?q=Lembah+Harau+Payakumbuh',
  },
  {
    id: 'd3',
    title: 'DANAU MANINJAU & RUTE KELOK 44',
    titleEn: 'LAKE MANINJAU & KELOK 44 ROUTE',
    category: 'Danau & Gunung',
    categoryEn: 'Lakes & Mountains',
    regency: 'Kabupaten Agam',
    tag: 'KALDERA VULKANIK PURBA',
    tagEn: 'ANCIENT VOLCANIC CALDERA',
    description: 'Danau kaldera vulkanik seluas 99.5 km² yang tenang dan memukau. Sensasi perjalanan melintasi rute spektakuler Kelok 44 dengan tingkatan tikungan tajam dan pemandangan danau dari ketinggian.',
    descriptionEn: 'A serene 99.5 km² volcanic caldera lake. Experience the exhilarating drive along the iconic 44 hairpin curves of Kelok 44 offering breathtaking lake views from above.',
    highlights: ['Puncak Lawang untuk Paragliding terbaik', 'Keindahan Kelok 44 nan ikonik', 'Matahari Terbenam Danau Kaldera'],
    highlightsEn: ['Puncak Lawang for World-class Paragliding', 'Iconic Winding Kelok 44 Mountain Pass', 'Spectacular Caldera Sunset Views'],
    bestTime: 'Pagi Hari & Sore Hari',
    bestTimeEn: 'Morning & Late Afternoon',
    locationDetails: 'Kecamatan Tanjung Raya, Agam',
    locationDetailsEn: 'Tanjung Raya District, Agam',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd4',
    title: 'KEPULAUAN MENTAWAI & SURF SANCTUARY',
    titleEn: 'MENTAWAI ISLANDS & SURF SANCTUARY',
    category: 'Pantai & Bahari',
    categoryEn: 'Beaches & Marine',
    regency: 'Kabupaten Kepulauan Mentawai',
    tag: 'SURGA SELANCAR DUNIA',
    tagEn: 'WORLD SURFING HAVEN',
    description: 'Kepulauan eksotis dengan ombak kelas dunia (Mentawai Wave Sanctuary) serta kebudayaan suku asli Mentawai (Sikerei) yang masih memegang teguh tradisi tato tertua di dunia.',
    descriptionEn: 'Exotic islands renowned for world-class surf breaks and the indigenous Mentawai tribe (Sikerei) preserving one of the world\'s oldest tattooing traditions.',
    highlights: ['Ombak Kelas Dunia (Lance’s Right, HTs, Macaronis)', 'Ekowisata Budaya Suku Mentawai & Sikerei', 'Hutan Hujan Tropis & Pantai Perawan'],
    highlightsEn: ['World-class Surf Breaks (Lance\'s Right, HTs, Macaronis)', 'Mentawai Indigenous Culture & Sikerei Eco-tourism', 'Pristine Rainforests & Unspoiled Beaches'],
    bestTime: 'April - Oktober (Peak Swell Season)',
    bestTimeEn: 'April - October (Peak Swell Season)',
    locationDetails: 'Kepulauan Mentawai, Samudra Hindia',
    locationDetailsEn: 'Mentawai Archipelago, Indian Ocean',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd5',
    title: 'NAGARI PARIANGAN DESA TERINDAH',
    titleEn: 'NAGARI PARIANGAN HERITAGE VILLAGE',
    category: 'Desa Wisata',
    categoryEn: 'Heritage Villages',
    regency: 'Kabupaten Tanah Datar',
    tag: 'DESA TERTUA MINANGKABAU',
    tagEn: 'OLDEST MINANGKABAU VILLAGE',
    description: 'Dinobatkan sebagai salah satu Desa Terindah di Dunia. Terletak di lereng Gunung Marapi dengan arsitektur Rumah Gadang kayu berusia ratusan tahun dan pemandian air panas alami.',
    descriptionEn: 'Voted one of the most beautiful villages in the world. Nestled on Mount Marapi\'s slope with centuries-old wooden Rumah Gadang architecture and natural hot springs.',
    highlights: ['Masjid Tua Pariangan Arsitektur Kayu', 'Sawah Berpundak di Lereng Marapi', 'Situs Sejarah Asal Usul Orang Minang'],
    highlightsEn: ['Historic Wooden Architecture Mosque', 'Terraced Rice Fields on Mount Marapi Slopes', 'Cradle of Minangkabau Civilization'],
    bestTime: 'Pagi Hari (07:00 - 11:00)',
    bestTimeEn: 'Morning (07:00 - 11:00 AM)',
    locationDetails: 'Kecamatan Pariangan, Tanah Datar',
    locationDetailsEn: 'Pariangan District, Tanah Datar',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd6',
    title: 'DANAU DIATAS & DANAU DIBAWAH ALAHAN PANJANG',
    titleEn: 'TWIN LAKES DANAU DIATAS & DIBAWAH',
    category: 'Danau & Gunung',
    categoryEn: 'Lakes & Mountains',
    regency: 'Kabupaten Solok',
    tag: 'DANAU KEMBAR HIGHLAND',
    tagEn: 'HIGHLAND TWIN LAKES',
    description: 'Dua danau berdampingan di dataran tinggi Alahan Panjang dengan suhu udara dingin ala Eropa, hamparan kebun teh hijau yang membentang luas, dan kebun hortikultura.',
    descriptionEn: 'Twin side-by-side lakes in the cool Alahan Panjang highlands featuring European-like climate, vast green tea plantations, and vibrant flower farms.',
    highlights: ['Kebun Teh Kayu Aro & Danau Kembar', 'Camping Ground Tepi Danau', 'Pemandangan Bunga Hortensia & Gunung Talang'],
    highlightsEn: ['Kayu Aro Tea Estates & Twin Lakes', 'Lakeside Camping Grounds', 'Hydrangea Blossoms & Mount Talang Views'],
    bestTime: 'Juli - November',
    bestTimeEn: 'July - November',
    locationDetails: 'Alahan Panjang, Kabupaten Solok',
    locationDetailsEn: 'Alahan Panjang, Solok Regency',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
  },
  {
    id: 'd7',
    title: 'GEOPARK SILOKEK & SUNGAI BATANG KUANTAN',
    titleEn: 'SILOKEK GEOPARK & BATANG KUANTAN RIVER',
    category: 'Lembah & Geopark',
    categoryEn: 'Valleys & Geoparks',
    regency: 'Kabupaten Sijunjung',
    tag: 'WARISAN GEOLOGI DUNIA',
    tagEn: 'WORLD GEOLOGICAL HERITAGE',
    description: 'Kawasan Geopark Nasional bertema batuan purba berusia ratusan juta tahun, arung jeram di Sungai Batang Kuantan, serta gua karst kuno dengan lanskap hutan lindung.',
    descriptionEn: 'National Geopark featuring ancient rock formations dating back hundreds of millions of years, white-water rafting on Batang Kuantan River, and karst caves.',
    highlights: ['Batuan Purba Karst & Gua Silokek', 'Arung Jeram Batang Kuantan', 'Perkampungan Adat Sijunjung'],
    highlightsEn: ['Ancient Karst Formations & Silokek Caves', 'Batang Kuantan White Water Rafting', 'Sijunjung Traditional Heritage Village'],
    bestTime: 'Mei - September',
    bestTimeEn: 'May - September',
    locationDetails: 'Kecamatan Sijunjung, Sijunjung',
    locationDetailsEn: 'Sijunjung District, Sijunjung',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
  },
  {
    id: 'd8',
    title: 'PANTAI CAROCOK & PULAU MANDEH',
    titleEn: 'CAROCOK BEACH & MANDEH ISLANDS',
    category: 'Pantai & Bahari',
    categoryEn: 'Beaches & Marine',
    regency: 'Kabupaten Pesisir Selatan',
    tag: 'RAJA AMPAT-NYA SUMBAR',
    tagEn: 'RAJA AMPAT OF WEST SUMATRA',
    description: 'Gugusan pulau-pulau karang hijau tenang (Kawasan Wisata Bahari Terpadu Mandeh) yang dijuluki Raja Ampat Sumatera Barat, ideal untuk snorkeling, diving, dan island hopping.',
    descriptionEn: 'A pristine archipelago of lush emerald islands known as the Raja Ampat of West Sumatra, perfect for snorkeling, diving, and island hopping.',
    highlights: ['Puncak Mandeh & Island Hopping', 'Snorkeling Pulau Cubadak & Kapo-Kapo', 'Situs Jet Ski & Cliff Jumping'],
    highlightsEn: ['Mandeh Peak & Island Hopping Tours', 'Cubadak & Kapo-Kapo Island Snorkeling', 'Jet Skiing & Cliff Jumping Spots'],
    bestTime: 'Maret - Oktober',
    bestTimeEn: 'March - October',
    locationDetails: 'Tarusan, Pesisir Selatan',
    locationDetailsEn: 'Tarusan, Pesisir Selatan',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  }
];

export const CULTURE_ITEMS: CultureItem[] = [
  {
    id: 'c1',
    title: 'RUMAH GADANG & ARSITEKTUR GONJONG',
    titleEn: 'RUMAH GADANG & GONJONG ARCHITECTURE',
    category: 'Arsitektur',
    categoryEn: 'Architecture',
    description: 'Rumah adat khas Minangkabau dengan atap melengkung runcing menyerupai tanduk kerbau (Gonjong). Dibuat dari kayu tanpa paku besi sehingga tahan terhadap gempa bumi.',
    descriptionEn: 'Traditional Minangkabau house with curved pointed roofs mimicking buffalo horns (Gonjong). Constructed from timber without iron nails, making it earthquake-resistant.',
    philosophy: 'Alam Takambang Jadi Guru (Belajar dari hukum keseimbangan alam)',
    philosophyEn: 'Alam Takambang Jadi Guru (Nature as the ultimate teacher of natural balance)',
    origin: 'Ranah Minangkabau',
    originEn: 'Minangkabau Realm',
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c2',
    title: 'TARI PASAMBAHAN & TARI PIRING',
    titleEn: 'PASAMBAHAN & PIRING PLATE DANCE',
    category: 'Tari & Musik',
    categoryEn: 'Dance & Music',
    description: 'Tari Pasambahan dipersembahkan sebagai penghormatan menyambut tamu agung. Tari Piring menampilkan ketangkasan menari membawa piring porselen di atas pecahan kaca.',
    descriptionEn: 'Tari Pasambahan is performed to welcome honored guests. Tari Piring demonstrates dance agility balancing porcelain plates over broken glass.',
    philosophy: 'Budi baik dan rasa syukur atas hasil panen negeri',
    philosophyEn: 'Virtue, honor, and gratitude for plentiful harvests',
    origin: 'Solok & Minangkabau',
    originEn: 'Solok & Minangkabau',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c3',
    title: 'SILEK MINANGKABAU (SENI BELADIRI)',
    titleEn: 'SILEK MINANGKABAU (MARTIAL ARTS)',
    category: 'Seni Beladiri',
    categoryEn: 'Martial Arts',
    description: 'Seni bela diri tradisional Minangkabau yang berakar pada ketangkasan fisikal dan kerohanian (Silek Harimau, Silek Tuo, Silek Laku). Bermanfaat membela diri dan menjaga marwah.',
    descriptionEn: 'Traditional Minangkabau martial art combining agility and spiritual discipline (Silek Harimau, Silek Tuo). Used for self-defense and maintaining dignity.',
    philosophy: 'Lahir Silek Mahanan Musuah, Batin Silek Mahanan Diri',
    philosophyEn: 'Physical Silek deflects enemies, spiritual Silek masters the self',
    origin: 'Luhak Nan Tigo',
    originEn: 'Luhak Nan Tigo',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c4',
    title: 'SONGKET PANDAI SIKEK & TENUN SILUNGKANG',
    titleEn: 'PANDAI SIKEK & SILUNGKANG SONGKET WEAVING',
    category: 'Kain & Kerajinan',
    categoryEn: 'Textiles & Crafts',
    description: 'Kain tenun mewah bertahtakan benang emas dan perak bermotif ukiran Minang seperti Batang Pinang, Kaluak Paku, dan Bunga Lada. Dibuat secara manual selama berbulan-bulan.',
    descriptionEn: 'Luxurious woven brocade embedded with gold and silver threads featuring traditional Minang motifs. Handwoven painstakingly over months.',
    philosophy: 'Ketelitian, kerapian, dan keagungan martabat wanita Minang',
    philosophyEn: 'Precision, elegance, and the nobility of Minangkabau women',
    origin: 'Pandai Sikek & Silungkang',
    originEn: 'Pandai Sikek & Silungkang',
    imageUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c5',
    title: 'SISTEM MATRILINEAL MINANGKABAU',
    titleEn: 'MINANGKABAU MATRILINEAL SYSTEM',
    category: 'Tradisi Adat',
    categoryEn: 'Customs & Traditions',
    description: 'Sistem kekerabatan unik dan terbesar di dunia yang memperhitungkan garis keturunan dari pihak ibu (Matrilineal), di mana harta pusaka tinggi diwariskan kepada kaum perempuan.',
    descriptionEn: 'The world\'s largest matrilineal kinship system where lineage and ancestral property are inherited through the female lineage.',
    philosophy: 'Memprioritaskan perlindungan dan penghormatan kepada Ibu & Wanita',
    philosophyEn: 'Prioritizing protection, honor, and respect for mothers and women',
    origin: 'Sumatera Barat',
    originEn: 'West Sumatra',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  }
];

export const CULINARY_ITEMS: CulinaryItem[] = [
  {
    id: 'cul1',
    title: 'RENDANG MINANGKABAU',
    titleEn: 'MINANGKABAU BEEF RENDANG',
    type: 'Makanan Utama',
    typeEn: 'Main Course',
    origin: 'Payakumbuh & Tanah Datar',
    originEn: 'Payakumbuh & Tanah Datar',
    description: 'Daging sapi yang dimasak perlahan selama 8 jam dalam santan kelapa dan rempah-rempah autentik hingga berwarna hitam pekat. Diakui UNESCO sebagai warisan budaya kuliner dunia.',
    descriptionEn: 'Tender beef slow-cooked for 8 hours in coconut milk and authentic spices until rich, dark, and caramelized. UNESCO recognized world culinary heritage.',
    flavorProfile: 'Gurih, kaya rempah lengkuas & serai, legit, tahan lama tanpa pengawet.',
    flavorProfileEn: 'Savory, aromatic lemongrass & galangal spices, rich, naturally preserved.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul2',
    title: 'SATE PADANG KUAH REMPAH',
    titleEn: 'SPICED PADANG SATAY',
    type: 'Makanan Utama',
    typeEn: 'Main Course',
    origin: 'Padang Panjang & Pariaman',
    originEn: 'Padang Panjang & Pariaman',
    description: 'Daging lidah atau usus sapi berkuah kental rempah kuah kuning (Padang Panjang) atau kuah merah pedas (Pariaman) disajikan dengan ketupat dan taburan bawang goreng renyah.',
    descriptionEn: 'Grilled beef tongue skewers served in thick yellow or red spiced gravy over rice cakes topped with crispy shallots.',
    flavorProfile: 'Pedas hangat rempah kunyit, jintan, kapulaga, & ketumbar.',
    flavorProfileEn: 'Warm spicy turmeric, cumin, cardamom, and coriander broth.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul3',
    title: 'TEH TALUA (TEH TELUR ADAT)',
    titleEn: 'TEH TALUA (EGG SPICED TEA)',
    type: 'Minuman Tradisional',
    typeEn: 'Traditional Beverage',
    origin: 'Sumatera Barat',
    originEn: 'West Sumatra',
    description: 'Minuman stamina khas pria Minang hasil racikan kuning telur ayam kampung yang dikocok kental bersama gula dan disiram teh pekat mendidih serta perasan jeruk nipis.',
    descriptionEn: 'Traditional stamina tea made by whipping free-range egg yolk with sugar, poured with boiling black tea and a touch of calamansi lime.',
    flavorProfile: 'Manis gurih, creamy berbuih tebal, segar tanpa bau amis.',
    flavorProfileEn: 'Sweet, savory, thick creamy foam with a fresh lime accent.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul4',
    title: 'NASI KAPAU BUKITTINGGI',
    titleEn: 'NASI KAPAU BUKITTINGGI',
    type: 'Makanan Utama',
    typeEn: 'Main Course',
    origin: 'Nagari Kapau, Agam',
    originEn: 'Nagari Kapau, Agam',
    description: 'Nasi khas dengan gulai tambusu (usus isi telur), gulai kapau berdaging tebal, dan rebusan nangka serta kacang panjang yang disajikan bertingkat ala meja Kapau.',
    descriptionEn: 'Steamed rice served with egg-stuffed intestine curry (Tambusu), jackfruit curry, and vibrant Minangkabau spiced dishes.',
    flavorProfile: 'Sangat gurih, asam pedas segar dari rempah kunyit dan santan kental.',
    flavorProfileEn: 'Richly savory, zesty spicy turmeric and thick coconut milk.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul5',
    title: 'LAMANG TAPAI & KIPANG KACANG',
    titleEn: 'LAMANG TAPAI & PEANUT KIPANG',
    type: 'Kudapan Khas',
    typeEn: 'Traditional Snack',
    origin: 'Batusangkar & Tanah Datar',
    originEn: 'Batusangkar & Tanah Datar',
    description: 'Beras ketan yang dibakar dalam selongsong bambu berlapis daun pisang (Lamang) disajikan bersama tape ketan hitam manis berbuih (Tapai).',
    descriptionEn: 'Glutinous rice roasted in banana-lined bamboo stalks (Lamang) paired with sweet fermented black sticky rice (Tapai).',
    flavorProfile: 'Perpaduan manis, gurih legit bambu, dan asam manis menyegarkan.',
    flavorProfileEn: 'Harmonious blend of sweet, aromatic smoky bamboo, and tangy fermented notes.',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  }
];

export const EVENTS_SCHEDULE: EventItem[] = [
  {
    id: 'ev1',
    title: 'PACU JAWI (ATRAKSI BALAP SAPI LUMPUR)',
    titleEn: 'PACU JAWI (MUD BULL RACE ATTRACTION)',
    schedule: 'Setiap Akhir Pekan (Bergilir)',
    scheduleEn: 'Every Weekend (Rotational)',
    location: 'Sawah Nagari Tanah Datar (Sungai Tarab, Pariangan)',
    locationEn: 'Tanah Datar Rice Fields (Sungai Tarab, Pariangan)',
    description: 'Atraksi budaya unik di mana joki memegang ekor dua ekor sapi sambil berlari kencang membelah sawah basah berlumpur tanpa cambuk.',
    descriptionEn: 'Spectacular traditional spectacle where a jockey holds onto the tails of two bulls racing through muddy post-harvest rice fields.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev2',
    title: 'FESTIVAL TOUR DE SINGKARAK',
    titleEn: 'TOUR DE SINGKARAK FESTIVAL',
    schedule: 'Tahunan (Oktober / November)',
    scheduleEn: 'Annual (October / November)',
    location: 'Lintas Kabupaten/Kota Sumatera Barat',
    locationEn: 'Across West Sumatra Regencies & Cities',
    description: 'Ajang balap sepeda internasional bergengsi gabungan olahraga dan promosi wisata alam melintasi Danau Singkarak, Kelok 44, dan Lembah Harau.',
    descriptionEn: 'Prestigious UCI international cycling race showcasing breathtaking landscapes across Lake Singkarak, Kelok 44, and Harau Valley.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev3',
    title: 'FESTIVAL TABUIK PARIAMAN',
    titleEn: 'PARIAMAN TABUIK FESTIVAL',
    schedule: '1 - 10 Muharram',
    scheduleEn: '1st - 10th Muharram',
    location: 'Kota Pariaman & Pantai Gandoriah',
    locationEn: 'Pariaman City & Gandoriah Beach',
    description: 'Upacara kolosal budaya memperingati Hari Asyura dengan mengarak menara Tabuik megah setinggi 12 meter sebelum dilarung ke lautan.',
    descriptionEn: 'Grand cultural festival carrying towering 12-meter decorative Tabuik structures before immersion into the ocean.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev4',
    title: 'FESTIVAL MAANTA SANI & PACU ITIK',
    titleEn: 'PACU ITIK DUCK FLYING RACE FESTIVAL',
    schedule: 'Juli - Agustus',
    scheduleEn: 'July - August',
    location: 'Payakumbuh & Lima Puluh Kota',
    locationEn: 'Payakumbuh & Lima Puluh Kota',
    description: 'Perlombaan terbang burung itik lokal yang terlatih terbang melintasi jarak 800 meter serta pesta kesenian tari Minang tradisi.',
    descriptionEn: 'Unique traditional racing festival featuring trained local ducks flying over distances up to 800 meters.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  }
];
