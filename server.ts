import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Travel Planner (UNI MALA AI Minangkabau)
  app.post("/api/ai/itinerary", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { durasiHari, profilWisatawan, preferensiMinat, logistik, anggaran, akomodasi, kebutuhanKhusus, outputPreferensi, language = 'id' } = req.body;

      const isEnglish = language === 'en';

      if (!apiKey) {
        // Fallback response when GEMINI_API_KEY is not configured
        return res.json({
          title: isEnglish
            ? `West Sumatra Exploration (${durasiHari || 3} Days - ${profilWisatawan?.kategori || 'Nature & Culinary'})`
            : `Eksplorasi Ranah Minang (${durasiHari || 3} Hari - ${profilWisatawan?.kategori || 'Wisata Alam & Kuliner'})`,
          summary: isEnglish
            ? `UNI MALA AI recommended travel plan combining geopark landscapes, authentic Rendang gastronomy, and rich Minangkabau Rumah Gadang heritage.`
            : `Rencana wisata rekomendasi UNI MALA AI mencakup perpaduan keindahan geowisata, kuliner Rendang autentik, serta warisan budaya Rumah Gadang.`,
          itinerary: Array.from({ length: Number(durasiHari) || 3 }).map((_, idx) => ({
            day: idx + 1,
            title: isEnglish
              ? (idx === 0 ? "Arrival & Bukittinggi Clock Tower Charm" : idx === 1 ? "Lembah Harau Canyon Adventure & Payakumbuh Food" : "Lake Maninjau & Nagari Pariangan Heritage Village")
              : (idx === 0 ? "Kedatangan & Pesona Kota Jam Gadang Bukittinggi" : idx === 1 ? "Petualangan Geopark Lembah Harau & Kuliner Payakumbuh" : "Wisata Danau Maninjau & Desa Terindah Nagari Pariangan"),
            activities: [
              {
                time: "08:30 - 11:30",
                location: idx === 0 ? "Jam Gadang & Ngarai Sianok" : idx === 1 ? "Lembah Harau Canyon" : "Nagari Pariangan",
                activity: isEnglish
                  ? (idx === 0 ? "Photo session at Bukittinggi Clock Tower, followed by exploring Sianok Canyon and Japanese Tunnel." : idx === 1 ? "Enjoying spectacular granite cliffs and Sarasah Bunta Waterfall." : "Explore Minangkabau's oldest village featuring traditional wooden architecture and Mount Marapi views.")
                  : (idx === 0 ? "Sesi foto di Ikon Jam Gadang, dilanjutkan menyusuri panorama Ngarai Sianok dan Lubang Jepang." : idx === 1 ? "Menikmati tebing tebing granit spektakuler dan air terjun Sarasah Bunta." : "Jelajah desa tertua Minangkabau dengan arsitektur kayu tradisional dan pemandangan Gunung Marapi."),
                tips: isEnglish ? "Wear warm layers and comfortable walking shoes." : "Gunakan pakaian hangat dan sepatu jalan yang nyaman."
              },
              {
                time: "12:30 - 14:00",
                location: isEnglish ? "Authentic Padang Cuisine Restaurant" : "Restoran Rumah Makan Padang Autentik",
                activity: isEnglish ? "Lunch featuring Beef Rendang, Pop Chicken, and Bukittinggi Kapau Curry." : "Makan siang dengan hidangan Rendang Daging, Ayam Pop, dan Gulai Kapau khas Bukittinggi.",
                tips: isEnglish ? "Try pairing Green Sambal with Tunjang Curry." : "Coba padukan Sambal Lado Mudo dengan Gulai Tunjang."
              },
              {
                time: "15:30 - 18:00",
                location: idx === 0 ? "Puncak Lawang & Kelok 44" : idx === 1 ? "Istano Basa Pagaruyung" : "Padang Beach & Grand Mosque of West Sumatra",
                activity: isEnglish
                  ? (idx === 0 ? "Enjoying Lake Maninjau panoramic view from Puncak Lawang height." : idx === 1 ? "Exploring Minangkabau Royal Palace wearing traditional costume." : "Sunset at Padang Beach and admiring the unique dome-less Minangkabau architecture of West Sumatra Grand Mosque.")
                  : (idx === 0 ? "Menikmati pemandangan Danau Maninjau dari ketinggian Puncak Lawang." : idx === 1 ? "Eksplorasi Istana Kerajaan Minangkabau dengan pakaian adat tradisional." : "Sunset di Pantai Padang dan menikmati keindahan arsitektur Rumah Gadang tanpa kubah Masjid Raya Sumbar."),
                tips: isEnglish ? "Capture the sunset moments." : "Abadikan momen matahari terbenam."
              }
            ],
            culinaryRecommendation: isEnglish
              ? (idx === 0 ? "Pasar Atas Nasi Kapau & Teh Talua (Egg Tea)" : idx === 1 ? "Payakumbuh Satay & Tapai Sticky Rice" : "Padang Satay & Durian Ice")
              : (idx === 0 ? "Nasi Kapau Pasar Atas & Teh Talua" : idx === 1 ? "Sate Payakumbuh & Lemang Tapai" : "Sate Padang & Es Durian")
          })),
          localTips: isEnglish
            ? [
                "Minangkabau culture deeply values 'Adat Basandi Syarak, Syarak Basandi Kitabullah' (Custom based on religion). Please respect local wisdom and dress modestly.",
                "Must-buy souvenirs: Sanjai Balado Chips, Local Coffee, and Packaged Rendang."
              ]
            : [
                "Masyarakat Minangkabau memegang teguh falsafah 'Adat Basandi Syarak, Syarak Basandi Kitabullah'. Hargai kearifan lokal.",
                "Oleh-oleh wajib: Keripik Balado Sanjai, Kopi Bawaan, dan Rendang Kemasan."
              ]
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const langInstruction = isEnglish
        ? "Please generate the official trip itinerary for West Sumatra completely in ENGLISH language."
        : "Buatkan rencana perjalanan wisata (Itinerary) resmi & komprehensif untuk Sumatera Barat dalam Bahasa Indonesia.";

      const prompt = `Anda adalah UNI MALA AI Sumatera Barat - Asisten AI Pariwisata Resmi Dinas Pariwisata Provinsi Sumatera Barat (Wonderful West Sumatra).\n${langInstruction}\n\nDetail Permintaan Wisatawan:\n- Durasi: ${durasiHari || 3} hari\n- Profil Wisatawan: ${profilWisatawan?.jumlahOrang || 2} orang (${profilWisatawan?.kategori || 'pasangan'}, Asal: ${profilWisatawan?.asal || 'domestik'})\n- Minat Destinasi: ${(preferensiMinat?.kategoriWisata || []).join(', ')}\n- Tingkat Aktivitas: ${preferensiMinat?.tingkatAktivitas || 'sedang'}\n- Kelas Anggaran: ${anggaran?.rentang || 'menengah'}\n- Kebutuhan Khusus / Alergi: ${(kebutuhanKhusus?.alergiMakanan || []).join(', ')}\n\nFormatkan output HANYA dalam format JSON valid dengan struktur:\n{\n  "title": "${isEnglish ? 'Trip Title' : 'Judul Rencana Perjalanan Wisata'}",\n  "summary": "${isEnglish ? 'Summary of experience' : 'Ringkasan pengalaman wisata yang akan dirasakan'}",\n  "itinerary": [\n    {\n      "day": 1,\n      "title": "${isEnglish ? 'Day 1 Theme' : 'Tema Hari Ke-1'}",\n      "activities": [\n        {\n          "time": "08:00 - 10:00",\n          "location": "${isEnglish ? 'Location Name' : 'Nama Tempat / Destinasi'}",\n          "activity": "${isEnglish ? 'Recommended activity description' : 'Deskripsi kegiatan yang direkomendasikan'}",\n          "tips": "${isEnglish ? 'Local tips' : 'Tips lokal / kearifan lokal'}"\n        }\n      ],\n      "culinaryRecommendation": "${isEnglish ? 'Culinary recommendation' : 'Rekomendasi kuliner khas untuk hari ini'}"\n    }\n  ],\n  "localTips": [\n    "${isEnglish ? 'Minangkabau etiquette tip' : 'Tips etika Minangkabau (Adat Basandi Syarak, Syarak Basandi Kitabullah)'}",\n    "${isEnglish ? 'Souvenir recommendation' : 'Rekomendasi oleh-oleh khas Sumbar'}"\n  ]\n}\n\nBerikan respon HANYA dalam format JSON tanpa markdown backticks atau teks lain di luar JSON. Language requested: ${isEnglish ? 'ENGLISH' : 'INDONESIAN'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      const rawText = response.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Gagal mengekstrak data JSON dari respon AI");
      }
      const parsedData = JSON.parse(jsonMatch[0]);

      return res.json(parsedData);
    } catch (error: any) {
      console.error("Error generating AI itinerary:", error);
      return res.status(500).json({ error: error.message || "Gagal membuat rencana perjalanan AI" });
    }
  });

  // API Route: UNI MALA AI Chatbot / Quick Answers
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { message } = req.body;

      if (!apiKey) {
        // Fallback friendly reply when GEMINI_API_KEY is missing
        return res.json({
          reply: `Rancak bana! Saya UNI MALA AI Sumbar. Terkait "${message}", Sumatera Barat menawarkan destinasi luar biasa seperti Lembah Harau, Jam Gadang Bukittinggi, Danau Maninjau, serta sajian Rendang autentik dan Sate Padang. Ada tempat spesifik yang ingin Anda ketahui lebih dalam?`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemInstruction = `Anda adalah 'UNI MALA AI Sumbar' - Pemandu AI Resmi Pariwisata & Kebudayaan Minangkabau dari Dinas Pariwisata Provinsi Sumatera Barat.
Anda sangat ramah, fasih, dan berwawasan luas tentang destinasi alam, kuliner khas (Rendang, Sate Padang, Teh Talua, Lamang Tapai), kebudayaan Minangkabau (Rumah Gadang, Jam Gadang, Nagari Pariangan, Silek, Ukiran, Adat), serta rute perjalanan terbaik di Sumatera Barat.
Gunakan Bahasa Indonesia yang sopan dan hangat. Selalu sertakan nuansa kehangatan Ranah Minang. Jangan melakukan transaksi/booking.`;

      const prompt = `${systemInstruction}\n\nPertanyaan Wisatawan: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (error: any) {
      console.error("AI Chat error:", error);
      return res.status(500).json({ error: error.message || "Gagal menjawab pertanyaan AI" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
