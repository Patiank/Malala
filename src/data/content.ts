import { Destination, CultureItem, CulinaryItem, EventItem, DownloadItem, HotInfoItem } from '../types';

export const RAW_BG_IMAGE_1 = "https://drive.google.com/file/d/15YQ1KiIdWOO216udJAHNZP4dmR5CNKf-/view?usp=drive_link";
export const RAW_BG_IMAGE_2 = "https://drive.google.com/file/d/1sKE9Y3NKIh6wwIQMsy5zYEQtROna5H1f/view?usp=drive_link";

export function getDirectDriveUrl(url: string): string {
  if (!url) return '';
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
    category: 'Danau & Gunung',
    regency: 'Kota Bukittinggi',
    tag: 'IKON SEJARAH & HERITAGE',
    description: 'Menara jam megah berkubah khas Rumah Gadang setinggi 26 meter yang didirikan tahun 1926. Dikelilingi udara sejuk pegunungan Marapi dan Singgalang, pasar seni, dan benteng bersejarah.',
    highlights: ['Menara Jam Abad ke-20 dengan Mesin Langka Vortmann', 'Panorama Gunung Singgalang & Marapi', 'Pusat Kuliner Nasi Kapau Pasar Atas'],
    bestTime: 'Sepanjang Tahun (Pagi & Malam Hari)',
    locationDetails: 'Pusat Kota Bukittinggi, Sumatera Barat',
    imageUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    mapUrl: 'https://maps.google.com/?q=Jam+Gadang+Bukittinggi',
  },
  {
    id: 'd2',
    title: 'LEMBAH HARAU & TEBING GRANIT CANYON',
    category: 'Lembah & Geopark',
    regency: 'Kabupaten Lima Puluh Kota',
    tag: 'SURGA TEBING GRANIT',
    description: 'Lembah hijau subur yang dijepit oleh tebing-tebing batu granit vertikal setinggi 100 hingga 300 meter. Memiliki belasan air terjun alami dan pemandangan persawahan nan asri.',
    highlights: ['Panjat Tebing & Trekking Canyon', 'Air Terjun Sarasah Bunta & Aka Barayun', 'Sawah Subur di Kaki Tebing Granit'],
    bestTime: 'Mei - Oktober (Musim Cerah)',
    locationDetails: 'Kecamatan Harau, Lima Puluh Kota',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    mapUrl: 'https://maps.google.com/?q=Lembah+Harau+Payakumbuh',
  },
  {
    id: 'd3',
    title: 'DANAU MANINJAU & RUTE KELOK 44',
    category: 'Danau & Gunung',
    regency: 'Kabupaten Agam',
    tag: 'KALDERA VULKANIK PURBA',
    description: 'Danau kaldera vulkanik seluas 99.5 km² yang tenang dan memukau. Sensasi perjalanan melintasi rute spektakuler Kelok 44 dengan tingkatan tikungan tajam dan pemandangan danau dari ketinggian.',
    highlights: ['Puncak Lawang untuk Paragliding terbaik', 'Keindahan Kelok 44 nan ikonik', 'Matahari Terbenam Danau Kaldera'],
    bestTime: 'Pagi Hari & Sore Hari',
    locationDetails: 'Kecamatan Tanjung Raya, Agam',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd4',
    title: 'KEPULAUAN MENTAWAI & SURF SANCTUARY',
    category: 'Pantai & Bahari',
    regency: 'Kabupaten Kepulauan Mentawai',
    tag: 'SURGA SELANCAR DUNIA',
    description: 'Kepulauan eksotis dengan ombak kelas dunia (Mentawai Wave Sanctuary) serta kebudayaan suku asli Mentawai (Sikerei) yang masih memegang teguh tradisi tato tertua di dunia.',
    highlights: ['Ombak Kelas Dunia (Lance’s Right, HTs, Macaronis)', 'Ekowisata Budaya Suku Mentawai & Sikerei', 'Hutan Hujan Tropis & Pantai Perawan'],
    bestTime: 'April - Oktober (Peak Swell Season)',
    locationDetails: 'Kepulauan Mentawai, Samudra Hindia',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd5',
    title: 'NAGARI PARIANGAN DESA TERINDAH',
    category: 'Desa Wisata',
    regency: 'Kabupaten Tanah Datar',
    tag: 'DESA TERTUA MINANGKABAU',
    description: 'Dinobatkan sebagai salah satu Desa Terindah di Dunia. Terletak di lereng Gunung Marapi dengan arsitektur Rumah Gadang kayu berusia ratusan tahun dan pemandian air panas alami.',
    highlights: ['Masjid Tua Pariangan Arsitektur Kayu', 'Sawah Berpundak di Lereng Marapi', 'Situs Sejarah Asal Usul Orang Minang'],
    bestTime: 'Pagi Hari (07:00 - 11:00)',
    locationDetails: 'Kecamatan Pariangan, Tanah Datar',
    imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  },
  {
    id: 'd6',
    title: 'DANAU DIATAS & DANAU DIBAWAH ALAHAN PANJANG',
    category: 'Danau & Gunung',
    regency: 'Kabupaten Solok',
    tag: 'DANAU KEMBAR HIGHLAND',
    description: 'Dua danau berdampingan di dataran tinggi Alahan Panjang dengan suhu udara dingin ala Eropa, hamparan kebun teh hijau yang membentang luas, dan kebun hortikultura.',
    highlights: ['Kebun Teh Kayu Aro & Danau Kembar', 'Camping Ground Tepi Danau', 'Pemandangan Bunga Hortensia & Gunung Talang'],
    bestTime: 'Juli - November',
    locationDetails: 'Alahan Panjang, Kabupaten Solok',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
  },
  {
    id: 'd7',
    title: 'GEOPARK SILOKEK & SUNGAI BATANG KUANTAN',
    category: 'Lembah & Geopark',
    regency: 'Kabupaten Sijunjung',
    tag: 'WARISAN GEOLOGI DUNIA',
    description: 'Kawasan Geopark Nasional bertema batuan purba berusia ratusan juta tahun, arung jeram di Sungai Batang Kuantan, serta gua karst kuno dengan lanskap hutan lindung.',
    highlights: ['Batuan Purba Karst & Gua Silokek', 'Arung Jeram Batang Kuantan', 'Perkampungan Adat Sijunjung'],
    bestTime: 'Mei - September',
    locationDetails: 'Kecamatan Sijunjung, Sijunjung',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
  },
  {
    id: 'd8',
    title: 'PANTAI CAROCOK & PULAU MANDEH',
    category: 'Pantai & Bahari',
    regency: 'Kabupaten Pesisir Selatan',
    tag: 'RAJA AMPAT-NYA SUMBAR',
    description: 'Gugusan pulau-pulau karang hijau tenang (Kawasan Wisata Bahari Terpadu Mandeh) yang dijuluki Raja Ampat Sumatera Barat, ideal untuk snorkeling, diving, dan island hopping.',
    highlights: ['Puncak Mandeh & Island Hopping', 'Snorkeling Pulau Cubadak & Kapo-Kapo', 'Situs Jet Ski & Cliff Jumping'],
    bestTime: 'Maret - Oktober',
    locationDetails: 'Tarusan, Pesisir Selatan',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
  }
];

