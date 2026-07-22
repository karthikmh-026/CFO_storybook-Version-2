import { useState } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import CountUp from "../CountUp";
import AgeingBars from "../charts/AgeingBars";
import HorizontalBar from "../charts/HorizontalBar";
import "./FixedAssets.css";

export default function FixedAssets({ data, rptData }) {
  const [ref, inView] = useScrollReveal(0.15);
  const [activeTab, setActiveTab] = useState("capital");

  if (!data || !rptData) return null;

  // Convert fixedAssetBlocks to the expected format for HorizontalBar
  const blocksData = data.fixedAssetBlocks.map((b) => ({
    name: b.name,
    value: b.net,
  }));

  // Convert cwipAgeing to formatting compatible with AgeingBars
  const cwipAgeingData = data.cwipAgeing.map((c) => ({
    bucket: c.bucket,
    amount: c.amountCr,
  }));

  // Convert rptBalances to the expected format for HorizontalBar
  const rptBalancesData = rptData.rptBalances.map((b) => ({
    name: b.bucket,
    value: b.amountCr,
  }));

  // Convert rptQuarterly to formatting compatible with AgeingBars
  const rptQuarterlyData = rptData.rptQuarterly.map((q) => ({
    bucket: q.bucket,
    amount: q.amountCr,
  }));

  return (
    <section id="fixedassets" className="chapter chapter--fixedassets" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 7 — Capital Assets &amp; RPT</p>
        <h2>Scale is built in concrete, trust is verified at arm's length</h2>
      </div>

      <div className="two-col">
        <div className={`narrative-col reveal ${inView ? "in-view" : ""}`}>
          <p>
            Physical capacity expansion scales our industrial output, while strict arm's-length controls govern our intercompany transactions.
          </p>
          <p className="hook">
            Depreciation runs are 100% reconciled and statutory approvals are fully compliant.
          </p>
        </div>
        <div className={`cash__visual reveal reveal-delay-1 ${inView ? "in-view" : ""}`}>
          <div className="sub-switcher">
            <button
              type="button"
              className={`sub-switcher__pill ${activeTab === "capital" ? "is-active" : ""}`}
              onClick={() => setActiveTab("capital")}
            >
              Capital Assets
            </button>
            <button
              type="button"
              className={`sub-switcher__pill ${activeTab === "rpt" ? "is-active" : ""}`}
              onClick={() => setActiveTab("rpt")}
            >
              Related Party Transactions (RPT)
            </button>
          </div>

          {activeTab === "capital" && (
            <div className="tab-content">
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
                  <p className="panel-title">Net Asset carrying value by block (₹ Cr)</p>
                  <HorizontalBar data={blocksData} valueKey="value" labelKey="name" />
                </div>

                <div className="panel">
                  <p className="panel-title">Capital WIP (AuC) Ageing (₹ Cr)</p>
                  <AgeingBars data={cwipAgeingData} valueKey="amount" labelKey="bucket" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "rpt" && (
            <div className="tab-content">
              <div className="stat-grid" style={{ marginBottom: "16px" }}>
                {rptData.components.map((comp) => {
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
                  <p className="panel-title">Outstanding RPT Balances (₹ Cr)</p>
                  <HorizontalBar data={rptBalancesData} valueKey="value" labelKey="name" />
                </div>

                <div className="panel">
                  <p className="panel-title">Quarterly RPT Volume trend (₹ Cr)</p>
                  <AgeingBars data={rptQuarterlyData} valueKey="amount" labelKey="bucket" />
                </div>
              </div>
            </div>
          )}

          <Link to="/deepdive/fixedassets" className="chapter-deepdive" style={{ marginTop: "12px" }}>
            Deep dive into Capital Assets &amp; RPT
          </Link>
        </div>
      </div>
    </section>
  );
}
