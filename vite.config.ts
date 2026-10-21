import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        products: resolve(__dirname, 'products/index.html'),
        insights: resolve(__dirname, 'insights/index.html'),
        careers: resolve(__dirname, 'careers/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
