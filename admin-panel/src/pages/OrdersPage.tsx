import { useState } from 'react'
import { Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderFiltersComponent } from '@/components/orders/order-filters'
import { OrdersTable } from '@/components/orders/orders-table'
import { OrderDetails } from '@/components/orders/order-details'
import { useOrders } from '@/hooks/useOrders'
import type { Order, OrderFilters } from '@/types/order'

export function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({})
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data, isLoading, error } = useOrders({ filters })

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  const handleCloseDetails = () => {
    setDetailsOpen(false)
    // Pequeño delay antes de limpiar el estado para evitar flicker
    setTimeout(() => setSelectedOrder(null), 200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-sm text-muted-foreground">
            Administra y visualiza todos los pedidos de la plataforma
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Buscar y filtrar pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderFiltersComponent filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Tabla de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pedidos
            {data && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({data.totalCount} {data.totalCount === 1 ? 'pedido' : 'pedidos'})
              </span>
            )}
          </CardTitle>
          <CardDescription>Lista de todos los pedidos</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-6 text-center">
              <p className="text-sm text-destructive">
                Error al cargar los pedidos. Por favor, intenta de nuevo.
              </p>
            </div>
          ) : (
            <OrdersTable
              orders={data?.orders || []}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <OrderDetails
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={handleCloseDetails}
      />
    </div>
  )
}
