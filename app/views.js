// views.js — one job: turn the household state into HTML for each page.
// Every view is a pure function of (state, helpers). It never fetches,
// never writes storage, never touches the network.

import { rupiah, rupiahShort, percent, dateLabel } from "./format.js";
import { categoryBars, donutChart, trendChart, progressBar } from "./charts.js";

function categoryOf(state, id) {
  return state.categories.find((c) => c.id === id) || { label: id, color: "#64748b" };
}

function spentByCategory(state) {
  const map = {};
  for (const e of state.expenses) map[e.category] = (map[e.category] || 0) + e.amount;
  return map;
}

export function totalIncome(state) {
  return state.income.reduce((s, x) => s + x.amount, 0);
}

export function totalSpent(state) {
  return state.expenses.reduce((s, x) => s + x.amount, 0);
}

function statCards(state) {
  const income = totalIncome(state);
  const spent = totalSpent(state);
  const left = income - spent;
  const budget = state.categories.reduce((s, c) => s + c.budget, 0);
  return `<section class="cards">
    <article class="card income"><p class="card-label">Pemasukan bulan ini</p><p class="card-value">${rupiah(income)}</p><p class="card-sub">3 sumber · gajian 25 &amp; 28 Nov</p></article>
    <article class="card spent"><p class="card-label">Sudah terpakai</p><p class="card-value">${rupiah(spent)}</p><p class="card-sub">${percent(spent, income)}% dari pemasukan</p></article>
    <article class="card left"><p class="card-label">Sisa uang</p><p class="card-value">${rupiah(left)}</p><p class="card-sub">dari anggaran ${rupiahShort(budget)}</p></article>
  </section>`;
}

function upcomingBills(state) {
  const unpaid = state.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const rows = unpaid.map((b) =>
    `<li><span class="bill-day">${b.dueDay} Nov</span><span class="bill-name">${b.name}</span><strong>${rupiah(b.amount)}</strong></li>`).join("");
  return `<section class="panel"><h2>Tagihan yang belum dibayar</h2>
    <ul class="bill-list">${rows}</ul>
    <p><a class="link" href="#/bills">Lihat kalender tagihan →</a></p></section>`;
}

