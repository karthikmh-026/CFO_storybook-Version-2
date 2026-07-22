import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchDeepDive } from "../api";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, Cell, PieChart, Pie, Legend } from "recharts";
import TrendArea from "../components/charts/TrendArea";
import AgeingBars from "../components/charts/AgeingBars";
import WaterfallBridge from "../components/charts/WaterfallBridge";
import SankeyFlow from "../components/charts/SankeyFlow";
import PieDonut from "../components/charts/PieDonut";
import HorizontalBar from "../components/charts/HorizontalBar";
import Starfield from "../components/Starfield";
import "./DeepDive.css";

function StatsSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="stat-grid">
        {section.items.map((item) => (
          <div className="stat-card" key={item.label}>
            <div className="stat-card__value">{item.value}</div>
            <div className="stat-card__label">{item.label}</div>
            {item.hint && <div className="stat-card__delta">{item.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel dd-table-wrap">
        <table className="dd-table">
          <thead>
            <tr>
              {section.columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr key={i}>
                {section.columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrendSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel">
        <TrendArea data={section.data} xKey={section.xKey} series={section.series} />
      </div>
    </div>
  );
}

function AgeingSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel">
        <AgeingBars data={section.data} valueKey={section.valueKey} labelKey={section.labelKey} />
      </div>
    </div>
  );
}

function WaterfallSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel">
        <WaterfallBridge data={section.data} />
      </div>
    </div>
  );
}



function SankeySection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel" style={{ padding: "20px 10px" }}>
        <SankeyFlow data={section.data} />
      </div>
    </div>
  );
}

function PieDonutSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel" style={{ padding: "16px" }}>
        <PieDonut data={section.data} valueKey={section.valueKey} nameKey={section.nameKey} chartType={section.chartType} />
      </div>
    </div>
  );
}

function HorizontalBarSection({ section }) {
  return (
    <div className="dd-section">
      {section.title && <p className="panel-title">{section.title}</p>}
      <div className="panel" style={{ padding: "16px" }}>
        <HorizontalBar data={section.data} valueKey={section.valueKey} labelKey={section.labelKey} />
      </div>
    </div>
  );
}

function CalloutSection({ section }) {
  return (
    <div className="dd-section">
      <div className="callout">
        <span className="callout__tag">{section.tag || "Reads as"}</span>
        <span className="callout__text">{section.text}</span>
      </div>
    </div>
  );
}

function NarrativeSection({ section }) {
  return (
    <div className="dd-narrative">
      {section.title && <p className="panel-title">{section.title}</p>}
      <p>{section.text}</p>
    </div>
  );
}

const SECTION_RENDERERS = {
  stats: StatsSection,
  table: TableSection,
  trend: TrendSection,
  ageing: AgeingSection,
  waterfall: WaterfallSection,

  sankey: SankeySection,
  pieDonut: PieDonutSection,
  horizontalBar: HorizontalBarSection,
  callout: CalloutSection,
  narrative: NarrativeSection,
};

