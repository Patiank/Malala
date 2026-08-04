const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the req.body destructuring
code = code.replace(
  /const { durationDays, travelStyle, destinationsOfInterest, budgetLevel, userNote } = req\.body;/,
  `const { durasiHari, profilWisatawan, preferensiMinat, logistik, anggaran, akomodasi, kebutuhanKhusus, outputPreferensi } = req.body;`
);

// Replace durationDays references in the fallback with durasiHari
code = code.replace(/durationDays/g, 'durasiHari');

// Replace travelStyle references in the fallback
code = code.replace(/travelStyle/g, 'profilWisatawan?.kategori');

// Replace the prompt with a simpler version
const oldPromptRegex = /const prompt = `Anda adalah UNI MALA AI Sumatera Barat[\s\S]*?JSON.`\;/m;

const newPrompt = "const prompt = `Anda adalah UNI MALA AI Sumatera Barat - Asisten AI Pariwisata Resmi Dinas Pariwisata Provinsi Sumatera Barat (Wonderful West Sumatra).\\nBuatkan rencana perjalanan wisata (Itinerary) resmi & komprehensif untuk Sumatera Barat dalam Bahasa Indonesia.\\n\\nDetail Permintaan Wisatawan:\\n- Durasi: ${durasiHari || 3} hari\\n- Profil Wisatawan: ${profilWisatawan?.jumlahOrang || 2} orang (${profilWisatawan?.kategori || 'pasangan'}, Asal: ${profilWisatawan?.asal || 'domestik'})\\n- Minat Destinasi: ${(preferensiMinat?.kategoriWisata || []).join(', ')}\\n- Tingkat Aktivitas: ${preferensiMinat?.tingkatAktivitas || 'sedang'}\\n- Kelas Anggaran: ${anggaran?.rentang || 'menengah'}\\n- Kebutuhan Khusus / Alergi: ${(kebutuhanKhusus?.alergiMakanan || []).join(', ')}\\n\\nFormatkan output HANYA dalam format JSON valid dengan struktur:\\n{\\n  \"title\": \"Judul Rencana Perjalanan Wisata\",\\n  \"summary\": \"Ringkasan pengalaman wisata yang akan dirasakan\",\\n  \"itinerary\": [\\n    {\\n      \"day\": 1,\\n      \"title\": \"Tema Hari Ke-1\",\\n      \"activities\": [\\n        {\\n          \"time\": \"08:00 - 10:00\",\\n          \"location\": \"Nama Tempat / Destinasi\",\\n          \"activity\": \"Deskripsi kegiatan yang direkomendasikan\",\\n          \"tips\": \"Tips lokal / kearifan lokal\"\\n        }\\n      ],\\n      \"culinaryRecommendation\": \"Rekomendasi kuliner khas untuk hari ini\"\\n    }\\n  ],\\n  \"localTips\": [\\n    \"Tips etika Minangkabau (Adat Basandi Syarak, Syarak Basandi Kitabullah)\",\\n    \"Rekomendasi oleh-oleh khas Sumbar\"\\n  ]\\n}\\n\\nBerikan respon HANYA dalam format JSON tanpa markdown backticks atau teks lain di luar JSON.`;";

code = code.replace(oldPromptRegex, newPrompt);

fs.writeFileSync('server.ts', code);
