// RumahBudget seed data: one household, one month, real figures.
// All amounts are Indonesian rupiah (IDR). The app reads this file only;
// every number the site shows comes from here or from edits the user makes.

export const HOUSEHOLD = {
  name: "Keluarga Hartono",
  members: ["Budi Hartono", "Sari Hartono", "Dimas (12)", "Kirana (8)"],
  city: "Jakarta",
  month: "November 2026",
  currency: "IDR",
};

export const INCOME = [
  { source: "Gaji Budi — PT Nusantara Jaya", amount: 9500000, day: 25, kind: "salary" },
  { source: "Gaji Sari — Klinik Sehat Bersama", amount: 3000000, day: 28, kind: "salary" },
  { source: "Freelance desain — Sari", amount: 2000000, day: 15, kind: "freelance" },
];

export const CATEGORIES = [
  { id: "groceries", label: "Belanja Harian", color: "#2f7d4f", budget: 3000000 },
  { id: "rent", label: "Sewa Rumah", color: "#7a5c2e", budget: 2500000 },
  { id: "transport", label: "Transport", color: "#2b6cb0", budget: 1200000 },
  { id: "utilities", label: "Listrik, Air & Internet", color: "#6b46c1", budget: 900000 },
  { id: "dining", label: "Makan di Luar", color: "#c05621", budget: 800000 },
  { id: "education", label: "Sekolah Anak", color: "#0e7490", budget: 700000 },
  { id: "entertainment", label: "Hiburan", color: "#be185d", budget: 600000 },
  { id: "health", label: "Kesehatan", color: "#b91c1c", budget: 500000 },
  { id: "savings", label: "Tabungan", color: "#15803d", budget: 2500000 },
  { id: "misc", label: "Lain-lain", color: "#64748b", budget: 800000 },
];

// Expenses recorded so far in November 2026. `id` is stable so the tracker
// can edit and delete rows; `paid` marks a bill already settled.
export const EXPENSES = [
  { id: 1, date: "2026-11-01", desc: "Sewa rumah — November", category: "rent", amount: 2500000, note: "Transfer ke Pak RT" },
  { id: 2, date: "2026-11-02", desc: "Pasar Minggu — sayur & buah", category: "groceries", amount: 185000, note: "" },
  { id: 3, date: "2026-11-03", desc: "Bensin motor (Pertalite)", category: "transport", amount: 120000, note: "" },
  { id: 4, date: "2026-11-04", desc: "Indomaret — susu & roti", category: "groceries", amount: 96000, note: "" },
  { id: 5, date: "2026-11-05", desc: "BPJS Kesehatan keluarga", category: "health", amount: 350000, note: "Iuran bulanan" },
  { id: 6, date: "2026-11-06", desc: "Gojek — antar Dimas les", category: "transport", amount: 45000, note: "" },
  { id: 7, date: "2026-11-07", desc: "Ayam Geprek Bensu — makan malam", category: "dining", amount: 132000, note: "Berempat" },
  { id: 8, date: "2026-11-08", desc: "Tokopedia — buku sekolah Kirana", category: "education", amount: 210000, note: "" },
  { id: 9, date: "2026-11-09", desc: "Pasar Minggu — beras 10 kg", category: "groceries", amount: 142000, note: "" },
  { id: 10, date: "2026-11-10", desc: "Token listrik PLN 200 kWh", category: "utilities", amount: 302000, note: "" },
  { id: 11, date: "2026-11-11", desc: "Netflix — langganan bulanan", category: "entertainment", amount: 65000, note: "" },
  { id: 12, date: "2026-11-12", desc: "PDAM — tagihan air", category: "utilities", amount: 118000, note: "" },
  { id: 13, date: "2026-11-13", desc: "Indomaret — sabun & sampo", category: "groceries", amount: 87000, note: "" },
  { id: 14, date: "2026-11-14", desc: "Soto Betawi H. Ma'ruf", category: "dining", amount: 98000, note: "Makan siang keluarga" },
  { id: 15, date: "2026-11-15", desc: "IndiHome — internet 50 Mbps", category: "utilities", amount: 375000, note: "" },
  { id: 16, date: "2026-11-16", desc: "Bensin mobil (Pertamax)", category: "transport", amount: 250000, note: "" },
  { id: 17, date: "2026-11-17", desc: "Les piano Dimas", category: "education", amount: 300000, note: "4x pertemuan" },
  { id: 18, date: "2026-11-18", desc: "Apotek — vitamin & obat flu", category: "health", amount: 124000, note: "" },
  { id: 19, date: "2026-11-19", desc: "Super Indo — belanja mingguan", category: "groceries", amount: 486000, note: "" },
  { id: 20, date: "2026-11-20", desc: "Bioskop — film keluarga", category: "entertainment", amount: 200000, note: "4 tiket" },
  { id: 21, date: "2026-11-21", desc: "Gojek — antar Kirana", category: "transport", amount: 38000, note: "" },
  { id: 22, date: "2026-11-22", desc: "Warung Kopi — sarapan", category: "dining", amount: 76000, note: "" },
  { id: 23, date: "2026-11-23", desc: "Pasar Minggu — ikan & ayam", category: "groceries", amount: 231000, note: "" },
  { id: 24, date: "2026-11-24", desc: "Tabungan darurat — setor", category: "savings", amount: 2500000, note: "Auto-debet BCA" },
  { id: 25, date: "2026-11-25", desc: "Servis AC — 2 unit", category: "misc", amount: 300000, note: "" },
  { id: 26, date: "2026-11-26", desc: "Indomaret — popok & tisu", category: "groceries", amount: 112000, note: "" },
];

