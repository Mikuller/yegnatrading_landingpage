import { renderToString } from 'react-dom/server';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import InsightsPage from './pages/InsightsPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

export function renderPage(url: string): string {
  let PageComponent = HomePage;

  const normalized = url.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';

  if (normalized === '/about') {
    PageComponent = AboutPage;
  } else if (normalized === '/products') {
    PageComponent = ProductsPage;
  } else if (normalized === '/insights') {
    PageComponent = InsightsPage;
  } else if (normalized === '/careers') {
    PageComponent = CareersPage;
  } else if (normalized === '/contact') {
    PageComponent = ContactPage;
  }

  return renderToString(
    <AppProvider>
      <PageComponent />
    </AppProvider>
  );
}
