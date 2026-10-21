import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import InsightsPage from '../pages/InsightsPage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <InsightsPage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
