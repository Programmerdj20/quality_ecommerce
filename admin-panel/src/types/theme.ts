/**
 * Tipos para la gestión de temas visuales
 */

export interface Theme {
  id: string
  name: string
  slug: string
  description: string | null
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  created_at: string
  updated_at: string
}

export interface ThemeCardProps {
  theme: Theme
  isActive: boolean
  onActivate: (themeId: string) => void
  isActivating: boolean
}
