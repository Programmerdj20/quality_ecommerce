/**
 * Cliente para Strapi CMS
 * Maneja configuración del sitio, temas, pedidos y usuarios
 * Soporta Multi-Tenant con header x-tenant-domain
 */

import type { SiteConfig, Theme, Order, StrapiResponse, Tenant } from '@/types';
import { PLACEHOLDER_SITE_CONFIG } from './placeholderData';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/utils/cache/simpleCache';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * Opciones para fetch de Strapi con soporte multi-tenant
 */
interface StrapiFetchOptions extends RequestInit {
  tenantDomain?: string; // Dominio del tenant para header x-tenant-domain
}

/**
 * Wrapper para fetch de Strapi con autenticación y multi-tenant
 */
async function strapiFetch<T>(
  endpoint: string,
  options: StrapiFetchOptions = {}
): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Agregar token si está disponible
  if (STRAPI_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
  }

  // Agregar header de tenant si está disponible (para isolation)
  if (options.tenantDomain) {
    headers['x-tenant-domain'] = options.tenantDomain;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Strapi Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from Strapi ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Obtener tenant por dominio
 * Usado por el middleware de detección de tenant
 */
export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  try {
    const normalizedDomain = domain.replace(/^https?:\/\//, '').toLowerCase();
    const response = await strapiFetch<{ data: any[] }>(
      `/tenants?filters[dominio][$eq]=${encodeURIComponent(normalizedDomain)}&filters[activo][$eq]=true&populate=*`
    );

    if (!response.data || response.data.length === 0) {
      console.warn(`⚠️ No se encontró tenant activo para dominio: ${normalizedDomain}`);
      return null;
    }

    const tenantData = response.data[0];
    const tenant: Tenant = {
      id: tenantData.id,
      ...tenantData.attributes,
    };

    return tenant;
  } catch (error) {
    console.error('❌ Error al obtener tenant por dominio:', error);
    return null;
  }
}

/**
 * Obtener configuración del sitio (filtrada por tenant)
 */
export async function getSiteConfig(tenantId?: string, tenantDomain?: string): Promise<SiteConfig> {
  const cacheKey = tenantId ? `${CACHE_KEYS.SITE_CONFIG}:${tenantId}` : CACHE_KEYS.SITE_CONFIG;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const queryParams = tenantId ? `?filters[tenant][id][$eq]=${tenantId}&populate=deep` : '?populate=deep';
        const response = await strapiFetch<StrapiResponse<any>>(
          `/site-configs${queryParams}`,
          { tenantDomain }
        );

        // Si es un array, tomar el primero
        const data = Array.isArray(response.data) ? response.data[0] : response.data;

        if (!data) {
          console.warn('⚠️ No se encontró configuración del sitio, usando placeholder');
          return PLACEHOLDER_SITE_CONFIG;
        }

        // Transformar respuesta de Strapi al formato esperado
        return transformStrapiConfig(data);
      } catch (error) {
        console.warn('Usando configuración placeholder');
        return PLACEHOLDER_SITE_CONFIG;
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener tema activo del tenant
 */
export async function getActiveTheme(tenantId?: string, tenantDomain?: string): Promise<Theme> {
  const cacheKey = tenantId ? `${CACHE_KEYS.THEME}:${tenantId}` : CACHE_KEYS.THEME;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const config = await getSiteConfig(tenantId, tenantDomain);
        return config.temaActivo;
      } catch (error) {
        console.warn('Usando tema placeholder');
        return PLACEHOLDER_SITE_CONFIG.temaActivo;
      }
    },
    CACHE_TTL.SHORT
  );
}

/**
 * Obtener todos los temas disponibles del tenant
 */
export async function getThemes(tenantId?: string, tenantDomain?: string): Promise<Theme[]> {
  try {
    const queryParams = tenantId ? `?filters[tenant][id][$eq]=${tenantId}&populate=*` : '?populate=*';
    const response = await strapiFetch<{ data: any[] }>(
      `/themes${queryParams}`,
      { tenantDomain }
    );

    return response.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error('Error obteniendo temas:', error);
    return [];
  }
}

