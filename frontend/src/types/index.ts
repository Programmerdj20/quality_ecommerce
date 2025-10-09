/**
 * Punto de entrada central para todos los tipos TypeScript
 * Exporta todos los tipos del proyecto para importación conveniente
 */

// Tipos de productos
export type {
  Product,
  ProductCategory,
  ProductFilters,
  ProductPagination,
  ProductListResponse,
} from './product';

// Tipos de temas y configuración
export type {
  ThemeSlug,
  ThemeColors,
  ThemeTypography,
  Theme,
  Banner,
  TextosLegales,
  SiteConfig,
  StrapiResponse,
} from './theme';

// Tipos de pedidos y carrito
export type {
  CartItem,
  Cart,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  DireccionEnvio,
  ClienteInfo,
  PagoInfo,
  Order,
  CheckoutFormData,
  MercadoPagoPreference,
  MercadoPagoWebhook,
} from './order';

// Tipos de API y autenticación
export type {
  ApiResponse,
  ApiError,
  LoadingState,
  PaginatedResponse,
  CacheConfig,
  User,
  AuthToken,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from './api';
