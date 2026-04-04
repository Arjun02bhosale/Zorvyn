import React from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, CheckCircle2, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getSummary, filterByPeriod, formatCurrency } from "../../utils/finance";

export default function SummaryCards({ period }) {
  const { state } = useApp();
  const txns   = filterByPeriod(state.transactions, period);
  const summary = getSummary(txns);

  const incomeCount  = txns.filter((t) => t.type === "income").length;
  const expenseCount = txns.filter((t) => t.type === "expense").length;
  const healthyRate  = summary.savingsRate >= 20;

  const cards = [
    {
      key: "balance", label: "Total Balance",
      value: formatCurrency(summary.totalBalance), Icon: Wallet,
      meta: "Net worth", metaClass: "", MetaIcon: null,
    },
    {
      key: "income", label: "Total Income",
      value: formatCurrency(summary.totalIncome), Icon: TrendingUp,
      meta: `${incomeCount} transaction${incomeCount !== 1 ? "s" : ""}`,
      metaClass: "change-positive", MetaIcon: null,
    },
    {
      key: "expense", label: "Total Expenses",
      value: formatCurrency(summary.totalExpenses), Icon: TrendingDown,
      meta: `${expenseCount} transaction${expenseCount !== 1 ? "s" : ""}`,
      metaClass: "change-negative", MetaIcon: null,
    },
    {
      key: "savings", label: "Savings Rate",
      value: `${summary.savingsRate}%`, Icon: PiggyBank,
      meta: healthyRate ? "Healthy rate" : "Room to improve",
      metaClass: healthyRate ? "change-positive" : "change-negative",
      MetaIcon: healthyRate ? CheckCircle2 : AlertCircle,
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map(({ key, label, value, Icon, meta, metaClass, MetaIcon }) => (
        <div key={key} className={`summary-card ${key}`}>
          <div className="summary-card-header">
            <div className="summary-card-label">{label}</div>
            <div className="summary-card-icon">
              <Icon size={17} strokeWidth={1.75} />
            </div>
          </div>
          <div className="summary-card-value">{value}</div>
          <div className="summary-card-meta">
            <span className={metaClass} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {MetaIcon && <MetaIcon size={12} strokeWidth={2} />}
              {meta}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