export const CULTURE_ITEMS: CultureItem[] = [
  {
    id: 'c1',
    title: 'RUMAH GADANG & ARSITEKTUR GONJONG',
    category: 'Arsitektur',
    description: 'Rumah adat khas Minangkabau dengan atap melengkung runcing menyerupai tanduk kerbau (Gonjong). Dibuat dari kayu tanpa paku besi sehingga tahan terhadap gempa bumi.',
    philosophy: 'Alam Takambang Jadi Guru (Belajar dari hukum keseimbangan alam)',
    origin: 'Ranah Minangkabau',
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c2',
    title: 'TARI PASAMBAHAN & TARI PIRING',
    category: 'Tari & Musik',
    description: 'Tari Pasambahan dipersembahkan sebagai penghormatan menyambut tamu agung. Tari Piring menampilkan ketangkasan menari membawa piring porselen di atas pecahan kaca.',
    philosophy: 'Budi baik dan rasa syukur atas hasil panen negeri',
    origin: 'Solok & Minangkabau',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c3',
    title: 'SILEK MINANGKABAU (SENI BELADIRI)',
    category: 'Seni Beladiri',
    description: 'Seni bela diri tradisional Minangkabau yang berakar pada ketangkasan fisikal dan kerohanian (Silek Harimau, Silek Tuo, Silek L бы). Bermanfaat membela diri dan menjaga marwah.',
    philosophy: 'Lahir Silek Mahanan Musuah, Batin Silek Mahanan Diri',
    origin: 'Luhak Nan Tigo',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c4',
    title: 'SONGKET PANDAI SIKEK & TENUN SILUNGKANG',
    category: 'Kain & Kerajinan',
    description: 'Kain tenun mewah bertahtakan benang emas dan perak bermotif ukiran Minang seperti Batang Pinang, Kaluak Paku, dan Bunga Lada. Dibuat secara manual selama berbulan-bulan.',
    philosophy: 'Ketelitian, kerapian, dan keagungan martabat wanita Minang',
    origin: 'Pandai Sikek & Silungkang',
    imageUrl: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'c5',
    title: 'SISTEM MATRILINEAL MINANGKABAU',
    category: 'Tradisi Adat',
    description: 'Sistem kekerabatan unik dan terbesar di dunia yang memperhitungkan garis keturunan dari pihak ibu (Matrilineal), di mana harta pusaka tinggi diwariskan kepada kaum perempuan.',
    philosophy: 'Memprioritaskan perlindungan dan penghormatan kepada Ibu & Wanita',
    origin: 'Sumatera Barat',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  }
];

