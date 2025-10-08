import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive SAKERNAS classification database
const SAKERNAS_DB = {
  lapanganUsaha: {
    // Category A: Pertanian, Kehutanan dan Perikanan
    "01121": "Pertanian Padi Hibrida - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "01122": "Pertanian Padi Inbrida - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "01111": "Pertanian Jagung - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "01131": "Pertanian Hortikultura Sayuran Daun - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "01411": "Pembibitan dan Budidaya Sapi Potong - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "01461": "Budidaya Ayam Ras Pedaging - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    "03111": "Penangkapan Pisces/Ikan Bersirip di Laut - Kategori A (Pertanian, Kehutanan dan Perikanan)",
    
    // Category B: Pertambangan dan Penggalian
    "05100": "Pertambangan Batu Bara - Kategori B (Pertambangan dan Penggalian)",
    "06100": "Ekstraksi Minyak Bumi - Kategori B (Pertambangan dan Penggalian)",
    
    // Category C: Industri Pengolahan
    "10110": "Industri Pengolahan dan Pengawetan Daging - Kategori C (Industri Pengolahan)",
    "10740": "Industri Mie dan Produk Sejenis - Kategori C (Industri Pengolahan)",
    "10791": "Industri Kecap, Tauco dan Sejenisnya - Kategori C (Industri Pengolahan)",
    
    // Category G: Perdagangan Besar dan Eceran
    "47111": "Perdagangan Eceran Serba Ada dengan Luas Area Penjualan 5000 M2 atau Lebih - Kategori G (Perdagangan Besar dan Eceran)",
    "47192": "Perdagangan Eceran Berbagai Macam Barang yang Utamanya Bukan Makanan, Minuman atau Tembakau - Kategori G (Perdagangan Besar dan Eceran)",
    
    // Category H: Pengangkutan dan Pergudangan
    "49111": "Angkutan Rel Penumpang Jarak Jauh - Kategori H (Pengangkutan dan Pergudangan)",
    "49210": "Angkutan Bus Bertrayek - Kategori H (Pengangkutan dan Pergudangan)",
    
    // Category I: Penyediaan Akomodasi dan Penyediaan Makan Minum
    "55101": "Hotel Bintang - Kategori I (Penyediaan Akomodasi dan Penyediaan Makan Minum)",
    "56101": "Restoran - Kategori I (Penyediaan Akomodasi dan Penyediaan Makan Minum)",
    
    // Category J: Informasi dan Komunikasi
    "58110": "Penerbitan Buku - Kategori J (Informasi dan Komunikasi)",
    "62010": "Aktivitas Pemrograman Komputer - Kategori J (Informasi dan Komunikasi)",
    
    // Category P: Pendidikan
    "85111": "Pendidikan Anak Usia Dini Formal - Kategori P (Pendidikan)",
    "85301": "Pendidikan Menengah Kejuruan - Kategori P (Pendidikan)",
    
    // Category Q: Aktivitas Kesehatan Manusia dan Aktivitas Sosial
    "86101": "Aktivitas Rumah Sakit - Kategori Q (Aktivitas Kesehatan Manusia dan Aktivitas Sosial)",
    "86201": "Aktivitas Praktek Dokter Umum - Kategori Q (Aktivitas Kesehatan Manusia dan Aktivitas Sosial)",
  },
  
  jenisPekerjaan: {
    // Golongan 0: TNI dan POLRI
    "0110": "Perwira Tinggi TNI - Golongan 0 (TNI dan POLRI)",
    "0210": "Perwira Tinggi POLRI - Golongan 0 (TNI dan POLRI)",
    
    // Golongan 1: Manajer
    "1111": "Legislator - Golongan 1 (Manajer)",
    "1120": "Manajer Pelaksana - Golongan 1 (Manajer)",
    "1211": "Manajer Keuangan - Golongan 1 (Manajer)",
    
    // Golongan 2: Profesional
    "2111": "Fisikawan dan Astronom - Golongan 2 (Profesional)",
    "2120": "Ahli Matematika, Aktuaris dan Ahli Statistika - Golongan 2 (Profesional)",
    "2310": "Guru Perguruan Tinggi - Golongan 2 (Profesional)",
    
    // Golongan 3: Teknisi dan Asisten Profesional
    "3111": "Teknisi Kimia - Golongan 3 (Teknisi dan Asisten Profesional)",
    "3211": "Teknisi Peralatan Medis dan Gigi - Golongan 3 (Teknisi dan Asisten Profesional)",
    
    // Golongan 4: Tenaga Tata Usaha
    "4110": "Tenaga Administrasi Perkantoran Umum - Golongan 4 (Tenaga Tata Usaha)",
    "4211": "Juru Catat dan Penanganan Uang - Golongan 4 (Tenaga Tata Usaha)",
    
    // Golongan 5: Tenaga Usaha Jasa dan Tenaga Penjualan
    "5111": "Pramugara - Golongan 5 (Tenaga Usaha Jasa dan Tenaga Penjualan)",
    "5211": "Pedagang di Kios dan Warung - Golongan 5 (Tenaga Usaha Jasa dan Tenaga Penjualan)",
    
    // Golongan 6: Pekerja Terampil Pertanian, Kehutanan dan Perikanan
    "6111": "Petani Tanaman Pangan - Golongan 6 (Pekerja Terampil Pertanian, Kehutanan dan Perikanan)",
    "6121": "Peternak Hewan - Golongan 6 (Pekerja Terampil Pertanian, Kehutanan dan Perikanan)",
    "6221": "Pembudidaya Ikan - Golongan 6 (Pekerja Terampil Pertanian, Kehutanan dan Perikanan)",
    
    // Golongan 7: Pekerja Pengolahan, Kerajinan, dan YBDI
    "7111": "Pembangun Rumah - Golongan 7 (Pekerja Pengolahan, Kerajinan, dan YBDI)",
    "7211": "Tukang Cor Logam - Golongan 7 (Pekerja Pengolahan, Kerajinan, dan YBDI)",
    
    // Golongan 8: Operator dan Perakit Mesin
    "8111": "Operator Instalasi Pertambangan - Golongan 8 (Operator dan Perakit Mesin)",
    "8211": "Operator Mesin Pengolah Logam - Golongan 8 (Operator dan Perakit Mesin)",
    "8322": "Pengemudi Mobil, Taksi dan Van - Golongan 8 (Operator dan Perakit Mesin)",
    
    // Golongan 9: Pekerja Kasar
    "9111": "Pembersih Rumah dan Kantor - Golongan 9 (Pekerja Kasar)",
    "9211": "Pekerja Kasar Pertanian, Kehutanan dan Perikanan - Golongan 9 (Pekerja Kasar)",
    "9611": "Pengumpul Sampah - Golongan 9 (Pekerja Kasar)",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing query:", query);

    // Create knowledge base for AI
    const knowledgeBase = `
Anda adalah AI Agent klasifikasi SAKERNAS BPS 2025. Database Anda mencakup:

LAPANGAN USAHA (KBLI 2020):
${Object.entries(SAKERNAS_DB.lapanganUsaha).map(([code, desc]) => `- ${code}: ${desc}`).join('\n')}

JENIS PEKERJAAN (KBJI 2014):
${Object.entries(SAKERNAS_DB.jenisPekerjaan).map(([code, desc]) => `- ${code}: ${desc}`).join('\n')}

Tugas Anda:
1. Identifikasi kategori dari query user (lapangan usaha, pekerjaan, atau keduanya)
2. Cari kode yang paling sesuai dari database
3. Berikan jawaban dalam format tabel markdown
4. Berikan penjelasan singkat

Format respons WAJIB menggunakan tabel markdown seperti ini:

| Aspek | Kode | Keterangan |
|-------|------|------------|
| Lapangan Usaha | [kode] | [deskripsi lengkap] |
| Jenis Pekerjaan | [kode] | [deskripsi lengkap] |

Kemudian berikan penjelasan singkat dan tanyakan: "Apakah Anda membutuhkan informasi lebih lanjut?"
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: knowledgeBase },
          { role: "user", content: query },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit tercapai. Silakan coba lagi sebentar." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kredit AI habis. Silakan tambah kredit di workspace Anda." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response received successfully");

    return new Response(
      JSON.stringify({ 
        result: data.choices[0].message.content 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in classify-sakernas:", error);
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
