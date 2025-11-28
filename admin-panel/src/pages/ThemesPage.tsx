import { Palette, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeCard } from '@/components/themes/theme-card'
import { useThemes } from '@/hooks/useThemes'
import { useActiveTenant } from '@/hooks/useActiveTenant'
import { useActivateTheme } from '@/hooks/useActivateTheme'

export function ThemesPage() {
  const { data: themes, isLoading: themesLoading, error: themesError } = useThemes()
  const { data: tenant, isLoading: tenantLoading } = useActiveTenant()
  const activateTheme = useActivateTheme()

  const handleActivateTheme = (themeId: string) => {
    activateTheme.mutate(themeId, {
      onSuccess: () => {
        toast.success('Tema activado correctamente', {
          description: 'El tema se ha aplicado a tu tienda.',
        })
      },
      onError: (error) => {
        toast.error('Error al activar tema', {
          description: error.message,
        })
      },
    })
  }

  const isLoading = themesLoading || tenantLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Palette className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Temas</h1>
          <p className="text-sm text-muted-foreground">
            Administra los temas visuales de tu tienda
          </p>
        </div>
      </div>

      {/* Error state */}
      {themesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar los temas. Por favor, intenta de nuevo más tarde.
          </AlertDescription>
        </Alert>
      )}

      {/* Información del tema activo */}
      {tenant && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tema Activo Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {tenant.active_theme_id
                ? `ID del tema activo: ${tenant.active_theme_id}`
                : 'No hay tema activo seleccionado'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Grid de temas */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Temas Disponibles</h2>
          <p className="text-sm text-muted-foreground">
            Selecciona un tema para aplicarlo a tu tienda
          </p>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : themes && themes.length > 0 ? (
          // Temas cargados
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={tenant?.active_theme_id === theme.id}
                onActivate={handleActivateTheme}
                isActivating={activateTheme.isPending}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <Card>
            <CardContent className="flex h-[300px] items-center justify-center">
              <div className="text-center">
                <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No hay temas disponibles</p>
                <p className="text-sm text-muted-foreground">
                  Contacta al administrador para agregar temas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
