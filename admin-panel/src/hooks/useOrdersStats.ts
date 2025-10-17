import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { OrdersSummary, DashboardStats } from '@/types/dashboard'

/**
 * Hook para obtener estadísticas generales de pedidos
 * Usa la vista orders_summary de Supabase (respeta RLS)
 */
export function useOrdersStats() {
  return useQuery({
    queryKey: ['orders-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const { data, error } = await supabase
        .from('orders_summary')
        .select('*')
        .single()

      if (error) {
        throw new Error(`Error fetching orders stats: ${error.message}`)
      }

      // Transformar datos de la vista a DashboardStats
      const summary = data as OrdersSummary

      return {
        totalOrders: summary.total_orders || 0,
        totalRevenue: Number(summary.total_revenue) || 0,
        pendingOrders: summary.pending_orders || 0,
        avgOrderValue: Number(summary.avg_order_value) || 0,
      }
    },
    // Refetch cada 5 minutos
    staleTime: 5 * 60 * 1000,
    // Retry en caso de error
    retry: 2,
  })
}
