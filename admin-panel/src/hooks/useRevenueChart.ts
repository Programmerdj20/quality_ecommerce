import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { DailyRevenue } from '@/types/dashboard'

/**
 * Hook para obtener datos del gráfico de revenue
 * Usa la vista daily_revenue de Supabase (últimos 7 días)
 */
export function useRevenueChart() {
  return useQuery({
    queryKey: ['revenue-chart'],
    queryFn: async (): Promise<DailyRevenue[]> => {
      // Calcular fecha de hace 7 días
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const dateString = sevenDaysAgo.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('daily_revenue')
        .select('*')
        .gte('date', dateString)
        .order('date', { ascending: true })

      if (error) {
        throw new Error(`Error fetching revenue chart: ${error.message}`)
      }

      // Transformar a números y formatear fechas
      return (data || []).map((item) => ({
        tenant_id: item.tenant_id,
        date: item.date,
        orders_count: item.orders_count || 0,
        total_revenue: Number(item.total_revenue) || 0,
        avg_order_value: Number(item.avg_order_value) || 0,
      }))
    },
    // Refetch cada 10 minutos
    staleTime: 10 * 60 * 1000,
    retry: 2,
  })
}
