import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { getMonthlyData, filterByPeriod, formatCurrency } from "../../utils/finance";

const PERIOD_MONTHS = { THIS_MONTH: 1, LAST_3: 3, LAST_6: 6, ALL: 6 };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((entry) => (
        <div key={entry.name} className="tooltip-row">
          <div className="tooltip-dot" style={{ background: entry.color }} />
          <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{entry.name}:</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            {formatCurrency(entry.value, true)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BalanceTrend({ period }) {
  const { state } = useApp();
  const months = PERIOD_MONTHS[period] || 6;
  const data   = getMonthlyData(state.transactions, months);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Income vs Expenses</div>
          <div className="chart-subtitle">{months === 1 ? "This month" : `${months}-month overview`}</div>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "var(--green)" }} />
            Income
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: "var(--red)" }} />
            Expenses
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--green)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--red)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month"
            tick={{ fontSize: 12, fill: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => formatCurrency(v, true)}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-hover)", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="income"   name="Income"
            stroke="var(--green)" strokeWidth={2} fill="url(#incomeGrad)"
            dot={{ fill: "var(--green)", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "var(--green)", strokeWidth: 0 }}
          />
          <Area type="monotone" dataKey="expenses" name="Expenses"
            stroke="var(--red)" strokeWidth={2} fill="url(#expenseGrad)"
            dot={{ fill: "var(--red)", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: "var(--red)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
