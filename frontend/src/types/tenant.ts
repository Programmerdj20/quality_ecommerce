/**
 * Tipos TypeScript para el sistema Multi-Tenant
 * Define la estructura de tenants y sus configuraciones
 */

/**
 * Plan del tenant en el sistema SaaS
 */
export type TenantPlan = 'free' | 'basic' | 'premium';

/**
 * Configuración personalizable del tenant
 * Almacenada en el campo JSON del schema
 */
export interface TenantConfig {
  // Branding
  logo?: string; // URL o path del logo
  logoUrl?: string; // URL completa del logo
  nombre?: string; // Nombre de la tienda
  descripcion?: string; // Descripción corta

  // Colores del branding (CSS hex colors)
  colores?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };

  // IVA personalizado por país/región
  iva?: number; // Ej: 0.19 para Colombia (19%)

  // Información de contacto
  contacto?: {
    email?: string;
    telefono?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
  };

  // Redes sociales
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    whatsapp?: string;
  };

  // Textos legales personalizados
  textosLegales?: {
    terminosYCondiciones?: string;
    politicaPrivacidad?: string;
    politicaDevolucion?: string;
  };

  // Configuraciones adicionales
  moneda?: string; // Ej: 'COP', 'USD', 'MXN'
  locale?: string; // Ej: 'es-CO', 'es-MX'
  timezone?: string; // Ej: 'America/Bogota'
}

/**
 * Tenant - Cliente del e-commerce multi-tenant
 * Representa un cliente que tiene su propia tienda
 */
export interface Tenant {
  id: number | string;
  nombre: string; // Nombre del cliente/empresa
  slug: string; // URL-friendly identifier
  dominio: string; // Dominio custom (ej: tienda.cliente1.com)

  // Tokens de APIs externas (privados, solo en server)
  qualityApiToken?: string; // Token para Quality API (backend)
  mercadoPagoAccessToken?: string; // Token de MP (privado)
  mercadoPagoPublicKey?: string; // Public key de MP

  // Configuración personalizada (JSON)
  configuracion?: TenantConfig;

  // Estado del tenant
  activo: boolean; // Si está activo o no
  planActual: TenantPlan; // Plan contratado

  // Metadatos
  fechaCreacion?: string; // ISO date string
  notas?: string; // Notas internas del admin

  // Timestamps de Strapi (opcionales)
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Respuesta de Strapi para un Tenant
 */
export interface TenantStrapiResponse {
  data: {
    id: number;
    attributes: Omit<Tenant, 'id'>;
  };
}

/**
 * Respuesta de Strapi para múltiples Tenants
 */
export interface TenantsStrapiResponse {
  data: Array<{
    id: number;
    attributes: Omit<Tenant, 'id'>;
  }>;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Context de Tenant para pasar entre componentes
 * Versión simplificada sin tokens privados
 */
export interface TenantContext {
  id: string;
  nombre: string;
  slug: string;
  dominio: string;
  configuracion?: TenantConfig;
  activo: boolean;
  planActual: TenantPlan;
  // NO incluir tokens privados aquí (seguridad)
}

/**
 * Type guard para validar si un objeto es un Tenant válido
 */
export function isTenant(obj: any): obj is Tenant {
  return (
    obj &&
    typeof obj === 'object' &&
    (typeof obj.id === 'number' || typeof obj.id === 'string') &&
    typeof obj.nombre === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.dominio === 'string' &&
    typeof obj.activo === 'boolean' &&
    typeof obj.planActual === 'string' &&
    ['free', 'basic', 'premium'].includes(obj.planActual)
  );
}

/**
 * Type guard para validar TenantContext
 */
export function isTenantContext(obj: any): obj is TenantContext {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.nombre === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.dominio === 'string' &&
    typeof obj.activo === 'boolean'
  );
}

/**
 * Transformar Tenant completo a TenantContext (para uso en cliente)
 * Elimina tokens sensibles
 */
export function tenantToContext(tenant: Tenant): TenantContext {
  return {
    id: tenant.id.toString(),
    nombre: tenant.nombre,
    slug: tenant.slug,
    dominio: tenant.dominio,
    configuracion: tenant.configuracion,
    activo: tenant.activo,
    planActual: tenant.planActual,
  };
}

/**
 * Obtener logo del tenant con fallback
 */
export function getTenantLogo(tenant: TenantContext | Tenant): string | null {
  return tenant.configuracion?.logo || tenant.configuracion?.logoUrl || null;
}

/**
 * Obtener nombre de display del tenant
 */
export function getTenantDisplayName(tenant: TenantContext | Tenant): string {
  return tenant.configuracion?.nombre || tenant.nombre;
}

/**
 * Obtener IVA del tenant con fallback a Colombia (19%)
 */
export function getTenantIVA(tenant: TenantContext | Tenant): number {
  return tenant.configuracion?.iva || 0.19;
}

/**
 * Obtener moneda del tenant con fallback a COP
 */
export function getTenantCurrency(tenant: TenantContext | Tenant): string {
  return tenant.configuracion?.moneda || 'COP';
}

/**
 * Verificar si el tenant tiene Mercado Pago configurado
 * (Solo en server-side donde se tienen los tokens)
 */
export function hasMercadoPagoConfigured(tenant: Tenant): boolean {
  return !!(tenant.mercadoPagoAccessToken && tenant.mercadoPagoPublicKey);
}
