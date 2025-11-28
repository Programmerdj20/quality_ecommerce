import { useState, useEffect } from 'react'
import { Settings, Loader2, Save, MessageSquare, Share2, Globe, FileText } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useSiteConfig } from '@/hooks/useSiteConfig'
import { useUpdateSiteConfig } from '@/hooks/useUpdateSiteConfig'
import type { SiteConfigFormData } from '@/types/site-config'

export function SettingsPage() {
  const { data: config, isLoading } = useSiteConfig()
  const updateConfig = useUpdateSiteConfig()

  const [formData, setFormData] = useState<SiteConfigFormData>({
    // Contacto
    whatsapp: config?.whatsapp || '',
    email: config?.email || '',
    phone: config?.phone || '',
    // Redes sociales
    facebook_url: config?.facebook_url || '',
    instagram_url: config?.instagram_url || '',
    twitter_url: config?.twitter_url || '',
    // Regional
    iva_percentage: config?.iva_percentage || 19,
    currency: config?.currency || 'COP',
    country: config?.country || 'Colombia',
    // Textos
    store_name: config?.store_name || 'Mi Tienda',
    slogan: config?.slogan || '',
    welcome_message: config?.welcome_message || '',
  })

  // Actualizar formData cuando config cargue
  useEffect(() => {
    if (config) {
      setFormData({
        whatsapp: config.whatsapp || '',
        email: config.email || '',
        phone: config.phone || '',
        facebook_url: config.facebook_url || '',
        instagram_url: config.instagram_url || '',
        twitter_url: config.twitter_url || '',
        iva_percentage: config.iva_percentage,
        currency: config.currency,
        country: config.country || '',
        store_name: config.store_name,
        slogan: config.slogan || '',
        welcome_message: config.welcome_message || '',
      })
    }
  }, [config])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    updateConfig.mutate(formData, {
      onSuccess: () => {
        toast.success('Configuración guardada', {
          description: 'Los cambios se han guardado correctamente.',
        })
      },
      onError: (error) => {
        toast.error('Error al guardar', {
          description: error.message,
        })
      },
    })
  }

  const handleInputChange = (field: keyof SiteConfigFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Ajusta la configuración general de tu tienda
          </p>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sitio</CardTitle>
              <CardDescription>
                Personaliza contacto, redes sociales y más ajustes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="contact" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="contact" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Contacto</span>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Redes</span>
                  </TabsTrigger>
                  <TabsTrigger value="regional" className="gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Regional</span>
                  </TabsTrigger>
                  <TabsTrigger value="texts" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Textos</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Contacto */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        placeholder="+57 300 123 4567"
                        value={formData.whatsapp || ''}
                        onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Número de WhatsApp para contacto con clientes
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contacto@mitienda.com"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="+57 601 234 5678"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Redes Sociales */}
                <TabsContent value="social" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">Facebook</Label>
                      <Input
                        id="facebook_url"
                        type="url"
                        placeholder="https://facebook.com/mitienda"
                        value={formData.facebook_url || ''}
                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram_url">Instagram</Label>
                      <Input
                        id="instagram_url"
                        type="url"
                        placeholder="https://instagram.com/mitienda"
                        value={formData.instagram_url || ''}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter_url">Twitter / X</Label>
                      <Input
                        id="twitter_url"
                        type="url"
                        placeholder="https://twitter.com/mitienda"
                        value={formData.twitter_url || ''}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Regional */}
                <TabsContent value="regional" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iva_percentage">IVA (%)</Label>
                      <Input
                        id="iva_percentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={formData.iva_percentage}
                        onChange={(e) =>
                          handleInputChange('iva_percentage', parseFloat(e.target.value))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Porcentaje de IVA aplicado a los productos
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Moneda</Label>
                      <Input
                        id="currency"
                        maxLength={3}
                        placeholder="COP"
                        value={formData.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value.toUpperCase())}
                      />
                      <p className="text-xs text-muted-foreground">
                        Código ISO de 3 letras (COP, USD, EUR, etc.)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input
                        id="country"
                        placeholder="Colombia"
                        value={formData.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Textos */}
                <TabsContent value="texts" className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="store_name">Nombre de la Tienda *</Label>
                      <Input
                        id="store_name"
                        required
                        placeholder="Mi Tienda Online"
                        value={formData.store_name}
                        onChange={(e) => handleInputChange('store_name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slogan">Slogan</Label>
                      <Input
                        id="slogan"
                        placeholder="Los mejores productos al mejor precio"
                        value={formData.slogan || ''}
                        onChange={(e) => handleInputChange('slogan', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="welcome_message">Mensaje de Bienvenida</Label>
                      <Textarea
                        id="welcome_message"
                        rows={4}
                        placeholder="Bienvenido a nuestra tienda online..."
                        value={formData.welcome_message || ''}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('welcome_message', e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Botón de guardar */}
              <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={updateConfig.isPending}>
                  {updateConfig.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  )
}
