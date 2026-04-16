import { amongUsModuleRoutes } from '../../config/routes';

interface AmongUsModuleHeaderProps {
  currentPath: string;
}

export function AmongUsModuleHeader({ currentPath }: AmongUsModuleHeaderProps) {
  return (
    <section className="among-us-module-header" aria-label="Among Us module navigation">
      <div className="among-us-module-header__copy">
        <p className="section-kicker">Featured Game</p>
        <h2>Among Us</h2>
        <p>
          Sharp reads, color memory, and the sessions people keep retelling after Discord has moved on.
        </p>
      </div>

      <div className="among-us-module-header__nav">
        {amongUsModuleRoutes.map((route) => (
          <a
            className={`among-us-chip ${route.path === currentPath ? 'among-us-chip--active' : ''}`}
            href={`#${route.path}`}
            key={route.id}
          >
            <span>{route.stateLabel}</span>
            <strong>{route.shortLabel}</strong>
          </a>
        ))}
      </div>
    </section>
  );
}
