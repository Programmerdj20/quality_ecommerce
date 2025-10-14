import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.email}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vista General</CardTitle>
          <CardDescription>
            Resumen de métricas y estadísticas principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">
                Próximamente - Fase 4
              </p>
              <p className="text-sm text-muted-foreground">
                Aquí se mostrarán métricas, gráficos de ventas y estadísticas de
                la plataforma.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Sesión</CardTitle>
            <CardDescription>
              Datos del usuario autenticado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Email:</span>{' '}
              <span className="text-muted-foreground">{user?.email}</span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>{' '}
              <span className="font-mono text-sm text-muted-foreground">
                {user?.id}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>
              Panel administrativo funcional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Autenticación:</span>
              <span className="text-green-600 dark:text-green-400">✓ Activa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Navegación:</span>
              <span className="text-green-600 dark:text-green-400">✓ Funcional</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Fase 3:</span>
              <span className="text-green-600 dark:text-green-400">✓ Completada</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
