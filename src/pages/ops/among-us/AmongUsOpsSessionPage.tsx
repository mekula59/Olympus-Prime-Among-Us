import { ModuleFrame } from '../../../components/ModuleFrame';
import { getAmongUsOpsSessionIdFromPath } from '../../../config/routes';
import { useHubOpsData } from '../../../data/ops/hubOpsData';
import { useHashRoute } from '../../../hooks/useHashRoute';
import { AmongUsOpsEnginePage } from './AmongUsOpsEnginePage';

export function AmongUsOpsSessionPage() {
  const { path } = useHashRoute();
  const currentSessionId = getAmongUsOpsSessionIdFromPath(path) ?? undefined;
  const { currentHubOpsSessionId } = useHubOpsData(currentSessionId);

  return (
    <div className="page page--ops-among-us-session">
      <ModuleFrame
        eyebrow="Among Us Ops"
        title="Flagship session engine"
        lede="This route keeps the staged Among Us host workflow intact while the broader Ops layer stays lighter and more generic."
        tone="warm"
        className="ops-module-callout"
      >
        <div className="hub-placeholder__actions">
          <a className="secondary-link" href="#/ops">
            Back to Ops Home
          </a>
          <a className="secondary-link" href={`#/ops/sessions/${currentHubOpsSessionId}`}>
            Open Broad Session Editor
          </a>
        </div>
      </ModuleFrame>

      <AmongUsOpsEnginePage />
    </div>
  );
}
