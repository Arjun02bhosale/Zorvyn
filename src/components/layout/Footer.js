import React from "react";
import { IndianRupee, Linkedin, Github } from "lucide-react";

const LINKEDIN_URL = "https://www.linkedin.com/in/arjun-bhosale-6993b92b1/";
const GITHUB_URL = "https://github.com/Arjun02bhosale";

export default function Footer({ onOpenAppPage }) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-top">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo-mark" aria-hidden>
              <IndianRupee size={16} strokeWidth={2.5} />
            </div>
            <div className="landing-footer-brand-text">
              <span className="landing-footer-logo-type">
                Fin<span className="landing-footer-logo-accent">arc</span>
              </span>
              <p className="landing-footer-tagline">
                Personal finance clarity—track, plan, and grow in one place.
              </p>
            </div>
          </div>

          <nav className="landing-footer-nav" aria-label="Footer">
            <span className="landing-footer-nav-label">Explore</span>
            <div className="landing-footer-nav-links">
              <button type="button" className="landing-footer-link" onClick={() => onOpenAppPage("dashboard")}>
                Dashboard
              </button>
              <button type="button" className="landing-footer-link" onClick={() => onOpenAppPage("transactions")}>
                Transactions
              </button>
              <button type="button" className="landing-footer-link" onClick={() => onOpenAppPage("insights")}>
                Insights
              </button>
            </div>
          </nav>

          <div className="landing-footer-social-wrap">
            <span className="landing-footer-nav-label">Connect</span>
            <div className="landing-footer-social">
              <a
                href={LINKEDIN_URL}
                className="landing-footer-social-btn"
                aria-label="LinkedIn — Arjun Bhosale"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} strokeWidth={1.75} />
              </a>
              <a
                href={GITHUB_URL}
                className="landing-footer-social-btn"
                aria-label="GitHub — Arjun02bhosale"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} strokeWidth={1.75} />
              </a>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <p className="landing-footer-copy">© {new Date().getFullYear()} Finarc. All rights reserved.</p>
          <p className="landing-footer-legal">
            <a href="#privacy" className="landing-footer-legal-link">
              Privacy
            </a>
            <span className="landing-footer-legal-dot" aria-hidden>
              ·
            </span>
            <a href="#terms" className="landing-footer-legal-link">
              Terms
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
