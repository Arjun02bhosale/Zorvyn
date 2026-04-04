import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ToastProvider } from "./components/ui/Toast";
import Topbar from "./components/layout/Topbar";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";
import LandingPage from "./components/landing/LandingPage";
import "./index.css";

function AppContent() {
  const { state, dispatch } = useApp();
  const [showLanding, setShowLanding] = useState(true);

  // Apply theme class
  useEffect(() => {
    document.documentElement.className = state.theme === "light" ? "light" : "";
  }, [state.theme]);

  // Keyboard shortcut: N = open add transaction modal (admin only)
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "n" || e.key === "N") {
        if (state.role === "admin") {
          dispatch({ type: "SET_ACTIVE_PAGE", payload: "transactions" });
          setShowLanding(false);
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("open-add-modal"));
          }, 50);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.role, dispatch]);

  const openAppPage = (page) => {
    dispatch({ type: "SET_ACTIVE_PAGE", payload: page });
    setShowLanding(false);
  };

  const renderPage = () => {
    switch (state.activePage) {
      case "transactions":
        return <TransactionsPage />;
      case "insights":
        return <InsightsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="app">
      <div className="main-content">
        <Topbar
          showLanding={showLanding}
          onGoHome={() => setShowLanding(true)}
          onOpenAppPage={openAppPage}
        />
        <main className="app-main-shell">
          {showLanding ? <LandingPage onOpenAppPage={openAppPage} /> : renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}
