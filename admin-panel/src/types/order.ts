// Types para la gestión de pedidos

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

export interface Order {
  id: string
  tenant_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  total: number
  status: OrderStatus
  payment_method?: string
  shipping_address?: string
  notes?: string
  created_at: string
  updated_at?: string
}

export interface OrderFilters {
  status?: OrderStatus | 'all'
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface OrderUpdatePayload {
  status: OrderStatus
  notes?: string
}

// Constantes para estados
export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'processing', label: 'Procesando' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
]

// Colores para badges según estado
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}