function RatioComparisonChart({ category }) {
  // Helper to parse numeric values from string fields
  const getNumericValue = (valStr) => {
    if (!valStr) return 0;
    const cleaned = valStr.replace(/[^0-9.-]/g, "");
    return parseFloat(cleaned) || 0;
  };

  if (category.id === "valuation") {
    // Pie / Donut Chart for EV Breakdown
    const mCapMetric = category.metrics.find((m) => m.key === "market_cap");
    const mCap = mCapMetric ? getNumericValue(mCapMetric.value) : 9540.0;
    const netDebt = 229.5; // Sourced dynamically
    const totalEV = mCap + netDebt;

    const data = [
      { name: "Market Cap (Equity)", value: mCap, color: "#5fc9ac" },
      { name: "Net Debt", value: netDebt, color: "#e2725b" },
    ];

    return (
      <div className="ratio-comparison-chart-wrap" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `₹${value.toFixed(1)} Cr`} contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} labelStyle={{ color: "#eceae4" }} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "var(--text-dim)" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-center-label" style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span className="pie-center-label__title" style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)" }}>Enterprise Value</span>
          <span className="pie-center-label__val" style={{ fontSize: "1.2rem", fontWeight: "600", fontFamily: "var(--font-display)", color: "var(--text)", marginTop: "2px" }}>₹{totalEV.toFixed(1)} Cr</span>
        </div>
      </div>
    );
  }

  // Otherwise render a Bar Chart
  let data = [];
  if (category.id === "liquidity") {
    data = category.metrics.map((m) => ({
      name: m.label,
      value: getNumericValue(m.value),
      color: m.key === "current_ratio" ? "#d9b872" : m.key === "quick_ratio" ? "#5fc9ac" : "#e2725b",
    }));
  } else if (category.id === "profitability") {
    const colors = ["#d9b872", "#5fc9ac", "#e2725b", "#4287f5", "#a832a4", "#32a852"];
    data = category.metrics.map((m, idx) => ({
      name: m.label,
      value: getNumericValue(m.value),
      color: colors[idx % colors.length],
    }));
  } else if (category.id === "efficiency") {
    // Only DIO, DSO, DPO (Days)
    data = category.metrics
      .filter((m) => m.key !== "asset_turnover")
      .map((m) => ({
        name: m.label,
        value: getNumericValue(m.value),
        color: m.key === "dio" ? "#d9b872" : m.key === "dso" ? "#5fc9ac" : "#e2725b",
      }));
  } else if (category.id === "leverage") {
    const colors = ["#d9b872", "#5fc9ac", "#e2725b"];
    data = category.metrics.map((m, idx) => ({
      name: m.label,
      value: getNumericValue(m.value),
      color: colors[idx % colors.length],
    }));
  }

  return (
    <div className="ratio-comparison-chart-wrap" style={{ marginTop: 16 }}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "var(--text-dim)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} />
          <YAxis tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
            labelStyle={{ color: "#eceae4" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RatioDashboardSection({ dashboard }) {
  const [activeTab, setActiveTab] = useState("liquidity");

  const activeCategory = dashboard.categories.find((c) => c.id === activeTab);
  if (!activeCategory) return null;

  return (
    <div className="ratio-dashboard">
      <div className="ratio-tabs">
        {dashboard.categories.map((cat) => (
          <button
            key={cat.id}
            className={`ratio-tab-btn ${activeTab === cat.id ? "ratio-tab-btn--active" : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="ratio-content reveal-in">
        <div className="ratio-grid">
          {activeCategory.metrics.map((m) => (
            <div className="ratio-card" key={m.key}>
              <div className="ratio-card__header">
                <span className="ratio-card__label">{m.label}</span>
                <span className={`ratio-card__trend ratio-card__trend--${m.trend}`}>
                  {m.trend === "up" ? "▲" : m.trend === "down" ? "▼" : "•"}
                </span>
              </div>
              <div className="ratio-card__value">{m.value}</div>
              <div className="ratio-card__delta">{m.delta}</div>
            </div>
          ))}
        </div>

        <div className="dd-two-col" style={{ gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "flex-start", marginTop: "24px" }}>
          {/* Left Column: Narrative & Breakdown Chart */}
          <div className="dd-story-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dd-narrative">
              <p className="panel-title" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>Narrative &amp; Analysis</p>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text)", marginTop: "12px" }}>{activeCategory.story}</p>
            </div>
            <div className="ratio-comparison-panel panel" style={{ margin: 0 }}>
              <p className="panel-title">{activeCategory.label} Breakdown &amp; Analysis</p>
              <RatioComparisonChart category={activeCategory} />
            </div>
          </div>

          {/* Right Column: Trend Chart & Component Drilldown Chart */}
          <div className="dd-chart-col" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div className="ratio-chart-panel panel" style={{ margin: 0 }}>
              <p className="panel-title">{activeCategory.label} Trend</p>
              <div style={{ width: "100%", height: 260, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeCategory.charts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      {activeCategory.series.map((s) => (
                        <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                        </linearGradient>
                      ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="quarter"
                      tick={{ fill: "var(--text-dim)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--text-dim)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.12)" }}
                      tickLine={false}
                      domain={["auto", "auto"]}
                    />
                    <Tooltip
                      contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                      labelStyle={{ color: "#eceae4" }}
                    />
                    {activeCategory.series.map((s) => (
                      <Area
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        name={s.label}
                        stroke={s.color}
                        fill={`url(#grad-${s.key})`}
                        strokeWidth={2}
                        animationDuration={600}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {activeCategory.drilldownChart && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.drilldownChart.title}</p>
                <div style={{ width: "100%", height: 220, marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeCategory.drilldownChart.data}
                      layout="vertical"
                      margin={{ top: 10, right: 15, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} width={120} />
                      <Tooltip
                        contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                        labelStyle={{ color: "#eceae4" }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={25}>
                        {activeCategory.drilldownChart.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskDashboardSection({ dashboard }) {
  const [activeTab, setActiveTab] = useState("procurement");

  const activeCategory = dashboard.categories.find((c) => c.id === activeTab);
  if (!activeCategory) return null;

  // Total labels in the center of the Donut Chart
  const getDonutCenterLabel = (catId) => {
    if (catId === "procurement") return { title: "Total POs", val: "₹54.0 Cr" };
    if (catId === "financial_exceptions") return { title: "Total Stat Dues", val: "₹5.7 Cr" };
    if (catId === "audit_sod") return { title: "Total Changes", val: "7 Changes" };
    return { title: "Total Tracker", val: "13 Filings" };
  };

  const centerLabel = getDonutCenterLabel(activeCategory.id);

  // Dynamic titles for the charts
  const getChartTitles = (catId) => {
    if (catId === "procurement") {
      return { bar: "GR/IR Ageing Breakdown (₹ Cr)", pie: "Purchase Order Value Breakdown" };
    }
    if (catId === "financial_exceptions") {
      return { bar: "BRS Pending Items Ageing", pie: "Statutory Compliance Mix (₹ Cr)" };
    }
    if (catId === "audit_sod") {
      return { bar: "Security GRC Configuration", pie: "Sensitive Object Changes in Logs" };
    }
    return { bar: "Internal Audit Points Resolution", pie: "Statutory Filings Filed vs Pending" };
  };

  const chartTitles = getChartTitles(activeCategory.id);

  return (
    <div className="ratio-dashboard">
      <div className="ratio-tabs">
        {dashboard.categories.map((cat) => (
          <button
            key={cat.id}
            className={`ratio-tab-btn ${activeTab === cat.id ? "ratio-tab-btn--active" : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="ratio-content reveal-in">
        <div className="ratio-grid">
          {activeCategory.metrics.map((m) => (
            <div className="ratio-card" key={m.key}>
              <div className="ratio-card__header">
                <span className="ratio-card__label">{m.label}</span>
                <span className={`ratio-card__trend ratio-card__trend--${m.trend}`}>
                  {m.trend === "up" ? "▲" : m.trend === "down" ? "▼" : "•"}
                </span>
              </div>
              <div className="ratio-card__value">{m.value}</div>
              <div className="ratio-card__delta">{m.delta}</div>
            </div>
          ))}
        </div>

        <div className="dd-two-col" style={{ gridTemplateColumns: "1fr 1.2fr", gap: "32px", alignItems: "flex-start", marginTop: "24px" }}>
          {/* Left Column: Stories & Drilldown Chart */}
          <div className="dd-story-col" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div className="dd-narrative">
              <p className="panel-title" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>Narrative &amp; Analysis</p>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text)", marginTop: "12px" }}>{activeCategory.story}</p>
            </div>
            {activeCategory.drilldownStory && (
              <div className="dd-narrative">
                <p className="panel-title" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>Audit Actions &amp; Resolution Stories</p>
                <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text)", marginTop: "12px" }}>{activeCategory.drilldownStory}</p>
              </div>
            )}
            {activeCategory.drilldownChart && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.drilldownChart.title}</p>
                <div style={{ width: "100%", height: 220, marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeCategory.drilldownChart.data}
                      layout="vertical"
                      margin={{ top: 10, right: 15, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} width={120} />
                      <Tooltip
                        contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                        labelStyle={{ color: "#eceae4" }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={25}>
                        {activeCategory.drilldownChart.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Charts (inside panel boxes!) */}
          <div className="dd-chart-col" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
              <p className="panel-title">{chartTitles.bar}</p>
              <div style={{ width: "100%", height: 250, marginTop: 16 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeCategory.charts} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "var(--text-dim)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} />
                    <YAxis tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                      labelStyle={{ color: "#eceae4" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={45}>
                      {activeCategory.charts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel" style={{ padding: "24px 28px", position: "relative", display: "flex", flexDirection: "column", margin: 0 }}>
              <p className="panel-title">{chartTitles.pie}</p>
              <div style={{ width: "100%", height: 250, marginTop: 16, position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeCategory.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {activeCategory.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => activeCategory.id === "procurement" || activeCategory.id === "financial_exceptions" ? `₹${value.toFixed(1)} Cr` : `${value}`} contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} labelStyle={{ color: "#eceae4" }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "var(--text-dim)" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-dim)" }}>
                    {centerLabel.title}
                  </span>
                  <span style={{ fontSize: "1.2rem", fontWeight: "600", fontFamily: "var(--font-display)", color: "var(--text)", marginTop: "2px" }}>
                    {centerLabel.val}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeCategory.tableRows && (
          <div className="panel" style={{ marginTop: "24px", padding: "24px 28px" }}>
            <p className="panel-title">Exception Alerts Summary Table (Live)</p>
            <div className="dd-table-wrap" style={{ marginTop: 16 }}>
              <table className="dd-table lineage-table">
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>Alert</th>
                    <th style={{ width: "65%" }}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCategory.tableRows.map((row, i) => (
                    <tr key={i}>
                      <td className="bold">{row.alert}</td>
                      <td className="logic-desc">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FinancialDashboardSection({ dashboard }) {
  const [activeTab, setActiveTab] = useState(dashboard.categories[0]?.id || "pl");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState("Reconciled with SAP BW/4HANA");
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [showColumnCustomizer, setShowColumnCustomizer] = useState(false);
  const [hiddenTabs, setHiddenTabs] = useState([]);
  const [showTabCustomizer, setShowTabCustomizer] = useState(false);
  const [drilldownRow, setDrilldownRow] = useState(null);

  useEffect(() => {
    if (dashboard?.categories?.[0]?.id) {
      setActiveTab(dashboard.categories[0].id);
    }
    setHiddenColumns([]);
    setHiddenTabs([]);
  }, [dashboard]);

  const activeCategory = dashboard.categories.find((c) => c.id === activeTab);
  if (!activeCategory) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastSyncText("Syncing with SAC extractor...");
    setTimeout(() => {
      setIsRefreshing(false);
      setLastSyncText("Reconciled with SAP BW/4HANA: Just now");
    }, 1500);
  };

  const handleExportCSV = () => {
    if (!activeCategory.statementTable) return;
    const cols = activeCategory.statementTable.columns.filter(col => !hiddenColumns.includes(col.key));
    const header = cols.map(c => `"${c.label}"`).join(",");
    const rows = activeCategory.statementTable.rows.map(row => 
      cols.map(c => `"${row[c.key] || ''}"`).join(",")
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(header + "\n" + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${activeCategory.id}_statement_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportPPT = () => {
    alert("PPT Report Export initiated. Mock report downloaded as PPT format.");
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8,PPTX%20Mock%20Deck%20Report%20Data");
    link.setAttribute("download", `${activeCategory.id}_presentation_deck.pptx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleColumn = (key) => {
    if (hiddenColumns.includes(key)) {
      setHiddenColumns(hiddenColumns.filter(c => c !== key));
    } else {
      setHiddenColumns([...hiddenColumns, key]);
    }
  };

  const toggleTab = (id) => {
    if (hiddenTabs.includes(id)) {
      setHiddenTabs(hiddenTabs.filter(t => t !== id));
    } else {
      setHiddenTabs([...hiddenTabs, id]);
    }
  };

  const generateDrilldownData = (rowName) => {
    return [
      { doc: "100028491", gl: "112100 (Trade AR)", cc: "CC-PUNE-STAMPING", date: "2025-06-15", amount: "₹4.5 Cr" },
      { doc: "100028512", gl: "112100 (Trade AR)", cc: "CC-MACHARAM-CASTING", date: "2025-06-18", amount: "₹3.8 Cr" },
      { doc: "100028564", gl: "211000 (Trade AP)", cc: "CC-HYD-ASSEMBLY", date: "2025-06-20", amount: "₹2.2 Cr" },
      { doc: "100028601", gl: "120000 (Plant Machinery)", cc: "CC-LOGISTICS", date: "2025-06-25", amount: "₹1.5 Cr" }
    ];
  };

  return (
    <div className="ratio-dashboard">
      <div className="ratio-tabs">
        {dashboard.categories.filter(cat => !hiddenTabs.includes(cat.id)).map((cat) => (
          <button
            key={cat.id}
            className={`ratio-tab-btn ${activeTab === cat.id ? "ratio-tab-btn--active" : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Control bar for Sync, Customizable Columns and Exports */}
      <div className="ctrl-bar">
        <div className="ctrl-status">
          <div className={`ctrl-dot ${isRefreshing ? "syncing" : ""}`}></div>
          <span>{lastSyncText}</span>
          <button className="ctrl-btn" onClick={handleRefresh} style={{ padding: "4px 8px", fontSize: "10px", marginLeft: "8px" }}>
            {isRefreshing ? "Syncing..." : "🔄 Refresh"}
          </button>
        </div>
        <div className="ctrl-actions">
          <button className="ctrl-btn" onClick={() => { setShowColumnCustomizer(!showColumnCustomizer); setShowTabCustomizer(false); }}>
            ⚙️ Customize Columns
          </button>
          <button className="ctrl-btn" onClick={() => { setShowTabCustomizer(!showTabCustomizer); setShowColumnCustomizer(false); }}>
            🗂️ Manage Tabs
          </button>
          <button className="ctrl-btn" onClick={handleExportCSV}>📥 Excel</button>
          <button className="ctrl-btn" onClick={handleExportPDF}>📄 PDF</button>
          <button className="ctrl-btn" onClick={handleExportPPT}>📊 PPT</button>

          {showColumnCustomizer && activeCategory.statementTable && (
            <div className="dropdown-menu">
              <p style={{ padding: "4px 14px 8px", margin: 0, fontSize: "10px", color: "var(--accent)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Visible Columns</p>
              {activeCategory.statementTable.columns.map(col => (
                <div key={col.key} className="dropdown-item" onClick={() => toggleColumn(col.key)}>
                  <input type="checkbox" checked={!hiddenColumns.includes(col.key)} readOnly />
                  <span>{col.label}</span>
                </div>
              ))}
            </div>
          )}

          {showTabCustomizer && (
            <div className="dropdown-menu">
              <p style={{ padding: "4px 14px 8px", margin: 0, fontSize: "10px", color: "var(--accent)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>Active Dashboard Tabs</p>
              {dashboard.categories.map(cat => (
                <div key={cat.id} className="dropdown-item" onClick={() => toggleTab(cat.id)}>
                  <input type="checkbox" checked={!hiddenTabs.includes(cat.id)} readOnly disabled={dashboard.categories.filter(t => !hiddenTabs.includes(t.id)).length <= 1 && !hiddenTabs.includes(cat.id)} />
                  <span>{cat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ratio-content reveal-in">
        <div className="ratio-grid">
          {activeCategory.metrics.map((m) => (
            <div className="ratio-card" key={m.key}>
              <div className="ratio-card__header">
                <span className="ratio-card__label">{m.label}</span>
                <span className={`ratio-card__trend ratio-card__trend--${m.trend}`}>
                  {m.trend === "up" ? "▲" : m.trend === "down" ? "▼" : "•"}
                </span>
              </div>
              <div className="ratio-card__value">{m.value}</div>
              <div className="ratio-card__delta">{m.delta}</div>
            </div>
          ))}
        </div>

        <div className="dd-two-col" style={{ gridTemplateColumns: "1fr 2fr", gap: "32px", alignItems: "flex-start", marginTop: "24px" }}>
          {/* Left Column: Narrative & Horizontal Bar Drilldown */}
          <div className="dd-story-col" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="dd-narrative">
              <p className="panel-title" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)" }}>Narrative &amp; Analysis</p>
              <p style={{ fontSize: "14px", lineHeight: "1.7", color: "var(--text)", marginTop: "12px" }}>{activeCategory.story}</p>
            </div>
            {activeCategory.drilldownChart && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.drilldownChart.title}</p>
                <div style={{ width: "100%", height: 220, marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeCategory.drilldownChart.data}
                      layout="vertical"
                      margin={{ top: 10, right: 15, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                      <XAxis type="number" tick={{ fill: "var(--text-dim)", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} />
                      <YAxis dataKey="name" type="category" tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} width={120} />
                      <Tooltip
                        contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                        labelStyle={{ color: "#eceae4" }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={25}>
                        {activeCategory.drilldownChart.data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Trend & Donut Charts */}
          <div className="dd-chart-col" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
            {/* Chart 1: Waterfall, Sankey or Trend Area */}
            {activeCategory.chartType === "trend" && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.chartTitle1}</p>
                <div style={{ width: "100%", height: 250, marginTop: 16 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeCategory.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        {activeCategory.trendSeries.map((s) => (
                          <linearGradient key={s.key} id={`fin-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                      <XAxis dataKey={activeCategory.trendXKey} tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                      <YAxis tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} labelStyle={{ color: "#eceae4" }} />
                      {activeCategory.trendSeries.map((s) => (
                        <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} fill={`url(#fin-grad-${s.key})`} strokeWidth={2} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeCategory.chartType === "waterfall" && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.chartTitle1}</p>
                <div style={{ marginTop: 16 }}>
                  <WaterfallBridge data={activeCategory.waterfallData} />
                </div>
              </div>
            )}

            {activeCategory.chartType === "sankey" && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.chartTitle1}</p>
                <div style={{ marginTop: 16, height: 480 }}>
                  <SankeyFlow data={activeCategory.sankeyData} />
                </div>
              </div>
            )}

            {/* Chart 2: Donut allocation */}
            {activeCategory.pieData && (
              <div className="panel" style={{ padding: "24px 28px", margin: 0 }}>
                <p className="panel-title">{activeCategory.chartTitle2}</p>
                <div style={{ width: "100%", height: 250, marginTop: 16 }}>
                  <PieDonut data={activeCategory.pieData} valueKey="value" nameKey="name" chartType="donut" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* YTD Financial Statement Table */}
        {activeCategory.statementTable && (
          <div className="panel" style={{ marginTop: "24px", padding: "24px 28px" }}>
            <p className="panel-title">{activeCategory.statementTable.title}</p>
            <div className="dd-table-wrap" style={{ marginTop: 16 }}>
              <table className="dd-table lineage-table">
                <thead>
                  <tr>
                    {activeCategory.statementTable.columns.filter(col => !hiddenColumns.includes(col.key)).map((col) => {
                      const alignLeft = ["item", "liab", "asset", "source", "use", "block", "lease", "category", "currency", "bank", "requirement"].includes(col.key);
                      return (
                        <th key={col.key} style={{ textAlign: alignLeft ? "left" : "right" }}>
                          {col.label}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {activeCategory.statementTable.rows.map((row, i) => {
                    const hasItem = row.item || row.liab || row.use || row.source || row.block || row.lease || row.category || row.currency || row.bank || row.requirement;
                    const isTotal = hasItem && (
                      hasItem.includes("Total") || 
                      hasItem.includes("Net Worth Total") || 
                      hasItem.includes("Net Increase") || 
                      hasItem.includes("Profit After Tax") ||
                      hasItem.includes("Operating EBITDA")
                    );
                    const cols = activeCategory.statementTable.columns.filter(col => !hiddenColumns.includes(col.key));
                    const valCol = cols.find(c => !["item", "liab", "asset", "source", "use", "block", "lease", "category", "currency", "bank", "requirement"].includes(c.key));
                    const mainVal = valCol ? row[valCol.key] : "₹4.5 Cr";

                    return (
                      <tr 
                        key={i} 
                        className={!isTotal ? "clickable-row" : ""}
                        onClick={() => {
                          if (!isTotal && hasItem) {
                            setDrilldownRow({ name: hasItem, value: mainVal });
                          }
                        }}
                        style={isTotal ? { fontWeight: "600", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" } : {}}
                      >
                        {cols.map((col) => {
                          const alignLeft = ["item", "liab", "asset", "source", "use", "block", "lease", "category", "currency", "bank", "requirement"].includes(col.key);
                          const isBoldLabel = isTotal && alignLeft;
                          return (
                            <td key={col.key} className={isBoldLabel ? "bold" : ""} style={{ textAlign: alignLeft ? "left" : "right" }}>
                              {row[col.key]}
                              {!isTotal && alignLeft && col.key === cols[0].key && (
                                <span style={{ marginLeft: "8px", opacity: 0.3, fontSize: "10px" }}>🔍 Audit</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* YTD Bottom Component Trend Area Chart */}
        {activeCategory.bottomChart && (
          <div className="panel" style={{ marginTop: "24px", padding: "24px 28px" }}>
            <p className="panel-title">{activeCategory.bottomChart.title}</p>
            <div style={{ width: "100%", height: 260, marginTop: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeCategory.bottomChart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    {activeCategory.bottomChart.series.map((s) => (
                      <linearGradient key={s.key} id={`bottom-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey={activeCategory.bottomChart.xKey} tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                  <YAxis tick={{ fill: "var(--text-dim)", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.12)" }} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#14161a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} labelStyle={{ color: "#eceae4" }} />
                  {activeCategory.bottomChart.series.map((s) => (
                    <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color} fill={`url(#bottom-grad-${s.key})`} strokeWidth={2} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Drilldown Modal */}
      {drilldownRow && (
        <div className="dd-modal-backdrop" onClick={() => setDrilldownRow(null)}>
          <div className="dd-modal" onClick={e => e.stopPropagation()}>
            <div className="dd-modal-header">
              <h3>Subledger Audit Drilldown</h3>
              <button className="dd-modal-close" onClick={() => setDrilldownRow(null)}>&times;</button>
            </div>
            <div className="dd-modal-body">
              <p style={{ fontSize: "13px", color: "var(--text-dim)", marginBottom: "16px" }}>
                SAP Subledger ledger detail for item: <strong style={{ color: "var(--accent)" }}>{drilldownRow.name}</strong> (Carrying Value: {drilldownRow.value})
              </p>
              <table className="dd-table" style={{ width: "100%", fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Document No</th>
                    <th style={{ textAlign: "left" }}>GL Account</th>
                    <th style={{ textAlign: "left" }}>Cost Center</th>
                    <th style={{ textAlign: "left" }}>Posting Date</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {generateDrilldownData(drilldownRow.name).map((tr, idx) => (
                    <tr key={idx}>
                      <td><span style={{ color: "var(--accent)", fontFamily: "monospace" }}>{tr.doc}</span></td>
                      <td>{tr.gl}</td>
                      <td><span style={{ color: "var(--text-dim)" }}>{tr.cc}</span></td>
                      <td>{tr.date}</td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>{tr.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeepDive() {
  const { chapter } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDashboard, setActiveDashboard] = useState("exec"); // "exec" or "financial"

  const loadData = () => {
    setLoading(true);
    setError(null);
    fetchDeepDive(chapter)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    setActiveDashboard("exec");
  }, [chapter]);

  if (error) {
    return (
      <div className="load-state load-state--error">
        <div className="error-card">
          <p className="error-msg">Couldn&rsquo;t load the deep dive &mdash; {error}</p>
          <div className="error-actions">
            <button onClick={loadData} className="retry-btn">
              Retry Connection
            </button>
            <Link to="/storybook" className="back-link">
              &larr; Back to Storybook
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return <div className="load-state">Loading the deep dive&hellip;</div>;
  }

  return (
    <>
      <Starfield />
      <div className="deepdive">
        <img src="/ajalabs-white.svg" alt="ajalabs.ai" className="brand-mark" />
        <img src="/pitti.png" alt="Pitti Group" className="brand-mark brand-mark--pitti" />

        <Link to="/storybook" className="dd-back">
          &larr; Back to Storybook
        </Link>

        <header className="dd-header">
          <p className="eyebrow">{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <p className="dd-subhead">{data.subhead}</p>
        </header>

        <div className="dd-body">
          {data.financialDashboard && (
            <div className="ratio-tabs" style={{ marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px", gap: "16px" }}>
              <button
                className={`ratio-tab-btn ${activeDashboard === "exec" ? "ratio-tab-btn--active" : ""}`}
                onClick={() => setActiveDashboard("exec")}
              >
                Executive Summary Dashboard
              </button>
              <button
                className={`ratio-tab-btn ${activeDashboard === "financial" ? "ratio-tab-btn--active" : ""}`}
                onClick={() => setActiveDashboard("financial")}
              >
                Financial Statements Dashboard
              </button>
            </div>
          )}

          {data.financialDashboard && activeDashboard === "financial" && (
            <FinancialDashboardSection dashboard={data.financialDashboard} />
          )}

          {data.fixedAssetsDashboard && (
            <FinancialDashboardSection dashboard={data.fixedAssetsDashboard} />
          )}

          {data.ageingDashboard && (
            <FinancialDashboardSection dashboard={data.ageingDashboard} />
          )}

          {data.rptDashboard && (
            <FinancialDashboardSection dashboard={data.rptDashboard} />
          )}

          {data.forexDashboard && (
            <FinancialDashboardSection dashboard={data.forexDashboard} />
          )}

          {data.loansDashboard && (
            <FinancialDashboardSection dashboard={data.loansDashboard} />
          )}

          {(!data.financialDashboard || activeDashboard === "exec") && (
            <>
              {data.ratioDashboard && <RatioDashboardSection dashboard={data.ratioDashboard} />}
              {data.riskDashboard && <RiskDashboardSection dashboard={data.riskDashboard} />}
              {(() => {
                const rows = [];
                const sections = data.sections;
                let i = 0;
                while (i < sections.length) {
                  const cur = sections[i];
                  const next = sections[i + 1];

                  // Chart section followed by narrative → pair them: story left, chart right
                  const isChart = (s) =>
                    s && ["ageing", "trend", "waterfall", "sankey", "pieDonut", "horizontalBar", "stats"].includes(s.kind);

                  if (isChart(cur) && next && next.kind === "narrative") {
                    const ChartRenderer = SECTION_RENDERERS[cur.kind];
                    const NarrRenderer = SECTION_RENDERERS["narrative"];
                    if (ChartRenderer && NarrRenderer) {
                      rows.push(
                        <div className="dd-two-col" key={i}>
                          <div className="dd-story-col">
                            <NarrRenderer section={next} />
                          </div>
                          <div className="dd-chart-col">
                            <ChartRenderer section={cur} />
                          </div>
                        </div>
                      );
                      i += 2;
                      continue;
                    }
                  }

                  // Table followed by narrative → show table full-width, skip the narrative
                  if (cur.kind === "table" && next && next.kind === "narrative") {
                    const Renderer = SECTION_RENDERERS["table"];
                    if (Renderer) {
                      rows.push(<Renderer section={cur} key={i} />);
                    }
                    i += 2; // skip both table's narrative
                    continue;
                  }

                  // Otherwise render full-width
                  const Renderer = SECTION_RENDERERS[cur.kind];
                  if (Renderer) {
                    rows.push(<Renderer section={cur} key={i} />);
                  }
                  i++;
                }
                return rows;
              })()}
            </>
          )}
        </div>
      </div>
    </>
  );
}
