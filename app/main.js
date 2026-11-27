// main.js — one job: run the site. It owns the router, the household state
// (seeded from data.js, kept in localStorage after edits) and every control
// on every page: sliders, forms, filters, edit/delete, deposits, bill toggles.

import { HOUSEHOLD, INCOME, CATEGORIES, EXPENSES, GOALS, BILLS, MONTHLY_TREND, TIPS } from "./data.js";
import { viewDashboard, viewPlanner, viewExpenses, viewGoals, viewBills, viewReports, totalIncome, totalSpent } from "./views.js";
import { rupiah } from "./format.js";

const STORAGE_KEY = "rumahbudget-v1";

function seedState() {
  return {
    household: HOUSEHOLD,
    income: structuredClone(INCOME),
    categories: structuredClone(CATEGORIES),
    expenses: structuredClone(EXPENSES),
    goals: structuredClone(GOALS),
    bills: structuredClone(BILLS),
    trend: structuredClone(MONTHLY_TREND),
    tips: structuredClone(TIPS),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const saved = JSON.parse(raw);
    const base = seedState();
    return { ...base, ...saved, household: base.household, income: base.income, trend: base.trend, tips: base.tips };
  } catch {
    return seedState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      categories: state.categories, expenses: state.expenses,
      goals: state.goals, bills: state.bills,
    }));
  } catch { /* private mode: edits still work for this visit */ }
}

const state = loadState();
const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("[data-route]")];

const ROUTES = {
  "": viewDashboard,
  "/": viewDashboard,
  "/planner": viewPlanner,
  "/expenses": (s) => viewExpenses(s, expenseFilter),
  "/goals": viewGoals,
  "/bills": viewBills,
  "/reports": viewReports,
};

const TITLES = {
  "": "Dashboard", "/": "Dashboard", "/planner": "Perencana Anggaran",
  "/expenses": "Pelacak Pengeluaran", "/goals": "Target Tabungan",
  "/bills": "Kalender Tagihan", "/reports": "Laporan & Grafik",
};

const expenseFilter = { category: "", q: "" };

function currentRoute() {
  const hash = location.hash.replace(/^#/, "") || "/";
  return ROUTES[hash] ? hash : "/";
}

function render() {
  const route = currentRoute();
  app.innerHTML = ROUTES[route](state);
  document.title = "RumahBudget — " + TITLES[route];
  for (const a of navLinks) a.classList.toggle("active", a.dataset.route === route);
  wirePage(route);
  window.scrollTo(0, 0);
}

function refreshPlannerTotals() {
  const budget = state.categories.reduce((s, c) => s + c.budget, 0);
  const total = document.getElementById("plan-total");
  const free = document.getElementById("plan-free");
  if (total) total.textContent = rupiah(budget);
  if (free) free.textContent = rupiah(totalIncome(state) - budget);
}

function wirePage(route) {
  if (route === "/planner") {
    app.querySelectorAll("[data-slider]").forEach((input) => {
      input.addEventListener("input", () => {
        const cat = state.categories.find((c) => c.id === input.dataset.slider);
        if (!cat) return;
        cat.budget = Number(input.value);
        const row = input.closest(".plan-row");
        const amount = row.querySelector(".plan-amount");
        if (amount) amount.textContent = rupiah(cat.budget);
        refreshPlannerTotals();
      });
    });
    const save = document.getElementById("plan-save");
    if (save) save.addEventListener("click", () => {
      saveState(state);
      const msg = document.getElementById("plan-msg");
      if (msg) msg.textContent = "Anggaran tersimpan ✓";
    });
    const reset = document.getElementById("plan-reset");
    if (reset) reset.addEventListener("click", () => {
      state.categories = structuredClone(CATEGORIES);
      saveState(state);
      render();
    });
  }

  if (route === "/expenses") {
    const form = document.getElementById("add-expense");
    if (form) form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const nextId = Math.max(0, ...state.expenses.map((e) => e.id)) + 1;
      state.expenses.push({
        id: nextId,
        date: String(data.get("date") || "2026-11-26"),
        desc: String(data.get("desc") || "").trim(),
        category: String(data.get("category")),
        amount: Math.max(0, Number(data.get("amount")) || 0),
        note: "",
      });
      saveState(state);
      render();
    });
    const catSel = document.getElementById("filter-cat");
    if (catSel) catSel.addEventListener("change", () => {
      expenseFilter.category = catSel.value;
      render();
      const again = document.getElementById("filter-cat");
      if (again) again.focus();
    });
    const q = document.getElementById("filter-q");
    if (q) q.addEventListener("input", () => {
      expenseFilter.q = q.value;
      render();
      const again = document.getElementById("filter-q");
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
    app.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.del);
        state.expenses = state.expenses.filter((e) => e.id !== id);
        saveState(state);
        render();
      });
    });
    app.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.edit);
        const e = state.expenses.find((x) => x.id === id);
        if (!e) return;
        const amount = prompt("Jumlah baru untuk “" + e.desc + "” (Rp):", String(e.amount));
        if (amount === null) return;
        const n = Math.max(0, Number(amount) || 0);
        if (n > 0) { e.amount = n; saveState(state); render(); }
      });
    });
  }

  if (route === "/goals") {
    app.querySelectorAll(".goal-add").forEach((form) => {
      form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const id = Number(form.dataset.goal);
        const g = state.goals.find((x) => x.id === id);
        const amount = Math.max(0, Number(new FormData(form).get("amount")) || 0);
        if (g && amount > 0) {
          g.saved = Math.min(g.target, g.saved + amount);
          saveState(state);
          render();
        }
      });
    });
    const add = document.getElementById("add-goal");
    if (add) add.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const data = new FormData(add);
      const nextId = Math.max(0, ...state.goals.map((g) => g.id)) + 1;
      state.goals.push({
        id: nextId,
        name: String(data.get("name") || "").trim(),
        target: Math.max(0, Number(data.get("target")) || 0),
        saved: Math.max(0, Number(data.get("saved")) || 0),
        note: "Target baru keluarga",
      });
      saveState(state);
      render();
    });
  }

  if (route === "/bills") {
    app.querySelectorAll("[data-bill]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const b = state.bills.find((x) => x.id === Number(btn.dataset.bill));
        if (b) { b.paid = !b.paid; saveState(state); render(); }
      });
    });
  }
}

// Footer totals, kept live on every page.
function renderFooter() {
  const el = document.getElementById("foot-totals");
  if (el) el.textContent = `Bulan ini: pemasukan ${rupiah(totalIncome(state))} · terpakai ${rupiah(totalSpent(state))} · sisa ${rupiah(totalIncome(state) - totalSpent(state))}`;
}

window.addEventListener("hashchange", () => { render(); renderFooter(); });
document.getElementById("reset-data").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  location.hash = "#/";
  location.reload();
});

render();
renderFooter();
