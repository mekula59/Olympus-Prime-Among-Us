import { startTransition, useEffect, useState } from 'react';
import { getRouteByPath, normalizeAppPath } from '../config/routes';

export function useHashRoute() {
  const [path, setPath] = useState(() => normalizeAppPath(window.location.hash));

  useEffect(() => {
    const syncHash = (nextPath: string) => {
      if (window.location.hash !== `#${nextPath}`) {
        window.history.replaceState(null, '', `#${nextPath}`);
      }
    };

    syncHash(path);

    const onHashChange = () => {
      const nextPath = normalizeAppPath(window.location.hash);
      syncHash(nextPath);

      startTransition(() => {
        setPath(nextPath);
      });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [path]);

  return {
    path,
    route: getRouteByPath(path),
  };
}
