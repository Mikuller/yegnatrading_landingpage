import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';

export const ROUTE_TITLES: Record<string, string> = {
  '/': 'Yegna Trading PLC | Certified Steel Rebar & Construction Supply Ethiopia',
  '/about': 'About Yegna Trading PLC | Grade 75 Steel Supplier Since 2017',
  '/products': 'Grade 75 Rebar, Cement & Plywood Specs | Yegna Trading Ethiopia',
  '/insights': 'Construction Insights & Rebar Guides | Yegna Trading Ethiopia',
  '/careers': 'Careers at Yegna Trading PLC | Construction Supply Jobs Addis Ababa',
  '/contact': 'Request a Rebar Quote | Contact Yegna Trading Addis Ababa',
};

export function normalizePath(path: string): string {
  if (!path) return '/';
  const clean = path.replace(/\/index\.html$/, '').replace(/\/$/, '') || '/';
  return clean.startsWith('/') ? clean : `/${clean}`;
}

interface NavigationContextType {
  currentPath: string;
  isNavigating: boolean;
  isRevealing: boolean;
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  initialPath?: string;
}

export function NavigationProvider({ children, initialPath }: NavigationProviderProps) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (initialPath) return normalizePath(initialPath);
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const [isNavigating, setIsNavigating] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);

  const navigate = useCallback(
    (href: string) => {
      if (typeof window === 'undefined') return;

      const [rawPathname, rawHash] = href.split('#');
      const hash = rawHash ? `#${rawHash}` : '';
      const targetPath = normalizePath(rawPathname || currentPath);

      // Case 1: Same page anchor navigation (e.g. /about/#team or #quote)
      if (targetPath === currentPath) {
        if (rawHash) {
          const el = document.getElementById(rawHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          if (window.location.hash !== hash) {
            window.history.pushState({}, '', `${window.location.pathname}${hash}`);
          }
        }
        return;
      }

      // Case 2: Cross-page seamless client-side transition
      setIsNavigating(true);
      setIsRevealing(false);

      // Stage 1: Play Depth Dissolve & Sculpted Company Logo Medallion (~180ms)
      setTimeout(() => {
        // Stage 2: Swap the page component underneath the transition overlay
        setCurrentPath(targetPath);
        window.history.pushState({}, '', href);

        // Update document title
        const nextTitle = ROUTE_TITLES[targetPath] || ROUTE_TITLES['/'];
        if (nextTitle) {
          document.title = nextTitle;
        }

        // Scroll management
        if (rawHash) {
          setTimeout(() => {
            const el = document.getElementById(rawHash);
            if (el) {
              el.scrollIntoView({ behavior: 'instant' });
            }
          }, 30);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        // Stage 3: Smooth dissolution of the veil & horizon laser blade
        setIsNavigating(false);
        setIsRevealing(true);

        setTimeout(() => {
          setIsRevealing(false);
        }, 260);
      }, 190);
    },
    [currentPath]
  );

  // Handle browser Back / Forward buttons via popstate
  useEffect(() => {
    const handlePopState = () => {
      const target = normalizePath(window.location.pathname);
      setCurrentPath(target);
      const title = ROUTE_TITLES[target] || ROUTE_TITLES['/'];
      if (title) document.title = title;

      if (window.location.hash) {
        const id = window.location.hash.slice(1);
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Intercept all internal <a> link clicks document-wide
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Ignore right clicks or keyboard modifiers (cmd, ctrl, shift, alt)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, mailto, tel, downloads, or target="_blank"
      if (
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('//')
      ) {
        return;
      }

      // Handle relative or absolute internal paths
      if (href.startsWith('/') || href.startsWith('#')) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [navigate]);

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        isNavigating,
        isRevealing,
        navigate,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
