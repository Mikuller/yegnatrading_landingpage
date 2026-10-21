import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import CareersPage from '../pages/CareersPage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <CareersPage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
