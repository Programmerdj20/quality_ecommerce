// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server', // SSR (Server-Side Rendering) para soporte completo
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