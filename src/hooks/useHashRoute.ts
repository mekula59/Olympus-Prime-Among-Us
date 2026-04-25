import { startTransition, useEffect, useState } from 'react';
import { getRouteByPath, normalizeAppPath } from '../config/routes';

function isAuthCallbackLocation() {
  return (
    window.location.pathname.endsWith('/auth/callback') ||
    window.location.hash.includes('access_token=') ||
    window.location.hash.includes('refresh_token=') ||
    window.location.hash.includes('error=')
  );
}

export function useHashRoute() {
  const [path, setPath] = useState(() => normalizeAppPath(window.location.hash));

  useEffect(() => {
    if (isAuthCallbackLocation()) {
      return;
    }

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
