import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Palette } from 'lucide-react'

export function ThemesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gestión de Temas</h1>
          <p className="text-muted-foreground">
            Administra los temas visuales de tu tienda
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temas Disponibles</CardTitle>
          <CardDescription>
            Activa o desactiva temas para personalizar tu tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Próximamente - Fase 6
              </p>
              <p className="text-sm text-muted-foreground">
                Aquí se mostrarán los temas disponibles con preview visual y
                opciones de activación.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
