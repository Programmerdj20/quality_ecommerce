/**
 * Tipos relacionados con el sistema de temas dinámicos
 * Los temas se configuran desde Strapi
 */

export type ThemeSlug = 'default' | 'blackfriday' | 'navidad';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
}

export interface ThemeTypography {
  sans: string;
  heading: string;
}

export interface Theme {
  id: string;
  nombre: string;
  slug: ThemeSlug;
  colores: ThemeColors;
  tipografias: ThemeTypography;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Banner {
  id: string;
  imagen: string;
  titulo: string;
  subtitulo?: string;
  cta?: {
    texto: string;
    url: string;
  };
  orden: number;
  activo: boolean;
}

export interface TextosLegales {
  terminos: string;
  privacidad: string;
  sobreNosotros: string;
  politicaEnvios?: string;
  politicaDevoluciones?: string;
}

export interface SiteConfig {
  id: string;
  temaActivo: Theme;
  banners: Banner[];
  textos: TextosLegales;
  iva: number;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };
  contacto?: {
    email?: string;
    telefono?: string;
    direccion?: string;
  };
}

// Respuesta de la API de Strapi
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
