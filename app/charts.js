// charts.js — one job: build SVG charts from numbers. Every function takes
// plain data and returns an SVG string; nothing here touches the page or
// the network. All charts are inline SVG, so the site stays fully offline.

import { rupiahShort } from "./format.js";

// Horizontal bars: one row per category, bar length = share of the largest.
export function categoryBars(rows) {
  const max = Math.max(1, ...rows.map((r) => r.spent));
  const body = rows.map((r) => {
    const w = Math.max(2, Math.round((r.spent / max) * 100));
    const over = r.spent > r.budget;
    return `<div class="bar-row">
      <span class="bar-label">${r.label}</span>
      <span class="bar-track"><span class="bar-fill${over ? " over" : ""}" style="width:${w}%;background:${r.color}"></span></span>
      <span class="bar-value">${rupiahShort(r.spent)} <em>/ ${rupiahShort(r.budget)}</em></span>
    </div>`;
  }).join("");
  return `<div class="bars">${body}</div>`;
}

// Donut: how the month's spending splits across categories.
export function donutChart(slices, size = 220) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, thick = 34;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const rings = slices.map((s) => {
    const frac = s.value / total;
    const dash = Math.max(0, frac * circ - 2);
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thick}" stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" />`;
    offset += frac * circ;
    return el;
  }).join("");
  const legend = slices.map((s) =>
    `<li><span class="dot" style="background:${s.color}"></span>${s.label} — ${Math.round((s.value / total) * 100)}%</li>`).join("");
  return `<div class="donut-wrap">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Pembagian pengeluaran per kategori">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7e2d6" stroke-width="${thick}" />
      ${rings}
      <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${rupiahShort(total)}</text>
      <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-sub">terpakai</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

// Grouped vertical bars: spending vs income across months.
export function trendChart(months) {
  const W = 640, H = 260, padL = 64, padB = 30, padT = 16;
  const max = Math.max(...months.map((m) => Math.max(m.spent, m.income)));
  const innerW = W - padL - 16, innerH = H - padT - padB;
  const slot = innerW / months.length;
  const barW = Math.min(34, slot / 3);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const grid = [0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + innerH * (1 - f);
    return `<line x1="${padL}" y1="${gy}" x2="${W - 16}" y2="${gy}" class="grid" />
      <text x="${padL - 8}" y="${gy + 4}" text-anchor="end" class="axis">${(max * f / 1000000).toFixed(0)} jt</text>`;
  }).join("");
  const bars = months.map((m, i) => {
    const x = padL + i * slot + slot / 2;
    return `<rect x="${(x - barW - 3).toFixed(1)}" y="${y(m.spent).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(m.spent)).toFixed(1)}" rx="3" fill="#2f7d4f" />
      <rect x="${(x + 3).toFixed(1)}" y="${y(m.income).toFixed(1)}" width="${barW}" height="${(padT + innerH - y(m.income)).toFixed(1)}" rx="3" fill="#d9c9a3" />
      <text x="${x}" y="${H - 8}" text-anchor="middle" class="axis">${m.month}</text>`;
  }).join("");
  return `<svg viewBox="0 0 ${W} ${H}" class="trend" role="img" aria-label="Tren pengeluaran dan pemasukan 6 bulan terakhir">
    ${grid}${bars}
  </svg>
  <p class="chart-key"><span class="key-spent"></span> Pengeluaran &nbsp; <span class="key-income"></span> Pemasukan</p>`;
}

// A thin progress bar used by savings goals and budget remaining.
export function progressBar(done, total, color = "#2f7d4f") {
  const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return `<div class="progress"><span style="width:${pct}%;background:${color}"></span></div>
    <span class="pct">${pct}%</span>`;
}
