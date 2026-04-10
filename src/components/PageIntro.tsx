import type { ReactNode } from 'react';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  lede: string;
  tags?: string[];
  aside?: ReactNode;
}

export function PageIntro({ eyebrow, title, lede, tags = [], aside }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="page-intro__copy">
        <p className="section-kicker">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="page-intro__lede">{lede}</p>
        {tags.length > 0 ? (
          <div className="page-tags" aria-label="Page cues">
            {tags.map((tag) => (
              <span className="page-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {aside ? <div className="page-intro__aside">{aside}</div> : null}
    </section>
  );
}
