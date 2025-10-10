/**
 * Tenant Resolver - Sistema de detección y resolución de tenants
 * Identifica el tenant por dominio y carga su configuración
 */

import type { Tenant, TenantContext } from '@/types/tenant';
import { tenantToContext, isTenant } from '@/types/tenant';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * Caché simple en memoria para configuraciones de tenant
 * Evita llamadas repetidas a Strapi en la misma sesión
 */
class TenantCache {
  private cache = new Map<string, { tenant: Tenant; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutos

  set(domain: string, tenant: Tenant): void {
    this.cache.set(domain, {
      tenant,
      timestamp: Date.now(),
    });
  }

  get(domain: string): Tenant | null {
    const entry = this.cache.get(domain);
    if (!entry) return null;

    // Validar TTL
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(domain);
      return null;
    }

    return entry.tenant;
  }

  invalidate(domain?: string): void {
    if (domain) {
      this.cache.delete(domain);
    } else {
      this.cache.clear();
    }
  }
}

const tenantCache = new TenantCache();

/**
 * Obtener tenant por dominio desde Strapi
 *
 * @param domain - Dominio a buscar (ej: 'tienda.cliente1.com' o 'localhost:4321')
 * @returns Tenant completo o null si no existe
 */
export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  // Normalizar dominio (remover protocolo si viene incluido)
  const normalizedDomain = domain.replace(/^https?:\/\//, '').toLowerCase();

  // Verificar caché primero
  const cached = tenantCache.get(normalizedDomain);
  if (cached) {
    console.log(`✅ Tenant encontrado en caché: ${cached.nombre} (${normalizedDomain})`);
    return cached;
  }

  try {
    // Construir URL de consulta a Strapi
    const url = `${STRAPI_URL}/api/tenants?filters[dominio][$eq]=${encodeURIComponent(normalizedDomain)}&populate=*`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (!response.ok) {
      console.error(`❌ Error al buscar tenant por dominio: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Validar que existe al menos un tenant
    if (!data.data || data.data.length === 0) {
      console.warn(`⚠️ No se encontró tenant para dominio: ${normalizedDomain}`);
      return null;
    }

    // Transformar respuesta de Strapi a Tenant
    const tenantData = data.data[0];
    const tenant: Tenant = {
      id: tenantData.id,
      ...tenantData.attributes,
    };

    // Validar que es un tenant válido
    if (!isTenant(tenant)) {
      console.error('❌ Datos de tenant inválidos recibidos de Strapi');
      return null;
    }

    // Validar que el tenant está activo
    if (!tenant.activo) {
      console.warn(`⚠️ Tenant encontrado pero está inactivo: ${tenant.nombre}`);
      return null;
    }

    // Guardar en caché
    tenantCache.set(normalizedDomain, tenant);

    console.log(`✅ Tenant cargado exitosamente: ${tenant.nombre} (${normalizedDomain})`);
    return tenant;
  } catch (error) {
    console.error('❌ Error al obtener tenant por dominio:', error);
    return null;
  }
}

/**
 * Obtener tenant por ID desde Strapi
 *
 * @param tenantId - ID del tenant
 * @returns Tenant completo o null si no existe
 */
export async function getTenantById(tenantId: string | number): Promise<Tenant | null> {
  try {
    const url = `${STRAPI_URL}/api/tenants/${tenantId}?populate=*`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (!response.ok) {
      console.error(`❌ Error al buscar tenant por ID: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (!data.data) {
      console.warn(`⚠️ No se encontró tenant con ID: ${tenantId}`);
      return null;
    }

    // Transformar respuesta de Strapi a Tenant
    const tenant: Tenant = {
      id: data.data.id,
      ...data.data.attributes,
    };

    // Validar que es un tenant válido y activo
    if (!isTenant(tenant) || !tenant.activo) {
      return null;
    }

    return tenant;
  } catch (error) {
    console.error('❌ Error al obtener tenant por ID:', error);
    return null;
  }
}

/**
 * Obtener configuración del tenant como TenantContext (sin tokens privados)
 * Seguro para pasar al cliente
 *
 * @param domain - Dominio del tenant
 * @returns TenantContext o null si no existe
 */
export async function getTenantContext(domain: string): Promise<TenantContext | null> {
  const tenant = await getTenantByDomain(domain);
  if (!tenant) return null;

  return tenantToContext(tenant);
}

/**
 * Extraer dominio del request de Astro
 * Compatible con desarrollo local y producción
 *
 * @param request - Request de Astro
 * @returns Dominio normalizado
 */
export function extractDomainFromRequest(request: Request): string {
  try {
    const url = new URL(request.url);
    return url.host; // Retorna 'example.com:3000' o 'example.com'
  } catch (error) {
    console.error('❌ Error al extraer dominio del request:', error);
    return 'localhost:4321'; // Fallback para desarrollo
  }
}

/**
 * Extraer dominio de headers (para casos donde URL no está disponible)
 *
 * @param headers - Headers del request
 * @returns Dominio o null si no se encuentra
 */
export function extractDomainFromHeaders(headers: Headers): string | null {
  // Intentar obtener de diferentes headers
  const host = headers.get('host') ||
               headers.get('x-forwarded-host') ||
               headers.get('x-original-host');

  if (!host) {
    console.warn('⚠️ No se encontró header "host" en el request');
    return null;
  }

  return host;
}

/**
 * Invalidar caché de tenant
 * Útil para desarrollo o cuando se actualiza configuración
 *
 * @param domain - Dominio específico o undefined para limpiar todo
 */
export function invalidateTenantCache(domain?: string): void {
  tenantCache.invalidate(domain);
  console.log(domain ? `🗑️ Caché invalidado para: ${domain}` : '🗑️ Caché de tenants limpiado completamente');
}

/**
 * Validar si un dominio es de desarrollo local
 *
 * @param domain - Dominio a validar
 * @returns true si es localhost o 127.0.0.1
 */
export function isLocalDomain(domain: string): boolean {
  return domain.includes('localhost') ||
         domain.includes('127.0.0.1') ||
         domain.includes('0.0.0.0');
}

/**
 * Obtener dominio de desarrollo configurado
 * Útil para testing local con múltiples tenants
 *
 * @returns Dominio de desarrollo o null
 */
export function getDevDomain(): string | null {
  // Puede leer de variable de entorno para testing
  return import.meta.env.PUBLIC_DEV_TENANT_DOMAIN || null;
}

/**
 * Helper para debugging: Listar todos los tenants activos
 * (Solo para desarrollo)
 */
export async function listActiveTenants(): Promise<Tenant[]> {
  try {
    const url = `${STRAPI_URL}/api/tenants?filters[activo][$eq]=true&populate=*`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
      },
    });

    if (!response.ok) return [];

    const data = await response.json();

    return data.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error('❌ Error al listar tenants:', error);
    return [];
  }
}
