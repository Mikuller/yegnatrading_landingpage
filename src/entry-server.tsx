import { renderToString } from 'react-dom/server';
import App from './App';

export function renderPage(url: string): string {
  return renderToString(<App initialPath={url} />);
}
