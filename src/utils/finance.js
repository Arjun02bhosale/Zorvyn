import {
  format, parseISO, startOfMonth, endOfMonth,
  isWithinInterval, subMonths, startOfDay,
} from "date-fns";
import { INITIAL_BALANCE } from "../data/transactions";

export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (compact && amount >= 1000)   return `₹${(amount / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(amount);
}

// Filter transactions by dashboard period
export function filterByPeriod(transactions, period) {
  if (!period || period === "ALL") return transactions;
  const now = new Date();
  const cutoffs = {
    THIS_MONTH: startOfMonth(now),
    LAST_3:     subMonths(now, 3),
    LAST_6:     subMonths(now, 6),
  };
  const cutoff = cutoffs[period];
  if (!cutoff) return transactions;
  return transactions.filter((t) => parseISO(t.date) >= cutoff);
}

export function getMonthlyData(transactions, monthsBack = 6) {
  const result = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const start = startOfMonth(monthDate);
    const end   = endOfMonth(monthDate);
    const monthTxns = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start, end });
    });
    const income   = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    result.push({
      month:     format(monthDate, "MMM"),
      fullMonth: format(monthDate, "MMM yyyy"),
      income,
      expenses,
      net: income - expenses,
    });
  }
  return result;
}

export function getCategoryBreakdown(transactions, type = "expense") {
  const filtered = transactions.filter((t) => t.type === type);
  const map = {};
  filtered.forEach((t) => {
    if (!map[t.category]) {
      map[t.category] = { ...t.categoryData, category: t.category, value: 0, count: 0 };
    }
    map[t.category].value += t.amount;
    map[t.category].count += 1;
  });
  return Object.values(map).sort((a, b) => b.value - a.value);
}

export function getSummary(transactions) {
  const income   = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance:  INITIAL_BALANCE + income - expenses,
    totalIncome:   income,
    totalExpenses: expenses,
    savingsRate:   income > 0 ? Math.round(((income - expenses) / income) * 100) : 0,
  };
}

export function getInsights(transactions) {
  const now = new Date();
  const thisMonth = transactions.filter((t) =>
    isWithinInterval(parseISO(t.date), { start: startOfMonth(now), end: endOfMonth(now) })
  );
  const lastMonth = transactions.filter((t) => {
    const lm = subMonths(now, 1);
    return isWithinInterval(parseISO(t.date), { start: startOfMonth(lm), end: endOfMonth(lm) });
  });

  const thisExpenses = thisMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastMonth.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const thisIncome   = thisMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const lastIncome   = lastMonth.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const catBreakdown = getCategoryBreakdown(transactions);
  const topCategory  = catBreakdown[0];

  return {
    topCategory,
    expenseChange:       lastExpenses > 0 ? Math.round(((thisExpenses - lastExpenses) / lastExpenses) * 100) : 0,
    incomeChange:        lastIncome > 0   ? Math.round(((thisIncome - lastIncome)     / lastIncome)   * 100) : 0,
    thisMonthExpenses:   thisExpenses,
    lastMonthExpenses:   lastExpenses,
    thisMonthIncome:     thisIncome,
    lastMonthIncome:     lastIncome,
    categoryBreakdown:   catBreakdown.slice(0, 5),
  };
}

export function applyFilters(transactions, filters) {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.categoryData.label.toLowerCase().includes(q)
    );
  }
  if (filters.category !== "ALL")  result = result.filter((t) => t.category === filters.category);
  if (filters.type     !== "ALL")  result = result.filter((t) => t.type     === filters.type);

  if (filters.dateRange !== "ALL") {
    const now = new Date();
    const ranges = {
      THIS_MONTH: startOfMonth(now),
      LAST_30:    subMonths(now, 1),
      LAST_90:    subMonths(now, 3),
      LAST_180:   subMonths(now, 6),
    };
    const cutoff = ranges[filters.dateRange];
    if (cutoff) result = result.filter((t) => parseISO(t.date) >= cutoff);
  }

  result.sort((a, b) => {
    if (filters.sortBy === "date") {
      const diff = new Date(b.date) - new Date(a.date);
      return filters.sortOrder === "desc" ? diff : -diff;
    }
    if (filters.sortBy === "amount") {
      const diff = b.amount - a.amount;
      return filters.sortOrder === "desc" ? diff : -diff;
    }
    return 0;
  });

  return result;
}

export function exportToCSV(transactions) {
  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows    = transactions.map((t) => [
    t.date, `"${t.description}"`, t.categoryData.label, t.type, t.amount,
  ]);
  const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
