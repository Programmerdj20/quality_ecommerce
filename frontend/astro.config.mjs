// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid', // Permite SSR para API routes y SSG para páginas estáticas
  server: {
    port: 4321,
    host: true
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['nanostores', 'mercadopago']
    }
  },
  // Configuración de rutas
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto'
  }
});