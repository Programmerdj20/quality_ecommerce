import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ThemeCardProps } from '@/types/theme'

export function ThemeCard({ theme, isActive, onActivate, isActivating }: ThemeCardProps) {
  return (
    <Card className={isActive ? 'border-primary shadow-lg' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{theme.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {theme.description || 'Sin descripción'}
            </CardDescription>
          </div>
          {isActive && (
            <Badge variant="default" className="gap-1">
              <Check className="h-3 w-3" />
              Activo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Preview de colores */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Vista previa de colores:</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Color primario */}
            <div className="space-y-1.5">
              <div
                className="h-14 rounded-md border shadow-sm"
                style={{ backgroundColor: theme.primary_color }}
              />
              <p className="text-xs font-medium">Primario</p>
              <p className="font-mono text-xs text-muted-foreground">{theme.primary_color}</p>
            </div>

            {/* Color secundario */}
            <div className="space-y-1.5">
              <div
                className="h-14 rounded-md border shadow-sm"
                style={{ backgroundColor: theme.secondary_color }}
              />
              <p className="text-xs font-medium">Secundario</p>
              <p className="font-mono text-xs text-muted-foreground">{theme.secondary_color}</p>
            </div>

            {/* Color accent */}
            <div className="space-y-1.5">
              <div
                className="h-14 rounded-md border shadow-sm"
                style={{ backgroundColor: theme.accent_color }}
              />
              <p className="text-xs font-medium">Acento</p>
              <p className="font-mono text-xs text-muted-foreground">{theme.accent_color}</p>
            </div>

            {/* Color de fondo */}
            <div className="space-y-1.5">
              <div
                className="h-14 rounded-md border shadow-sm"
                style={{ backgroundColor: theme.background_color }}
              />
              <p className="text-xs font-medium">Fondo</p>
              <p className="font-mono text-xs text-muted-foreground">{theme.background_color}</p>
            </div>
          </div>

          {/* Preview visual con los colores aplicados */}
          <div
            className="mt-4 rounded-md border p-4 shadow-sm"
            style={{ backgroundColor: theme.background_color }}
          >
            <div className="space-y-2">
              <div
                className="h-6 w-32 rounded"
                style={{ backgroundColor: theme.primary_color }}
              />
              <div
                className="h-4 w-24 rounded"
                style={{ backgroundColor: theme.secondary_color }}
              />
              <div
                className="h-3 w-16 rounded"
                style={{ backgroundColor: theme.accent_color }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isActive ? 'outline' : 'default'}
          disabled={isActive || isActivating}
          onClick={() => onActivate(theme.id)}
        >
          {isActivating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Activando...
            </>
          ) : isActive ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Tema Activo
            </>
          ) : (
            'Activar Tema'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
