import React, { useState, useMemo, useEffect } from "react";
import {
  Search, Plus, Download, RotateCcw,
  Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  SearchX, Eye,
  Utensils, Car, ShoppingBag, Zap, HeartPulse,
  Clapperboard, Briefcase, Monitor, TrendingUp, Home,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useToast } from "../ui/Toast";
import { CATEGORIES } from "../../data/transactions";
import { applyFilters, formatCurrency, exportToCSV } from "../../utils/finance";
import { format, parseISO } from "date-fns";
import TransactionModal from "./TransactionModal";

const CATEGORY_ICONS = {
  FOOD: Utensils, TRANSPORT: Car, SHOPPING: ShoppingBag, UTILITIES: Zap,
  HEALTH: HeartPulse, ENTERTAINMENT: Clapperboard, SALARY: Briefcase,
  FREELANCE: Monitor, INVESTMENT: TrendingUp, RENT: Home,
};

const PAGE_SIZE = 10;

function SortIcon({ col, sortBy, sortOrder }) {
  if (sortBy !== col) return <ChevronsUpDown size={13} strokeWidth={1.75} style={{ opacity: 0.4, marginLeft: 3 }} />;
  return sortOrder === "desc"
    ? <ChevronDown size={13} strokeWidth={2} style={{ marginLeft: 3, color: "var(--gold)" }} />
    : <ChevronUp   size={13} strokeWidth={2} style={{ marginLeft: 3, color: "var(--gold)" }} />;
}

export default function TransactionsPage() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const { filters, role } = state;
  const isAdmin = role === "admin";

  const [showModal, setShowModal] = useState(false);
  const [editTxn,   setEditTxn]   = useState(null);
  const [page,      setPage]      = useState(1);

  const filtered   = useMemo(() => applyFilters(state.transactions, filters), [state.transactions, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (key, value) => {
    dispatch({ type: "SET_FILTER", payload: { [key]: value } });
    setPage(1);
  };

  const handleSort = (col) => {
    if (filters.sortBy === col) {
      updateFilter("sortOrder", filters.sortOrder === "desc" ? "asc" : "desc");
    } else {
      dispatch({ type: "SET_FILTER", payload: { sortBy: col, sortOrder: "desc" } });
      setPage(1);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
      toast("Transaction deleted", "info");
    }
  };

  const handleExport = () => {
    exportToCSV(filtered);
    toast(`Exported ${filtered.length} transactions`, "success");
  };

  const openEdit   = (txn) => { setEditTxn(txn); setShowModal(true); };
  const closeModal = ()    => { setShowModal(false); setEditTxn(null); };

  // Listen for global "N" keyboard shortcut from App.js
  useEffect(() => {
    const handler = () => { if (isAdmin) { setEditTxn(null); setShowModal(true); } };
    window.addEventListener("open-add-modal", handler);
    return () => window.removeEventListener("open-add-modal", handler);
  }, [isAdmin]);

  // Global keyboard shortcut: N = add transaction
  React.useEffect(() => {
    const handler = () => { if (isAdmin) { setEditTxn(null); setShowModal(true); } };
    window.addEventListener("open-add-modal", handler);
    return () => window.removeEventListener("open-add-modal", handler);
  }, [isAdmin]);

  return (
    <div className="page" key="transactions">
      <div className="transactions-header">
        <div>
          {!isAdmin && (
            <div className="viewer-notice">
              <Eye size={13} strokeWidth={2} />
              Viewer mode — read only
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={14} strokeWidth={2.5} /> Add Transaction
              <span className="kbd-hint">N</span>
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={14} strokeWidth={2} /> Export CSV
          </button>
          <button
            className="btn btn-secondary btn-icon"
            title="Reset filters"
            onClick={() => { dispatch({ type: "RESET_FILTERS" }); setPage(1); toast("Filters reset", "info"); }}
          >
            <RotateCcw size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <div className="search-box">
            <span className="search-icon"><Search size={14} strokeWidth={2} /></span>
            <input
              className="search-input"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>
          <select className="filter-select" value={filters.category} onChange={(e) => updateFilter("category", e.target.value)}>
            <option value="ALL">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>
          <select className="filter-select" value={filters.type} onChange={(e) => updateFilter("type", e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filters.dateRange} onChange={(e) => updateFilter("dateRange", e.target.value)}>
            <option value="ALL">All Time</option>
            <option value="THIS_MONTH">This Month</option>
            <option value="LAST_30">Last 30 Days</option>
            <option value="LAST_90">Last 90 Days</option>
            <option value="LAST_180">Last 6 Months</option>
          </select>
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="txn-table-container" style={{ border: "none", borderRadius: 0 }}>
          <table className="txn-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th className="sortable" onClick={() => handleSort("date")} style={{ whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center" }}>
                    Date <SortIcon col="date" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </span>
                </th>
                <th className="sortable" onClick={() => handleSort("amount")} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                    Amount <SortIcon col="amount" sortBy={filters.sortBy} sortOrder={filters.sortOrder} />
                  </span>
                </th>
                {isAdmin && <th style={{ width: 80 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr className="no-data-row">
                  <td colSpan={isAdmin ? 6 : 5}>
                    <div className="empty-icon"><SearchX size={36} strokeWidth={1.25} /></div>
                    <div>No transactions found</div>
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => {
                  const CatIcon = CATEGORY_ICONS[txn.category] || Briefcase;
                  return (
                    <tr key={txn.id}>
                      <td><div className="txn-description">{txn.description}</div></td>
                      <td>
                        <span className="category-pill">
                          <CatIcon size={12} strokeWidth={2} style={{ flexShrink: 0 }} />
                          {txn.categoryData.label}
                        </span>
                      </td>
                      <td><span className={`type-badge type-${txn.type}`}>{txn.type}</span></td>
                      <td><div>{format(parseISO(txn.date), "MMM d, yyyy")}</div></td>
                      <td style={{ textAlign: "right" }}>
                        <span className={txn.type === "income" ? "amount-income" : "amount-expense"}>
                          {txn.type === "income" ? "+" : "−"}{formatCurrency(txn.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="txn-actions">
                            <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(txn)} title="Edit">
                              <Pencil size={13} strokeWidth={2} />
                            </button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(txn.id)} title="Delete">
                              <Trash2 size={13} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
            <div className="pagination">
              <div className="pagination-info">Page {page} of {totalPages} · {filtered.length} total</div>
              <div className="pagination-controls">
                <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
                <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;
                  return (
                    <button key={p} className={`page-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  );
                })}
                <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
                <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && <TransactionModal transaction={editTxn} onClose={closeModal} />}
    </div>
  );
}
