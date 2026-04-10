import { startTransition, useEffect, useState } from 'react';
import { routeOrder } from '../data/hqData';
import type { RouteId } from '../types/hq';

const defaultRoute: RouteId = 'command-center';

function normalizeHash(hash: string): RouteId {
  const cleaned = hash.replace(/^#\/?/, '');
  if (routeOrder.includes(cleaned as RouteId)) {
    return cleaned as RouteId;
  }

  return defaultRoute;
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteId>(() => normalizeHash(window.location.hash));

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = `/${defaultRoute}`;
    }

    const onHashChange = () => {
      startTransition(() => {
        setRoute(normalizeHash(window.location.hash));
      });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return route;
}
