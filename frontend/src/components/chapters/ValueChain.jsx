import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import "./ValueChain.css";

export default function ValueChain({ data }) {
  const [ref, inView] = useScrollReveal(0.15);

  return (
    <section id="valuechain" className="chapter" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 2 — The Value Chain</p>
        <h2>{data.headline}</h2>
      </div>

      <div className={`narrative-col reveal ${inView ? "in-view" : ""}`} style={{ maxWidth: 720, marginBottom: 12 }}>
        <p>{data.subhead}</p>
      </div>

      <div className={`vc-flow reveal reveal-delay-1 ${inView ? "in-view" : ""}`}>
        {data.stages.map((stage, i) => (
          <Fragment key={stage.name}>
            {i > 0 && <div className="vc-arrow">→</div>}
            <div className={`vc-stage vc-stage--${stage.kind}`}>
              <div className="vc-stage__tag">{stage.tag}</div>
              <div className="vc-stage__name">{stage.name}</div>
              <div className="vc-stage__detail">{stage.detail}</div>
              <div className="vc-stage__value">
                {stage.value}
                {stage.delta && <span className="vc-stage__delta">{stage.delta}</span>}
              </div>
            </div>
          </Fragment>
        ))}
      </div>

      <div className={`vc-sectors reveal reveal-delay-2 ${inView ? "in-view" : ""}`}>
        <span className="vc-sectors__label">Fans out to →</span>
        <div className="vc-sectors__list">
          {data.sectors.map((sector) => (
            <div className={`vc-chip ${sector.highlight ? "vc-chip--highlight" : ""}`} key={sector.name}>
              {sector.name} <span className="vc-chip__share">{sector.share}{sector.trend === "up" && " ▲"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={`stat-grid reveal reveal-delay-3 ${inView ? "in-view" : ""}`} style={{ marginTop: 24 }}>
        <div className="stat-card">
          <div className="stat-card__value">{data.capacityUtilizationPct}%</div>
          <div className="stat-card__label">Capacity Utilization</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">₹{data.orderBookCr.toFixed(0)} Cr</div>
          <div className="stat-card__label">Open Order Book</div>
        </div>
      </div>

      <Link to="/deepdive/valuechain" className="chapter-deepdive" style={{ marginTop: 28 }}>
        Deep dive into Sales Analytics
      </Link>
    </section>
  );
}
