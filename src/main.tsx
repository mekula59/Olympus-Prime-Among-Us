import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SessionEngineProvider } from './hooks/useSessionEngine';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SessionEngineProvider>
      <App />
    </SessionEngineProvider>
  </StrictMode>,
);
