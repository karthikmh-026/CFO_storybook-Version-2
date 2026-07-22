import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fetchViolationDetail } from "../api";
import "./ViolationDetail.css";

const STATUS_TONE = {
  Blocked: "bad",
  Exceeded: "bad",
  Flagged: "bad",
  Open: "warn",
  "Under Review": "warn",
  "Approved (pending review)": "warn",
  Posted: "ok",
  Cleared: "ok",
  Approved: "ok",
  Released: "ok",
};

export default function ViolationDetail() {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = () => {
    setLoading(true);
    setError(null);
    fetchViolationDetail(id)
      .then((res) => {
        setDetail(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDetail();
  }, [id]);

  if (error) {
    return (
      <div className="vdet vdet--center load-state--error" style={{ minHeight: "100vh" }}>
        <div className="error-card">
          <p className="error-msg">Couldn't load this violation &mdash; {error}</p>
          <div className="error-actions">
            <button onClick={loadDetail} className="retry-btn">
              Retry Connection
            </button>
            <button onClick={() => window.close()} className="back-link">
              Close Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !detail) {
    return (
      <div className="vdet vdet--center">
        <p>Loading drill-down report&hellip;</p>
      </div>
    );
  }

  const chartData = detail.transactions.map((t) => ({
    name: t.sapDoc,
    amount: t.amountCr,
  }));

  return (
    <div className="vdet">
      <img src="/ajalabs-black.svg" alt="ajalabs.ai" className="vdet__brand" />
      <header className="vdet__header">
        <div>
          <p className="vdet__eyebrow">Drill-Down Report &middot; {detail.documentType}</p>
          <h1>{detail.document}</h1>
          <p className="vdet__sub">
            {detail.customerName} <span className="vdet__muted">({detail.customerCode})</span> &middot;{" "}
            {new Date(detail.txnDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="vdet__header-right">
          <span className={`vdet__severity vdet__severity--${detail.severity.toLowerCase()}`}>
            {detail.severity} severity
          </span>
          <div className="vdet__amount">₹{detail.amountCr.toFixed(2)} Cr</div>
        </div>
      </header>

      <section className="vdet__section">
        <p className="vdet__label">Rule Violated</p>
        <p className="vdet__rule">{detail.ruleViolated}</p>
        <p className="vdet__desc">{detail.description}</p>
      </section>

      <section className="vdet__callout">
        <p className="vdet__label">Recommended Action</p>
        <p>{detail.recommendedAction}</p>
      </section>

      <section className="vdet__section">
        <p className="vdet__label">Transaction Line Amounts (₹ Cr)</p>
        <div className="vdet__chart">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,27,22,0.1)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#6b6255", fontSize: 11 }} axisLine={{ stroke: "rgba(30,27,22,0.2)" }} tickLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "rgba(166,73,47,0.08)" }}
                contentStyle={{ background: "#fbf9f3", border: "1px solid #ddd5c3", borderRadius: 6 }}
                labelStyle={{ color: "#1e1b16" }}
                formatter={(v) => [`₹${Number(v).toFixed(2)} Cr`, "Amount"]}
              />
              <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.amount < 0 ? "#a6492f" : "#2f6e63"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="vdet__section">
        <p className="vdet__label">Transaction Detail</p>
        <table className="vdet__table">
          <thead>
            <tr>
              <th>Line</th>
              <th>SAP Doc</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount (₹ Cr)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {detail.transactions.map((t) => (
              <tr key={t.lineNo}>
                <td>{t.lineNo}</td>
                <td className="vdet__mono">{t.sapDoc}</td>
                <td>{new Date(t.docDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                <td>{t.description}</td>
                <td className="vdet__mono">{t.amountCr.toFixed(2)}</td>
                <td>
                  <span className={`vdet__status vdet__status--${STATUS_TONE[t.status] ?? "warn"}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="vdet__footer">
        Generated from live SAP-fed rule engine tables &middot; opened as a standalone report so the source dashboard tab stays where you left it.
      </footer>
    </div>
  );
}
