import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface BreadcrumbItem {
  label: string;
  amLabel: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { t } = useApp();

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-mute">
        <li className="flex items-center gap-1.5">
          <a
            href="/"
            className="hover:text-ember flex items-center gap-1 transition-colors"
            title={t('Home', 'መነሻ')}
          >
            <Home className="h-3.5 w-3.5" />
            <span>{t('Home', 'መነሻ')}</span>
          </a>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
              {isLast || !item.href ? (
                <span className="text-ink font-semibold" aria-current="page">
                  {t(item.label, item.amLabel)}
                </span>
              ) : (
                <a href={item.href} className="hover:text-ember transition-colors">
                  {t(item.label, item.amLabel)}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
