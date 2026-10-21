import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import ContactPage from '../pages/ContactPage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <ContactPage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