function recentExpenses(state) {
  const rows = [...state.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((e) => {
    const c = categoryOf(state, e.category);
    return `<li><span class="dot" style="background:${c.color}"></span><span class="exp-desc">${e.desc}</span><span class="exp-date">${dateLabel(e.date)}</span><strong>${rupiah(e.amount)}</strong></li>`;
  }).join("");
  return `<section class="panel"><h2>Pengeluaran terakhir</h2><ul class="exp-list">${rows}</ul>
    <p><a class="link" href="#/expenses">Buka pelacak pengeluaran →</a></p></section>`;
}

export function viewDashboard(state) {
  const spent = spentByCategory(state);
  const rows = state.categories
    .map((c) => ({ ...c, spent: spent[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  const donut = donutChart(rows.filter((r) => r.spent > 0).map((r) => ({ label: r.label, value: r.spent, color: r.color })));
  const tips = state.tips.map((t) => `<article class="tip"><h3>${t.title}</h3><p>${t.body}</p></article>`).join("");
  return `<h1>Dashboard — ${state.household.month}</h1>
  <p class="lede">Selamat pagi, ${state.household.name}. Ini kondisi uang keluarga sampai 26 November — semua angka sudah termasuk pengeluaran hari ini.</p>
  ${statCards(state)}
  <div class="grid-2">
    <section class="panel"><h2>Pengeluaran per kategori</h2>${categoryBars(rows)}</section>
    <section class="panel"><h2>Ke mana uang pergi</h2>${donut}</section>
  </div>
  <div class="grid-2">
    ${upcomingBills(state)}
    ${recentExpenses(state)}
  </div>
  <section class="panel"><h2>Catatan untuk keluarga</h2><div class="tips">${tips}</div></section>`;
}

export function viewPlanner(state) {
  const income = totalIncome(state);
  const spent = spentByCategory(state);
  const budget = state.categories.reduce((s, c) => s + c.budget, 0);
  const rows = state.categories.map((c) => {
    const used = spent[c.id] || 0;
    const left = c.budget - used;
    return `<article class="plan-row" data-cat="${c.id}">
      <div class="plan-head"><span class="dot" style="background:${c.color}"></span><strong>${c.label}</strong>
        <span class="plan-amount">${rupiah(c.budget)}</span></div>
      <input type="range" min="0" max="5000000" step="50000" value="${c.budget}" data-slider="${c.id}" aria-label="Anggaran ${c.label}">
      <p class="plan-sub">Terpakai ${rupiah(used)} · sisa ${rupiah(left)}${left < 0 ? " — <b class='over-text'>melewati anggaran!</b>" : ""}</p>
    </article>`;
  }).join("");
  return `<h1>Perencana Anggaran Bulanan</h1>
  <p class="lede">Geser untuk mengatur anggaran tiap kategori. Total anggaran tidak boleh melewati pemasukan ${rupiah(income)} — sisanya otomatis dihitung di bawah.</p>
  <section class="cards">
    <article class="card income"><p class="card-label">Pemasukan</p><p class="card-value">${rupiah(income)}</p></article>
    <article class="card spent"><p class="card-label">Total anggaran</p><p class="card-value" id="plan-total">${rupiah(budget)}</p></article>
    <article class="card left"><p class="card-label">Belum dialokasikan</p><p class="card-value" id="plan-free">${rupiah(income - budget)}</p></article>
  </section>
  <section class="panel"><h2>Anggaran per kategori</h2><div class="plan-list">${rows}</div>
  <div class="actions"><button id="plan-save" type="button">Simpan anggaran</button>
  <button id="plan-reset" type="button" class="ghost">Kembalikan ke awal</button>
  <span id="plan-msg" class="msg" role="status"></span></div></section>`;
}

export function viewExpenses(state, filter) {
  const cats = state.categories;
  const options = [`<option value="">Semua kategori</option>`].concat(
    cats.map((c) => `<option value="${c.id}"${filter.category === c.id ? " selected" : ""}>${c.label}</option>`)).join("");
  const list = state.expenses
    .filter((e) => (!filter.category || e.category === filter.category)
      && (!filter.q || (e.desc + " " + (e.note || "")).toLowerCase().includes(filter.q.toLowerCase())))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  const rows = list.map((e) => {
    const c = categoryOf(state, e.category);
    return `<tr><td>${dateLabel(e.date)}</td><td>${e.desc}${e.note ? `<br><span class="note">${e.note}</span>` : ""}</td>
      <td><span class="chip" style="background:${c.color}">${c.label}</span></td>
      <td class="num">${rupiah(e.amount)}</td>
      <td><button type="button" data-edit="${e.id}">Ubah</button> <button type="button" data-del="${e.id}" class="danger">Hapus</button></td></tr>`;
  }).join("") || `<tr><td colspan="5">Tidak ada pengeluaran yang cocok. Coba ubah filter atau kata kunci.</td></tr>`;
  const total = list.reduce((s, e) => s + e.amount, 0);
  return `<h1>Pelacak Pengeluaran</h1>
  <p class="lede">${state.expenses.length} pengeluaran tercatat di bulan ini, total ${rupiah(totalSpent(state))}. Tambah, ubah, atau hapus — total dan grafik ikut berubah langsung.</p>
  <section class="panel"><h2>Tambah pengeluaran</h2>
    <form id="add-expense" class="form-grid">
      <label>Tanggal <input type="date" name="date" value="2026-11-26" required></label>
      <label>Keterangan <input type="text" name="desc" placeholder="cth: Pasar Minggu — sayur" required></label>
      <label>Kategori <select name="category">${cats.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")}</select></label>
      <label>Jumlah (Rp) <input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>
      <button type="submit">Tambah</button>
    </form></section>
  <section class="panel"><h2>Daftar pengeluaran <span class="count">${list.length} baris · ${rupiah(total)}</span></h2>
    <div class="filters">
      <label>Filter kategori <select id="filter-cat">${options}</select></label>
      <label>Cari <input type="search" id="filter-q" placeholder="cth: pasar" value="${filter.q || ""}"></label>
    </div>
    <div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th>Aksi</th></tr></thead>
    <tbody>${rows}</tbody></table></div></section>`;
}

export function viewGoals(state) {
  const cards = state.goals.map((g) => `<article class="goal-card">
    <h3>${g.name}</h3><p class="goal-note">${g.note}</p>
    ${progressBar(g.saved, g.target)}
    <p class="goal-amount">${rupiah(g.saved)} dari ${rupiah(g.target)} · kurang ${rupiah(g.target - g.saved)}</p>
    <form class="goal-add" data-goal="${g.id}"><label>Tambah tabungan (Rp)
      <input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>
      <button type="submit">Setor</button></form>
  </article>`).join("");
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `<h1>Target Tabungan</h1>
  <p class="lede">Empat target keluarga: total terkumpul ${rupiah(totalSaved)} dari ${rupiah(totalTarget)} (${percent(totalSaved, totalTarget)}%). Setor kapan saja — progres langsung bertambah.</p>
  <section class="panel"><h2>Semua target</h2><div class="goal-grid">${cards}</div></section>
  <section class="panel"><h2>Tambah target baru</h2>
    <form id="add-goal" class="form-grid">
      <label>Nama target <input type="text" name="name" placeholder="cth: DP motor baru" required></label>
      <label>Target (Rp) <input type="number" name="target" min="100000" step="50000" placeholder="5000000" required></label>
      <label>Sudah terkumpul (Rp) <input type="number" name="saved" min="0" step="50000" value="0"></label>
      <button type="submit">Buat target</button>
    </form></section>`;
}

export function viewBills(state) {
  const daysInMonth = 30;
  const firstWeekday = 5; // 1 Nov 2026 is a Sunday; grid starts Monday
  const byDay = {};
  for (const b of state.bills) (byDay[b.dueDay] ||= []).push(b);
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(`<td class="empty"></td>`);
  for (let d = 1; d <= daysInMonth; d++) {
    const bills = (byDay[d] || []).map((b) =>
      `<span class="cal-bill${b.paid ? " paid" : ""}">${b.name} · ${rupiahShort(b.amount)}</span>`).join("");
    cells.push(`<td${d === 26 ? ` class="today"` : ""}><b>${d}</b>${bills}</td>`);
  }
  while (cells.length % 7) cells.push(`<td class="empty"></td>`);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join("")}</tr>`);
  const list = [...state.bills].sort((a, b) => a.dueDay - b.dueDay).map((b) =>
    `<li><span class="bill-day">${b.dueDay} Nov</span><span class="bill-name">${b.name} <em>(${b.recurring})</em></span>
    <strong>${rupiah(b.amount)}</strong>
    <button type="button" data-bill="${b.id}" class="${b.paid ? "ghost" : ""}">${b.paid ? "Sudah dibayar ✓" : "Tandai dibayar"}</button></li>`).join("");
  const unpaidTotal = state.bills.filter((b) => !b.paid).reduce((s, b) => s + b.amount, 0);
  return `<h1>Kalender Tagihan — November 2026</h1>
  <p class="lede">Semua tagihan rutin keluarga dalam satu kalender. Yang belum dibayar: ${rupiah(unpaidTotal)} — ketuk “Tandai dibayar” setelah lunas.</p>
  <section class="panel"><h2>Kalender</h2>
    <div class="table-wrap"><table class="calendar"><thead><tr><th>Sen</th><th>Sel</th><th>Rab</th><th>Kam</th><th>Jum</th><th>Sab</th><th>Min</th></tr></thead>
    <tbody>${rows.join("")}</tbody></table></div>
    <p class="cal-note">Hari ini: <b>26 November</b> (kotak bergaris). Tagihan yang sudah dibayar berwarna hijau.</p></section>
  <section class="panel"><h2>Semua tagihan bulan ini</h2><ul class="bill-list big">${list}</ul></section>`;
}

export function viewReports(state) {
  const spent = spentByCategory(state);
  const rows = state.categories
    .map((c) => ({ ...c, spent: spent[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  const top = rows[0];
  const income = totalIncome(state);
  const spentTotal = totalSpent(state);
  const saved = income - spentTotal;
  const over = rows.filter((r) => r.spent > r.budget);
  const insights = [
    `Kategori terbesar bulan ini adalah <b>${top.label}</b> (${rupiah(top.spent)}, ${percent(top.spent, spentTotal)}% dari total pengeluaran).`,
    over.length
      ? `Ada ${over.length} kategori melewati anggaran: ${over.map((r) => r.label + " (" + rupiah(r.spent - r.budget) + " lebih)").join(", ")}.`
      : "Tidak ada kategori yang melewati anggaran — semua masih dalam batas.",
    `Sisa uang bulan ini ${rupiah(saved)} (${percent(saved, income)}% dari pemasukan). Disarankan pindahkan ke dana darurat sebelum akhir bulan.`,
    `Pengeluaran November ${rupiahShort(state.trend[5].spent)} adalah yang terendah dalam 6 bulan terakhir — turun ${rupiahShort(state.trend[4].spent - state.trend[5].spent)} dari Oktober.`,
  ].map((x) => `<li>${x}</li>`).join("");
  return `<h1>Laporan &amp; Grafik</h1>
  <p class="lede">Ringkasan November 2026: pemasukan ${rupiah(income)}, pengeluaran ${rupiah(spentTotal)}, sisa ${rupiah(saved)}.</p>
  ${statCards(state)}
  <section class="panel"><h2>Tren 6 bulan — pengeluaran vs pemasukan</h2>${trendChart(state.trend)}</section>
  <div class="grid-2">
    <section class="panel"><h2>Pembagian pengeluaran</h2>${donutChart(rows.filter((r) => r.spent > 0).map((r) => ({ label: r.label, value: r.spent, color: r.color })))}</section>
    <section class="panel"><h2>Yang perlu diperhatikan</h2><ul class="insights">${insights}</ul></section>
  </div>
  <section class="panel"><h2>Rincian per kategori</h2>${categoryBars(rows)}</section>`;
}
