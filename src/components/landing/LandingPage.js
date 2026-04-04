import React, { useEffect, useRef } from "react";
import { LayoutDashboard, ArrowLeftRight, BarChart2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const VIDEO_SRC = `${process.env.PUBLIC_URL}/video.mp4`;

export default function LandingPage({ onOpenAppPage }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="landing">
      <div className="landing-video-wrap">
        <video
          ref={videoRef}
          className="landing-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="landing-overlay" />
        <div className="landing-video-stack">
          <div className="landing-video-wordmark" aria-label="Hero headline">
            <span className="landing-video-line">Track</span>
            <span className="landing-video-line landing-video-lineAccent">cash flow,</span>
            <span className="landing-video-line">budgets, and investments</span>
            <span className="landing-video-line">in one clear view</span>
          </div>
          <p className="landing-video-subline">Make calmer money decisions daily.</p>
          <div className="landing-video-actions">
            <button
              type="button"
              className="landing-video-action-btn"
              onClick={() => onOpenAppPage("dashboard")}
            >
              <LayoutDashboard size={16} strokeWidth={2} />
              Dashboard
            </button>
            <button
              type="button"
              className="landing-video-action-btn"
              onClick={() => onOpenAppPage("transactions")}
            >
              <ArrowLeftRight size={16} strokeWidth={2} />
              Transactions
            </button>
            <button
              type="button"
              className="landing-video-action-btn"
              onClick={() => onOpenAppPage("insights")}
            >
              <BarChart2 size={16} strokeWidth={2} />
              Insights
            </button>
          </div>
        </div>
      </div>

      <div className="landing-hero">
        <div className="landing-badge">
          <span className="landing-badge-dot" />
          Personal Finance Dashboard
        </div>

        <h1 className="landing-title">
          Take control of<br />
          <span className="landing-title-accent">your finances</span>
        </h1>

        <p className="landing-subtitle">
          Track income, monitor spending, and understand your financial patterns — all in one clean,
          intuitive dashboard.
        </p>

        <div className="landing-features">
          <div className="landing-feature">
            <TrendingUp size={14} strokeWidth={2} />
            Real-time analytics
          </div>
          <div className="landing-feature">
            <ShieldCheck size={14} strokeWidth={2} />
            Role-based access
          </div>
          <div className="landing-feature">
            <Zap size={14} strokeWidth={2} />
            Instant insights
          </div>
        </div>
      </div>

      <div className="landing-scroll-hint">
        <div className="landing-scroll-line" />
        <span>Scroll to explore</span>
        <div className="landing-scroll-line" />
      </div>

      <div className="landing-stats">
        <div className="landing-stat">
          <div className="landing-stat-value">60+</div>
          <div className="landing-stat-label">Transactions tracked</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat">
          <div className="landing-stat-value">6</div>
          <div className="landing-stat-label">Months of history</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat">
          <div className="landing-stat-value">10</div>
          <div className="landing-stat-label">Spending categories</div>
        </div>
        <div className="landing-stat-divider" />
        <div className="landing-stat">
          <div className="landing-stat-value">2</div>
          <div className="landing-stat-label">Access roles</div>
        </div>
      </div>
    </div>
  );
}
