import { useEffect, useState } from "react";
import { fetchStory } from "./api";
import ChapterRail from "./components/ChapterRail";
import Starfield from "./components/Starfield";
import EntitySwitcher from "./components/EntitySwitcher";
import Hero from "./components/chapters/Hero";
import ExecSummary from "./components/chapters/ExecSummary";
import ValueChain from "./components/chapters/ValueChain";
import PLMarginStory from "./components/chapters/PLMarginStory";
import CashWorkingCapital from "./components/chapters/CashWorkingCapital";
import RatiosValuation from "./components/chapters/RatiosValuation";
import RiskAnomaly from "./components/chapters/RiskAnomaly";
import FixedAssets from "./components/chapters/FixedAssets";
import ForexLoans from "./components/chapters/ForexLoans";
import IntegrationModal from "./components/IntegrationModal";


const CHAPTERS = [
  { id: "hero", label: "Prologue" },
  { id: "exec", label: "Executive Summary" },
  { id: "valuechain", label: "Value Chain" },
  { id: "pl", label: "Margin Story" },
  { id: "cash", label: "Cash & Working Capital" },
  { id: "ratios", label: "Ratios & Valuation" },
  { id: "risk", label: "Risk & Anomaly" },
  { id: "fixedassets", label: "Capital Assets & RPT" },
  { id: "forexloans", label: "Forex & Loans" },
];

export default function Storybook() {
  const [story, setStory] = useState(null);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState("hero");
  const [entity, setEntity] = useState("ALL");
  const [activeEntityTab, setActiveEntityTab] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCompany, setModalCompany] = useState("");

  useEffect(() => {
    setError(null);
    setStory(null);
    fetchStory(entity)
      .then(setStory)
      .catch((e) => setError(e.message));
  }, [entity]);

  const handleEntityChange = (code) => {
    setActiveEntityTab(code);
    setEntity(code);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveEntityTab("ALL");
    setEntity("ALL");
  };

  useEffect(() => {
    if (!story) return undefined;
    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [story]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  if (error) {
    return <div className="load-state">Couldn't load the story &mdash; {error}</div>;
  }

  if (!story) {
    return <div className="load-state">Loading the story&hellip;</div>;
  }

  return (
    <>
      <Starfield />
      <div className="storybook">
        <EntitySwitcher companies={story.companies} value={activeEntityTab} onChange={handleEntityChange} />
        <img src="/ajalabs-white.svg" alt="ajalabs.ai" className="brand-mark" />
        <img src="/pitti.png" alt="Pitti Group" className="brand-mark brand-mark--pitti" />
        <a href="/" className="dd-back">&larr; Back to Home</a>
        <ChapterRail chapters={CHAPTERS} activeId={activeId} onSelect={scrollTo} />
        <Hero meta={story.meta} hero={story.hero} />
        <ExecSummary data={story.execSummary} />
        <ValueChain data={story.valueChain} />
        <PLMarginStory data={story.plBridge} />
        <CashWorkingCapital data={story.cashWorkingCapital} />
        <RatiosValuation data={story.ratiosValuation} />
        <RiskAnomaly data={story.riskAnomaly} />
        <FixedAssets data={story.fixedAssets} rptData={story.rpt} />
        <ForexLoans data={story.forex} loansData={story.loans} />
        <IntegrationModal isOpen={modalOpen} companyCode={modalCompany} onClose={handleCloseModal} />
      </div>
    </>
  );
}
