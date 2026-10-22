import { createRoot, hydrateRoot } from 'react-dom/client';
import '../style.css';
import App from '../App';

const container = document.getElementById('root')!;
const app = <App />;

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
