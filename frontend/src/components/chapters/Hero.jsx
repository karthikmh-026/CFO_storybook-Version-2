import { useScrollReveal } from "../../hooks/useScrollReveal";
import CountUp from "../CountUp";
import "./Hero.css";

export default function Hero({ meta, hero }) {
  const [ref, inView] = useScrollReveal(0.4);

  return (
    <section id="hero" className="chapter hero" ref={ref}>
      <div className={`hero__content reveal ${inView ? "in-view" : ""}`}>
        <p className="eyebrow">
          {meta.company} &mdash; {meta.period}
        </p>
        <h1 className="hero__headline">{hero.headline}</h1>
        <p className="hero__subhead">{hero.subhead}</p>
        <div className="hero__number">
          <CountUp value={hero.revenueYtdCr} trigger={inView} prefix="₹" suffix=" Cr" />
        </div>
        <p className="hero__number-label">{hero.revenueYtdLabel}</p>
      </div>
      <div className="hero__cue">Scroll to begin the story ↓</div>
    </section>
  );
}
