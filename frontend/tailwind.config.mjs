/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Paleta Minimalista (colores estáticos)
        'white-pure': '#FFFFFF',
        'white-smoke': '#F5F5F5',
        'gray-light': '#D9D9D9',
        'gray-medium': '#7A7A7A',
        'gray-dark': '#2E2E2E',
        'black-pure': '#000000',

        // Colores dinámicos desde CSS Variables (configurados por el tema activo)
        primary: 'var(--color-primary, #000000)',
        secondary: 'var(--color-secondary, #2E2E2E)',
        accent: 'var(--color-accent, #000000)',
        background: 'var(--color-background, #F5F5F5)',
        surface: 'var(--color-surface, #FFFFFF)',
        border: 'var(--color-border, #D9D9D9)',
        text: 'var(--color-text, #2E2E2E)',
        'text-secondary': 'var(--color-text-secondary, #7A7A7A)',
      },
      fontFamily: {
        sans: ['var(--font-sans, "Inter")', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading, "Poppins")', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
};
