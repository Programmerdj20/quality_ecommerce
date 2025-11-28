import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { SiteConfigFormData } from '@/types/site-config'

/**
 * Hook para actualizar la configuración del sitio
 */
export function useUpdateSiteConfig() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const tenantId = user?.user_metadata?.tenant_id

  return useMutation({
    mutationFn: async (formData: SiteConfigFormData) => {
      if (!tenantId) {
        throw new Error('No tenant ID found')
      }

      // Primero, verificar si existe una configuración
      const { data: existing } = await supabase
        .from('site_config')
        .select('id')
        .eq('tenant_id', tenantId)
        .single()

      if (existing) {
        // Actualizar configuración existente
        const { data, error } = await supabase
          .from('site_config')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('tenant_id', tenantId)
          .select()
          .single()

        if (error) {
          throw new Error(`Error al actualizar configuración: ${error.message}`)
        }

        return data
      } else {
        // Crear nueva configuración
        const { data, error } = await supabase
          .from('site_config')
          .insert({
            tenant_id: tenantId,
            ...formData,
          })
          .select()
          .single()

        if (error) {
          throw new Error(`Error al crear configuración: ${error.message}`)
        }

        return data
      }
    },
    onSuccess: () => {
      // Invalidar query para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['site-config', tenantId] })
    },
  })
}
