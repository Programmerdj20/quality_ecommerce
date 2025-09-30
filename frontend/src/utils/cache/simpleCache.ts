/**
 * Sistema de caché simple en memoria para reducir llamadas a APIs
 * Usa node-cache internamente
 */

import NodeCache from 'node-cache';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>>;
  private nodeCache: NodeCache | null = null;

  constructor() {
    this.cache = new Map();

    // Intentar usar node-cache si está disponible (solo en server-side)
    if (typeof window === 'undefined') {
      try {
        this.nodeCache = new NodeCache({
          stdTTL: 300, // 5 minutos por defecto
          checkperiod: 60, // Revisar cada 60 segundos para limpiar
          useClones: false
        });
      } catch (error) {
        console.warn('node-cache no disponible, usando Map simple');
      }
    }
  }

  /**
   * Obtener valor del caché o ejecutar fetcher si no existe/expiró
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300 // 5 minutos por defecto
  ): Promise<T> {
    // Intentar obtener del caché
    const cached = this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    // No está en caché o expiró, ejecutar fetcher
    try {
      const data = await fetcher();
      this.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Error fetching data for cache key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Obtener valor del caché
   */
  get<T>(key: string): T | null {
    // Si estamos en el servidor y tenemos node-cache
    if (this.nodeCache) {
      const value = this.nodeCache.get<T>(key);
      return value !== undefined ? value : null;
    }

    // Fallback a Map
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Verificar si expiró
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Guardar valor en el caché
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    if (this.nodeCache) {
      this.nodeCache.set(key, data, ttl);
      return;
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Eliminar valor del caché
   */
  delete(key: string): void {
    if (this.nodeCache) {
      this.nodeCache.del(key);
      return;
    }

    this.cache.delete(key);
  }

  /**
   * Invalidar caché por patrón
   */
  invalidate(pattern?: string): void {
    if (!pattern) {
      // Limpiar todo
      if (this.nodeCache) {
        this.nodeCache.flushAll();
      } else {
        this.cache.clear();
      }
      return;
    }

    // Limpiar por patrón
    if (this.nodeCache) {
      const keys = this.nodeCache.keys();
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.nodeCache!.del(key);
        }
      });
    } else {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    }
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats(): { keys: number; hits?: number; misses?: number } {
    if (this.nodeCache) {
      const stats = this.nodeCache.getStats();
      return {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses
      };
    }

    return {
      keys: this.cache.size
    };
  }
}

// Exportar instancia singleton
export const cache = new SimpleCache();

// Utilidades de caché específicas
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  SITE_CONFIG: 'site-config',
  THEME: 'theme'
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minuto
  MEDIUM: 300, // 5 minutos
  LONG: 600, // 10 minutos
  VERY_LONG: 3600 // 1 hora
} as const;
