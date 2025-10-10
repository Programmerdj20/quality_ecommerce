# 📡 API Reference - Quality Ecommerce Multi-Tenant

> **Documentación completa de los endpoints de la API multi-tenant**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0
> **Base URL**: `https://quality-backend.up.railway.app`

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Autenticación](#autenticación)
3. [Headers Requeridos](#headers-requeridos)
4. [Tenant API](#tenant-api)
5. [Orders API](#orders-api)
6. [Themes API](#themes-api)
7. [Site Config API](#site-config-api)
8. [Códigos de Error](#códigos-de-error)
9. [Rate Limiting](#rate-limiting)
10. [Ejemplos Completos](#ejemplos-completos)

---

## 🎯 Introducción

La API de Quality Ecommerce está construida sobre **Strapi 5** con **multi-tenancy** implementado mediante policies y middlewares custom.

### Características

- ✅ **RESTful** con convenciones de Strapi
- ✅ **Multi-Tenant** con aislamiento automático de datos
- ✅ **JWT Authentication** para operaciones de admin
- ✅ **Tenant Detection** por header `x-tenant-domain`
- ✅ **Auto-filtering** de datos por tenant
- ✅ **Rate Limiting** incluido

### Base URL

```
Producción: https://quality-backend.up.railway.app
Desarrollo: http://localhost:1337
```

---

## 🔐 Autenticación

### Tipos de Autenticación

| Tipo | Header | Uso |
|------|--------|-----|
| **API Token** | `Authorization: Bearer <token>` | Operaciones de admin, scripts |
| **JWT Token** | `Authorization: Bearer <jwt>` | Usuarios autenticados |
| **Public** | Sin auth | Consultas públicas (limited) |

### Obtener API Token

1. Accede a Strapi Admin: `https://quality-backend.up.railway.app/admin`
2. Ve a **Settings** → **API Tokens**
3. Click en **Create new API Token**
4. Configura:
   - **Name**: Frontend API Token
   - **Token type**: Read-Only o Full Access
   - **Duration**: Unlimited
5. Copia el token generado

### Ejemplo de Uso

```bash
# Con API Token
curl https://quality-backend.up.railway.app/api/tenants \
  -H "Authorization: Bearer YOUR_API_TOKEN"

# Con JWT (usuario autenticado)
curl https://quality-backend.up.railway.app/api/orders \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

---

## 📋 Headers Requeridos

### Headers Standard

| Header | Requerido | Descripción | Ejemplo |
|--------|-----------|-------------|---------|
| `Content-Type` | ✅ (POST/PUT) | Tipo de contenido | `application/json` |
| `Authorization` | ⚠️ Según endpoint | Token de auth | `Bearer abc123...` |
| `x-tenant-domain` | ✅ (Multi-tenant endpoints) | Dominio del tenant | `cliente1.miapp.com` |

### Ejemplo de Request Completo

```bash
curl -X GET https://quality-backend.up.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

---

## 🏢 Tenant API

### GET /api/tenants

Obtener lista de tenants (requiere autenticación de admin)

**Endpoint**: `GET /api/tenants`

**Auth**: ✅ Requerida (Admin)

**Query Parameters**:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `filters[dominio]` | string | Filtrar por dominio | `cliente1.miapp.com` |
| `filters[activo]` | boolean | Solo tenants activos | `true` |
| `filters[planActual]` | string | Filtrar por plan | `basic`, `premium` |
| `populate` | string | Poblar relaciones | `*` (todas) |

**Ejemplo**:

```bash
# Obtener tenant por dominio
curl "https://quality-backend.up.railway.app/api/tenants?filters[dominio]=cliente1.miapp.com" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Respuesta** (200 OK):

```json
{
  "data": [
    {
      "id": 5,
      "documentId": "abc123def456",
      "nombre": "Tienda María Calzados",
      "slug": "tienda-maria-calzados",
      "dominio": "cliente1.miapp.com",
      "activo": true,
      "planActual": "basic",
      "configuracion": {
        "logo": "https://ejemplo.com/logo.png",
        "colores": {
          "primario": "#2563eb",
          "secundario": "#1e40af"
        },
        "moneda": "COP",
        "iva": 0.19,
        "pais": "Colombia"
      },
      "createdAt": "2025-10-09T12:00:00.000Z",
      "updatedAt": "2025-10-09T12:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**Nota**: Los campos `qualityApiToken`, `mercadoPagoAccessToken` y `mercadoPagoPublicKey` **NO se retornan** por seguridad (están marcados como `private` en el schema).

---

### GET /api/tenants/:id

Obtener tenant específico por ID

**Endpoint**: `GET /api/tenants/:id`

**Auth**: ✅ Requerida (Admin)

**Path Parameters**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del tenant |

**Ejemplo**:

```bash
curl https://quality-backend.up.railway.app/api/tenants/5 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Respuesta** (200 OK):

```json
{
  "data": {
    "id": 5,
    "documentId": "abc123",
    "nombre": "Tienda María",
    "dominio": "cliente1.miapp.com",
    ...
  }
}
```

---

### POST /api/tenants

Crear nuevo tenant

**Endpoint**: `POST /api/tenants`

**Auth**: ✅ Requerida (Admin)

**Body**:

```json
{
  "data": {
    "nombre": "Tienda Ejemplo",
    "dominio": "ejemplo.miapp.com",
    "qualityApiToken": "ABC123...",
    "mercadoPagoAccessToken": "TEST-123...",
    "mercadoPagoPublicKey": "TEST-abc...",
    "activo": true,
    "planActual": "free",
    "configuracion": {
      "logo": "https://ejemplo.com/logo.png",
      "colores": {
        "primario": "#2563eb"
      },
      "moneda": "COP",
      "iva": 0.19,
      "pais": "Colombia"
    }
  }
}
```

**Ejemplo**:

```bash
curl -X POST https://quality-backend.up.railway.app/api/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "data": {
      "nombre": "Tienda Ejemplo",
      "dominio": "ejemplo.miapp.com",
      "qualityApiToken": "ABC123",
      "mercadoPagoAccessToken": "TEST-123",
      "mercadoPagoPublicKey": "TEST-abc",
      "activo": true,
      "planActual": "free"
    }
  }'
```

**Respuesta** (200 OK):

```json
{
  "data": {
    "id": 10,
    "documentId": "xyz789",
    "nombre": "Tienda Ejemplo",
    ...
  }
}
```

---

### PUT /api/tenants/:id

Actualizar tenant

**Endpoint**: `PUT /api/tenants/:id`

**Auth**: ✅ Requerida (Admin)

**Body** (solo campos a actualizar):

```json
{
  "data": {
    "planActual": "premium",
    "configuracion": {
      "colores": {
        "primario": "#10b981"
      }
    }
  }
}
```

**Ejemplo**:

```bash
curl -X PUT https://quality-backend.up.railway.app/api/tenants/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "data": {
      "planActual": "premium"
    }
  }'
```

---

### DELETE /api/tenants/:id

Eliminar tenant (soft delete recomendado)

**Endpoint**: `DELETE /api/tenants/:id`

**Auth**: ✅ Requerida (Admin)

⚠️ **CUIDADO**: Esto eliminará el tenant y **todos** sus datos relacionados (orders, themes, site-configs).

**Recomendación**: En vez de DELETE, usar `PUT` para marcar como inactivo:

```bash
# Mejor: Marcar como inactivo
curl -X PUT https://quality-backend.up.railway.app/api/tenants/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{ "data": { "activo": false } }'
```

---

## 🛒 Orders API

**Importante**: Todos los endpoints de Orders requieren header `x-tenant-domain` y están protegidos por `tenant-isolation`.

### GET /api/orders

Obtener órdenes del tenant

**Endpoint**: `GET /api/orders`

**Auth**: ⚠️ Opcional (sin auth retorna solo public data)

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**
- `Authorization`: ⚠️ Opcional

**Query Parameters**:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `filters[status]` | string | Filtrar por estado | `pending`, `paid`, `completed` |
| `filters[customerEmail]` | string | Filtrar por email | `cliente@ejemplo.com` |
| `sort` | string | Ordenar | `createdAt:desc` |
| `pagination[page]` | integer | Página | `1` |
| `pagination[pageSize]` | integer | Tamaño de página | `25` |

**Ejemplo**:

```bash
# Obtener todas las órdenes pendientes del tenant
curl "https://quality-backend.up.railway.app/api/orders?filters[status]=pending" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

**Respuesta** (200 OK):

```json
{
  "data": [
    {
      "id": 15,
      "documentId": "order123",
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "customerPhone": "+57 300 123 4567",
      "items": [
        {
          "productId": "prod_001",
          "name": "Zapatos Deportivos",
          "quantity": 2,
          "price": 150000
        }
      ],
      "subtotal": 300000,
      "iva": 57000,
      "total": 357000,
      "status": "pending",
      "mercadoPagoPaymentId": null,
      "createdAt": "2025-10-09T15:30:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**Nota**: La policy `tenant-isolation` automáticamente filtra por `tenant.id`, por lo que solo verás orders de tu tenant.

---

### GET /api/orders/:id

Obtener orden específica

**Endpoint**: `GET /api/orders/:id`

**Auth**: ⚠️ Opcional

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Path Parameters**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID de la orden |

**Ejemplo**:

```bash
curl https://quality-backend.up.railway.app/api/orders/15 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

**Respuesta** (200 OK):

```json
{
  "data": {
    "id": 15,
    "documentId": "order123",
    "customerName": "Juan Pérez",
    ...
  }
}
```

**Respuesta** (403 Forbidden) - Si la orden no pertenece al tenant:

```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Acceso denegado: recurso no pertenece a este tenant"
  }
}
```

---

### POST /api/orders

Crear nueva orden

**Endpoint**: `POST /api/orders`

**Auth**: ⚠️ Opcional (recomendado para tracking)

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Body**:

```json
{
  "data": {
    "customerName": "Juan Pérez",
    "customerEmail": "juan@ejemplo.com",
    "customerPhone": "+57 300 123 4567",
    "customerAddress": "Calle 123 #45-67, Bogotá",
    "items": [
      {
        "productId": "prod_001",
        "name": "Zapatos Deportivos",
        "quantity": 2,
        "price": 150000
      }
    ],
    "subtotal": 300000,
    "iva": 57000,
    "total": 357000,
    "status": "pending",
    "mercadoPagoPaymentId": null
  }
}
```

**Ejemplo**:

```bash
curl -X POST https://quality-backend.up.railway.app/api/orders \
  -H "Content-Type: application/json" \
  -H "x-tenant-domain: cliente1.miapp.com" \
  -d '{
    "data": {
      "customerName": "Juan Pérez",
      "customerEmail": "juan@ejemplo.com",
      "items": [...],
      "total": 357000,
      "status": "pending"
    }
  }'
```

**Respuesta** (200 OK):

```json
{
  "data": {
    "id": 20,
    "documentId": "neworder456",
    ...
  }
}
```

**Nota**: La policy `tenant-isolation` automáticamente asigna `tenant.id` del contexto.

---

### PUT /api/orders/:id

Actualizar orden (ej: cambiar estado)

**Endpoint**: `PUT /api/orders/:id`

**Auth**: ⚠️ Opcional

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Body** (solo campos a actualizar):

```json
{
  "data": {
    "status": "paid",
    "mercadoPagoPaymentId": "123456789"
  }
}
```

**Ejemplo**:

```bash
# Actualizar estado a "paid" después de confirmación de pago
curl -X PUT https://quality-backend.up.railway.app/api/orders/15 \
  -H "Content-Type: application/json" \
  -H "x-tenant-domain: cliente1.miapp.com" \
  -d '{
    "data": {
      "status": "paid",
      "mercadoPagoPaymentId": "123456789"
    }
  }'
```

---

## 🎨 Themes API

### GET /api/themes

Obtener themes del tenant

**Endpoint**: `GET /api/themes`

**Auth**: ⚠️ Opcional

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Query Parameters**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `filters[activo]` | boolean | Solo themes activos | `true` |

**Ejemplo**:

```bash
# Obtener theme activo del tenant
curl "https://quality-backend.up.railway.app/api/themes?filters[activo]=true" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

**Respuesta** (200 OK):

```json
{
  "data": [
    {
      "id": 12,
      "documentId": "theme123",
      "nombre": "Default Azul",
      "activo": true,
      "colores": {
        "primario": "#2563eb",
        "secundario": "#1e40af",
        "acento": "#f59e0b"
      },
      "tipografia": {
        "fuente": "Inter",
        "fuenteURL": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
      }
    }
  ]
}
```

---

### POST /api/themes

Crear theme para el tenant

**Endpoint**: `POST /api/themes`

**Auth**: ✅ Requerida

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Body**:

```json
{
  "data": {
    "nombre": "Black Friday",
    "activo": false,
    "colores": {
      "primario": "#ef4444",
      "secundario": "#991b1b",
      "acento": "#fbbf24"
    },
    "tipografia": {
      "fuente": "Roboto",
      "fuenteURL": "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
    }
  }
}
```

---

## ⚙️ Site Config API

### GET /api/site-configs

Obtener configuración del sitio del tenant

**Endpoint**: `GET /api/site-configs`

**Auth**: ⚠️ Opcional

**Headers**:
- `x-tenant-domain`: ✅ **Requerido**

**Query Parameters**:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `populate` | string | Poblar relaciones | `theme` (incluye theme) |

**Ejemplo**:

```bash
curl "https://quality-backend.up.railway.app/api/site-configs?populate=theme" \
  -H "x-tenant-domain: cliente1.miapp.com"
```

**Respuesta** (200 OK):

```json
{
  "data": [
    {
      "id": 8,
      "documentId": "config123",
      "siteName": "Tienda María",
      "tagline": "Los mejores calzados de Colombia",
      "banners": [
        {
          "titulo": "Bienvenido",
          "subtitulo": "50% de descuento",
          "imagen": "https://ejemplo.com/banner.jpg",
          "cta": "Ver Productos",
          "link": "/productos"
        }
      ],
      "theme": {
        "id": 12,
        "nombre": "Default Azul",
        ...
      }
    }
  ]
}
```

---

## ❌ Códigos de Error

### Errores Comunes

| Código | Nombre | Descripción | Solución |
|--------|--------|-------------|----------|
| **400** | Bad Request | Request malformado | Verifica JSON syntax |
| **401** | Unauthorized | Falta auth token | Agrega header `Authorization` |
| **403** | Forbidden | No tienes permiso | Verifica ownership del recurso |
| **404** | Not Found | Recurso no existe | Verifica ID |
| **500** | Internal Server Error | Error del servidor | Contacta soporte |

### Errores Específicos de Multi-Tenant

#### Error: Tenant no encontrado

**Request**:

```bash
curl https://quality-backend.up.railway.app/api/orders \
  -H "x-tenant-domain: tenant-inexistente.com"
```

**Respuesta** (404 Not Found):

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Tenant no encontrado para el dominio: tenant-inexistente.com"
  }
}
```

#### Error: Acceso Cross-Tenant

**Request**:

```bash
# Intentar acceder a order de otro tenant
curl https://quality-backend.up.railway.app/api/orders/99 \
  -H "x-tenant-domain: cliente1.miapp.com"
# Order 99 pertenece a cliente2.miapp.com
```

**Respuesta** (403 Forbidden):

```json
{
  "error": {
    "status": 403,
    "name": "ForbiddenError",
    "message": "Acceso denegado: recurso no pertenece a este tenant"
  }
}
```

#### Error: Header x-tenant-domain faltante

**Request**:

```bash
curl https://quality-backend.up.railway.app/api/orders
# Falta header x-tenant-domain
```

**Respuesta** (400 Bad Request):

```json
{
  "error": {
    "status": 400,
    "name": "BadRequestError",
    "message": "Header x-tenant-domain es requerido"
  }
}
```

---

## 🚦 Rate Limiting

### Límites por Default

| Endpoint | Límite | Ventana | Headers en Respuesta |
|----------|--------|---------|----------------------|
| **GET** | 100 requests | 1 minuto | `X-RateLimit-Limit`, `X-RateLimit-Remaining` |
| **POST/PUT** | 50 requests | 1 minuto | `X-RateLimit-Limit`, `X-RateLimit-Remaining` |

### Headers de Rate Limiting

```bash
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1633024800
```

### Respuesta cuando se excede el límite

**Respuesta** (429 Too Many Requests):

```json
{
  "error": {
    "status": 429,
    "name": "TooManyRequestsError",
    "message": "Rate limit exceeded. Try again in 30 seconds."
  }
}
```

---

## 💡 Ejemplos Completos

### Flujo Completo: Crear Orden desde Frontend

```javascript
// 1. Detectar tenant
const tenant = await getTenantByDomain(window.location.hostname);

// 2. Preparar datos de orden
const orderData = {
  data: {
    customerName: cart.customerName,
    customerEmail: cart.customerEmail,
    customerPhone: cart.customerPhone,
    items: cart.items,
    subtotal: cart.subtotal,
    iva: cart.subtotal * tenant.configuracion.iva,
    total: cart.subtotal * (1 + tenant.configuracion.iva),
    status: 'pending',
  },
};

// 3. Crear orden en Strapi
const response = await fetch(`${STRAPI_URL}/api/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-tenant-domain': tenant.dominio,
  },
  body: JSON.stringify(orderData),
});

const { data: order } = await response.json();

// 4. Crear preferencia de Mercado Pago
const mpResponse = await fetch('/api/checkout/create-preference', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.id,
    items: order.items,
    total: order.total,
  }),
});

const { preference_id } = await mpResponse.json();

// 5. Redirigir a Mercado Pago
window.location.href = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${preference_id}`;
```

### Flujo Completo: Webhook de Mercado Pago

```javascript
// /api/webhooks/mercadopago.ts

export async function POST({ request }) {
  const body = await request.json();

  // 1. Extraer metadata del pago
  const { tenant_id, order_id } = body.metadata;

  // 2. Buscar tenant en Strapi
  const tenantRes = await fetch(`${STRAPI_URL}/api/tenants/${tenant_id}`, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
  });
  const { data: tenant } = await tenantRes.json();

  // 3. Verificar pago con Mercado Pago (usando token del tenant)
  const paymentRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${body.payment_id}`,
    {
      headers: { Authorization: `Bearer ${tenant.mercadoPagoAccessToken}` },
    }
  );
  const payment = await paymentRes.json();

  // 4. Actualizar orden en Strapi
  if (payment.status === 'approved') {
    await fetch(`${STRAPI_URL}/api/orders/${order_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-domain': tenant.dominio,
      },
      body: JSON.stringify({
        data: {
          status: 'paid',
          mercadoPagoPaymentId: payment.id,
        },
      }),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## 📞 Soporte

¿Problemas con la API?

- 📧 Email: api@quality.com
- 💬 Slack: #api-support
- 📖 Docs: /docs/API_REFERENCE.md

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
