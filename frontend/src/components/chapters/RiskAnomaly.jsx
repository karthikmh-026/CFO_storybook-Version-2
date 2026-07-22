import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import SankeyFlow from "../charts/SankeyFlow";
import PieDonut from "../charts/PieDonut";
import HorizontalBar from "../charts/HorizontalBar";
import "./RiskAnomaly.css";

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

export default function RiskAnomaly({ data }) {
  const [ref, inView] = useScrollReveal(0.1);
  const violations = [...data.ruleViolations].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
  );

  // Aggregate violations by severity for the donut chart
  const severityValue = violations.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + curr.amountCr;
    return acc;
  }, {});

  const severityChartData = Object.keys(severityValue).map((sev) => ({
    name: sev,
    value: parseFloat(severityValue[sev].toFixed(2)),
  }));

  // Map high risk customers exposure
  const customerExposureData = data.customerRisk.map((c) => ({
    name: c.customerName,
    value: c.openArCr,
  }));

  return (
    <section id="risk" className="chapter chapter--risk" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 6 — Risk &amp; Anomaly</p>
        <h2>Not every order finishes the journey to cash</h2>
      </div>

      <div className={`risk__charts-grid reveal ${inView ? "in-view" : ""}`}>
        <div className="panel">
          <p className="panel-title">Violation Value by Severity (₹ Cr)</p>
          <PieDonut data={severityChartData} valueKey="value" nameKey="name" chartType="donut" />
        </div>
        <div className="panel">
          <p className="panel-title">Exposure of High-Risk Customers (₹ Cr Open AR)</p>
          <HorizontalBar data={customerExposureData} valueKey="value" labelKey="name" />
        </div>
      </div>

      <div className={`panel reveal reveal-delay-1 ${inView ? "in-view" : ""}`} style={{ marginTop: 20 }}>
        <p className="panel-title">Order-to-Cash Flow</p>
        <SankeyFlow data={data.o2cFlow} />
      </div>

      <div className={`risk__grid reveal reveal-delay-2 ${inView ? "in-view" : ""}`} style={{ marginTop: 20 }}>
        <div className="panel">
          <p className="panel-title">Rule Violations</p>
          <p className="panel-hint">Click a violation to open the full drill-down report in a new tab.</p>
          {violations.map((v) => (
            <a
              className="violation-row violation-row--link"
              key={v.id}
              href={`/violation/${v.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{v.document}</span>
              <span>{v.ruleViolated}</span>
              <span>{v.customerName}</span>
              <span className={`badge badge--${v.severity.toLowerCase()}`}>{v.severity}</span>
            </a>
          ))}
        </div>

        <div className="panel">
          <p className="panel-title">Highest-Risk Customers</p>
          {data.customerRisk.map((c, i) => (
            <div className="risk-row-block" key={i}>
              <div className="risk-row">
                <div>
                  <div>
                    {c.customerName} <span className="risk-row__meta">({c.customerCode})</span>
                  </div>
                  <div className="risk-row__meta">
                    Open AR ₹{c.openArCr.toFixed(1)} Cr &middot; Overdue ₹{c.overdueCr.toFixed(1)} Cr
                  </div>
                </div>
                <div className="risk-score">{c.riskScore}</div>
              </div>
              <p className="risk-row__narrative">&ldquo;{c.narrative}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>

      <Link to="/deepdive/risk" className="chapter-deepdive" style={{ marginTop: 28 }}>
        Deep dive into Exceptions &amp; Compliance
      </Link>
    </section>
  );
}
