import React, { createContext, useContext, useReducer, useEffect } from "react";
import { transactions as initialTransactions } from "../data/transactions";

const AppContext = createContext(null);
const STORAGE_KEY = "finance_dashboard_state_v2";

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":        return { ...state, role: action.payload };
    case "SET_THEME":       return { ...state, theme: action.payload };
    case "SET_FILTER":      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "RESET_FILTERS":   return { ...state, filters: initialFilters };
    case "SET_DASHBOARD_PERIOD": return { ...state, dashboardPeriod: action.payload };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_ACTIVE_PAGE": return { ...state, activePage: action.payload };
    default:                return state;
  }
}

const initialFilters = {
  search: "",
  category: "ALL",
  type: "ALL",
  dateRange: "ALL",
  sortBy: "date",
  sortOrder: "desc",
};

const defaultState = {
  role: "admin",
  theme: "dark",
  transactions: initialTransactions,
  filters: initialFilters,
  dashboardPeriod: "ALL",
  activePage: "dashboard",
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed, activePage: "dashboard" };
    }
  } catch {}
  return null;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, loadState() || defaultState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        role: state.role,
        theme: state.theme,
        transactions: state.transactions,
        filters: state.filters,
        dashboardPeriod: state.dashboardPeriod,
      }));
    } catch {}
  }, [state.role, state.theme, state.transactions, state.filters, state.dashboardPeriod]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
