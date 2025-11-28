import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

interface Tenant {
  id: string
  name: string
  slug: string
  domain: string
  active_theme_id: string | null
  created_at: string
  updated_at: string
}

/**
 * Hook para obtener información del tenant actual del usuario
 */
export function useActiveTenant() {
  const { user } = useAuth()
  const tenantId = user?.user_metadata?.tenant_id

  return useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('No tenant ID found')
      }

      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .single()

      if (error) {
        throw new Error(`Error al cargar tenant: ${error.message}`)
      }

      return data as Tenant
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
