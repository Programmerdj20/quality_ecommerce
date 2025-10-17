import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Settings } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Ajusta la configuración general de tu tienda
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sitio</CardTitle>
          <CardDescription>
            Personaliza contacto, redes sociales y configuración regional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Próximamente - Fase 7
              </p>
              <p className="text-sm text-muted-foreground">
                Aquí podrás configurar WhatsApp, redes sociales, IVA, moneda y
                más ajustes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
