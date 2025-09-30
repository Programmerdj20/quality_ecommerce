// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // Permite SSG + SSR selectivo
  server: {
    port: 4321,
    host: true
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['nanostores']
    }
  },
  // Configuración de rutas
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto'
  }
});