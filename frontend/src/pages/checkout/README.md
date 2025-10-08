# Sistema de Checkout con Mercado Pago

Este directorio contiene todas las páginas relacionadas con el proceso de pago integrado con Mercado Pago.

## 📁 Estructura

```
checkout/
├── index.astro        # Página principal de checkout con formulario
├── success.astro      # Página de pago exitoso
├── pending.astro      # Página de pago pendiente
├── failure.astro      # Página de pago rechazado/fallido
└── README.md          # Este archivo
```

## 🔄 Flujo de Compra

1. **Usuario agrega productos al carrito**
   - Los productos se guardan en `localStorage` vía `cartStore`
   - El carrito calcula subtotal, IVA (19%) y total automáticamente

2. **Usuario hace clic en "Ir a Pagar"** en el CartDrawer
   - Se valida que el carrito no esté vacío
   - Se redirige a `/checkout`

3. **Página de Checkout** (`/checkout/index.astro`)
   - Muestra resumen del pedido en el sidebar
   - Formulario para recolectar:
     - Información de contacto (email, nombre, teléfono)
     - Documento de identidad (opcional)
     - Dirección de envío completa
   - Al enviar el formulario:
     - Se valida la información del cliente
     - Se genera una referencia única del pedido
     - Se hace POST a `/api/checkout/create-preference`
     - Se recibe un `preferenceId` de Mercado Pago
     - Se renderiza el **Wallet Brick** de Mercado Pago

4. **Usuario completa el pago en Mercado Pago**
   - Mercado Pago procesa el pago
   - Redirige a una de las páginas de resultado:
     - `/checkout/success` - Pago aprobado ✅
     - `/checkout/pending` - Pago en proceso ⏳
     - `/checkout/failure` - Pago rechazado ❌

5. **Webhook recibe notificación**
   - Mercado Pago envía webhook a `/api/webhooks/mercadopago`
   - El webhook consulta el estado del pago
   - Aquí se debe:
     - Actualizar el pedido en Strapi
     - Enviar email de confirmación
     - Actualizar stock de productos

## 🛠️ API Routes

### `/api/checkout/create-preference`

**Método:** POST

**Body:**
```json
{
  "items": [
    {
      "productId": "1",
      "sku": "SKU001",
      "nombre": "Producto Ejemplo",
      "precio": 100000,
      "cantidad": 2,
      "imagen": "/images/product.jpg",
      "stockDisponible": 10
    }
  ],
  "customerInfo": {
    "email": "cliente@example.com",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "3001234567",
    "documento": "1234567890",
    "tipoDocumento": "CC",
    "direccion": "Calle 123 #45-67",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "codigoPostal": "110111",
    "referencias": "Casa amarilla",
    "aceptaTerminos": true
  },
  "orderReference": "ORDER-1234567890-ABC123"
}
```

**Response:**
```json
{
  "preferenceId": "123456789-abcd-1234-5678-123456789abc",
  "initPoint": "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=..."
}
```

### `/api/webhooks/mercadopago`

**Método:** POST

Recibe notificaciones de Mercado Pago cuando cambia el estado de un pago.

**Body (ejemplo):**
```json
{
  "id": 12345,
  "live_mode": false,
  "type": "payment",
  "date_created": "2025-10-08T10:00:00Z",
  "data": {
    "id": "67890"
  }
}
```

## 🔧 Configuración Requerida

### Variables de Entorno

Asegúrate de configurar estas variables en tu archivo `.env`:

```bash
# Mercado Pago
PUBLIC_MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxx

# Sitio (debe ser HTTPS en producción)
PUBLIC_SITE_URL=https://tu-tienda.com
PUBLIC_SITE_NAME=Quality Ecommerce

# Moneda y región
PUBLIC_CURRENCY=COP
PUBLIC_LOCALE=es-CO
PUBLIC_IVA_RATE=0.19
```

### Credenciales de Prueba

Para desarrollo, usa las credenciales de prueba de Mercado Pago:

1. Ve a https://www.mercadopago.com.co/developers/panel
2. Crea una aplicación
3. Obtén tus credenciales de **TEST**
4. Usa tarjetas de prueba: https://www.mercadopago.com.co/developers/es/docs/checkout-api/testing

