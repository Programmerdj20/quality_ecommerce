import { Badge } from '@/components/ui/badge'
import { type OrderStatus } from '@/types/order'
import { cn } from '@/lib/utils'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

const statusConfig: Record<OrderStatus, { label: string; variant: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    variant: 'secondary',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 border-yellow-200',
  },
  processing: {
    label: 'Procesando',
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100/80 border-blue-200',
  },
  completed: {
    label: 'Completado',
    variant: 'secondary',
    className: 'bg-green-100 text-green-800 hover:bg-green-100/80 border-green-200',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'secondary',
    className: 'bg-red-100 text-red-800 hover:bg-red-100/80 border-red-200',
  },
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge className={cn(config.className, className)} variant="secondary">
      {config.label}
    </Badge>
  )
}
