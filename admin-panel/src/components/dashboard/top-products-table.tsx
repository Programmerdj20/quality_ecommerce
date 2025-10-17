import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useTopProducts } from '@/hooks/useTopProducts'
import { Loader2, AlertCircle, Package } from 'lucide-react'

export function TopProductsTable() {
  const { data: products, isLoading, error } = useTopProducts()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getRankBadge = (index: number) => {
    const variants = ['default', 'secondary', 'outline'] as const
    return variants[index] || 'outline'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Productos</CardTitle>
          <CardDescription>Los 5 productos más vendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Top Productos</CardTitle>
          <CardDescription>Los 5 productos más vendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">Error al cargar productos: {error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Productos</CardTitle>
          <CardDescription>Los 5 productos más vendidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">No hay productos vendidos aún</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Productos</CardTitle>
        <CardDescription>Los {products.length} productos más vendidos</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Vista desktop */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Pedidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.product_id}>
                  <TableCell>
                    <Badge variant={getRankBadge(index)}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.product_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(product.avg_price)} por unidad
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {product.total_quantity}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(product.total_revenue)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {product.total_orders}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Vista móvil */}
        <div className="md:hidden space-y-3">
          {products.map((product, index) => (
            <div key={product.product_id} className="flex gap-3 p-3 rounded-lg border bg-card">
              <Badge variant={getRankBadge(index)} className="h-6">
                #{index + 1}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{product.product_name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatCurrency(product.avg_price)} por unidad
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Vendidos: </span>
                    <span className="font-medium">{product.total_quantity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue: </span>
                    <span className="font-medium">{formatCurrency(product.total_revenue)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pedidos: </span>
                    <span className="font-medium">{product.total_orders}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
