import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import WaterfallBridge from "../charts/WaterfallBridge";
import TrendArea from "../charts/TrendArea";
import "./PLMarginStory.css";

export default function PLMarginStory({ data }) {
  const [ref, inView] = useScrollReveal(0.15);
  const variancePct = ((data.variance.actual - data.variance.budget) / data.variance.budget) * 100;
  const revenue = data.bridge.find((b) => b.label === "Revenue")?.value ?? 0;
  const pat = data.bridge.find((b) => b.label === "PAT")?.value ?? 0;

  return (
    <section id="pl" className="chapter" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 3 — The Margin Story</p>
        <h2>Every rupee of revenue, traced to what's left of it</h2>
      </div>

      {data.quarterlyKpis && (
        <div className={`pl__quarterly-section reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
          <p className="panel-title">Quarterly EBIT &amp; EBITDA Performance (₹ in Cr)</p>
          <div className="pl__quarterly-grid">
            {data.quarterlyKpis.map((kpi, i) => (
              <div key={i} className="pl__quarterly-card">
                <div className="pl__quarterly-card-header">
                  <span className="pl__quarterly-card-label">{kpi.label}</span>
                  <span className="pl__quarterly-card-formula">{kpi.formula}</span>
                </div>
                <div className="pl__quarterly-card-value">
                  ₹{kpi.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr
                </div>
                <div className="pl__quarterly-card-subvalue">
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

      <div className="two-col">
        <div className={`narrative-col reveal ${inView ? "in-view" : ""}`}>
          <p>
            ₹{revenue.toFixed(0)} Cr of revenue passes through cost of goods,
            operating expense, depreciation, finance cost and tax &mdash;
            leaving ₹{pat.toFixed(0)} Cr of profit after tax. Margins have widened for
            four straight quarters.
          </p>
          <p>
            Actual revenue landed {variancePct >= 0 ? "above" : "below"} budget
            by {Math.abs(variancePct).toFixed(1)}%.
          </p>
          <p className="hook">Profit is up &mdash; but did the cash follow?</p>
        </div>

        <div className={`pl__visual reveal reveal-delay-1 ${inView ? "in-view" : ""}`}>
          <div className="panel">
            <p className="panel-title">Revenue to PAT Bridge (₹ Cr)</p>
            <WaterfallBridge data={data.bridge} />
          </div>
          <div className="panel" style={{ marginTop: 20 }}>
            <p className="panel-title">Margin Trend</p>
            <TrendArea
              data={data.marginTrend}
              xKey="quarter"
              series={[
                { key: "gm", label: "Gross Margin %", color: "#5fc9ac" },
                { key: "ebitda", label: "EBITDA %", color: "#d9b872" },
                { key: "pat", label: "PAT %", color: "#e2725b" },
              ]}
            />
          </div>

          <div className="callout" style={{ marginTop: 20 }}>
            <span className="callout__tag">Watch</span>
            <span className="callout__text">{data.watch}</span>
          </div>

          <Link to="/deepdive/pl" className="chapter-deepdive">
            Deep dive into Expense Analytics
          </Link>
        </div>
      </div>
    </section>
  );
}
