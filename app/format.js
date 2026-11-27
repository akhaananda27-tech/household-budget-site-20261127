// format.js — one job: turn numbers into readable Indonesian rupiah text
// and dates into short Indonesian labels. No state, no DOM.

export function rupiah(amount) {
  const n = Math.round(Number(amount) || 0);
  return "Rp " + n.toLocaleString("id-ID");
}

export function rupiahShort(amount) {
  const n = Math.abs(Number(amount) || 0);
  if (n >= 1000000) return "Rp " + (n / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (n >= 1000) return "Rp " + Math.round(n / 1000) + " rb";
  return rupiah(n);
}

export function percent(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

const MONTHS_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function dateLabel(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return d + " " + MONTHS_ID[m - 1] + " " + y;
}

export function dayOfMonth(iso) {
  return Number(iso.split("-")[2]);
}

export function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
