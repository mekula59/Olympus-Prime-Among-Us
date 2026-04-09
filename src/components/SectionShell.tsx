import type { ReactNode } from 'react';

interface SectionShellProps {
  id?: string;
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}

export function SectionShell({
  id,
  eyebrow,
  title,
  lede,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className="panel section-shell">
      <div className="section-shell__header">
        <p className="section-eyebrow">{eyebrow}</p>
        <div>
          <h2>{title}</h2>
          <p className="section-lede">{lede}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
