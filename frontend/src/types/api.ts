/**
 * Tipos para respuestas de APIs y manejo de errores
 */

// Respuesta genérica de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

// Error de API
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode?: number;
}

// Estado de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Respuesta paginada genérica
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Configuración de caché
export interface CacheConfig {
  ttl: number; // Time to live en segundos
  key: string;
}

// Usuario autenticado
export interface User {
  id: string;
  email: string;
  username: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  direccion?: {
    calle?: string;
    ciudad?: string;
    departamento?: string;
    codigoPostal?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Token JWT
export interface AuthToken {
  jwt: string;
  user: User;
}

// Respuesta de autenticación
export interface AuthResponse {
  jwt: string;
  user: User;
}

// Credenciales de login
export interface LoginCredentials {
  identifier: string; // email o username
  password: string;
}

// Datos de registro
export interface RegisterData {
  email: string;
  username: string;
  password: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
}
