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
const X_WIDGET_READY_RETRY_COUNT = 8;
const X_WIDGET_READY_RETRY_MS = 250;

let xWidgetScriptPromise: Promise<void> | null = null;

function getWidgetLoadTarget() {
  return window.twttr?.widgets?.load ?? null;
}

function waitForWidgetRuntime(attempt = 0): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (getWidgetLoadTarget()) {
    return Promise.resolve(true);
  }

  if (attempt >= X_WIDGET_READY_RETRY_COUNT) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    window.setTimeout(() => {
      void waitForWidgetRuntime(attempt + 1).then(resolve);
    }, X_WIDGET_READY_RETRY_MS);
  });
}

function ensureXWidgetScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve();
  }

  if (getWidgetLoadTarget()) {
    return Promise.resolve();
  }

  if (xWidgetScriptPromise) {
    return xWidgetScriptPromise;
  }

  const existingScript = document.getElementById(X_WIDGET_SCRIPT_ID) as HTMLScriptElement | null;

  xWidgetScriptPromise = new Promise<void>((resolve, reject) => {
    const handleLoad = () => resolve();
    const handleError = () => reject(new Error('Failed to load X widgets script.'));

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = X_WIDGET_SCRIPT_ID;
    script.async = true;
    script.src = X_WIDGET_SCRIPT_SRC;
    script.charset = 'utf-8';
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.body.appendChild(script);
  }).catch(() => {
    xWidgetScriptPromise = null;
  });

  return xWidgetScriptPromise;
  }

interface XPostEmbedProps {
  postUrl: string;
}

export function XPostEmbed({ postUrl }: XPostEmbedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function hydrateEmbed() {
      try {
        await ensureXWidgetScript();
        const ready = await waitForWidgetRuntime();

        if (!cancelled && ready && containerRef.current && getWidgetLoadTarget()) {
          window.twttr?.widgets?.load(containerRef.current);
        }
      } catch {
        // Leave the fallback blockquote link in place if the script cannot load.
      }
    }

    void hydrateEmbed();

    return () => {
      cancelled = true;
    };
  }, [postUrl]);

  return (
    <div className="x-post-embed" ref={containerRef}>
      <blockquote className="twitter-tweet" data-chrome="nofooter noborders transparent">
        <a href={postUrl}>View this Olympus Prime post on X</a>
      </blockquote>
    </div>
  );
}
