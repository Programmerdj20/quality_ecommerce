/**
 * Tipos relacionados con pedidos, carrito y checkout
 */

export interface CartItem {
  productId: string;
  sku: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  stockDisponible: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  iva: number;
  total: number;
  itemCount: number;
}

export type OrderStatus = 'pendiente' | 'pagado' | 'procesando' | 'enviado' | 'completado' | 'cancelado';

export type PaymentStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'en_proceso' | 'devuelto';

export interface DireccionEnvio {
  calle: string;
  ciudad: string;
  departamento: string;
  codigoPostal?: string;
  referencias?: string;
}

export interface ClienteInfo {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  documento?: string;
  tipoDocumento?: 'CC' | 'CE' | 'NIT';
  direccion: DireccionEnvio;
}

export interface PagoInfo {
  metodo: 'mercadopago';
  mercadoPagoId?: string;
  estado: PaymentStatus;
  fechaPago?: string;
  detalles?: {
    metodoPago?: string; // tarjeta, pse, efectivo
    ultimosDigitos?: string;
    cuotas?: number;
  };
}

export interface Order {
  id: string;
  numero: string;
  fecha: string;
  items: CartItem[];
  subtotal: number;
  iva: number;
  envio: number;
  total: number;
  estado: OrderStatus;
  cliente: ClienteInfo;
  pago: PagoInfo;
  userId?: string;
  notas?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutFormData {
  email: string;
  nombre: string;
  apellido?: string;
  telefono: string;
  documento?: string;
  tipoDocumento?: 'CC' | 'CE' | 'NIT';
  direccion: string;
  ciudad: string;
  departamento: string;
  codigoPostal?: string;
  referencias?: string;
  crearCuenta?: boolean;
  password?: string;
  aceptaTerminos: boolean;
}

// Preferencia de Mercado Pago
export interface MercadoPagoPreference {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
}

// Webhook de Mercado Pago
export interface MercadoPagoWebhook {
  id: number;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: number;
  user_id: string;
  version: number;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}
