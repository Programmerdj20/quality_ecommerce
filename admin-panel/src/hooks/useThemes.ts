import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Theme } from '@/types/theme'

/**
 * Hook para obtener todos los temas disponibles
 */
export function useThemes() {
  return useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name')

      if (error) {
        throw new Error(`Error al cargar temas: ${error.message}`)
      }

      return data as Theme[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
