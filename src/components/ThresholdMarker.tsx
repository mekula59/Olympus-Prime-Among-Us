import type { Tone } from '../types/hq';

interface ThresholdMarkerProps {
  eyebrow: string;
  title: string;
  detail: string;
  tone?: Tone;
}

export function ThresholdMarker({
  eyebrow,
  title,
  detail,
  tone = 'quiet',
}: ThresholdMarkerProps) {
  return (
    <div className={`zone-threshold zone-threshold--${tone}`}>
      <span className="zone-threshold__line" aria-hidden="true" />
      <div className="zone-threshold__copy">
        <p>{eyebrow}</p>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <span className="zone-threshold__line" aria-hidden="true" />
    </div>
  );
}
