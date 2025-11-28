import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

/**
 * Hook para activar un tema para el tenant actual
 */
export function useActivateTheme() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (themeId: string) => {
      // Obtener tenant_id del user metadata
      const tenantId = user?.user_metadata?.tenant_id

      if (!tenantId) {
        throw new Error('No se encontró el tenant_id del usuario')
      }

      // Actualizar el tema activo del tenant
      const { error } = await supabase
        .from('tenants')
        .update({ active_theme_id: themeId })
        .eq('id', tenantId)

      if (error) {
        throw new Error(`Error al activar tema: ${error.message}`)
      }

      return { themeId, tenantId }
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar la UI
      queryClient.invalidateQueries({ queryKey: ['themes'] })
      queryClient.invalidateQueries({ queryKey: ['tenant'] })
    },
  })
}
