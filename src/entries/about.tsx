import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import AboutPage from '../pages/AboutPage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <AboutPage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
