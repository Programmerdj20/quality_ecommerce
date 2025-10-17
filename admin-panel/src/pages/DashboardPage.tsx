import { useAuth } from '@/hooks/useAuth'
import { LayoutDashboard } from 'lucide-react'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { TopProductsTable } from '@/components/dashboard/top-products-table'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Bienvenido, {user?.email}</p>
        </div>
      </div>

      {/* Métricas principales */}
      <StatsCards />

      {/* Gráfico de revenue */}
      <RevenueChart />

      {/* Top productos */}
      <TopProductsTable />
    </div>
  )
}
