import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Package } from 'lucide-react'

export function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">
            Administra y visualiza todos los pedidos de la plataforma
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            Vista de todos los pedidos recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Próximamente - Fase 5
              </p>
              <p className="text-sm text-muted-foreground">
                Aquí se mostrará la tabla de pedidos con filtros, paginación y
                gestión de estados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
