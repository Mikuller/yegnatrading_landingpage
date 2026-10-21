import { createRoot, hydrateRoot } from 'react-dom/client';
import './style.css';
import App from './App';

const container = document.getElementById('root')!;
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
