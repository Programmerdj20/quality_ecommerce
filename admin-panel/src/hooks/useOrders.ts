import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Order, OrderFilters } from '@/types/order'

interface UseOrdersOptions {
  filters?: OrderFilters
  page?: number
  pageSize?: number
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { filters = {}, page = 1, pageSize = 20 } = options

  return useQuery({
    queryKey: ['orders', filters, page, pageSize],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Aplicar filtro de estado
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      // Aplicar filtro de búsqueda (por nombre o email)
      if (filters.search) {
        query = query.or(
          `customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
        )
      }

      // Aplicar filtros de fecha
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      // Paginación
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw error
      }

      return {
        orders: (data as Order[]) || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}
