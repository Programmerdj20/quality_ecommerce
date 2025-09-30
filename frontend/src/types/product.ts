/**
 * Tipos relacionados con productos del catálogo
 * Los productos vienen desde la API contable externa
 */

export interface Product {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento?: number;
  stock: number;
  categoria: string;
  subcategoria?: string;
  imagenes: {
    principal: string;
    galeria: string[];
  };
  caracteristicas?: Record<string, string>;
  slug: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export interface ProductCategory {
  id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  imagen?: string;
  productCount: number;
  parent?: string;
}

export interface ProductFilters {
  categoria?: string;
  subcategoria?: string;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
  enStock?: boolean;
  ordenar?: 'precio-asc' | 'precio-desc' | 'nombre-asc' | 'nombre-desc' | 'reciente';
}

export interface ProductPagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: ProductPagination;
  filters: ProductFilters;
}
