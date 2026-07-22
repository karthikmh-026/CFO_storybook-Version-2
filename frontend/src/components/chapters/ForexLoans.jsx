import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import CountUp from "../CountUp";
import AgeingBars from "../charts/AgeingBars";
import HorizontalBar from "../charts/HorizontalBar";
import "./ForexLoans.css";

export default function ForexLoans({ data, loansData }) {
  const [ref, inView] = useScrollReveal(0.15);
  const [activeTab, setActiveTab] = useState("forex");

  if (!data || !loansData) return null;

  // Convert forexBreakdown to HorizontalBar format
  const forexBreakdownData = data.forexBreakdown.map((b) => ({
    name: b.bucket,
    value: b.amountCr,
  }));

  // Convert hedgeTenor to AgeingBars format
  const hedgeTenorData = data.hedgeTenor.map((t) => ({
    bucket: t.bucket,
    amount: t.amountCr,
  }));

  // Convert lenderBreakdown to HorizontalBar format
  const lenderData = loansData.lenderBreakdown.map((l) => ({
    name: l.bucket,
    value: l.amountCr,
  }));

  // Convert covenantPerformance to AgeingBars format
  const covenantData = loansData.covenantPerformance.map((c) => ({
    bucket: c.bucket,
    amount: c.amountCr,
  }));

  return (
    <section id="forexloans" className="chapter chapter--forexloans" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 8 — Forex &amp; Loans</p>
        <h2>Navigating global volatility, anchoring our capital covenants</h2>
      </div>

      <div className="two-col">
        <div className={`narrative-col reveal ${inView ? "in-view" : ""}`}>
          <p>
            Active currency hedging manages USD and EUR volatility across export receivables and import POs, while foreign commercial borrowings are optimized below local interest benchmarks.
          </p>
          <p className="hook">
            Over 62.2% of forex exposure is hedged, and debt covenant coverage remains fully compliant.
          </p>
        </div>

        <div className={`cash__visual reveal reveal-delay-1 ${inView ? "in-view" : ""}`}>
          <div className="sub-switcher">
            <button
              type="button"
              className={`sub-switcher__pill ${activeTab === "forex" ? "is-active" : ""}`}
              onClick={() => setActiveTab("forex")}
            >
              Forex Exposure &amp; Hedging
            </button>
            <button
              type="button"
              className={`sub-switcher__pill ${activeTab === "loans" ? "is-active" : ""}`}
              onClick={() => setActiveTab("loans")}
            >
              Debt &amp; Covenant Compliance
            </button>
          </div>

          {activeTab === "forex" && (
            <div className="tab-content">
              {/* ================= FOREX SUMMARY ================= */}
              <div className="stat-grid" style={{ marginBottom: "16px" }}>
                {data.components.map((comp) => {
                  const val = parseFloat(comp.value.replace(/[^0-9.-]/g, ""));
                  return (
                    <div className="stat-card" key={comp.name}>
                      <div className="stat-card__value">
                        <CountUp value={val} prefix="₹" suffix=" Cr" decimals={1} trigger={inView} />
                      </div>
                      <div className="stat-card__label">{comp.tag}</div>
                      <div className="stat-card__hint" style={{ fontSize: "10px", opacity: 0.6, marginTop: "4px" }}>
                        {comp.detail} {comp.delta && `(${comp.delta})`}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cash__grid" style={{ marginBottom: "24px" }}>
                <div className="panel">
                  <p className="panel-title">Forex exposure by currency (₹ Cr)</p>
                  <HorizontalBar data={forexBreakdownData} valueKey="value" labelKey="name" />
                </div>

                <div className="panel">
                  <p className="panel-title">Forward hedge cover by tenor (₹ Cr)</p>
                  <AgeingBars data={hedgeTenorData} valueKey="amount" labelKey="bucket" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "loans" && (
            <div className="tab-content">
              {/* ================= LOANS SUMMARY ================= */}
              <div className="stat-grid" style={{ marginBottom: "16px" }}>
                {loansData.components.map((comp) => {
                  const numericMatch = comp.value.match(/[0-9.]+/);
                  const val = numericMatch ? parseFloat(numericMatch[0]) : null;
                  return (
                    <div className="stat-card" key={comp.name}>
                      <div className="stat-card__value">
                        {val !== null ? (
                          <CountUp value={val} prefix="₹" suffix=" Cr" decimals={1} trigger={inView} />
                        ) : (
                          comp.value
                        )}
                      </div>
                      <div className="stat-card__label">{comp.tag}</div>
                      <div className="stat-card__hint" style={{ fontSize: "10px", opacity: 0.6, marginTop: "4px" }}>
                        {comp.detail} {comp.delta && `(${comp.delta})`}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cash__grid" style={{ marginBottom: "24px" }}>
                <div className="panel">
                  <p className="panel-title">Term loans outstanding by lender (₹ Cr)</p>
                  <HorizontalBar data={lenderData} valueKey="value" labelKey="name" />
                </div>

                <div className="panel">
                  <p className="panel-title">Actual vs required covenant compliance</p>
                  <AgeingBars data={covenantData} valueKey="amount" labelKey="bucket" />
                </div>
              </div>
            </div>
          )}

          <Link to="/deepdive/forex" className="chapter-deepdive" style={{ marginTop: "12px" }}>
            Deep dive into Forex &amp; Loans
          </Link>
        </div>
      </div>
    </section>
  );
}
