/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores dinámicos desde CSS Variables (configurados por el tema activo)
        primary: 'var(--color-primary, #2563eb)',
        secondary: 'var(--color-secondary, #7c3aed)',
        accent: 'var(--color-accent, #f59e0b)',
        background: 'var(--color-background, #ffffff)',
        text: 'var(--color-text, #1f2937)',
        'text-secondary': 'var(--color-text-secondary, #6b7280)',
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
