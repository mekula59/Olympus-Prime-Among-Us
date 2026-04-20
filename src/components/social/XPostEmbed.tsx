import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

const X_WIDGET_SCRIPT_ID = 'olympus-prime-x-widgets';
const X_WIDGET_SCRIPT_SRC = 'https://platform.twitter.com/widgets.js';

function ensureXWidgetScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(X_WIDGET_SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = X_WIDGET_SCRIPT_ID;
  script.async = true;
  script.src = X_WIDGET_SCRIPT_SRC;
  script.charset = 'utf-8';
  document.body.appendChild(script);
}

interface XPostEmbedProps {
  postUrl: string;
}

export function XPostEmbed({ postUrl }: XPostEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ensureXWidgetScript();

    if (window.twttr?.widgets?.load && containerRef.current) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, [postUrl]);

  return (
    <div className="x-post-embed" ref={containerRef}>
      <blockquote className="twitter-tweet" data-chrome="nofooter noborders transparent">
        <a href={postUrl}>View this Olympus Prime post on X</a>
      </blockquote>
    </div>
  );
}
