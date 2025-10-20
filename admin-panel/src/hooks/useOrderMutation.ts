import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { OrderUpdatePayload } from '@/types/order'

interface UpdateOrderParams {
  orderId: string
  payload: OrderUpdatePayload
}

export function useOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ orderId, payload }: UpdateOrderParams) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: payload.status,
          notes: payload.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    },
    onSuccess: () => {
      // Invalidar queries de pedidos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      // También invalidar stats del dashboard
      queryClient.invalidateQueries({ queryKey: ['orders-stats'] })
    },
  })
}
