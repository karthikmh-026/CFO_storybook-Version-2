import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import CountUp from "../CountUp";
import "./ExecSummary.css";

function Delta({ label, value }) {
  const cls = value >= 0 ? "up" : "down";
  const arrow = value >= 0 ? "▲" : "▼";
  return (
    <span className={cls}>
      {arrow} {Math.abs(value).toFixed(1)}% {label}
    </span>
  );
}

export default function ExecSummary({ data }) {
  const [ref, inView] = useScrollReveal(0.2);

  return (
    <section id="exec" className="chapter" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 1 — Executive Summary</p>
        <h2>Where the business stands today</h2>
      </div>

      <div className="two-col">
        <div className={`narrative-col reveal ${inView ? "in-view" : ""}`}>
          <p>
            Revenue has kept climbing this quarter, and profitability is expanding
            faster than the top line &mdash; EBITDA and PAT are both outpacing
            revenue growth. Below the surface, though, a handful of exceptions
            are quietly building up.
          </p>
          <p className="hook">Three alerts are worth attention before month-end close.</p>
          <Link to="/deepdive/exec" className="chapter-deepdive">
            Deep dive into Financial Statements
          </Link>
        </div>

        <div className="exec__visual">
          <div className={`stat-grid reveal ${inView ? "in-view" : ""}`}>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.revenue.mtd} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Revenue MTD</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.revenue.qtd} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Revenue QTD</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.revenue.ytd} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Revenue YTD</div>
            </div>
          </div>

          <div className={`stat-grid reveal reveal-delay-1 ${inView ? "in-view" : ""}`} style={{ marginTop: 18 }}>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.growth.ebitda.value} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">EBITDA</div>
              <div className="stat-card__delta">
                <Delta label="YoY" value={data.growth.ebitda.yoy} />
                <Delta label="QoQ" value={data.growth.ebitda.qoq} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.growth.ebit.value} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">EBIT</div>
              <div className="stat-card__delta">
                <Delta label="YoY" value={data.growth.ebit.yoy} />
                <Delta label="QoQ" value={data.growth.ebit.qoq} />
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.growth.pat.value} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">PAT</div>
              <div className="stat-card__delta">
                <Delta label="YoY" value={data.growth.pat.yoy} />
                <Delta label="QoQ" value={data.growth.pat.qoq} />
              </div>
            </div>
          </div>

          <div className={`stat-grid reveal reveal-delay-2 ${inView ? "in-view" : ""}`} style={{ marginTop: 18 }}>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.cashAndBank} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Cash &amp; Bank</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.netDebt} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Net Debt</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.cashConversionCycle} trigger={inView} decimals={0} suffix=" days" />
              </div>
              <div className="stat-card__label">Cash Conversion Cycle</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.workingCapital} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Working Capital</div>
            </div>
          </div>

          <div className={`panel reveal reveal-delay-3 ${inView ? "in-view" : ""}`} style={{ marginTop: 24 }}>
            <p className="panel-title">Key Alerts</p>
            <ul className="alert-list">
              {data.alerts.map((alert, i) => (
                <li key={i}>
                  <span className={`badge badge--${alert.severity}`}>{alert.severity}</span>
                  {alert.label}
                </li>
              ))}
            </ul>
          </div>

          <div className={`callout reveal reveal-delay-3 ${inView ? "in-view" : ""}`} style={{ marginTop: 18 }}>
            <span className="callout__tag">Reads as</span>
            <span className="callout__text">{data.readsAs}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
