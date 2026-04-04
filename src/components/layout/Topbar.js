import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./Topbar.module.css";
import {
  Menu,
  IndianRupee,
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  Sun,
  Moon,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", Icon: ArrowLeftRight },
  { id: "insights", label: "Insights", Icon: BarChart2 },
];

export default function Topbar({ showLanding, onGoHome, onOpenAppPage }) {
  const { state, dispatch } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = state.role === "admin";
  
  // Refs for GSAP animations
  const navRefs = useRef([]);
  const utilsRefs = useRef([]);
  const underlineRefs = useRef([]); // New ref for the yellow underlines

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // GSAP Entry Animation
  useEffect(() => {
    gsap.fromTo(
      navRefs.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
    
    gsap.fromTo(
      utilsRefs.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", delay: 0.2 }
    );
  }, []);

  const navigate = (item) => {
    onOpenAppPage?.(item.id);
    setMobileOpen(false);
  };

  const setRole = (role) => dispatch({ type: "SET_ROLE", payload: role });
  const toggleTheme = () =>
    dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });

  const navButtonClass = (item) => {
    return `topbar-nav-link ${!showLanding && state.activePage === item.id ? "active" : ""}`;
  };

  const drawerLinkClass = (item) => {
    return `topbar-drawer-link ${!showLanding && state.activePage === item.id ? "active" : ""}`;
  };

  // GSAP Hover Handlers for Nav Links (includes yellow underline)
  const handleNavMouseEnter = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: "power1.out" });
    if (underlineRefs.current[index]) {
      gsap.to(underlineRefs.current[index], { width: "80%", duration: 0.3, ease: "power2.out" });
    }
  };

  const handleNavMouseLeave = (e, index) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.out" });
    if (underlineRefs.current[index]) {
      gsap.to(underlineRefs.current[index], { width: "0%", duration: 0.3, ease: "power2.in" });
    }
  };

  // Standard Hover Handlers for Utilities
  const handleUtilMouseEnter = (e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2, ease: "power1.out" });
  const handleUtilMouseLeave = (e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power1.out" });

  return (
    <header className={styles.bar} data-theme={state.theme}>
      <div className={`${styles.row} topbar-row`}>
        <div className="topbar-start">
          <button
            type="button"
            className="menu-btn"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Menu size={18} strokeWidth={2} />
          </button>

          <button
            type="button"
            className="topbar-logo-btn"
            onClick={() => { onGoHome ? onGoHome() : navigate(NAV_ITEMS[0]) }}
            aria-label="Go to home"
          >
            <span className="logo-mark">
              <span className="logo-icon">
                <IndianRupee size={16} strokeWidth={2.5} />
              </span>
              <span className="logo-text">
                Fin<span>arc</span>
              </span>
            </span>
          </button>

          <nav className="topbar-nav-desktop" aria-label="Main navigation">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => (navRefs.current[index] = el)}
                type="button"
                className={navButtonClass(item)}
                onClick={() => navigate(item)}
                onMouseEnter={(e) => handleNavMouseEnter(e, index)}
                onMouseLeave={(e) => handleNavMouseLeave(e, index)}
                style={{ position: "relative", paddingBottom: "8px" }} // Added relative positioning for the underline
              >
                <span className="topbar-nav-icon" aria-hidden>
                  <item.Icon size={15} strokeWidth={1.75} />
                </span>
                {item.label}
                
                {/* Yellow Underline Element */}
                <span 
                  ref={(el) => (underlineRefs.current[index] = el)}
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    height: "3px",
                    width: "0%",
                    backgroundColor: "#FACC15", // Tailwind Yellow-400
                    borderRadius: "2px",
                    pointerEvents: "none" // Prevents the underline from interfering with hover events
                  }}
                />
              </button>
            ))}
          </nav>
        </div>

        <div className="topbar-right">
          {isAdmin && (
            <div className="kbd-tip" ref={(el) => (utilsRefs.current[0] = el)}>
              Press <kbd className="kbd">N</kbd> to add
            </div>
          )}
          <div className="topbar-utilities-desktop">
            <div 
              className="role-toggle topbar-role-toggle" 
              role="group" 
              aria-label="Role"
              ref={(el) => (utilsRefs.current[1] = el)}
            >
              <button
                type="button"
                className={`role-btn ${state.role === "viewer" ? "active" : ""}`}
                onClick={() => setRole("viewer")}
              >
                Viewer
              </button>
              <button
                type="button"
                className={`role-btn ${state.role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
            </div>
            
            <button 
              type="button" 
              className="theme-toggle topbar-theme-toggle" 
              onClick={toggleTheme}
              ref={(el) => (utilsRefs.current[2] = el)}
              onMouseEnter={handleUtilMouseEnter}
              onMouseLeave={handleUtilMouseLeave}
            >
              <span className="theme-toggle-label">
                {state.theme === "dark" ? (
                  <Moon size={13} strokeWidth={2} />
                ) : (
                  <Sun size={13} strokeWidth={2} />
                )}
                <span className="topbar-theme-label-text">
                  {state.theme === "dark" ? "Dark" : "Light"}
                </span>
              </span>
              <span className={`toggle-switch ${state.theme === "light" ? "on" : ""}`}>
                <span className="toggle-knob" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`topbar-drawer-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`topbar-drawer ${mobileOpen ? "open" : ""}`}
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
      >
        <div className="topbar-drawer-head">
          <span className="logo-text" style={{ fontSize: 16 }}>
            Fin<span>arc</span>
          </span>
        </div>
        <nav className="topbar-drawer-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={drawerLinkClass(item)}
              onClick={() => navigate(item)}
            >
              <item.Icon size={18} strokeWidth={1.75} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="topbar-drawer-footer">
          {isAdmin && (
            <div className="kbd-tip topbar-drawer-kbd">
              Press <kbd className="kbd">N</kbd> to add
            </div>
          )}
          <div className="role-label">Role</div>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-btn ${state.role === "viewer" ? "active" : ""}`}
              onClick={() => setRole("viewer")}
            >
              Viewer
            </button>
            <button
              type="button"
              className={`role-btn ${state.role === "admin" ? "active" : ""}`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            <span className="theme-toggle-label">
              {state.theme === "dark" ? (
                <Moon size={13} strokeWidth={2} />
              ) : (
                <Sun size={13} strokeWidth={2} />
              )}
              {state.theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
            <span className={`toggle-switch ${state.theme === "light" ? "on" : ""}`}>
              <span className="toggle-knob" />
            </span>
          </button>
        </div>
      </aside>
    </header>
  );
}