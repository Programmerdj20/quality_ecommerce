import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="min-h-screen bg-muted/40 p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>
              Vista principal del panel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              ¡Autenticación exitosa! 🎉
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Este es un placeholder para el dashboard. En la Fase 4
              implementaremos métricas, gráficos y estadísticas de la plataforma.
            </p>
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}
