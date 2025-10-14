import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Quality Admin</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
