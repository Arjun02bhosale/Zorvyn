import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  Utensils, Car, ShoppingBag, Zap, HeartPulse,
  Clapperboard, Briefcase, Monitor, TrendingUp, Home, Tag,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getCategoryBreakdown, filterByPeriod, formatCurrency } from "../../utils/finance";

const CATEGORY_ICONS = {
  FOOD: Utensils, TRANSPORT: Car, SHOPPING: ShoppingBag, UTILITIES: Zap,
  HEALTH: HeartPulse, ENTERTAINMENT: Clapperboard, SALARY: Briefcase,
  FREELANCE: Monitor, INVESTMENT: TrendingUp, RENT: Home,
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const CatIcon = CATEGORY_ICONS[d.category] || Tag;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-row" style={{ gap: 8 }}>
        <CatIcon size={14} strokeWidth={1.75} style={{ color: d.color, flexShrink: 0 }} />
        <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{d.label}</span>
      </div>
      <div style={{ marginTop: 6, color: "var(--text-secondary)", fontSize: 12 }}>
        {formatCurrency(d.value)} · {d.count} txns
      </div>
    </div>
  );
}

export default function SpendingBreakdown({ period }) {
  const { state }      = useApp();
  const [activeIndex, setActiveIndex] = useState(null);
  const txns = filterByPeriod(state.transactions, period);
  const data = getCategoryBreakdown(txns, "expense").slice(0, 6);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Spending by Category</div>
          <div className="chart-subtitle">Expense breakdown</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={50} outerRadius={72}
            paddingAngle={3} dataKey="value"
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.35}
                style={{ cursor: "pointer", transition: "opacity 150ms" }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="category-list">
        {data.map((item, i) => {
          const CatIcon = CATEGORY_ICONS[item.category] || Tag;
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.category}
              className="category-item"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{ opacity: activeIndex === null || activeIndex === i ? 1 : 0.45, transition: "opacity 150ms", cursor: "default" }}
            >
              <span className="category-icon-sm">
                <CatIcon size={14} strokeWidth={1.75} />
              </span>
              <div className="category-bar-container">
                <div className="category-bar-label">
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {formatCurrency(item.value, true)}{" "}
                    <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({pct}%)</span>
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
    </div>
  );
}
