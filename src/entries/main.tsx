import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import HomePage from '../pages/HomePage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <HomePage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