/**
 * Actualizar tema activo (solo admin)
 */
export async function setActiveTheme(themeId: string): Promise<boolean> {
  try {
    await strapiFetch('/site-configuration', {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          temaActivo: themeId
        }
      })
    });

    // Invalidar caché
    cache.invalidate(CACHE_KEYS.SITE_CONFIG);
    cache.invalidate(CACHE_KEYS.THEME);

    return true;
  } catch (error) {
    console.error('Error actualizando tema:', error);
    return false;
  }
}

/**
 * Crear un nuevo pedido (con tenant)
 */
export async function createOrder(
  orderData: Partial<Order>,
  tenantId: string | number,
  tenantDomain?: string
): Promise<Order | null> {
  try {
    // Agregar tenantId a los datos del pedido
    const orderWithTenant = {
      ...orderData,
      tenant: tenantId,
    };

    const response = await strapiFetch<{ data: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ data: orderWithTenant }),
      tenantDomain,
    });

    return {
      id: response.data.id,
      ...response.data.attributes,
    };
  } catch (error) {
    console.error('Error creando pedido:', error);
    return null;
  }
}

/**
 * Actualizar estado de un pedido
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['estado'],
  paymentData?: Partial<Order['pago']>,
  tenantDomain?: string
): Promise<boolean> {
  try {
    const updateData: any = { estado: status };

    if (paymentData) {
      updateData.pago = paymentData;
    }

    await strapiFetch(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: updateData }),
      tenantDomain,
    });

    return true;
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    return false;
  }
}

/**
 * Obtener pedidos de un usuario (filtrado por tenant automáticamente)
 */
export async function getUserOrders(userId: string, tenantDomain?: string): Promise<Order[]> {
  try {
    const response = await strapiFetch<{ data: any[] }>(
      `/orders?filters[user][id][$eq]=${userId}&sort=createdAt:desc`,
      { tenantDomain }
    );

    return response.data.map((item: any) => ({
      id: item.id,
      ...item.attributes,
    }));
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return [];
  }
}

/**
 * Obtener un pedido por número (filtrado por tenant automáticamente)
 */
export async function getOrderByNumber(orderNumber: string, tenantDomain?: string): Promise<Order | null> {
  try {
    const response = await strapiFetch<{ data: any[] }>(
      `/orders?filters[numero][$eq]=${orderNumber}`,
      { tenantDomain }
    );

    if (!response.data || response.data.length === 0) return null;

    const orderData = response.data[0];
    return {
      id: orderData.id,
      ...orderData.attributes,
    };
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    return null;
  }
}

/**
 * Transformar respuesta de Strapi al formato de SiteConfig
 * Ajustar según la estructura real de tu Strapi
 */
function transformStrapiConfig(data: any): SiteConfig {
  // TODO: Ajustar según tu estructura real de Strapi
  // Esta es una transformación de ejemplo

  return {
    id: data.id?.toString() || '1',
    temaActivo: data.attributes?.temaActivo?.data?.attributes || PLACEHOLDER_SITE_CONFIG.temaActivo,
    banners: data.attributes?.banners || PLACEHOLDER_SITE_CONFIG.banners,
    textos: data.attributes?.textosLegales || PLACEHOLDER_SITE_CONFIG.textos,
    iva: data.attributes?.iva || 0.19,
    redesSociales: data.attributes?.redesSociales,
    contacto: data.attributes?.contacto
  };
}

/**
 * Autenticación de usuario (login)
 */
export async function login(identifier: string, password: string) {
  try {
    const response = await strapiFetch('/auth/local', {
      method: 'POST',
      body: JSON.stringify({
        identifier,
        password
      })
    });

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

/**
 * Registro de usuario
 */
export async function register(
  email: string,
  username: string,
  password: string,
  additionalData?: Record<string, any>
) {
  try {
    const response = await strapiFetch('/auth/local/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        username,
        password,
        ...additionalData
      })
    });

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
}

/**
 * Obtener datos del usuario actual (con JWT)
 */
export async function getCurrentUser(jwt: string) {
  try {
    const response = await strapiFetch('/users/me', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    return response;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    throw error;
  }
}
