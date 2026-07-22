import { Link } from "react-router-dom";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import CountUp from "../CountUp";
import AgeingBars from "../charts/AgeingBars";
import TrendArea from "../charts/TrendArea";
import "./CashWorkingCapital.css";

export default function CashWorkingCapital({ data }) {
  const [ref, inView] = useScrollReveal(0.15);
  const { ccc } = data;

  return (
    <section id="cash" className="chapter" ref={ref}>
      <div className="chapter__label">
        <p className="eyebrow">Chapter 4 — Cash &amp; Working Capital</p>
        <h2>Profit on paper is not cash in the bank</h2>
      </div>

      <div className="two-col">
        <div className={`narrative-col reveal ${inView ? "in-view" : ""}`}>
          <p>
            Stock sits on the shelf for {ccc.inventoryDays} days, customers take{" "}
            {ccc.receivableDays} days to pay, and suppliers are paid in {ccc.payableDays}{" "}
            days &mdash; net, cash is tied up for {ccc.netDays} days on every cycle.
          </p>
          <p className="hook">Some of these receivables aren't just slow &mdash; they're anomalous.</p>
        </div>

        <div className={`cash__visual reveal reveal-delay-1 ${inView ? "in-view" : ""}`}>
          <div className="ccc-bridge">
            <div className="ccc-block">
              <div className="ccc-block__value">
                <CountUp value={ccc.inventoryDays} trigger={inView} decimals={0} />
              </div>
              <div className="ccc-block__label">Inventory Days</div>
            </div>
            <div className="ccc-op">+</div>
            <div className="ccc-block">
              <div className="ccc-block__value">
                <CountUp value={ccc.receivableDays} trigger={inView} decimals={0} />
              </div>
              <div className="ccc-block__label">Receivable Days</div>
            </div>
            <div className="ccc-op">&minus;</div>
            <div className="ccc-block">
              <div className="ccc-block__value">
                <CountUp value={ccc.payableDays} trigger={inView} decimals={0} />
              </div>
              <div className="ccc-block__label">Payable Days</div>
            </div>
            <div className="ccc-op">=</div>
            <div className="ccc-block ccc-block--total">
              <div className="ccc-block__value">
                <CountUp value={ccc.netDays} trigger={inView} decimals={0} />
              </div>
              <div className="ccc-block__label">Cash Conversion Cycle</div>
            </div>
          </div>

          <div className="cash__grid cash__grid--three" style={{ marginTop: 24 }}>
            <div className="panel">
              <p className="panel-title">Receivables Ageing (₹ Cr)</p>
              <AgeingBars data={data.arAgeing} />
            </div>
            <div className="panel">
              <p className="panel-title">Inventory Ageing (₹ Cr)</p>
              <AgeingBars data={data.inventoryAgeing} labelKey="bucket" />
            </div>
            <div className="panel">
              <p className="panel-title">Payables Ageing (₹ Cr)</p>
              <AgeingBars data={data.payablesAgeing} labelKey="bucket" />
            </div>
          </div>

          <div className="cash__grid" style={{ marginTop: 20 }}>
            <div className="panel">
              <p className="panel-title">DSO Trend (days)</p>
              <TrendArea
                data={data.dsoTrend}
                xKey="quarter"
                series={[{ key: "dso", label: "DSO", color: "#5fc9ac" }]}
              />
            </div>
            <div className="callout callout--warn" style={{ alignSelf: "center" }}>
              <span className="callout__tag">Flag</span>
              <span className="callout__text">{data.flag}</span>
            </div>
          </div>

          <div className="stat-grid" style={{ marginTop: 18 }}>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.payables.msme} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Payables — MSME</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.payables.nonMsme} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Payables — Non-MSME</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.netDebtBridge.grossBorrowings} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Gross Borrowings</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.netDebtBridge.netDebt} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Net Debt</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__value">
                <CountUp value={data.freeCashFlowCr} trigger={inView} prefix="₹" suffix=" Cr" />
              </div>
              <div className="stat-card__label">Free Cash Flow</div>
            </div>
          </div>

          <Link to="/deepdive/cash" className="chapter-deepdive">
            Deep dive into Working Capital &amp; Treasury
          </Link>
        </div>
      </div>
    </section>
  );
}
