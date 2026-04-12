import type { CSSProperties } from 'react';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { usePublicSyncState } from '../hooks/usePublicSyncState';

export function MissionReportPage() {
  const { missionReport, shell, sync } = usePublicSyncState();

  return (
    <div className="page page--mission-report">
      <PageIntro
        eyebrow="Debrief dome"
        title="A polished report space quietly admitting the crew was chaos."
        lede={
          sync.runtimeEnabled
            ? `${shell.title} is now tied into the debrief dome, so this report reads from the session engine instead of pretending the night ended somewhere else.`
            : 'This page turns the night into a debrief without sanding off the personality. Calm typography, rounded instrument rails, and enough warmth to keep the report from feeling corporate.'
        }
        tags={['Calm shell', sync.phaseLabel, 'Post-round glow']}
        aside={
          <div className="memory-orb memory-orb--compact">
            <p className="memory-orb__label">Official note</p>
            <strong>
              {sync.runtimeEnabled
                ? missionReport.headline
                : 'Organized on paper. Still humming with last-round adrenaline.'}
            </strong>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Debrief instruments"
        title="How the room sounded once the night was over"
        lede="This chamber should read like ship instrumentation, not a product dashboard."
        className="gauge-module debrief-chamber"
      >
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
        <ModuleFrame
          eyebrow="Zone outcomes"
          title="What each room contributed to the myth"
          lede="Distinct zones should feel like they shape the night differently."
          tone="cool"
        >
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

        <ModuleFrame
          eyebrow="After-action reel"
          title="The lines still hanging in the dome"
          lede="This is the softer, more memorable side of the report room."
          tone="warm"
        >
          <div className="report-readouts">
            {missionReport.readouts.map((item) => (
              <article className="report-readout" key={item.title}>
                <span>{item.title}</span>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </ModuleFrame>

        <ModuleFrame
          eyebrow="Close-out note"
          title="The official conclusion"
          lede="It reads formal, but the memory underneath is still rowdy."
          tone="warm"
        >
          <div className="report-closeout">
            <p>{missionReport.verdict}</p>
            <p>{missionReport.recommendation}</p>
          </div>
        </ModuleFrame>
      </div>
    </div>
  );
}