**Tarjetas de prueba (Colombia):**
- **Aprobada:** 5031 7557 3453 0604 | CVV: 123 | Vencimiento: 11/25
- **Rechazada:** 5031 4332 1540 6351 | CVV: 123 | Vencimiento: 11/25

## 📊 Stores Utilizados

### `cartStore`
- Maneja el carrito de compras
- Persiste en `localStorage` con clave `cart-items`
- Funciones: `addToCart`, `removeFromCart`, `incrementQuantity`, `decrementQuantity`, `clearCart`

### `orderStore`
- Maneja el estado del checkout
- Almacena información del cliente temporalmente
- Genera referencias únicas para pedidos
- Funciones: `setCheckoutCustomerInfo`, `generateOrderReference`, `resetCheckoutState`

### `toastStore`
- Sistema de notificaciones
- Funciones: `toastSuccess`, `toastError`, `toastWarning`, `toastInfo`

## 🎨 Componentes Usados

- **Wallet Brick** de Mercado Pago
  - Renderizado dinámicamente después de crear la preferencia
  - Proporciona UI completa de pago
  - Soporta todos los métodos de pago de Colombia

## 🔒 Seguridad

### HTTPS Obligatorio (2025)
Desde marzo 2025, Mercado Pago **requiere HTTPS** para:
- URLs de retorno (`back_urls`)
- URLs de notificación (`notification_url`)

### Validaciones Implementadas
- ✅ Validación de carrito no vacío antes de checkout
- ✅ Validación de formulario en cliente
- ✅ Validación de datos en API routes
- ✅ Limpieza de carrito después de pago exitoso
- ✅ Reseteo de estado de checkout en páginas de resultado

## 🚀 Próximos Pasos

### Pendiente de Implementar
- [ ] Integración con Strapi para guardar pedidos
- [ ] Envío de emails de confirmación
- [ ] Actualización de stock en API contable
- [ ] Panel de administración de pedidos
- [ ] Historial de pedidos para usuarios registrados
- [ ] Integración con sistema de envíos
- [ ] Generación de facturas automáticas

## 📱 Testing

### Flujo Completo de Prueba

1. Agrega productos al carrito
2. Haz clic en "Ir a Pagar"
3. Completa el formulario de checkout
4. Usa tarjeta de prueba en Mercado Pago
5. Verifica redirección a página de resultado
6. Verifica que el carrito se limpió
7. Verifica logs del webhook en consola del servidor

### Verificar Webhook Localmente

Para recibir webhooks en desarrollo local:

```bash
# Opción 1: Usar ngrok
ngrok http 4321

# Opción 2: Usar localtunnel
npx localtunnel --port 4321

# Luego configura la URL en Mercado Pago Dashboard
# https://abc123.ngrok.io/api/webhooks/mercadopago
```

## 🐛 Troubleshooting

### Error: "Preference creation failed"
- Verifica que `MP_ACCESS_TOKEN` esté configurado
- Verifica que el token sea válido
- Revisa logs de consola para más detalles

### Error: "Wallet Brick no se renderiza"
- Verifica que `PUBLIC_MP_PUBLIC_KEY` esté configurado
- Verifica que el SDK de Mercado Pago se cargó correctamente
- Abre DevTools y revisa errores de consola

### Webhook no recibe notificaciones
- Verifica que la URL sea HTTPS en producción
- Verifica que la URL esté configurada en Mercado Pago Dashboard
- Usa herramientas como ngrok para testing local

## 📚 Recursos

- [Documentación Mercado Pago - Checkout Pro](https://www.mercadopago.com.co/developers/es/docs/checkout-pro/integrate-checkout-pro/web)
- [SDK JavaScript](https://github.com/mercadopago/sdk-js)
- [SDK Node.js](https://github.com/mercadopago/sdk-nodejs)
- [Tarjetas de Prueba](https://www.mercadopago.com.co/developers/es/docs/checkout-api/testing)
- [Webhooks](https://www.mercadopago.com.co/developers/es/docs/your-integrations/notifications/webhooks)
