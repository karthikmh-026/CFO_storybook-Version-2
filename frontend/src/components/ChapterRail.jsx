import "./ChapterRail.css";

export default function ChapterRail({ chapters, activeId, onSelect }) {
  return (
    <nav className="chapter-rail">
      {chapters.map((chapter) => (
        <button
          key={chapter.id}
          className={`chapter-rail__dot ${activeId === chapter.id ? "is-active" : ""}`}
          onClick={() => onSelect(chapter.id)}
          aria-label={chapter.label}
        >
          <span className="chapter-rail__tooltip">{chapter.label}</span>
          <span className="chapter-rail__marker" />
        </button>
      ))}
    </nav>
  );
}
