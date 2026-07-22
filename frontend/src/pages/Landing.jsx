import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Starfield from "../components/Starfield";
import { authenticate, isAuthenticated } from "../auth";
import "./Landing.css";

const COMPLIBEAR_URL = "http://localhost:7329";

const CHAPTER_CARDS = [
  { n: "01", title: "Executive Summary", blurb: "Revenue, profitability and cash at a glance, with the alerts that need your attention first." },
  { n: "02", title: "Value Chain", blurb: "How raw material becomes shipped product, and which sectors it fans out to." },
  { n: "03", title: "Margin Story", blurb: "The P&L bridge from revenue to PAT — where every rupee of margin is won or lost." },
  { n: "04", title: "Cash & Working Capital", blurb: "The cash conversion cycle, ageing receivables and payables, and the debt bridge." },
  { n: "05", title: "Ratios & Valuation", blurb: "Liquidity, leverage and returns next to how the market is pricing the business." },
  { n: "06", title: "Risk & Anomaly", blurb: "Order-to-cash flow, rule violations and the customers carrying the most risk." },
  { n: "07", title: "Capital Assets & RPT", blurb: "Gross and net block asset schedules, Ind AS 116 lease reconciliation, and related party compliance." },
  { n: "08", title: "Forex & Loans", blurb: "Export exposure currency breakdown, forward cover hedges, and borrowing covenant checklists." },
];

export default function Landing() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(isAuthenticated());
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/storybook";

  function handleSubmit(e) {
    e.preventDefault();
    if (authenticate(password)) {
      navigate(from, { replace: true });
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <>
      <Starfield />
      <div className="landing">
        <img src="/ajalabs-white.svg" alt="ajalabs.ai" className="brand-mark" />
        <img src="/pitti.png" alt="Pitti Group" className="brand-mark brand-mark--pitti" />

        <div className="landing__left">
          <p className="eyebrow">Pitti Group &middot; CFO Storybook</p>
          <h1 className="landing__title">The Business, Told in Numbers</h1>
          <p className="landing__subhead">
            Eight chapters, told in sequence &mdash; each one hands off the thread to the next,
            covering everything from margin progression to liquidity, ratios, capital assets, forex, and risk anomalies.
          </p>

          <div className="landing__grid">
            {CHAPTER_CARDS.map((c) => (
              <div className="overview__card" key={c.n}>
                <span className="overview__num">{c.n}</span>
                <div className="overview__title">{c.title}</div>
                <p className="overview__blurb">{c.blurb}</p>
              </div>
            ))}
          </div>

          <div className="overview__complibear landing__complibear">
            <div>
              <p className="overview__complibear-label">Looking for the daily transactional detail?</p>
              <p className="overview__complibear-text">
                CompliBear combines every exception and insight surfaced from the data &mdash;
                revenue leakages, non-compliances and other flags &mdash; at a day-to-day
                transaction level.
              </p>
            </div>
            <a href={COMPLIBEAR_URL} target="_blank" rel="noopener noreferrer" className="chapter-deepdive overview__complibear-btn">
              Open CompliBear
            </a>
          </div>

          <p className="overview__disclaimer landing__disclaimer">
            All figures presented in this storybook are derived from SAP ERP extracts and are
            intended for internal management reporting only.
          </p>
        </div>

        <div className="landing__right">
          {unlocked ? (
            <div className="login__card">
              <p className="eyebrow">Access Granted</p>
              <h1>You&rsquo;re already signed in</h1>
              <button
                type="button"
                className="chapter-deepdive login__submit"
                onClick={() => navigate(from, { replace: true })}
              >
                Continue to Storybook
              </button>
            </div>
          ) : (
            <form className="login__card" onSubmit={handleSubmit}>
              <p className="eyebrow">Restricted Access</p>
              <h1>Enter password to continue</h1>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Password"
                className={`login__input ${error ? "is-error" : ""}`}
              />
              {error && <p className="login__error">Incorrect password &mdash; try again.</p>}
              <button type="submit" className="chapter-deepdive login__submit">
                Unlock Storybook
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
