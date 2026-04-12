import { bottomNavRoutes } from '../../config/routes';

interface HubBottomNavProps {
  currentPath: string;
}

export function HubBottomNav({ currentPath }: HubBottomNavProps) {
  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      <div className="bottom-dock__scroll">
        {bottomNavRoutes.map((route) => (
          <a
            className={`bottom-dock__item ${
              route.path === currentPath ||
              (route.path === '/games' && currentPath.startsWith('/games')) ||
              (route.path === '/players' && currentPath.startsWith('/players')) ||
              (route.path === '/seasons' && currentPath.startsWith('/seasons'))
                ? 'bottom-dock__item--active'
                : ''
            }`}
            href={`#${route.path}`}
            key={route.id}
          >
            <span>{route.stateLabel}</span>
            <strong>{route.shortLabel}</strong>
          </a>
        ))}
      </div>
    </nav>
  );
}