export const GOALS = [
  { id: 1, name: "Dana Darurat", target: 20000000, saved: 12400000, note: "6 bulan pengeluaran pokok" },
  { id: 2, name: "Liburan ke Yogyakarta", target: 8000000, saved: 3250000, note: "Libur sekolah Desember" },
  { id: 3, name: "Laptop baru Dimas", target: 12000000, saved: 5600000, note: "Untuk belajar coding" },
  { id: 4, name: "Renovasi dapur", target: 15000000, saved: 2100000, note: "Ganti kompor & wastafel" },
];

export const BILLS = [
  { id: 1, name: "Sewa rumah", amount: 2500000, dueDay: 1, paid: true, recurring: "Bulanan" },
  { id: 2, name: "BPJS Kesehatan", amount: 350000, dueDay: 5, paid: true, recurring: "Bulanan" },
  { id: 3, name: "Token listrik PLN", amount: 302000, dueDay: 10, paid: true, recurring: "Bulanan" },
  { id: 4, name: "PDAM — air", amount: 118000, dueDay: 12, paid: true, recurring: "Bulanan" },
  { id: 5, name: "IndiHome internet", amount: 375000, dueDay: 15, paid: true, recurring: "Bulanan" },
  { id: 6, name: "Netflix", amount: 65000, dueDay: 11, paid: true, recurring: "Bulanan" },
  { id: 7, name: "Les piano Dimas", amount: 300000, dueDay: 17, paid: true, recurring: "Bulanan" },
  { id: 8, name: "Iuran RT/RW", amount: 75000, dueDay: 20, paid: false, recurring: "Bulanan" },
  { id: 9, name: "Asuransi mobil", amount: 485000, dueDay: 27, paid: false, recurring: "Bulanan" },
  { id: 10, name: "SPP sekolah Kirana", amount: 650000, dueDay: 28, paid: false, recurring: "Bulanan" },
];

// Monthly spending for the trend chart (June – November 2026).
export const MONTHLY_TREND = [
  { month: "Jun", spent: 11840000, income: 14500000 },
  { month: "Jul", spent: 12450000, income: 14500000 },
  { month: "Agu", spent: 11080000, income: 14500000 },
  { month: "Sep", spent: 12900000, income: 14500000 },
  { month: "Okt", spent: 12150000, income: 14500000 },
  { month: "Nov", spent: 9442000, income: 14500000 },
];

export const TIPS = [
  { title: "Belanja harian masih di bawah anggaran", body: "Belanja harian Rp 1.543.000 dari anggaran Rp 3.000.000 — sisa Rp 1.457.000 untuk seminggu terakhir bulan ini." },
  { title: "Transport naik 12% dari Oktober", body: "Bensin dan Gojek sudah Rp 453.000. Pertimbangkan naik TransJakarta untuk perjalanan kantor Budi di minggu terakhir." },
  { title: "Dana darurat sudah 62%", body: "Tinggal Rp 7.600.000 lagi menuju target Rp 20.000.000. Setoran rutin Rp 2.500.000 per bulan sampai Februari 2027." },
];
