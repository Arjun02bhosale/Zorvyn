# Finarc — Finance Dashboard

A React-based personal finance dashboard with a **landing experience**, **glass-style top navigation**, full **Dashboard / Transactions / Insights** views, **role-based UI** (viewer vs admin), **local persistence**, and analytics charts.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI and component model |
| **Create React App** (`react-scripts` 5) | Build tooling and dev server |
| **Recharts** | Area, bar, pie/donut charts |
| **date-fns** | Date formatting and period logic |
| **lucide-react** | Icons |
| **GSAP** | Topbar nav micro-interactions (entry + hover) |
| **CSS variables** (`index.css`) | Dark / light theme tokens |
| **CSS Modules** | Scoped **Topbar** glassmorphism (`Topbar.module.css`) |
| **Context API + `useReducer`** | Global app state (`AppContext`) |
| **`localStorage`** | Persist role, theme, transactions, filters, dashboard period |

No TypeScript, Redux, React Router, or Tailwind — navigation is **in-app state** (`activePage` + optional landing flag).

---

## Prerequisites

- **Node.js** 16+ (18+ recommended)
- **npm** 7+

---

## Setup & Run

```bash
cd finance-dashboard
npm install
npm start
```

Open **http://localhost:3000** — the dev server starts with hot reload.

### Production build

```bash
npm run build
```

Static output is written to **`build/`** (suitable for static hosting).

### Landing video asset

Place your hero video at **`public/video.mp4`**. The landing page loads it via `process.env.PUBLIC_URL`. If the file is missing, the video area may not play until you add it.

---

## Usage

### First load & navigation

1. **Landing** — Hero video, headline, CTAs (**Dashboard**, **Transactions**, **Insights**), scrollable sections, and stats.
2. Choosing a section or using the **top bar** opens the main app on that page.
3. **Finarc logo** — Calls **`onGoHome`**, which sets the landing view again (**`App.js`** / **`Topbar.js`**). Section links use **`onOpenAppPage`** to open Dashboard, Transactions, or Insights.

### Top navigation (all screens)

- **Glass bar** — Semi-transparent background, `backdrop-filter` blur, theme-aware dark/light styles (**`Topbar.module.css`**).
- **Links** — Dashboard, Transactions, Insights (desktop inline; **mobile drawer** with hamburger).
- **Role** — **Viewer** / **Admin** toggle (same rules everywhere).
- **Theme** — Dark / light toggle (applies `html.light` + CSS variables).
- **Admin hint** — “Press **N** to add” opens **Transactions** and triggers the add-transaction modal (skipped when focus is in inputs).

### Footer (all screens)

- **Site footer** is rendered in **`App.js`** below `<main>`, so it appears on **landing and every app page**.
- **Explore** links mirror the main sections (`onOpenAppPage`).
- **Social** — LinkedIn and GitHub URLs are defined in **`src/components/layout/Footer.js`** (update there for your profiles).

### Dashboard

- Summary KPIs, period selector (**`dashboardPeriod`** in context), balance trend, spending breakdown, recent transactions.

### Transactions

- Filterable, sortable table; pagination; CSV export; **add / edit / delete** only in **Admin** (viewer sees a notice).

### Insights

- Spending highlights, month-over-month comparison, savings bars, category breakdown, monthly table.

### State & persistence

- **`AppContext`** holds: `transactions`, `filters`, `role`, `theme`, `dashboardPeriod`, `activePage`.
- **`localStorage`** key: `finance_dashboard_state_v2` — persists role, theme, transactions, filters, and dashboard period (not the landing vs app shell flag).

---

## Role matrix (frontend simulation)

| Capability | Viewer | Admin |
|------------|:------:|:-----:|
| View Dashboard / Transactions / Insights | ✅ | ✅ |
| Add / edit / delete transactions | ❌ | ✅ |
| Export CSV | ✅ | ✅ |

---

## Project structure

```
finance-dashboard/
├── public/
│   ├── index.html
│   └── video.mp4              # Landing hero video (add if not present)
├── src/
│   ├── App.js                 # Shell: Topbar, main, Footer, landing toggle
│   ├── index.js
│   ├── index.css              # Global design system & component styles
│   ├── components/
│   │   ├── dashboard/         # DashboardPage, charts, cards
│   │   ├── transactions/      # TransactionsPage, TransactionModal
│   │   ├── insights/          # InsightsPage
│   │   ├── landing/           # LandingPage
│   │   ├── layout/
│   │   │   ├── Topbar.js
│   │   │   ├── Topbar.module.css   # Glass navbar (scoped)
│   │   │   └── Footer.js
│   │   └── ui/                # Toast
│   ├── context/
│   │   └── AppContext.js      # Reducer + persistence
│   ├── data/
│   │   └── transactions.js    # Mock data + categories
│   └── utils/
│       └── finance.js         # Calculations, filters, CSV helpers
└── package.json
```

---

## Design notes

- **Typography:** **Inter** (Google Fonts) for UI and headings.
- **Palette:** Dark luxury base with **gold** (`#d4af37`) accents; light theme mirrors the same tokens.
- **Responsive:** Topbar collapses nav into a drawer on small viewports; dashboard and tables adapt with CSS breakpoints in **`index.css`**.

---

## Assumptions

- Currency and copy are oriented around **Indian Rupees (₹)** and sample data in **`src/data/transactions.js`**.
- **No backend** — all data is client-side; roles are not secure authentication.
- **Balance / periods** follow the logic implemented in **`utils/finance.js`** and dashboard components.

---

## Optional ideas for extension

- Replace in-memory routing with **React Router** and deep links.
- Real auth and API-backed transactions.
- Replace or compress **`video.mp4`** for faster first paint.

---

## License

Private project (`"private": true` in `package.json`). Add a license file if you open-source the repo.
