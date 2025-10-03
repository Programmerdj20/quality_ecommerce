/**
 * Utilidades para manejo de productos
 * Incluye funciones de aleatorización, filtrado y paginación
 */

import type { Product } from '@/types';

/**
 * Aleatoriza un array usando el algoritmo Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Obtiene productos aleatorios de un array
 */
export function getRandomProducts(products: Product[], count: number): Product[] {
  const shuffled = shuffleArray(products);
  return shuffled.slice(0, count);
}

/**
 * Filtra productos por categoría
 */
export function filterProductsByCategory(
  products: Product[],
  categorySlug: string
): Product[] {
  if (categorySlug === 'all') {
    return products.filter(p => p.activo);
  }
  return products.filter(p => p.activo && p.categoria === categorySlug);
}

/**
 * Obtiene productos aleatorios por categoría
 */
export function getRandomProductsByCategory(
  products: Product[],
  categorySlug: string,
  count: number
): Product[] {
  const filtered = filterProductsByCategory(products, categorySlug);
  return getRandomProducts(filtered, count);
}

/**
 * Pagina un array de productos
 */
export function paginateProducts(
  products: Product[],
  page: number,
  perPage: number
): Product[] {
  const start = page * perPage;
  const end = start + perPage;
  return products.slice(start, end);
}

/**
 * Cuenta productos por categoría
 */
export function countProductsByCategory(
  products: Product[],
  categorySlug: string
): number {
  if (categorySlug === 'all') {
    return products.filter(p => p.activo).length;
  }
  return products.filter(p => p.activo && p.categoria === categorySlug).length;
}
