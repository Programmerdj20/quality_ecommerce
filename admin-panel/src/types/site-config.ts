import { z } from 'zod'

/**
 * Interfaz para la configuración del sitio
 */
export interface SiteConfig {
  id: string
  tenant_id: string
  // Contacto
  whatsapp: string | null
  email: string | null
  phone: string | null
  // Redes sociales
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  // Configuración regional
  iva_percentage: number
  currency: string
  country: string | null
  // Textos
  store_name: string
  slogan: string | null
  welcome_message: string | null
  // Metadata
  created_at: string
  updated_at: string
}

/**
 * Schema de validación para el formulario de contacto
 */
export const contactSettingsSchema = z.object({
  whatsapp: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
})

/**
 * Schema de validación para redes sociales
 */
export const socialSettingsSchema = z.object({
  facebook_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  instagram_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  twitter_url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
})

/**
 * Schema de validación para configuración regional
 */
export const regionalSettingsSchema = z.object({
  iva_percentage: z.number().min(0).max(100),
  currency: z.string().min(3).max(3),
  country: z.string().optional().nullable(),
})

/**
 * Schema de validación para textos
 */
export const textSettingsSchema = z.object({
  store_name: z.string().min(1, 'El nombre de la tienda es requerido'),
  slogan: z.string().optional().nullable(),
  welcome_message: z.string().optional().nullable(),
})

/**
 * Schema completo para la configuración del sitio
 */
export const siteConfigSchema = z.object({
  ...contactSettingsSchema.shape,
  ...socialSettingsSchema.shape,
  ...regionalSettingsSchema.shape,
  ...textSettingsSchema.shape,
})

export type SiteConfigFormData = z.infer<typeof siteConfigSchema>
