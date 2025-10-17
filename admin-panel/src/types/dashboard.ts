// Types para el dashboard del panel admin

export interface OrdersSummary {
  tenant_id: string
  tenant_name: string
  tenant_slug: string
  total_orders: number
  pending_orders: number
  processing_orders: number
  completed_orders: number
  cancelled_orders: number
  total_revenue: number
  avg_order_value: number
  last_order_date: string | null
  first_order_date: string | null
}

export interface DailyRevenue {
  tenant_id: string
  date: string
  orders_count: number
  total_revenue: number
  avg_order_value: number
}

export interface TopProduct {
  tenant_id: string
  product_id: string
  product_name: string
  total_quantity: number
  total_revenue: number
  total_orders: number
  avg_price: number
}

export interface OrdersByStatus {
  tenant_id: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  count: number
  total_amount: number
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  avgOrderValue: number
}
