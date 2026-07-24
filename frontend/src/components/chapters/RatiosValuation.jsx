import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./RatiosValuation.css";

export default function RatiosValuation({ data }) {
  const [ref, inView] = useScrollReveal(0.15);

  return (
    <section id="ratios" className="chapter" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 5 — Ratios &amp; Valuation</p>
        <h2>How the balance sheet and the market see the same business</h2>
      </div>

      <div className={`narrative-col reveal ${inView ? "in-view" : ""}`} style={{ maxWidth: 720, marginBottom: 12 }}>
        <p>
          Liquidity, leverage and returns tell the operating story; the market multiples
          tell you what investors are willing to pay for it. Read them side by side.
        </p>
      </div>

      {data.quarterlyKpis && (
        <div className={`rv__quarterly-section reveal reveal-delay-1 ${inView ? "in-view" : ""}`} style={{ marginBottom: 36 }}>
          <p className="panel-title">Quarterly PAT Performance (₹ in Cr)</p>
          <div className="rv__quarterly-grid">
            {data.quarterlyKpis.map((kpi, i) => (
              <div key={i} className="rv__quarterly-card">
                <div className="rv__quarterly-card-header">
                  <span className="rv__quarterly-card-label">{kpi.label}</span>
                  <span className="rv__quarterly-card-formula">{kpi.formula}</span>
                </div>
                <div className="rv__quarterly-card-value">
                  ₹{kpi.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
                </div>
                <div className="rv__quarterly-card-subvalue">
                  {kpi.growth !== undefined && kpi.growth !== null ? (
                    <span style={{ color: kpi.growth >= 0 ? "var(--positive)" : "var(--negative)", fontWeight: "500", fontSize: "0.78rem" }}>
                      {kpi.growth >= 0 ? "▲" : "▼"} {Math.abs(kpi.growth).toFixed(1)}% QoQ
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4, fontSize: "0.78rem" }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.quarterlyGmKpis && (
        <div className={`rv__quarterly-section reveal reveal-delay-1 ${inView ? "in-view" : ""}`} style={{ marginBottom: 36 }}>
          <p className="panel-title">Quarterly Gross Margin Performance</p>
          <div className="rv__quarterly-grid">
            {data.quarterlyGmKpis.map((kpi, i) => (
              <div key={i} className="rv__quarterly-card rv__quarterly-card--gm">
                <div className="rv__quarterly-card-header">
                  <span className="rv__quarterly-card-label">{kpi.label}</span>
                  <span className="rv__quarterly-card-formula">{kpi.formula}</span>
                </div>
                <div className="rv__quarterly-card-value">
                  {kpi.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                </div>
                <div className="rv__quarterly-card-subvalue">
                  {kpi.growth !== undefined && kpi.growth !== null ? (
                    <span style={{ color: kpi.growth >= 0 ? "var(--positive)" : "var(--negative)", fontWeight: "500", fontSize: "0.78rem" }}>
                      {kpi.growth >= 0 ? "▲" : "▼"} {Math.abs(kpi.growth).toFixed(1)}% QoQ
                    </span>
                  ) : (
                    <span style={{ opacity: 0.4, fontSize: "0.78rem" }}>—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`rv-grid reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
        {data.metrics.map((m) => (
          <div className={`rv-card ${m.highlight ? "rv-card--highlight" : ""}`} key={m.label}>
            <div className="rv-card__label">{m.label}</div>
            <div className="rv-card__value">{m.value}</div>
            <div className={`rv-card__delta rv-card__delta--${m.trend}`}>{m.delta}</div>
          </div>
        ))}
      </div>


      <Link to="/deepdive/ratios" className="chapter-deepdive">
        Deep dive into Ratios &amp; Investor Relations
      </Link>
    </section>
  );
}
