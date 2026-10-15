import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const routes = [
  { path: '/', file: 'index.html' },
  { path: '/about/', file: 'about/index.html' },
  { path: '/products/', file: 'products/index.html' },
  { path: '/insights/', file: 'insights/index.html' },
  { path: '/careers/', file: 'careers/index.html' },
  { path: '/contact/', file: 'contact/index.html' },
];

async function prerender() {
  console.log('\n==========================================');
  console.log('⚡ Starting SSG Prerendering for MPA Pages');
  console.log('==========================================\n');

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: rootDir,
  });

  try {
    const { renderPage } = await vite.ssrLoadModule('/src/entry-server.tsx');

    for (const route of routes) {
      const filePath = path.resolve(distDir, route.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`[prerender] Warning: target HTML not found: ${filePath}`);
        continue;
      }

      const rawHtml = fs.readFileSync(filePath, 'utf-8');
      const appHtml = renderPage(route.path);

      // Inject rendered HTML into <div id="root">
      const finalHtml = rawHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      fs.writeFileSync(filePath, finalHtml, 'utf-8');
      const sizeKb = (Buffer.byteLength(appHtml, 'utf-8') / 1024).toFixed(1);
      console.log(`✓ Pre-rendered: ${route.path.padEnd(12)} -> dist/${route.file.padEnd(20)} (${sizeKb} KB HTML injected)`);
    }

    console.log('\n==========================================');
    console.log('🎉 SSG Prerendering successfully finished!');
    console.log('==========================================\n');
  } catch (err) {
    console.error('SSG Prerender encountered an error:', err);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

prerender();
