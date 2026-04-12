import { useState } from 'react';
import { ModuleFrame } from '../components/ModuleFrame';
import { PageIntro } from '../components/PageIntro';
import { ThresholdMarker } from '../components/ThresholdMarker';
import { usePublicSyncState } from '../hooks/usePublicSyncState';

export function TransmissionReportsPage() {
  const { transmissions, sync } = usePublicSyncState();
  const channelOptions = ['All channels', ...new Set(transmissions.map((item) => item.channel)), 'Standby'];
  const [activeChannel, setActiveChannel] = useState(channelOptions[0]);
  const visibleTransmissions =
    activeChannel === 'All channels'
      ? transmissions
      : transmissions.filter((item) => item.channel === activeChannel);

  return (
    <div className="page page--transmission-reports">
      <PageIntro
        eyebrow="Relay lounge"
        title="Announcements, chatter, and afterglow notes drifting through the ship."
        lede={
          sync.runtimeEnabled
            ? `The relay is now carrying live engine output, so verified reports and transmitted sessions arrive here as actual system traffic.`
            : 'This page is part noticeboard, part social memory. It should feel like overhearing the HQ talk to itself through warm speakers and soft indicator lights.'
        }
        tags={['Signal lounge', sync.phaseLabel, 'Warm relay glow']}
        aside={
          <div className="memory-orb memory-orb--compact">
            <p className="memory-orb__label">Speaker check</p>
            <strong>
              {sync.runtimeEnabled
                ? 'The speaker wall is now tied directly to the session engine.'
                : 'The ship sounds most like itself in the minute between one round and the next.'}
            </strong>
          </div>
        }
      />

      <ModuleFrame
        eyebrow="Relay tuner"
        title="Dial the ship to the room you want to overhear."
        lede="The lounge should feel like a warm receiver, not a standard feed filter."
        tone="cool"
        className="relay-console"
      >
        <div className="relay-console__layout">
          <div className="relay-dial">
            <span>Listening now</span>
            <strong>{activeChannel}</strong>
            <small>The room always sounds a little different depending on where you tune in.</small>
          </div>
          <div className="relay-chip-row" role="tablist" aria-label="Transmission channels">
            {channelOptions.map((channel) => (
              <button
                key={channel}
                className={`relay-chip ${channel === activeChannel ? 'relay-chip--active' : ''}`}
                onClick={() => setActiveChannel(channel)}
                type="button"
              >
                {channel}
              </button>
            ))}
          </div>
        </div>
      </ModuleFrame>

      <ThresholdMarker
        eyebrow="Speaker wall"
        title="Once the tuner locks in, the lounge stops being quiet."
        detail="Announcements, gossip, and afterglow should feel like different corners of the same room."
        tone="cool"
      />

      <div className="transmission-layout">
        <ModuleFrame
          eyebrow="Open channels"
          title="Reports coming through the speaker wall"
          lede="Different channels, same ship."
          className="transmission-feed"
        >
          <div className="transmission-stack">
            {visibleTransmissions.length > 0 ? (
              visibleTransmissions.map((item) => (
                <article className={`transmission-item transmission-item--${item.tone}`} key={`${item.stamp}-${item.title}`}>
                  <div className="transmission-item__meta">
                    <span>{item.channel}</span>
                    <strong>{item.stamp}</strong>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                  <small>{item.author}</small>
                </article>
              ))
            ) : (
              <div className="empty-bay relay-standby">
                <p>No active chatter on this frequency right now.</p>
                <span>The lounge is listening, but this channel is only giving soft static.</span>
              </div>
            )}
          </div>
        </ModuleFrame>

        <div className="stacked-side-modules">
          <ModuleFrame
            eyebrow="Signal moods"
            title="Channel flavors"
            lede="Tiny cues help this room feel curated, not generic."
            tone="warm"
          >
            <div className="signal-pillars">
              <span>Open lobby: welcoming and loud</span>
              <span>Crew chatter: dramatic and immediate</span>
              <span>Post-round: tidy but still emotional</span>
              <span>Quiet channel: the voice after the chaos</span>
            </div>
          </ModuleFrame>

          <ModuleFrame
            eyebrow="Queued but unsent"
            title="Next report draft pending"
            lede="Another in-world empty state."
            className="empty-state-module"
          >
            <div className="empty-bay empty-bay--relay">
              <p>The relay is clear for the next note from HQ, but no one has typed it yet.</p>
              <span>Signal line open. Cursor blinking.</span>
            </div>
          </ModuleFrame>
        </div>
      </div>
    </div>
  );
}
