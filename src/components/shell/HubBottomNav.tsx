import type { CSSProperties } from 'react';
import { bottomNavRoutes } from '../../config/routes';

interface HubBottomNavProps {
  currentPath: string;
}

function isActive(routePath: string, currentPath: string): boolean {
  return (
    routePath === currentPath ||
    (routePath === '/games' && currentPath.startsWith('/games')) ||
    (routePath === '/players' && currentPath.startsWith('/players')) ||
    (routePath === '/seasons' && currentPath.startsWith('/seasons'))
  );
}

const travelLabels: Record<string, { marker: string; label: string }> = {
  '/': { marker: 'MOUNT OLYMPUS', label: 'Home' },
  '/players': { marker: 'CHAMPIONS', label: 'Players' },
  '/seasons': { marker: 'CHRONICLES', label: 'Seasons' },
  '/yearbook': { marker: 'VAULT', label: 'Yearbook' },
  '/games': { marker: 'REALM GATES', label: 'Games' },
};

export function HubBottomNav({ currentPath }: HubBottomNavProps) {
  const activeIndex = Math.max(
    0,
    bottomNavRoutes.findIndex((route) => isActive(route.path, currentPath)),
  );

  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      <div
        className="bottom-dock__scroll"
        style={
          {
            '--active-index': activeIndex,
            '--total-items': bottomNavRoutes.length,
          } as CSSProperties
        }
      >
        <div className="bottom-dock__indicator" aria-hidden="true" />
        {bottomNavRoutes.map((route) => {
          const active = isActive(route.path, currentPath);
          const label = travelLabels[route.path] ?? { marker: 'MOVE', label: route.shortLabel };

          return (
            <a
              className={`bottom-dock__item ${active ? 'bottom-dock__item--active' : ''}`}
              href={`#${route.path}`}
              key={route.id}
              aria-current={active ? 'page' : undefined}
            >
              <i className="bottom-dock__node" aria-hidden="true" />
              <span>{label.marker}</span>
              <strong>{label.label}</strong>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
