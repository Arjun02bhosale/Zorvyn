# Finarc — Finance Dashboard

A clean, interactive finance dashboard built with React. Features a dark luxury aesthetic with gold accents, full RBAC simulation, data persistence, and rich analytics.

---

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher

### Installation & Running

```bash
# 1. Navigate into the project folder
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at **http://localhost:3000**

### Production Build

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

---

## Project Overview

**Finarc** is a personal finance tracker dashboard that allows users to monitor income, expenses, savings, and spending patterns across 6 months of mock data (60 transactions).

### Design Philosophy

The interface uses a **dark luxury aesthetic** — deep charcoal backgrounds, a gold accent palette (`#d4af37`), and the Syne + DM Sans type pairing — for a premium, high-signal feel. Every interaction includes smooth transitions (200ms cubic-bezier easing). A light mode is also available via the sidebar toggle.

---

## Feature Walkthrough

### 1. Dashboard Overview
- **4 Summary Cards**: Total Balance, Total Income, Total Expenses, Savings Rate — each with contextual color and a top-border accent on hover
- **Income vs Expenses Area Chart**: 6-month trend with gradient fills and interactive tooltips
- **Spending by Category Donut Chart**: Interactive hover state syncs chart + legend simultaneously
- **Recent Transactions**: Live list of the 6 most recent transactions with quick-access to the full list

### 2. Transactions Page
- Full paginated table (10 rows/page) with 60 pre-loaded transactions
- **Search**: Real-time filter by description or category name
- **Filters**: By category, type (income/expense), and date range (this month, 30/90/180 days)
- **Sorting**: Click column headers for Date or Amount — toggles asc/desc
- **Export CSV**: Downloads filtered transactions as a `.csv` file
- **Add/Edit/Delete**: Available in Admin mode — modal form with validation

### 3. Role-Based UI (RBAC Simulation)
Switch roles using the **sidebar toggle**:

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export CSV | ✅ | ✅ |

Viewer mode shows a blue notice banner on the transactions page.

### 4. Insights Page
- **Top Spending Category**: Identifies highest-spend category across all transactions
- **Month-over-Month Comparison**: Expense and income delta vs last month with percentage badges
- **Net Savings Bar Chart**: Monthly savings (green = positive, red = negative)
- **Category Breakdown Bar**: Top 5 expense categories with relative bar visualization
- **Monthly Summary Table**: All 6 months with income, expenses, net savings, and savings rate % pill

### 5. State Management
Uses **React Context + useReducer** (`AppContext.js`) with:
- `transactions` — full list, mutated by add/edit/delete
- `filters` — search, category, type, dateRange, sortBy, sortOrder
- `role` — "admin" | "viewer"
- `theme` — "dark" | "light"
- `activePage` — current view

All state except `activePage` is **persisted to localStorage** automatically and restored on reload.

### 6. UI/UX Details
- Fully responsive — collapses sidebar on mobile with overlay + hamburger menu
- Empty states handled gracefully (no transactions, no filter results)
- Hover-reveal action buttons in table rows (edit/delete only appear on hover)
- Animated page transitions (fadeInUp on route change)
- Dark/light mode with smooth CSS variable transitions
- Custom scrollbar, recharts tooltips themed to match the design system

---

## Project Structure

```
finance-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.js       # Main dashboard layout
│   │   │   ├── SummaryCards.js        # 4 KPI cards
│   │   │   ├── BalanceTrend.js        # Area chart (6-month)
│   │   │   ├── SpendingBreakdown.js   # Donut + category bars
│   │   │   └── RecentTransactions.js  # Latest 6 transactions
│   │   ├── transactions/
│   │   │   ├── TransactionsPage.js    # Table, filters, pagination
│   │   │   └── TransactionModal.js    # Add/edit form modal
│   │   ├── insights/
│   │   │   └── InsightsPage.js        # Analytics & comparisons
│   │   └── layout/
│   │       ├── Sidebar.js             # Nav, role toggle, theme
│   │       └── Topbar.js              # Page header, role badge
│   ├── context/
│   │   └── AppContext.js              # Global state (Context + Reducer)
│   ├── data/
│   │   └── transactions.js            # 60 mock transactions + CATEGORIES
│   ├── utils/
│   │   └── finance.js                 # Calculations, filters, export
│   ├── App.js                         # Root component + routing
│   ├── index.css                      # Full design system (CSS variables)
│   └── index.js                       # React entry point
└── package.json
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework |
| Recharts | Charts (Area, Bar, Pie) |
| date-fns | Date formatting & calculations |
| CSS Variables | Theming system (dark/light) |
| LocalStorage | State persistence |
| Context + useReducer | State management |

No TypeScript, no Redux, no Tailwind — kept intentionally lean to showcase clean vanilla React patterns.

---

## Assumptions Made

- Currency is Indian Rupees (₹) — common for Pune-based users
- "Balance" = a starting seed balance (₹42,000) + all income - all expenses
- Months shown are the current 6 calendar months (dynamically calculated)
- Roles are frontend-only — no authentication or backend required
- All data is mock/static but editable and persisted per browser session

---

## Optional Enhancements Included

- ✅ Dark mode / Light mode toggle
- ✅ LocalStorage persistence
- ✅ CSV export
- ✅ Animations and transitions
- ✅ Advanced filtering (search + category + type + date range)
