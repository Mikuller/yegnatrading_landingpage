import { AppProvider } from './context/AppContext';
import { NavigationProvider, useNavigation, normalizePath } from './context/NavigationContext';
import PageShell from './components/PageShell';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import InsightsPage from './pages/InsightsPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';

function AppContent() {
  const { currentPath } = useNavigation();
  const normalized = normalizePath(currentPath);

  let PageComponent = HomePage;
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

  return (
    <PageShell>
      <PageComponent />
    </PageShell>
  );
}

export default function App({ initialPath }: { initialPath?: string }) {
  return (
    <AppProvider>
      <NavigationProvider initialPath={initialPath}>
        <AppContent />
      </NavigationProvider>
    </AppProvider>
  );
}
