/**
 * Cargador y generador de temas dinámicos
 * Transforma la configuración del tema en CSS Variables
 * Soporta multi-tenant para cargar temas por tenant
 */

import type { SiteConfig, Theme } from '@/types';
import { getSiteConfig, getThemes, getActiveTheme } from '@/utils/api/strapiApi';

/**
 * Cargar configuración del sitio (con tema activo) de un tenant específico
 */
export async function loadSiteConfig(tenantId?: string, tenantDomain?: string): Promise<SiteConfig> {
  return await getSiteConfig(tenantId, tenantDomain);
}

/**
 * Cargar tema activo del tenant
 */
export async function loadTenantTheme(tenantId: string, tenantDomain?: string): Promise<Theme> {
  return await getActiveTheme(tenantId, tenantDomain);
}

/**
 * Cargar todos los themes disponibles del tenant
 */
export async function loadTenantThemes(tenantId: string, tenantDomain?: string): Promise<Theme[]> {
  return await getThemes(tenantId, tenantDomain);
}

/**
 * Generar CSS Variables desde un tema
 */
export function generateCSSVariables(theme: Theme): string {
  const { colores, tipografias } = theme;

  return `
    :root {
      /* Colores del tema */
      --color-primary: ${colores.primary};
      --color-secondary: ${colores.secondary};
      --color-accent: ${colores.accent};
      --color-background: ${colores.background};
      --color-text: ${colores.text};
      --color-text-secondary: ${colores.textSecondary};

      /* Tipografías */
      --font-sans: '${tipografias.sans}', system-ui, -apple-system, sans-serif;
      --font-heading: '${tipografias.heading}', system-ui, -apple-system, sans-serif;
    }
  `.trim();
}

/**
 * Obtener URL de Google Fonts para las tipografías del tema
 */
export function getGoogleFontsUrl(theme: Theme): string {
  const { tipografias } = theme;

  // Lista única de fuentes
  const fonts = Array.from(new Set([tipografias.sans, tipografias.heading]));

  // Construir URL de Google Fonts
  const fontParams = fonts.map(font => {
    const fontName = font.replace(/\s+/g, '+');
    return `family=${fontName}:wght@400;500;600;700`;
  }).join('&');

  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

/**
 * Aplicar tema dinámicamente en el cliente (JavaScript)
 */
export function applyThemeClient(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const { colores } = theme;
  const root = document.documentElement;

  // Aplicar variables CSS
  root.style.setProperty('--color-primary', colores.primary);
  root.style.setProperty('--color-secondary', colores.secondary);
  root.style.setProperty('--color-accent', colores.accent);
  root.style.setProperty('--color-background', colores.background);
  root.style.setProperty('--color-text', colores.text);
  root.style.setProperty('--color-text-secondary', colores.textSecondary);
}

/**
 * Detectar si el tema es oscuro basándose en el color de fondo
 */
export function isDarkTheme(theme: Theme): boolean {
  const hex = theme.colores.background.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Fórmula de luminancia relativa
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5;
}

/**
 * Obtener tema por slug
 */
export function getThemeBySlug(themes: Theme[], slug: string): Theme | undefined {
  return themes.find(t => t.slug === slug);
}
