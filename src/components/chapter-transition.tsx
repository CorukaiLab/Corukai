interface ChapterTransitionProps {
  chapter: string;
  eyebrow: string;
  title: string;
  tone?: "coral" | "aloe" | "yellow";
}

export function ChapterTransition({
  chapter,
  eyebrow,
  title,
  tone = "yellow",
}: ChapterTransitionProps) {
  return (
    <section className={`chapter-transition chapter-transition--${tone}`} aria-label={`${eyebrow}: ${title}`}>
      <div className="chapter-transition__edge" aria-hidden="true">
        <span /><span /><span /><b>{chapter}</b>
      </div>
      <div className="chapter-transition__curtains">
        <div>
          <p>{eyebrow}</p>
          <span>{chapter}</span>
        </div>
        <div>
          <h2>{title}</h2>
        </div>
      </div>
    </section>
  );
}
