import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { SiteConfig } from '@/types/site-config'

/**
 * Hook para obtener la configuración del sitio del tenant actual
 */
export function useSiteConfig() {
  const { user } = useAuth()
  const tenantId = user?.user_metadata?.tenant_id

  return useQuery({
    queryKey: ['site-config', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('No tenant ID found')
      }

      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('tenant_id', tenantId)
        .single()

      if (error) {
        // Si no existe config, devolver valores por defecto
        if (error.code === 'PGRST116') {
          return null
        }
        throw new Error(`Error al cargar configuración: ${error.message}`)
      }

      return data as SiteConfig
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
