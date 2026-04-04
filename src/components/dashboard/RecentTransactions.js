import React from "react";
import { ArrowRight, ClipboardList,
  Utensils, Car, ShoppingBag, Zap, HeartPulse,
  Clapperboard, Briefcase, Monitor, TrendingUp, Home } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/finance";
import { format, parseISO } from "date-fns";

const CATEGORY_ICONS = {
  FOOD:          Utensils,
  TRANSPORT:     Car,
  SHOPPING:      ShoppingBag,
  UTILITIES:     Zap,
  HEALTH:        HeartPulse,
  ENTERTAINMENT: Clapperboard,
  SALARY:        Briefcase,
  FREELANCE:     Monitor,
  INVESTMENT:    TrendingUp,
  RENT:          Home,
};

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const goToTransactions = () =>
    dispatch({ type: "SET_ACTIVE_PAGE", payload: "transactions" });

  return (
    <div className="card" style={{ marginTop: 0 }}>
      <div className="section-header">
        <div className="section-title">Recent Transactions</div>
        <button className="btn btn-secondary btn-sm" onClick={goToTransactions}
          style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          View all <ArrowRight size={13} strokeWidth={2} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><ClipboardList size={40} strokeWidth={1.25} /></div>
          <div className="empty-title">No transactions yet</div>
          <div className="empty-desc">Add your first transaction to get started</div>
        </div>
      ) : (
        <div>
          {recent.map((txn) => {
            const CatIcon = CATEGORY_ICONS[txn.category] || Briefcase;
            return (
              <div key={txn.id} className="txn-row">
                <div className="txn-cat-icon">
                  <CatIcon size={16} strokeWidth={1.75} />
                </div>
                <div className="txn-info">
                  <div className="txn-desc">{txn.description}</div>
                  <div className="txn-meta">
                    {txn.categoryData.label} · {format(parseISO(txn.date), "MMM d, yyyy")}
                  </div>
                </div>
                <div
                  className="txn-amount"
                  style={{ color: txn.type === "income" ? "var(--green)" : "var(--red)" }}
                >
                  {txn.type === "income" ? "+" : "−"}{formatCurrency(txn.amount, true)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
