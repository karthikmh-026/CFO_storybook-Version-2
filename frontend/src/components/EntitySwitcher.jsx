import "./EntitySwitcher.css";

export default function EntitySwitcher({ companies, value, onChange }) {
  if (!companies?.length) return null;

  return (
    <div className="entity-switcher">
      {companies.map((c) => (
        <button
          key={c.code}
          type="button"
          title={c.name}
          className={`entity-switcher__pill ${value === c.code ? "is-active" : ""}`}
          onClick={() => onChange(c.code)}
        >
          {c.code === "ALL" ? "Consolidated" : c.code}
        </button>
      ))}
    </div>
  );
}
