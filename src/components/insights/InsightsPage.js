import React from "react";
import {
  Tag, CalendarDays, IndianRupee, BarChart2,
  Utensils, Car, ShoppingBag, Zap, HeartPulse,
  Clapperboard, Briefcase, Monitor, TrendingUp, Home,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getInsights, getMonthlyData, formatCurrency } from "../../utils/finance";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const CATEGORY_ICONS = {
  FOOD: Utensils, TRANSPORT: Car, SHOPPING: ShoppingBag, UTILITIES: Zap,
  HEALTH: HeartPulse, ENTERTAINMENT: Clapperboard, SALARY: Briefcase,
  FREELANCE: Monitor, INVESTMENT: TrendingUp, RENT: Home,
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="tooltip-row">
          <div className="tooltip-dot" style={{ background: entry.fill }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{entry.name}:</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {formatCurrency(entry.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  const { state } = useApp();
  const insights = getInsights(state.transactions);
  const monthly  = getMonthlyData(state.transactions, 6);

  const TopCatIcon = insights.topCategory
    ? (CATEGORY_ICONS[insights.topCategory.category] || Tag)
    : Tag;

  const insightCards = [
    {
      Icon: TopCatIcon,
      iconBg: "var(--gold-dim)",
      iconColor: "var(--gold)",
      title: "Top Spending Category",
      value: insights.topCategory?.label || "—",
      desc: insights.topCategory
        ? `${formatCurrency(insights.topCategory.value)} across ${insights.topCategory.count} transactions`
        : "No expense data yet",
      badge: null,
      badgeClass: "badge-neutral",
    },
    {
      Icon: CalendarDays,
      iconBg: "var(--blue-dim)",
      iconColor: "var(--blue)",
      title: "Expenses vs Last Month",
      value: insights.thisMonthExpenses > 0 ? formatCurrency(insights.thisMonthExpenses) : "₹0",
      desc: insights.lastMonthExpenses > 0
        ? `Last month: ${formatCurrency(insights.lastMonthExpenses)}`
        : "No prior month data",
      badge: insights.expenseChange !== 0
        ? `${insights.expenseChange > 0 ? "+" : ""}${insights.expenseChange}%`
        : "No change",
      badgeClass: insights.expenseChange > 0 ? "badge-up" : insights.expenseChange < 0 ? "badge-down" : "badge-neutral",
    },
    {
      Icon: IndianRupee,
      iconBg: "var(--green-dim)",
      iconColor: "var(--green)",
      title: "Income vs Last Month",
      value: insights.thisMonthIncome > 0 ? formatCurrency(insights.thisMonthIncome) : "₹0",
      desc: insights.lastMonthIncome > 0
        ? `Last month: ${formatCurrency(insights.lastMonthIncome)}`
        : "No prior month data",
      badge: insights.incomeChange !== 0
        ? `${insights.incomeChange > 0 ? "+" : ""}${insights.incomeChange}%`
        : "No change",
      badgeClass: insights.incomeChange > 0 ? "badge-down" : "badge-up",
    },
  ];

  return (
    <div className="page" key="insights">
      <div className="insights-grid">
        {insightCards.map((card, i) => {
          const { Icon } = card;
          return (
            <div key={i} className="insight-card">
              <div className="insight-header">
                <div
                  className="insight-icon"
                  style={{ background: card.iconBg, color: card.iconColor }}
                >
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                {card.badge && (
                  <span className={`insight-badge ${card.badgeClass}`}>{card.badge}</span>
                )}
              </div>
              <div className="insight-title">{card.title}</div>
              <div className="insight-value">{card.value}</div>
              <div className="insight-desc">{card.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Monthly net savings bar chart */}
      <div className="charts-grid" style={{ marginBottom: 28 }}>
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Monthly Net Savings</div>
              <div className="chart-subtitle">Income minus expenses per month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-elevated)" }} />
              <Bar dataKey="net" name="Net Savings" radius={[4, 4, 0, 0]}>
                {monthly.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.net >= 0 ? "var(--green)" : "var(--red)"} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Top Spending Categories</div>
              <div className="chart-subtitle">All-time breakdown</div>
            </div>
          </div>
          {insights.categoryBreakdown.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <BarChart2 size={40} strokeWidth={1.25} />
              </div>
              <div className="empty-title">No data yet</div>
            </div>
          ) : (
            <div className="category-list" style={{ marginTop: 8 }}>
              {insights.categoryBreakdown.map((item) => {
                const CatIcon = CATEGORY_ICONS[item.category] || Tag;
                const max      = insights.categoryBreakdown[0]?.value || 1;
                const pct      = Math.round((item.value / max) * 100);
                const total    = insights.categoryBreakdown.reduce((s, c) => s + c.value, 0);
                const totalPct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <div key={item.category} className="category-item">
                    <span className="category-icon-sm">
                      <CatIcon size={14} strokeWidth={1.75} />
                    </span>
                    <div className="category-bar-container">
                      <div className="category-bar-label">
                        <span>{item.label}</span>
                        <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                          {formatCurrency(item.value, true)}{" "}
                          <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({totalPct}%)</span>
                        </span>
                      </div>
                      <div className="category-bar-track">
                        <div className="category-bar-fill" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Monthly summary table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <div className="chart-title">Monthly Summary</div>
          <div className="chart-subtitle" style={{ marginTop: 2 }}>Detailed month-by-month breakdown</div>
        </div>
        <table className="monthly-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Net Savings</th>
              <th>Savings Rate</th>
            </tr>
          </thead>
          <tbody>
            {monthly.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>No data</td></tr>
            ) : (
              monthly.map((row) => {
                const rate = row.income > 0 ? Math.round(((row.income - row.expenses) / row.income) * 100) : 0;
                return (
                  <tr key={row.fullMonth}>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{row.fullMonth}</td>
                    <td style={{ color: "var(--green)", fontWeight: 600 }}>{formatCurrency(row.income)}</td>
                    <td style={{ color: "var(--red)", fontWeight: 600 }}>{formatCurrency(row.expenses)}</td>
                    <td style={{ color: row.net >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                      {row.net >= 0 ? "+" : ""}{formatCurrency(row.net)}
                    </td>
                    <td>
                      <span style={{
                        background: rate >= 20 ? "var(--green-dim)" : rate >= 0 ? "var(--gold-dim)" : "var(--red-dim)",
                        color: rate >= 20 ? "var(--green)" : rate >= 0 ? "var(--gold)" : "var(--red)",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                      }}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
