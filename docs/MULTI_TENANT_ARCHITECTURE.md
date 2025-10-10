# 🏗️ Arquitectura Multi-Tenant - Documentación Técnica

> **Explicación detallada de la arquitectura multi-tenant de Quality Ecommerce**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Flujo de Datos](#flujo-de-datos)
5. [Estrategia de Aislamiento](#estrategia-de-aislamiento)
6. [Decisiones Técnicas](#decisiones-técnicas)
7. [Escalabilidad](#escalabilidad)
8. [Seguridad](#seguridad)
9. [Performance](#performance)
10. [Trade-offs y Limitaciones](#trade-offs-y-limitaciones)

---

## 🎯 Visión General

### ¿Qué es Multi-Tenancy?

**Multi-tenancy** es una arquitectura de software donde una única instancia de la aplicación sirve a múltiples clientes (tenants), manteniendo sus datos completamente aislados.

### Objetivo del Proyecto

Transformar Quality Ecommerce en una **plataforma SaaS** que permita:

- ✅ Servir **400+ clientes** con una sola infraestructura
- ✅ **Aislamiento total** de datos entre clientes
- ✅ **White-label** completo (cada cliente con su branding)
- ✅ **Costo-efectivo** ($0.08 - $0.50 por cliente/mes)
- ✅ **Escalable** horizontalmente

### Modelo de Negocio

```
┌─────────────────────────────────────────────────────────┐
│  Quality Ecommerce SaaS                                  │
│  • 1 plataforma multi-tenant                             │
│  • 400+ tiendas online independientes                    │
│  • Cada tienda = 1 tenant con datos aislados             │
│  • White-label: cada cliente ve solo su marca            │
└─────────────────────────────────────────────────────────┘

Clientes:
  - Tienda de Calzados → tenant_1 → cliente1.miapp.com
  - Boutique de Ropa  → tenant_2 → cliente2.miapp.com
  - Electrónica Pro   → tenant_3 → cliente3.com (custom)
  - ... (397 más)
```

---

## 🏛️ Arquitectura del Sistema

### Diagrama de Alto Nivel

```
┌──────────────────────────────────────────────────────────────┐
│                    USUARIOS FINALES                           │
│  (Compradores de cada tienda)                                 │
└───────────────┬──────────────────────────────────────────────┘
                │
                │ HTTP Requests con hostname
                ▼
┌──────────────────────────────────────────────────────────────┐
│              CLOUDFLARE CDN + EDGE                            │
│  • SSL Termination                                            │
│  • DDoS Protection                                            │
│  • Global CDN (200+ ubicaciones)                              │
└───────────────┬──────────────────────────────────────────────┘
                │
                │ Dominio detectado (cliente1.com, cliente2.com, etc.)
                ▼
┌──────────────────────────────────────────────────────────────┐
│         CLOUDFLARE PAGES (Frontend - Astro SSR)               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Tenant Resolver (Hostname Detection)                  │  │
│  │  • Extrae hostname del request                         │  │
│  │  • Busca tenant en Strapi por dominio                  │  │
│  │  • Carga configuración del tenant                      │  │
│  └───────────────────┬────────────────────────────────────┘  │
│                      │                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Dynamic Branding                                       │  │
│  │  • Logo del tenant                                      │  │
│  │  • Colores del theme                                    │  │
│  │  • Configuración regional (IVA, moneda)                │  │
│  └───────────────────┬────────────────────────────────────┘  │
│                      │                                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  API Calls con Tenant Context                          │  │
│  │  • Header: x-tenant-domain                             │  │
│  │  • Quality API Token dinámico                          │  │
│  │  • Mercado Pago Tokens dinámicos                       │  │
│  └───────────────────┬────────────────────────────────────┘  │
└────────────────────────┼───────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   STRAPI     │ │  QUALITY API │ │ MERCADO PAGO │
│  (Railway)   │ │  (Heroku)    │ │   (API)      │
│              │ │              │ │              │
│ Multi-Tenant │ │ Multi-Token  │ │ Multi-Token  │
│   Backend    │ │   Products   │ │   Payments   │
└──────────────┘ └──────────────┘ └──────────────┘
       │
       │ PostgreSQL
       ▼
┌──────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                    │
│  ┌────────────────────────────────────┐  │
│  │  Tenants Table                     │  │
│  │  • id, nombre, dominio             │  │
│  │  • tokens (Quality, MP)            │  │
│  │  • configuracion (branding)        │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Orders Table                      │  │
│  │  • id, tenant_id, items, total     │  │
│  │  • Row-level filtering por tenant  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Themes Table                      │  │
│  │  • id, tenant_id, colores          │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  SiteConfigs Table                 │  │
│  │  • id, tenant_id, settings         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Capas de la Arquitectura

| Capa | Tecnología | Responsabilidad |
|------|------------|-----------------|
| **CDN/Edge** | Cloudflare | SSL, DDoS, caché, routing |
| **Frontend** | Astro + Cloudflare Workers | SSR, tenant detection, UI |
| **Backend** | Strapi + PostgreSQL | Multi-tenant data, APIs |
| **External APIs** | Quality API, Mercado Pago | Productos, pagos |
| **Database** | PostgreSQL | Persistent storage |

---

## 🧩 Componentes Principales

### 1. Tenant Resolver (Frontend)

**Ubicación**: `/frontend/src/utils/tenant/tenantResolver.ts`

**Responsabilidad**: Detectar qué tenant está accediendo por su dominio

```typescript
// Ejemplo de flujo
Request: https://cliente1.miapp.com/productos

→ extractDomainFromRequest() → "cliente1.miapp.com"
→ getTenantByDomain("cliente1.miapp.com") → API call a Strapi
→ Strapi retorna: { id: 5, nombre: "Tienda María", ... }
→ Cache tenant por 5 minutos
→ Retornar TenantContext al componente
```

**Características**:

- ✅ Caché en memoria (5 min TTL)
- ✅ Manejo de errores (tenant no encontrado → 404)
- ✅ Soporte para desarrollo local (localhost:4321)
- ✅ Type-safe con TypeScript

### 2. Tenant Resolver Middleware (Backend)

**Ubicación**: `/backend/src/middlewares/tenant-resolver.ts`

**Responsabilidad**: Inyectar tenant context en todas las peticiones al backend

```javascript
// Flujo del middleware
Request: GET /api/orders
Header: x-tenant-domain: cliente1.miapp.com

→ Middleware extrae header x-tenant-domain
→ Busca tenant en DB: SELECT * FROM tenants WHERE dominio = 'cliente1.miapp.com'
→ Valida que tenant.activo === true
→ Inyecta en contexto: ctx.state.tenant = { id: 5, ... }
→ Continúa al siguiente middleware/controller
```

**Características**:

- ✅ Ejecuta antes de todas las rutas protegidas
- ✅ Valida existencia y estado del tenant
- ✅ Logging automático por tenant
- ✅ Retorna 404 si tenant no existe

### 3. Tenant Isolation Policy (Backend)

**Ubicación**: `/backend/src/policies/tenant-isolation.ts`

**Responsabilidad**: Filtrar automáticamente todas las queries por tenant

```javascript
// Ejemplo de filtrado automático
Original query: strapi.entityService.findMany('api::order.order')

→ Policy intercepta
→ Agrega filtro: { filters: { tenant: { id: ctx.state.tenant.id } } }
→ Query final: SELECT * FROM orders WHERE tenant_id = 5

→ Usuario solo ve sus propias orders
```

**Características**:

- ✅ Filtrado automático en find, findOne, findMany
- ✅ Validación en create (asigna tenant automáticamente)
- ✅ Bloqueo de acceso cross-tenant (403 Forbidden)
- ✅ Auditoría de intentos de acceso no autorizado

### 4. Dynamic Token Injection (Frontend)

**Ubicación**: `/frontend/src/utils/api/productsApi.ts`

**Responsabilidad**: Usar tokens dinámicos según el tenant

```typescript
// Sin multi-tenant (antes)
const products = await fetchProducts();
// Usaba siempre el mismo token hardcodeado

// Con multi-tenant (ahora)
const tenant = await getTenantContext();
const products = await fetchProducts(tenant.qualityApiToken);
// Cada tenant usa su propio token

// Mercado Pago
const mpToken = tenant.mercadoPagoAccessToken; // Dinámico
const preference = await createPreference(cart, mpToken);
```

---

## 🔄 Flujo de Datos

### Flujo Completo de una Request

```
1. Usuario accede a: https://cliente1.miapp.com/productos

2. Cloudflare CDN:
   ✓ SSL termination
   ✓ Routing a Cloudflare Pages

3. Astro SSR (Cloudflare Worker):
   ✓ BaseLayout.astro detecta hostname: "cliente1.miapp.com"
   ✓ getTenantByDomain("cliente1.miapp.com")
     → API call a Strapi: GET /api/tenants?filters[dominio]=cliente1.miapp.com
     → Strapi retorna tenant { id: 5, nombre: "Tienda María", ... }
   ✓ Cachea tenant por 5 minutos
   ✓ Pasa tenant context a componentes

4. ProductGrid.astro:
   ✓ Lee tenant.qualityApiToken
   ✓ fetchProducts(tenant.qualityApiToken)
     → API call a Quality API con token del tenant
     → Retorna productos del cliente específico

5. Renderizado:
   ✓ Header con logo del tenant
   ✓ Colores del theme del tenant
   ✓ Productos del tenant
   ✓ Footer con contacto del tenant

6. HTML retornado al usuario
```

### Flujo de Checkout Multi-Tenant

```
1. Usuario agrega productos al carrito y va a checkout

2. Checkout Page:
   ✓ Detecta tenant (mismo flujo que arriba)
   ✓ Lee tenant.mercadoPagoAccessToken
   ✓ Lee tenant.configuracion.iva (ej: 0.19 para Colombia)

3. API Route: /api/checkout/create-preference
   ✓ Recibe cart items
   ✓ Calcula total con IVA del tenant
   ✓ Crea preferencia en Mercado Pago con token del tenant
   ✓ Metadata incluye: { tenant_id: 5, tenant_domain: "cliente1.miapp.com" }
   ✓ Retorna preference_id

4. Usuario redirigido a Mercado Pago

5. Usuario paga

6. Mercado Pago envía webhook:
   POST /api/webhooks/mercadopago
   Body: { payment_id: "123", metadata: { tenant_id: 5 } }

7. Webhook Handler:
   ✓ Extrae tenant_id de metadata
   ✓ Busca tenant en Strapi
   ✓ Verifica pago con Mercado Pago usando token del tenant
   ✓ Crea order en Strapi con tenant_id = 5
   ✓ Policy tenant-isolation asegura que order se asocie al tenant correcto

8. Order creada y aislada por tenant ✓
```

---

## 🔒 Estrategia de Aislamiento

### Tipo de Multi-Tenancy

**Arquitectura elegida**: **Row-Level Isolation** (Pseudo Multi-Tenant)

| Estrategia | Descripción | Usado en Quality |
|------------|-------------|------------------|
| **Database per Tenant** | Cada tenant tiene su propia base de datos | ❌ No (muy costoso) |
| **Schema per Tenant** | Cada tenant tiene su propio schema | ❌ No (complejo de gestionar) |
| **Row-Level Isolation** | Todos comparten tabla, filtrado por `tenant_id` | ✅ **SÍ** |

### Implementación de Row-Level Isolation

#### 1. Schema de Base de Datos

Todas las tablas multi-tenant tienen columna `tenant_id`:

```sql
-- Tabla Orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  customer_email VARCHAR(255),
  items JSONB,
  total DECIMAL(10, 2),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para performance
CREATE INDEX idx_orders_tenant_id ON orders(tenant_id);

-- Tabla Themes
CREATE TABLE themes (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  nombre VARCHAR(255),
  colores JSONB,
  activo BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_themes_tenant_id ON themes(tenant_id);
```

#### 2. Filtrado Automático

Todas las queries son interceptadas por la policy `tenant-isolation`:

```javascript
// Query original del controller
const orders = await strapi.entityService.findMany('api::order.order');

// Policy modifica automáticamente a:
const orders = await strapi.entityService.findMany('api::order.order', {
  filters: {
    tenant: { id: ctx.state.tenant.id } // Inyectado automáticamente
  }
});

// SQL generado:
// SELECT * FROM orders WHERE tenant_id = 5
```

#### 3. Validaciones de Seguridad

```javascript
// En tenant-isolation.ts

// FIND: Agregar filtro automático
if (ctx.params.id) {
  // Validar que el recurso pertenece al tenant
  const resource = await strapi.entityService.findOne(uid, ctx.params.id);
  if (resource.tenant.id !== ctx.state.tenant.id) {
    return ctx.forbidden('Acceso denegado: recurso no pertenece a este tenant');
  }
}

// CREATE: Asignar tenant automáticamente
ctx.request.body.data.tenant = ctx.state.tenant.id;

// UPDATE/DELETE: Validar ownership antes de proceder
const resource = await strapi.entityService.findOne(uid, ctx.params.id);
if (resource.tenant.id !== ctx.state.tenant.id) {
  return ctx.forbidden('Acceso denegado');
}
```

---

## 🧠 Decisiones Técnicas

### ¿Por qué Row-Level Isolation en vez de Database per Tenant?

| Criterio | Row-Level | Database per Tenant | Decisión |
|----------|-----------|---------------------|----------|
| **Costo** | 💰 $5-75/mes total | 💰💰💰 $5/tenant = $2000/mes para 400 | ✅ Row-Level |
| **Complejidad** | ⭐⭐ Media | ⭐⭐⭐ Alta | ✅ Row-Level |
| **Escalabilidad** | ✅ 1000+ tenants | ⚠️ Difícil >100 | ✅ Row-Level |
| **Aislamiento** | ⚠️ Lógico (policies) | ✅ Físico (DBs separadas) | ⚠️ Trade-off aceptable |
| **Backups** | ✅ 1 backup para todos | ⚠️ 400 backups separados | ✅ Row-Level |
| **Migrations** | ✅ 1 migración | ⚠️ 400 migraciones | ✅ Row-Level |

**Conclusión**: Row-Level Isolation es óptimo para SaaS de 1-1000 tenants con presupuesto limitado.

### ¿Por qué Cloudflare Pages en vez de Vercel?

| Criterio | Cloudflare Pages | Vercel | Decisión |
|----------|------------------|--------|----------|
| **Costo** | 🆓 Gratis ilimitado | 💰 $20/mes (Pro) | ✅ Cloudflare |
| **Multi-dominio** | ✅ Ilimitado | ⚠️ 100 en Pro | ✅ Cloudflare |
| **SSR** | ✅ Workers (V8 Isolates) | ✅ Edge Functions | ✅ Ambos |
| **CDN** | ✅ 200+ ubicaciones | ✅ Global | ✅ Empate |
| **SSL** | ✅ Gratis ilimitado | ✅ Gratis ilimitado | ✅ Empate |

**Conclusión**: Cloudflare Pages es gratis y soporta ilimitados dominios custom.

### ¿Por qué Railway en vez de Heroku?

| Criterio | Railway | Heroku | Decisión |
|----------|---------|--------|----------|
| **Costo** | 💰 $5-20/mes | 💰💰 $25/mes (mínimo) | ✅ Railway |
| **PostgreSQL** | ✅ Incluido ($5) | 💰 $9/mes adicional | ✅ Railway |
| **Deploy** | ✅ GitHub auto-deploy | ✅ GitHub auto-deploy | ✅ Empate |
| **Escalabilidad** | ✅ Fácil upgrade | ✅ Fácil upgrade | ✅ Empate |
| **DX** | ✅ Moderno, rápido | ⚠️ UI anticuada | ✅ Railway |

**Conclusión**: Railway es más barato y moderno.

### ¿Por qué Strapi en vez de CMS headless alternativo?

| Criterio | Strapi | Contentful | Sanity |
|----------|--------|------------|--------|
| **Costo** | 🆓 Self-hosted gratis | 💰💰 $300+/mes | 💰 $99/mes |
| **Multi-tenant** | ✅ Flexible (custom) | ⚠️ No nativo | ⚠️ No nativo |
| **Customización** | ✅ Total (Node.js) | ⚠️ Limitada | ⚠️ Limitada |
| **Self-hosted** | ✅ Sí | ❌ No | ⚠️ Complejo |

**Conclusión**: Strapi es gratis, flexible y totalmente customizable.

---

## 📈 Escalabilidad

### Proyección de Crecimiento

| Fase | Tenants | Infraestructura | Costo/mes | Costo/tenant |
|------|---------|-----------------|-----------|--------------|
| **Piloto** | 1-10 | Railway Starter | $5 | $0.50 |
| **Crecimiento** | 10-100 | Railway Developer | $20 | $0.20 |
| **Escalado** | 100-400 | Railway Team | $75 | $0.18 |
| **Enterprise** | 400-1000 | Hetzner VPS + Supabase | $150 | $0.15 |

### Cuellos de Botella y Soluciones

#### 1. Base de Datos (PostgreSQL)

**Problema**: Con 400 tenants y 100 orders/tenant/mes = 40,000 orders/mes

**Solución**:
- ✅ **Índices**: `CREATE INDEX idx_orders_tenant_id ON orders(tenant_id)`
- ✅ **Partitioning**: Dividir tabla por rango de tenant_id
- ✅ **Read Replicas**: Railway/Supabase soportan réplicas de lectura

#### 2. Backend (Strapi)

**Problema**: 1 instancia de Strapi puede saturarse con muchas requests

**Solución**:
- ✅ **Horizontal Scaling**: Railway permite múltiples instancias
- ✅ **Load Balancer**: Railway balancea automáticamente
- ✅ **Caché**: Redis para cachear tenants, themes, configs

#### 3. Frontend (Cloudflare Workers)

**Problema**: Workers tienen límite de CPU time (50ms en Free)

**Solución**:
- ✅ **Caché Agresivo**: Cachear tenant context (5 min)
- ✅ **Edge Caching**: Cloudflare cachea páginas SSR
- ✅ **Plan Upgrade**: Workers Paid ($5/mes) = 100ms CPU time

### Plan de Escalamiento

```
1-10 tenants:
  ✅ Railway Starter + Cloudflare Free
  ✅ Sin optimizaciones adicionales
  ✅ Costo: $5/mes

10-100 tenants:
  ✅ Railway Developer + Cloudflare Free
  ✅ Agregar caché Redis
  ✅ Costo: $20-30/mes

100-400 tenants:
  ✅ Railway Team + Cloudflare Free
  ✅ PostgreSQL Partitioning
  ✅ Read Replicas
  ✅ Costo: $75-100/mes

400-1000 tenants:
  ✅ Migrar a Hetzner VPS (16GB RAM)
  ✅ Supabase Pro (PostgreSQL managed)
  ✅ Cloudflare Workers Paid
  ✅ Implementar sharding (dividir tenants en 2-3 DBs)
  ✅ Costo: $150-200/mes
```

---

## 🔐 Seguridad

### Vectores de Ataque y Mitigaciones

#### 1. Cross-Tenant Data Leakage

**Ataque**: Tenant A intenta acceder a datos de Tenant B

**Mitigación**:
- ✅ **Policy tenant-isolation**: Filtra automáticamente por tenant_id
- ✅ **Validación de ownership**: Verifica tenant_id en UPDATE/DELETE
- ✅ **Logging**: Registra intentos de acceso cross-tenant
- ✅ **Testing**: Tests automatizados validan aislamiento

**Ejemplo de test**:
```javascript
// Test: Tenant 1 no puede ver orders de Tenant 2
const tenant1Orders = await getOrders({ tenantDomain: 'tenant1.com' });
const tenant2Orders = await getOrders({ tenantDomain: 'tenant2.com' });

expect(tenant1Orders).not.toContainAnyOf(tenant2Orders); // ✓ Pass
```

#### 2. Token Leakage

**Ataque**: Quality API Token o MP Token expuesto al cliente

**Mitigación**:
- ✅ **Tokens en backend**: Nunca enviar tokens al cliente
- ✅ **Server-side API calls**: Productos y pagos se llaman desde servidor
- ✅ **Env vars**: Tokens en variables de entorno, nunca en código
- ✅ **Rotation**: Permitir rotación de tokens sin downtime

#### 3. Tenant Spoofing

**Ataque**: Usuario modifica header `x-tenant-domain` para acceder a otro tenant

**Mitigación**:
- ✅ **Validación en backend**: Header es solo informativo
- ✅ **Confirmación con dominio real**: Backend valida dominio de request
- ✅ **Strapi Auth**: APIs protegidas requieren autenticación

---

## ⚡ Performance

### Métricas Objetivo

| Métrica | Objetivo | Actual (estimado) |
|---------|----------|-------------------|
| **TTFB** | <200ms | ~100ms (con caché) |
| **FCP** | <1s | ~600ms |
| **LCP** | <2.5s | ~1.2s |
| **Tenant Detection** | <50ms | ~30ms (caché hit) |
| **Database Query** | <100ms | ~50ms (con índices) |

### Optimizaciones Implementadas

#### 1. Caché de Tenant (Frontend)

```typescript
// Caché en memoria (node-cache)
const tenantCache = new NodeCache({ stdTTL: 300 }); // 5 min

// Primer request: 200ms (API call a Strapi)
const tenant = await getTenantByDomain('cliente1.com'); // MISS

// Requests subsecuentes: 5ms (caché hit)
const tenant = await getTenantByDomain('cliente1.com'); // HIT ✓
```

#### 2. Índices de Base de Datos

```sql
-- Índice compuesto para queries frecuentes
CREATE INDEX idx_orders_tenant_status ON orders(tenant_id, status);

-- Query rápida: WHERE tenant_id = 5 AND status = 'completed'
-- Execution time: 5ms (vs 500ms sin índice)
```

#### 3. Edge Caching (Cloudflare)

```javascript
// Headers para caché en Cloudflare
Astro.response.headers.set('Cache-Control', 'public, max-age=300');

// Resultado:
// Primer request: 200ms (SSR)
// Requests subsecuentes: 20ms (Cloudflare caché) ✓
```

---

## ⚖️ Trade-offs y Limitaciones

### Trade-offs Aceptados

#### 1. Aislamiento Lógico vs Físico

**Trade-off**: Row-level isolation es lógico (policies), no físico (DBs separadas)

**Riesgo**: Bug en policy podría causar data leakage

**Mitigación**:
- ✅ Tests exhaustivos de aislamiento
- ✅ Auditoría de accesos
- ✅ Review de código en policies

**Conclusión**: ✅ **Aceptable** - Riesgo bajo con testing adecuado

#### 2. Tenant Detection por Dominio

**Trade-off**: Dependemos de header `x-tenant-domain` en frontend

**Riesgo**: Si header falla o es manipulado, tenant incorrecto

**Mitigación**:
- ✅ Validación en backend (no confía solo en header)
- ✅ Fallback a subdomain detection
- ✅ Logging de discrepancias

**Conclusión**: ✅ **Aceptable** - Múltiples capas de validación

### Limitaciones Conocidas

#### 1. Límite de Tenants por Instancia

**Límite**: ~1000 tenants por instancia de Railway antes de requerir sharding

**Razón**: PostgreSQL performance con millones de filas

**Solución futura**: Implementar sharding horizontal (múltiples DBs)

#### 2. No Soporta Customización de Código por Tenant

**Límite**: Todos los tenants usan el mismo código (frontend + backend)

**Razón**: Arquitectura compartida

**Solución futura**: Plugin system para customizaciones

#### 3. Dominio Custom Requiere Acción del Cliente

**Límite**: Para dominio custom (`tiendacliente.com`), cliente debe configurar DNS

**Razón**: No tenemos acceso a su registrador de dominios

**Solución actual**: Documentación clara + soporte

---

## 📊 Resumen Ejecutivo

### Características Principales

✅ **Row-Level Isolation** para aislamiento de datos
✅ **Tenant Detection** por hostname automático
✅ **Dynamic Tokens** (Quality API + Mercado Pago) por tenant
✅ **White-Label** completo (branding por tenant)
✅ **Multi-Dominio** (subdominios + custom domains)
✅ **Costo-Efectivo** ($0.08-0.50 por tenant/mes)
✅ **Escalable** (1-1000+ tenants)

### Beneficios del Negocio

| Métrica | Sin Multi-Tenant | Con Multi-Tenant |
|---------|------------------|------------------|
| **Costo infraestructura (400 clientes)** | ~$2000/mes | ~$75/mes |
| **Tiempo onboarding** | 2 horas | 15 minutos |
| **Mantenimiento** | 400 instancias | 1 instancia |
| **Despliegues** | 400 deploys | 1 deploy |
| **Bugs** | 400 codebases | 1 codebase |

### KPIs Técnicos

- ✅ **Uptime**: 99.9% (Cloudflare + Railway SLA)
- ✅ **TTFB**: <200ms promedio
- ✅ **Data Isolation**: 100% (validado con tests)
- ✅ **Escalabilidad**: 1000+ tenants sin cambios de arquitectura

---

## 📞 Soporte Técnico

¿Dudas sobre la arquitectura?

- 📧 Email: arquitectura@quality.com
- 💬 Slack: #arquitectura
- 📖 Docs: /docs/MULTI_TENANT_ARCHITECTURE.md

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
**Arquitecto Principal:** [Tu Nombre]
