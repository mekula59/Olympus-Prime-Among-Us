import type { ReactNode } from 'react';
import type { Tone } from '../types/hq';

interface ModuleFrameProps {
  eyebrow?: string;
  title?: string;
  lede?: string;
  className?: string;
  tone?: Tone;
  children: ReactNode;
}

export function ModuleFrame({
  eyebrow,
  title,
  lede,
  className = '',
  tone = 'quiet',
  children,
}: ModuleFrameProps) {
  return (
    <section className={`module module--${tone} ${className}`.trim()}>
      {eyebrow || title || lede ? (
        <header className="module__header">
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          {title ? <h3>{title}</h3> : null}
          {lede ? <p className="module__lede">{lede}</p> : null}
        </header>
      ) : null}
      <div className="module__body">{children}</div>
    </section>
  );
}
