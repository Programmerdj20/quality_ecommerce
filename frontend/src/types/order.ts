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

export type PaymentMethod = 'mercadopago' | 'transferencia';

export interface PagoInfo {
  metodo: PaymentMethod;
  mercadoPagoId?: string;
  transferenciaCuenta?: string; // Número de cuenta o llave para transferencias
  estado: PaymentStatus;
  fechaPago?: string;
  detalles?: {
    metodoPago?: string; // tarjeta, pse, efectivo, transferencia
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

// Request para crear preferencia de Mercado Pago
export interface CreatePreferenceRequest {
  items: Array<{
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
    description?: string;
    picture_url?: string;
  }>;
  payer: {
    name?: string;
    surname?: string;
    email: string;
    phone?: {
      area_code?: string;
      number: string;
    };
    identification?: {
      type: string;
      number: string;
    };
    address?: {
      street_name?: string;
      street_number?: string;
      zip_code?: string;
    };
  };
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return?: 'approved' | 'all';
  external_reference?: string;
  notification_url?: string;
  statement_descriptor?: string;
  metadata?: Record<string, any>;
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

// Información de pago de Mercado Pago
export interface MercadoPagoPaymentInfo {
  id: number;
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';
  status_detail: string;
  payment_type_id: string;
  payment_method_id: string;
  transaction_amount: number;
  currency_id: string;
  description: string;
  external_reference?: string;
  payer: {
    email: string;
    first_name?: string;
    last_name?: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  metadata?: Record<string, any>;
  date_created: string;
  date_approved?: string;
  date_last_updated: string;
}
