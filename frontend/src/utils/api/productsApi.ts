/**
 * Cliente para la API contable externa
 * Maneja productos, inventario, precios e imágenes
 */

import type { Product, ProductCategory, ProductFilters, ProductListResponse } from '@/types';
import { PLACEHOLDER_PRODUCTS, PLACEHOLDER_CATEGORIES } from './placeholderData';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/utils/cache/simpleCache';

const API_URL = import.meta.env.PUBLIC_API_CONTABLE_URL;
const API_TOKEN = import.meta.env.PUBLIC_API_CONTABLE_TOKEN;
const USE_PLACEHOLDER = !API_URL || !API_TOKEN;

/**
 * Configuración del cliente HTTP
 */
const fetchConfig: RequestInit = {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  }
};

/**
 * Wrapper para fetch con manejo de errores
 */
async function apiFetch<T>(endpoint: string): Promise<T> {
  if (USE_PLACEHOLDER) {
    console.warn(`⚠️ API contable no configurada. Usando datos placeholder.`);
    throw new Error('API not configured');
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, fetchConfig);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Obtener lista de productos con filtros opcionales
 */
export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const cacheKey = `${CACHE_KEYS.PRODUCTS}:${JSON.stringify(filters || {})}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        // TODO: Ajustar según la estructura real de tu API
        // Ejemplo: const data = await apiFetch<Product[]>('/productos');
        const data = await apiFetch<Product[]>('/productos');

        // Aplicar filtros localmente si la API no los soporta
        return applyLocalFilters(data, filters);
      } catch (error) {
        console.warn('Usando datos placeholder para productos');
        return applyLocalFilters(PLACEHOLDER_PRODUCTS, filters);
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener un producto por su slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = `${CACHE_KEYS.PRODUCT}:${slug}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        // TODO: Ajustar según la estructura real de tu API
        const data = await apiFetch<Product>(`/productos/${slug}`);
        return data;
      } catch (error) {
        console.warn(`Usando placeholder para producto: ${slug}`);
        return PLACEHOLDER_PRODUCTS.find(p => p.slug === slug) || null;
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener un producto por su ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const cacheKey = `${CACHE_KEYS.PRODUCT}:id:${id}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const data = await apiFetch<Product>(`/productos/id/${id}`);
        return data;
      } catch (error) {
        console.warn(`Usando placeholder para producto ID: ${id}`);
        return PLACEHOLDER_PRODUCTS.find(p => p.id === id) || null;
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener productos por categoría
 */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const cacheKey = `${CACHE_KEYS.PRODUCTS}:category:${categorySlug}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const data = await apiFetch<Product[]>(`/productos/categoria/${categorySlug}`);
        return data;
      } catch (error) {
        console.warn(`Usando placeholder para categoría: ${categorySlug}`);
        return PLACEHOLDER_PRODUCTS.filter(p => p.categoria === categorySlug);
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Obtener todas las categorías
 */
export async function getCategories(): Promise<ProductCategory[]> {
  return cache.getOrSet(
    CACHE_KEYS.CATEGORIES,
    async () => {
      try {
        const data = await apiFetch<ProductCategory[]>('/categorias');
        return data;
      } catch (error) {
        console.warn('Usando placeholder para categorías');
        return PLACEHOLDER_CATEGORIES;
      }
    },
    CACHE_TTL.LONG
  );
}

/**
 * Buscar productos por texto
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const cacheKey = `${CACHE_KEYS.PRODUCTS}:search:${query.toLowerCase()}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const data = await apiFetch<Product[]>(`/productos/buscar?q=${encodeURIComponent(query)}`);
        return data;
      } catch (error) {
        console.warn('Usando búsqueda local en placeholder');
        return PLACEHOLDER_PRODUCTS.filter(p =>
          p.nombre.toLowerCase().includes(query.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(query.toLowerCase())
        );
      }
    },
    CACHE_TTL.SHORT
  );
}

/**
 * Verificar disponibilidad de stock para múltiples productos
 */
export async function checkStockAvailability(productIds: string[]): Promise<Record<string, number>> {
  try {
    const data = await apiFetch<Record<string, number>>('/productos/stock', {
      method: 'POST',
      body: JSON.stringify({ productIds })
    } as RequestInit);
    return data;
  } catch (error) {
    console.warn('Usando stock placeholder');
    const stockMap: Record<string, number> = {};
    productIds.forEach(id => {
      const product = PLACEHOLDER_PRODUCTS.find(p => p.id === id);
      stockMap[id] = product?.stock || 0;
    });
    return stockMap;
  }
}

/**
 * Obtener productos destacados o en oferta
 */
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const cacheKey = `${CACHE_KEYS.PRODUCTS}:featured:${limit}`;

  return cache.getOrSet(
    cacheKey,
    async () => {
      try {
        const data = await apiFetch<Product[]>(`/productos/destacados?limit=${limit}`);
        return data;
      } catch (error) {
        console.warn('Usando productos destacados placeholder');
        return PLACEHOLDER_PRODUCTS
          .filter(p => p.precioDescuento && p.activo)
          .slice(0, limit);
      }
    },
    CACHE_TTL.MEDIUM
  );
}

/**
 * Aplicar filtros localmente (fallback si la API no soporta filtros)
 */
function applyLocalFilters(products: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return products;

  let filtered = [...products];

  // Filtrar por categoría
  if (filters.categoria) {
    filtered = filtered.filter(p => p.categoria === filters.categoria);
  }

  // Filtrar por subcategoría
  if (filters.subcategoria) {
    filtered = filtered.filter(p => p.subcategoria === filters.subcategoria);
  }

  // Filtrar por precio
  if (filters.precioMin !== undefined) {
    filtered = filtered.filter(p => {
      const precio = p.precioDescuento || p.precio;
      return precio >= filters.precioMin!;
    });
  }

  if (filters.precioMax !== undefined) {
    filtered = filtered.filter(p => {
      const precio = p.precioDescuento || p.precio;
      return precio <= filters.precioMax!;
    });
  }

  // Filtrar por stock
  if (filters.enStock) {
    filtered = filtered.filter(p => p.stock > 0);
  }

  // Filtrar por búsqueda
  if (filters.busqueda) {
    const query = filters.busqueda.toLowerCase();
    filtered = filtered.filter(p =>
      p.nombre.toLowerCase().includes(query) ||
      p.descripcion.toLowerCase().includes(query)
    );
  }

  // Ordenar
  if (filters.ordenar) {
    switch (filters.ordenar) {
      case 'precio-asc':
        filtered.sort((a, b) => {
          const precioA = a.precioDescuento || a.precio;
          const precioB = b.precioDescuento || b.precio;
          return precioA - precioB;
        });
        break;
      case 'precio-desc':
        filtered.sort((a, b) => {
          const precioA = a.precioDescuento || a.precio;
          const precioB = b.precioDescuento || b.precio;
          return precioB - precioA;
        });
        break;
      case 'nombre-asc':
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        filtered.sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        break;
    }
  }

  return filtered;
}

/**
 * Invalidar caché de productos (útil después de actualizar inventario)
 */
export function invalidateProductsCache(): void {
  cache.invalidate(CACHE_KEYS.PRODUCTS);
  cache.invalidate(CACHE_KEYS.PRODUCT);
}
