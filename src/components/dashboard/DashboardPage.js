import React from "react";
import { CalendarDays } from "lucide-react";
import { useApp } from "../../context/AppContext";
import SummaryCards from "./SummaryCards";
import BalanceTrend from "./BalanceTrend";
import SpendingBreakdown from "./SpendingBreakdown";
import RecentTransactions from "./RecentTransactions";

const PERIODS = [
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_3",     label: "Last 3 Months" },
  { value: "LAST_6",     label: "Last 6 Months" },
  { value: "ALL",        label: "All Time" },
];

export default function DashboardPage() {
  const { state, dispatch } = useApp();
  const period = state.dashboardPeriod || "ALL";

  return (
    <div className="page" key="dashboard">
      {/* Period selector */}
      <div className="dashboard-period-bar">
        <div className="dashboard-period-label">
          <CalendarDays size={14} strokeWidth={2} />
          Period
        </div>
        <div className="period-tabs">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              className={`period-tab ${period === p.value ? "active" : ""}`}
              onClick={() => dispatch({ type: "SET_DASHBOARD_PERIOD", payload: p.value })}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <SummaryCards period={period} />
      <div className="charts-grid">
        <BalanceTrend period={period} />
        <SpendingBreakdown period={period} />
      </div>
      <RecentTransactions />
    </div>
  );
}
