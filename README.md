# RumahBudget — Household Budget Site

[![make.fun bounty](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=jfeejy4f)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/akhaananda27-tech/household-budget-site-20261127/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=jfeejy4f)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/akhaananda27-tech/household-budget-site-20261127/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=jfeejy4f)

A working household budget site for one family — the Hartonos of Jakarta,
November 2026 — that runs entirely from static files, offline, on desktop
and on a phone. Built for the [make.fun bounty "Make the best household
budget site"](https://make.fun/bounty/best-household-budget-site-20261126-1457?ref=jfeejy4f).

## What it does

- **Dashboard** — income vs. spending vs. money left, spending per category,
  a donut of where the money goes, unpaid bills, recent expenses, and tips.
- **Monthly budget planner** — sliders per category; the total and the
  unallocated remainder recalculate live, and the plan can be saved.
- **Expense tracker** — 26 real expenses for the month; add, edit, or delete
  rows, filter by category, search by keyword. Totals update immediately.
- **Savings goals** — four family targets with progress bars; deposit money
  and watch the bar move, or add a new target.
- **Bills calendar** — every recurring bill on a November calendar, plus a
  list where each bill can be marked paid.
- **Reports** — a 6-month spending-vs-income trend chart, a category
  breakdown, and computed insights (biggest category, over-budget warnings,
  money left to move to the emergency fund).

Every figure is real data for the household (Rp 14.500.000 income,
Rp 9.442.000 spent so far in November), and every control does what it says.
Edits are kept in the browser's local storage; a reset button restores the
starting figures.

## Run it

No build step, no network. Serve `app/` with any static server, or open
`app/index.html` — e.g. `python3 -m http.server` from `app/`, then visit
`http://localhost:8000/`. Pages are hash routes (`#/planner`, `#/expenses`,
`#/goals`, `#/bills`, `#/reports`).

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
into the output directory and writes `dossier.json` with the vendored
`vendor/makefun-frontend.ts` library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots in `screenshots/` are real renders of this site in headless
Chrome: the dashboard, the planner, the expense tracker (1280×800), and the
reports page at phone size (390×844).

## Layout

- `app/index.html` — page shell, navigation, footer
- `app/style.css` — the whole look (system fonts only, no downloads)
- `app/main.js` — router, state, and every control's wiring
- `app/views.js` — one function per page, turning state into HTML
- `app/charts.js` — SVG bar, donut, and trend charts
- `app/data.js` — the household's seed figures
- `app/format.js` — rupiah and date formatting
- `vendor/makefun-frontend.ts` — make.fun dossier library, unchanged from the kit

License: MIT.
