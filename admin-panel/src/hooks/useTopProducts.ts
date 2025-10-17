import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { TopProduct } from '@/types/dashboard'

/**
 * Hook para obtener top 5 productos más vendidos
 * Usa la vista top_products de Supabase (respeta RLS)
 */
export function useTopProducts() {
  return useQuery({
    queryKey: ['top-products'],
    queryFn: async (): Promise<TopProduct[]> => {
      const { data, error } = await supabase
        .from('top_products')
        .select('*')
        .order('total_quantity', { ascending: false })
        .limit(5)

      if (error) {
        throw new Error(`Error fetching top products: ${error.message}`)
      }

      // Transformar a números
      return (data || []).map((item) => ({
        tenant_id: item.tenant_id,
        product_id: item.product_id,
        product_name: item.product_name,
        total_quantity: Number(item.total_quantity) || 0,
        total_revenue: Number(item.total_revenue) || 0,
        total_orders: Number(item.total_orders) || 0,
        avg_price: Number(item.avg_price) || 0,
      }))
    },
    // Refetch cada 5 minutos
    staleTime: 5 * 60 * 1000,
    retry: 2,
  })
}
