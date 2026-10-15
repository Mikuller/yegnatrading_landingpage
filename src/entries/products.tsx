import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import { AppProvider } from '../context/AppContext';
import ProductsPage from '../pages/ProductsPage';

const container = document.getElementById('root')!;
const app = (
  <AppProvider>
    <ProductsPage />
  </AppProvider>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