export const CULINARY_ITEMS: CulinaryItem[] = [
  {
    id: 'cul1',
    title: 'RENDANG MINANGKABAU',
    type: 'Makanan Utama',
    origin: 'Payakumbuh & Tanah Datar',
    description: 'Daging sapi yang dimasak perlahan selama 8 jam dalam santan kelapa dan rempah-rempah autentik hingga berwarna hitam pekat. Diakui UNESCO sebagai warisan budaya kuliner dunia.',
    flavorProfile: 'Gurih, kaya rempah lengkuas & serai, legit, tahan lama tanpa pengawet.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul2',
    title: 'SATE PADANG KUAH REMPAH',
    type: 'Makanan Utama',
    origin: 'Padang Panjang & Pariaman',
    description: 'Daging lidah atau usus sapi berkuah kental rempah kuah kuning (Padang Panjang) atau kuah merah pedas (Pariaman) disajikan dengan ketupat dan taburan bawang goreng renyah.',
    flavorProfile: 'Pedas hangat rempah kunyit, jintan, kapulaga, & ketumbar.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul3',
    title: 'TEH TALUA (TEH TELUR ADAT)',
    type: 'Minuman Tradisional',
    origin: 'Sumatera Barat',
    description: 'Minuman stamina khas pria Minang hasil racikan kuning telur ayam kampung yang dikocok kental bersama gula dan disiram teh pekat mendidih serta perasan jeruk nipis.',
    flavorProfile: 'Manis gurih, creamy berbuih tebal, segar tanpa bau amis.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul4',
    title: 'NASI KAPAU BUKITTINGGI',
    type: 'Makanan Utama',
    origin: 'Nagari Kapau, Agam',
    description: 'Nasi khas dengan gulai tambusu (usus isi telur), gulai kapau berdaging tebal, dan rebusan nangka serta kacang panjang yang disajikan bertingkat ala meja Kapau.',
    flavorProfile: 'Sangat gurih, asam pedas segar dari rempah kunyit dan santan kental.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cul5',
    title: 'LAMANG TAPAI & KIPANG KACANG',
    type: 'Kudapan Khas',
    origin: 'Batusangkar & Tanah Datar',
    description: 'Beras ketan yang dibakar dalam selongsong bambu berlapis daun pisang (Lamang) disajikan bersama tape ketan hitam manis berbuih (Tapai).',
    flavorProfile: 'Perpaduan manis, gurih legit bambu, dan asam manis menyegarkan.',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  }
];

export const EVENTS_SCHEDULE: EventItem[] = [
  {
    id: 'ev1',
    title: 'PACU JAWI (ATRAKSI BALAP SAPI LUMPUR)',
    schedule: 'Setiap Akhir Pekan (Bergilir)',
    location: 'Sawah Nagari Tanah Datar (Sungai Tarab, Pariangan)',
    description: 'Atraksi budaya unik di mana joki memegang ekor dua ekor sapi sambil berlari kencang membelah sawah basah berlumpur tanpa cambuk.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev2',
    title: 'FESTIVAL TOUR DE SINGKARAK',
    schedule: 'Tahunan (Oktober / November)',
    location: 'Lintas Kabupaten/Kota Sumatera Barat',
    description: 'Ajang balap sepeda internasional bergengsi gabungan olahraga dan promosi wisata alam melintasi Danau Singkarak, Kelok 44, dan Lembah Harau.',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev3',
    title: 'FESTIVAL TABUIK PARIAMAN',
    schedule: '1 - 10 Muharram',
    location: 'Kota Pariaman & Pantai Gandoriah',
    description: 'Upacara kolosal budaya memperingati Hari Asyura dengan mengarak menara Tabuik megah setinggi 12 meter sebelum dilarung ke lautan.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ev4',
    title: 'FESTIVAL MAANTA SANI & PACU ITIK',
    schedule: 'Juli - Agustus',
    location: 'Payakumbuh & Lima Puluh Kota',
    description: 'Perlombaan terbang burung itik lokal yang terlatih terbang melintasi jarak 800 meter serta pesta kesenian tari Minang tradisi.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  }
];
