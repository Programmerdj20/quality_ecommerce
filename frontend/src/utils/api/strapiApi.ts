/**
 * Cliente para Strapi CMS
 * Maneja configuración del sitio, temas, pedidos y usuarios
 */

import type { SiteConfig, Theme, Order, StrapiResponse } from '@/types';
import { PLACEHOLDER_SITE_CONFIG } from './placeholderData';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/utils/cache/simpleCache';

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

/**
 * Wrapper para fetch de Strapi con autenticación
 */
async function strapiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
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
 * Obtener configuración del sitio
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  return cache.getOrSet(
    CACHE_KEYS.SITE_CONFIG,
    async () => {
      try {
        const response = await strapiFetch<StrapiResponse<any>>(
          '/site-configuration?populate=deep'
        );

        // Transformar respuesta de Strapi al formato esperado
        return transformStrapiConfig(response.data);
      } catch (error) {
        console.warn('Usando configuración placeholder');
        return PLACEHOLDER_SITE_CONFIG;
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener tema activo
 */
export async function getActiveTheme(): Promise<Theme> {
  return cache.getOrSet(
    CACHE_KEYS.THEME,
    async () => {
      try {
        const config = await getSiteConfig();
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
 * Obtener todos los temas disponibles
 */
export async function getThemes(): Promise<Theme[]> {
  try {
    const response = await strapiFetch<StrapiResponse<Theme[]>>('/themes');
    return response.data;
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
 * Crear un nuevo pedido
 */
export async function createOrder(orderData: Partial<Order>): Promise<Order | null> {
  try {
    const response = await strapiFetch<StrapiResponse<Order>>('/orders', {
      method: 'POST',
      body: JSON.stringify({ data: orderData })
    });

    return response.data;
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
  paymentData?: Partial<Order['pago']>
): Promise<boolean> {
  try {
    const updateData: any = { estado: status };

    if (paymentData) {
      updateData.pago = paymentData;
    }

    await strapiFetch(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: updateData })
    });

    return true;
  } catch (error) {
    console.error('Error actualizando pedido:', error);
    return false;
  }
}

/**
 * Obtener pedidos de un usuario
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const response = await strapiFetch<StrapiResponse<Order[]>>(
      `/orders?filters[user][id][$eq]=${userId}&sort=createdAt:desc`
    );

    return response.data;
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    return [];
  }
}

/**
 * Obtener un pedido por número
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const response = await strapiFetch<StrapiResponse<Order[]>>(
      `/orders?filters[numero][$eq]=${orderNumber}`
    );

    return response.data[0] || null;
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
