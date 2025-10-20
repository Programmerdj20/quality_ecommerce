import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge } from './order-status-badge'
import { useOrderMutation } from '@/hooks/useOrderMutation'
import { useState } from 'react'
import { Loader2, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react'
import type { Order, OrderStatus } from '@/types/order'

interface OrderDetailsProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderDetails({ order, open, onOpenChange }: OrderDetailsProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const mutation = useOrderMutation()

  if (!order) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'long',
      timeStyle: 'medium',
    }).format(date)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleStatusChange = async () => {
    if (!selectedStatus) return

    try {
      await mutation.mutateAsync({
        orderId: order.id,
        payload: { status: selectedStatus },
      })
      setSelectedStatus(null)
      onOpenChange(false)
    } catch (error) {
      console.error('Error al actualizar el estado:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalles del Pedido
            <span className="font-mono text-sm text-muted-foreground">
              #{order.id.slice(0, 8)}
            </span>
          </DialogTitle>
          <DialogDescription>
            Información completa del pedido y opciones de gestión.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado actual */}
          <div>
            <h3 className="mb-2 text-sm font-medium">Estado actual</h3>
            <OrderStatusBadge status={order.status} />
          </div>

          <Separator />

          {/* Información del cliente */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Información del Cliente</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{order.customer_email}</span>
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información del pedido */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Información del Pedido</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{formatDate(order.created_at)}</span>
              </div>
              {order.payment_method && (
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Método de pago:</span>
                  <span className="font-medium">{order.payment_method}</span>
                </div>
              )}
              {order.shipping_address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground">Dirección de envío:</span>
                    <p className="font-medium">{order.shipping_address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total del Pedido</span>
              <span className="text-2xl font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Notas */}
          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2 text-sm font-medium">Notas</h3>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Cambiar estado */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Cambiar Estado</h3>
            <div className="flex gap-2">
              <Select
                value={selectedStatus || order.status}
                onValueChange={(value: string) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusChange}
                disabled={!selectedStatus || selectedStatus === order.status || mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
