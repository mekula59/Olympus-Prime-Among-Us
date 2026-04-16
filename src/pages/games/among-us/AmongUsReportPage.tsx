import type { CSSProperties } from 'react';
import { ModuleFrame } from '../../../components/ModuleFrame';
import { useAmongUsPublicSyncState } from '../../../hooks/games/among-us/useAmongUsPublicSyncState';

export function AmongUsReportPage() {
  const { missionReport, shell, sync } = useAmongUsPublicSyncState();

  return (
    <div className="page page--mission-report">
      <section className="module-screen-header" aria-label="Among Us report">
        <p className="module-screen-header__eyebrow">Among Us</p>
        <h2>Session report</h2>
        <p className="module-screen-header__lede">A cleaner recap screen for the final read on the night.</p>

        <div className="module-utility-row" aria-label="Report summary">
          <article>
            <span>Headline</span>
            <strong>{missionReport.headline}</strong>
          </article>
          <article>
            <span>Status</span>
            <strong>{sync.phaseLabel}</strong>
          </article>
          <article>
            <span>Source</span>
            <strong>{shell.title}</strong>
          </article>
        </div>
      </section>

      <ModuleFrame className="gauge-module debrief-chamber module-screen-module">
        <div className="debrief-chamber__layout">
          <div className="debrief-lantern">
            <span>Night verdict</span>
            <strong>{missionReport.headline}</strong>
            <p>{missionReport.summary}</p>
          </div>

          <div className="report-rail-stack">
            {missionReport.metrics.map((metric) => (
              <article className={`report-rail report-rail--${metric.tone}`} key={metric.label}>
                <div className="report-rail__header">
                  <h4>{metric.label}</h4>
                  <strong>{metric.value}%</strong>
                </div>
                <div className="report-rail__track">
                  <span
                    className="report-rail__fill"
                    style={{ '--fill': `${metric.value}%` } as CSSProperties}
                  />
                </div>
                <p>{metric.note}</p>
              </article>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <div className="two-up-grid">
        <ModuleFrame tone="cool" className="module-screen-module">
          <div className="debrief-grid">
            {missionReport.zoneDebriefs.map((debrief) => (
              <article className={`debrief-card debrief-card--${debrief.tone}`} key={debrief.zone}>
                <span>{debrief.outcome}</span>
                <h4>{debrief.zone}</h4>
                <p>{debrief.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame tone="warm" className="module-screen-module">
          <div className="report-readouts">
            {missionReport.readouts.map((item) => (
              <article className="report-readout" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame tone="warm" className="module-screen-module">
          <div className="report-closeout">
            <p>{missionReport.verdict}</p>
            <p>{missionReport.recommendation}</p>
          </div>
        </ModuleFrame>
      </div>
    </div>
  );
}
