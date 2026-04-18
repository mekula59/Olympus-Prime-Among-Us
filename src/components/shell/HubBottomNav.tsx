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
        {bottomNavRoutes.map((route) => (
          <a
            className={`bottom-dock__item ${isActive(route.path, currentPath) ? 'bottom-dock__item--active' : ''}`}
            href={`#${route.path}`}
            key={route.id}
            aria-current={isActive(route.path, currentPath) ? 'page' : undefined}
          >
            <strong>{route.shortLabel}</strong>
          </a>
        ))}
      </div>
    </nav>
  );
}
