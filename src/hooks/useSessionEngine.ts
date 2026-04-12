import {
  createContext,
  createElement,
  useContext,
  type PropsWithChildren,
} from 'react';
import {
  sessionEngineStageEntityMap,
  sessionEngineStages,
  useSessionEngine as useSessionEngineState,
} from '../data/sessionEngine';

type SessionEngineStore = ReturnType<typeof useSessionEngineState>;

const SessionEngineContext = createContext<SessionEngineStore | null>(null);

export function SessionEngineProvider({ children }: PropsWithChildren) {
  const engine = useSessionEngineState();

  return createElement(SessionEngineContext.Provider, { value: engine }, children);
}

export function useSessionEngine() {
  const engine = useContext(SessionEngineContext);

  if (!engine) {
    throw new Error('useSessionEngine must be used within a SessionEngineProvider');
  }

  return engine;
}

export { sessionEngineStageEntityMap, sessionEngineStages };
