# 🎛️ Panel Administrativo - Guía Maestra

**Documento de implementación completa del panel de administración para Quality E-commerce Multi-Tenant**

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Objetivos](#objetivos)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura](#arquitectura)
5. [Features](#features)
6. [Checklist de Implementación](#checklist-de-implementación)
7. [Estructura de Carpetas](#estructura-de-carpetas)
8. [Componentes Shadcn/ui](#componentes-shadcnui)
9. [Supabase Integration](#supabase-integration)
10. [Deploy](#deploy)
11. [Notas Técnicas](#notas-técnicas)

---

## 🎯 Introducción

### ¿Qué es este Panel?

Panel administrativo **custom** para gestionar la plataforma multi-tenant Quality E-commerce. Reemplaza el admin de Strapi con una solución más simple, rápida y económica.

### ¿Por qué NO Strapi Admin?

| Strapi Admin | Panel Custom |
|--------------|--------------|
| 1500+ líneas código backend | ~500 líneas React |
| $85/mes (Railway + PostgreSQL) | $25/mes (Supabase) |
| Lento y pesado | Rápido y ligero |
| Difícil de personalizar | 100% personalizable |
| Multi-tenant complejo | Multi-tenant simple (RLS) |

### Ventajas del Panel Custom

✅ **70% menos código**
✅ **Control total del UX**
✅ **Más rápido** (React SPA vs Strapi admin)
✅ **Más barato** ($60/mes de ahorro)
✅ **Auth incluido** (Supabase Auth)
✅ **Deploy gratuito** (Cloudflare Pages)

---

## 🎯 Objetivos

### Objetivos Principales

1. **Gestionar pedidos** de todos los tenants
2. **Activar/desactivar temas** dinámicamente
3. **Configurar ajustes** de cada tenant (WhatsApp, redes, IVA)
4. **Visualizar métricas** básicas (dashboard)
5. **Autenticación segura** con Supabase Auth

### Objetivos Secundarios

- Interfaz moderna con Shadcn/ui
- Responsive (mobile + desktop)
- Modo oscuro
- Búsqueda y filtros avanzados
- Export de datos (CSV)

---

## 🛠️ Stack Tecnológico

### Core

- **React 18** - UI library
- **Vite 5** - Build tool ultra-rápido
- **TypeScript** - Type safety
- **React Router 6** - Routing

### UI/UX

- **Shadcn/ui** - Componentes UI (Radix + Tailwind)
- **Tailwind CSS 4** - Utility CSS
- **Lucide Icons** - Iconos modernos
- **Recharts** - Gráficos para dashboard

### Backend/Data

- **Supabase Client** - PostgreSQL + Auth + RLS
- **React Query (TanStack Query)** - Data fetching + cache
- **Zod** - Validación de schemas

### Deploy

- **Cloudflare Pages** - Hosting gratuito + CDN global
- **GitHub Actions** (opcional) - CI/CD

---

## 🏗️ Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────┐
│  Usuario Admin → admin.quality.com      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  CLOUDFLARE PAGES (React SPA)           │
│  • React Router                         │
│  • Supabase Auth (sesión JWT)          │
│  • React Query (cache)                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  SUPABASE (Backend)                     │
│  • PostgreSQL (multi-tenant)            │
│  • Row Level Security (RLS)             │
│  • Auth (JWT + magic links)             │
│  • Realtime (opcional)                  │
└─────────────────────────────────────────┘
```

### Flujo de Autenticación

1. Usuario accede a `/login`
2. Ingresa email + password (o magic link)
3. Supabase Auth valida credenciales
4. Se crea sesión JWT (guardada en localStorage)
5. React Query usa JWT para todas las requests
6. RLS policies filtran data por `tenant_id`

### Flujo de Datos

```
Component → React Query → Supabase Client → PostgreSQL (RLS) → Response
   ↓
State actualizado
   ↓
UI re-renderiza
```

---

## 🎨 Features

### Feature 1: 🔐 Autenticación

**Descripción**: Login/logout con Supabase Auth

**Endpoints Supabase**:
- `supabase.auth.signInWithPassword()`
- `supabase.auth.signOut()`
- `supabase.auth.getSession()`

**Páginas**:
- `/login` - Formulario de login
- `/forgot-password` - Recuperar contraseña
- `/` - Redirect a dashboard si autenticado

**Componentes**:
- `<LoginForm />` - Formulario con email/password
- `<AuthProvider />` - Context para estado de auth
- `<ProtectedRoute />` - HOC para rutas privadas

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente

---

### Feature 2: 📊 Dashboard

**Descripción**: Métricas básicas de la plataforma

**Métricas**:
- Total de pedidos (hoy, semana, mes)
- Revenue total (por período)
- Productos más vendidos (top 5)
- Pedidos pendientes de procesar
- Gráfico de ventas por día (últimos 7 días)

**Endpoints Supabase**:
```sql
-- Total de pedidos
SELECT COUNT(*) FROM orders WHERE tenant_id = $1

-- Revenue
SELECT SUM(total) FROM orders WHERE tenant_id = $1 AND status = 'completed'

-- Top productos
SELECT product_id, COUNT(*) as qty
FROM order_items
WHERE tenant_id = $1
GROUP BY product_id
ORDER BY qty DESC
LIMIT 5
```

**Componentes**:
- `<DashboardStats />` - Cards con métricas
- `<RevenueChart />` - Gráfico de línea (Recharts)
- `<TopProducts />` - Tabla de productos top

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente

---

### Feature 3: 📦 Gestión de Pedidos

**Descripción**: Lista, filtrado y gestión de estados de pedidos

**Acciones**:
- Ver lista de pedidos (con paginación)
- Filtrar por estado (pending, processing, completed, cancelled)
- Filtrar por fecha (rango)
- Buscar por ID o cliente
- Ver detalles de un pedido (modal)
- Cambiar estado de un pedido
- Export CSV

**Endpoints Supabase**:
```sql
-- Listar pedidos
SELECT * FROM orders
WHERE tenant_id = $1
ORDER BY created_at DESC
LIMIT 20 OFFSET 0

-- Actualizar estado
UPDATE orders
SET status = $2
WHERE id = $1 AND tenant_id = $3
```

**Páginas**:
- `/orders` - Lista de pedidos
- `/orders/:id` - Detalles de pedido (modal o página)

**Componentes**:
- `<OrdersTable />` - Tabla con pedidos
- `<OrderFilters />` - Filtros (estado, fecha)
- `<OrderDetails />` - Modal con detalles
- `<OrderStatusBadge />` - Badge de estado
- `<OrderActions />` - Botones de acción

**Estados de Pedido**:
- `pending` - Pendiente de pago
- `processing` - En proceso
- `completed` - Completado
- `cancelled` - Cancelado

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente

---

### Feature 4: 🎨 Gestión de Temas

**Descripción**: Activar/desactivar temas visuales por tenant

**Acciones**:
- Ver lista de temas disponibles
- Preview de cada tema (colores, tipografía)
- Activar tema (solo 1 activo a la vez)
- Ver qué tenants usan cada tema

**Endpoints Supabase**:
```sql
-- Listar temas
SELECT * FROM themes ORDER BY name

-- Activar tema para tenant
UPDATE tenants
SET active_theme_id = $1
WHERE id = $2
```

**Páginas**:
- `/themes` - Lista de temas

**Componentes**:
- `<ThemeCard />` - Card con preview del tema
- `<ThemePreview />` - Preview visual (colores + font)
- `<ActivateThemeButton />` - Botón para activar

**Temas Iniciales**:
1. **Default** - Azul/morado corporativo
2. **Black Friday** - Oscuro con rojo/amarillo
3. **Navidad** - Rojo/verde festivo
4. **Verano** - Amarillo/naranja vibrante

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente

---

### Feature 5: ⚙️ Configuración de Sitio

**Descripción**: Editar configuración del tenant actual

**Campos Editables**:
- **Contacto**:
  - WhatsApp (número)
  - Email de contacto
  - Teléfono
- **Redes Sociales**:
  - Facebook URL
  - Instagram URL
  - Twitter/X URL
- **Configuración Regional**:
  - IVA (%)
  - Moneda (COP, USD, EUR, etc.)
  - País
- **Textos**:
  - Nombre de la tienda
  - Slogan
  - Mensaje de bienvenida

**Endpoints Supabase**:
```sql
-- Obtener config
SELECT * FROM site_config WHERE tenant_id = $1

-- Actualizar config
UPDATE site_config
SET whatsapp = $1, facebook_url = $2, ...
WHERE tenant_id = $3
```

**Páginas**:
- `/settings` - Formulario de configuración

**Componentes**:
- `<SettingsForm />` - Formulario con tabs
- `<ContactSettings />` - Tab de contacto
- `<SocialSettings />` - Tab de redes sociales
- `<RegionalSettings />` - Tab de configuración regional

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente

---

### Feature 6: 👥 Multi-Tenant (Opcional)

**Descripción**: Admin puede ver/gestionar múltiples tenants

**Solo si el usuario es super-admin**:
- Ver lista de todos los tenants
- Cambiar entre tenants (switch)
- Ver métricas globales (todos los tenants)

**Endpoints Supabase**:
```sql
-- Listar tenants (solo super-admin)
SELECT * FROM tenants

-- RLS policy verifica is_super_admin
```

**Estado**:
- ✅ Completado
- 🚧 En progreso
- ⏳ Pendiente (baja prioridad)

---

## ✅ Checklist de Implementación

### Fase 0: Setup Inicial ⏳

- [ ] Crear proyecto Vite + React + TypeScript
- [ ] Instalar dependencias base (React Router, Tailwind)
- [ ] Configurar Tailwind CSS + Shadcn/ui
- [ ] Configurar ESLint + Prettier
- [ ] Crear estructura de carpetas
- [ ] Setup .env variables

**Tiempo estimado**: 1 día

---

### Fase 1: Supabase Setup ✅ COMPLETADA

- [x] Crear proyecto en Supabase ✅
- [x] Ejecutar schema SQL (tablas + RLS) ✅
- [x] Crear seed data (3 themes, 2 tenants, 5 orders) ✅
- [x] Crear vistas (orders_summary, top_products, etc.) ✅
- [ ] Configurar Auth en Supabase (pendiente)
- [ ] Instalar `@supabase/supabase-js` (pendiente)
- [ ] Crear `supabaseClient.ts` (pendiente)
- [ ] Probar conexión desde React (pendiente)

**Tiempo real**: 1.5 horas
**Estado**: ✅ Base de datos lista y funcional

#### 📊 Validación Exitosa:
- ✅ **4 tablas creadas**: themes (3 rows), tenants (2 rows), orders (5 rows), site_config (2 rows)
- ✅ **RLS habilitado** en todas las tablas
- ✅ **12 policies RLS** funcionando correctamente
- ✅ **5 vistas** con security_invoker: orders_summary, top_products, daily_revenue, orders_by_status, recent_orders
- ✅ **Índices optimizados** para performance (11 índices totales)
- ✅ **Triggers** para updated_at automático

---

### Fase 2: Autenticación 🚧

- [ ] Instalar React Router 6
- [ ] Crear `<AuthProvider />` con Context
- [ ] Crear página `/login`
- [ ] Crear `<LoginForm />` component
- [ ] Implementar `signInWithPassword()`
- [ ] Implementar `signOut()`
- [ ] Crear `<ProtectedRoute />` HOC
- [ ] Persistir sesión en localStorage
- [ ] Probar login/logout

**Tiempo estimado**: 1-2 días

---

### Fase 3: Layout y Navegación 🚧

- [ ] Crear `<AppLayout />` (sidebar + header + content)
- [ ] Crear `<Sidebar />` con navegación
- [ ] Crear `<Header />` con usuario + logout
- [ ] Implementar navegación con React Router
- [ ] Responsive (mobile menu)
- [ ] Instalar componentes Shadcn: Button, Sheet, Avatar

**Tiempo estimado**: 1 día

---

### Fase 4: Dashboard 📊 ⏳

- [ ] Crear página `/dashboard`
- [ ] Instalar React Query
- [ ] Crear hooks de data fetching:
  - `useOrdersStats()`
  - `useRevenueStats()`
  - `useTopProducts()`
- [ ] Crear `<DashboardStats />` (cards con métricas)
- [ ] Instalar Recharts
- [ ] Crear `<RevenueChart />` (gráfico de línea)
- [ ] Crear `<TopProducts />` (tabla)
- [ ] Instalar componentes Shadcn: Card, Table

**Tiempo estimado**: 2 días

---

### Fase 5: Gestión de Pedidos 📦 ⏳

- [ ] Crear página `/orders`
- [ ] Crear hook `useOrders()` con React Query
- [ ] Crear `<OrdersTable />` component
- [ ] Implementar paginación
- [ ] Crear `<OrderFilters />` (estado, fecha)
- [ ] Crear `<OrderDetails />` modal
- [ ] Implementar cambio de estado
- [ ] Crear `<OrderStatusBadge />` component
- [ ] Export CSV (opcional)
- [ ] Instalar componentes Shadcn: Table, Dialog, Badge, Select

**Tiempo estimado**: 2-3 días

---

### Fase 6: Gestión de Temas 🎨 ⏳

- [ ] Crear página `/themes`
- [ ] Crear hook `useThemes()`
- [ ] Crear `<ThemeCard />` component
- [ ] Crear `<ThemePreview />` (mostrar colores)
- [ ] Implementar activar/desactivar tema
- [ ] Mostrar tema activo actual
- [ ] Instalar componentes Shadcn: Card, Switch

**Tiempo estimado**: 1-2 días

---

### Fase 7: Configuración de Sitio ⚙️ ⏳

- [ ] Crear página `/settings`
- [ ] Crear hook `useSiteConfig()`
- [ ] Crear `<SettingsForm />` con tabs
- [ ] Tab 1: Contacto (WhatsApp, email, teléfono)
- [ ] Tab 2: Redes sociales (Facebook, Instagram, Twitter)
- [ ] Tab 3: Regional (IVA, moneda, país)
- [ ] Tab 4: Textos (nombre, slogan)
- [ ] Implementar guardar cambios
- [ ] Validación con Zod
- [ ] Instalar componentes Shadcn: Tabs, Input, Textarea, Select

**Tiempo estimado**: 2 días

---

### Fase 8: Testing y Deploy 🚀 ⏳

- [ ] Testing manual de todas las features
- [ ] Probar multi-tenant con 2 cuentas
- [ ] Validar RLS policies (no ver data de otro tenant)
- [ ] Build de producción (`pnpm build`)
- [ ] Deploy en Cloudflare Pages
- [ ] Configurar variables de entorno en Cloudflare
- [ ] Configurar dominio custom (admin.quality.com)
- [ ] Testing E2E en producción

**Tiempo estimado**: 2 días

---

### Resumen de Tiempos

| Fase | Tiempo | Estado |
|------|--------|--------|
| Fase 0: Setup | 1 día | ⏳ Pendiente |
| Fase 1: Supabase | 1 día | ⏳ Pendiente |
| Fase 2: Auth | 1-2 días | ⏳ Pendiente |
| Fase 3: Layout | 1 día | ⏳ Pendiente |
| Fase 4: Dashboard | 2 días | ⏳ Pendiente |
| Fase 5: Pedidos | 2-3 días | ⏳ Pendiente |
| Fase 6: Temas | 1-2 días | ⏳ Pendiente |
| Fase 7: Config | 2 días | ⏳ Pendiente |
| Fase 8: Deploy | 2 días | ⏳ Pendiente |
| **TOTAL** | **13-16 días** | ⏳ Pendiente |

---

## 📁 Estructura de Carpetas

```
admin-panel/
├── public/
│   └── logo.png
├── src/
│   ├── assets/              # Imágenes, iconos
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes Shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── TopProducts.tsx
│   │   ├── orders/
│   │   │   ├── OrdersTable.tsx
│   │   │   ├── OrderFilters.tsx
│   │   │   ├── OrderDetails.tsx
│   │   │   ├── OrderStatusBadge.tsx
│   │   │   └── OrderActions.tsx
│   │   ├── themes/
│   │   │   ├── ThemeCard.tsx
│   │   │   ├── ThemePreview.tsx
│   │   │   └── ActivateThemeButton.tsx
│   │   └── settings/
│   │       ├── SettingsForm.tsx
│   │       ├── ContactSettings.tsx
│   │       ├── SocialSettings.tsx
│   │       └── RegionalSettings.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useOrders.ts
│   │   ├── useThemes.ts
│   │   ├── useSiteConfig.ts
│   │   └── useStats.ts
│   ├── lib/                 # Utilidades
│   │   ├── supabase.ts     # Cliente de Supabase
│   │   ├── utils.ts        # Helpers (cn, formatDate, etc.)
│   │   └── schemas.ts      # Schemas Zod
│   ├── pages/               # Páginas (React Router)
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ThemesPage.tsx
│   │   └── SettingsPage.tsx
│   ├── types/               # TypeScript types
│   │   ├── order.ts
│   │   ├── theme.ts
│   │   ├── tenant.ts
│   │   └── config.ts
│   ├── App.tsx              # Routing principal
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind imports
├── .env.example
├── .env.local
├── components.json          # Config Shadcn/ui
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🎨 Componentes Shadcn/ui

### Componentes a Instalar

```bash
# Auth
npx shadcn@latest add button input label

# Layout
npx shadcn@latest add sheet avatar dropdown-menu

# Dashboard
npx shadcn@latest add card

# Pedidos
npx shadcn@latest add table dialog badge select

# Temas
npx shadcn@latest add card switch

# Settings
npx shadcn@latest add tabs input textarea select

# Utilidades
npx shadcn@latest add toast
```

### Lista Completa

| Componente | Usado en | Prioridad |
|------------|----------|-----------|
| Button | Todo | 🔴 Alta |
| Input | Forms | 🔴 Alta |
| Card | Dashboard, Themes | 🔴 Alta |
| Table | Orders, Top Products | 🔴 Alta |
| Dialog | Order Details | 🔴 Alta |
| Badge | Order Status | 🔴 Alta |
| Select | Filters, Settings | 🔴 Alta |
| Tabs | Settings | 🟡 Media |
| Sheet | Mobile Menu | 🟡 Media |
| Avatar | Header User | 🟡 Media |
| Dropdown Menu | User Menu | 🟡 Media |
| Toast | Notificaciones | 🟡 Media |
| Switch | Theme Activation | 🟢 Baja |
| Textarea | Settings (texts) | 🟢 Baja |

---

## 🔌 Supabase Integration

### 1. Instalación

```bash
pnpm add @supabase/supabase-js
```

### 2. Cliente de Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Variables de Entorno

```bash
# .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### 4. Schema SQL (Ejemplo)

```sql
-- Tabla de tenants
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  active_theme_id UUID REFERENCES themes(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL, -- pending, processing, completed, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy (solo ve sus propios pedidos)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their tenant's orders"
ON orders
FOR SELECT
USING (tenant_id = (SELECT tenant_id FROM users WHERE auth.uid() = id));
```

### 5. React Query Setup

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

### 6. Hook de Ejemplo

```typescript
// src/hooks/useOrders.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })
}
```

---

## 🚀 Deploy

### Cloudflare Pages

#### 1. Build Settings

```yaml
Build command: pnpm build
Build output directory: dist
Root directory: admin-panel
Node version: 18
```

#### 2. Variables de Entorno

En Cloudflare Pages > Settings > Environment Variables:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

#### 3. Custom Domain

- Ir a Cloudflare Pages > Custom Domains
- Agregar: `admin.quality.com`
- DNS automático + SSL automático

#### 4. Deploy Manual

```bash
pnpm build
npx wrangler pages deploy dist
```

#### 5. Deploy Automático (GitHub)

Conectar repo → Cloudflare Pages → Deploy automático en push a `main`

---

## 📚 Notas Técnicas

### Context7 Integration

Usar Context7 para obtener docs actualizadas:

```bash
# Shadcn/ui docs
context7 shadcn/ui

# Supabase React docs
context7 supabase

# React Query docs
context7 tanstack/react-query
```

### Multi-Tenant con RLS

**Importante**: Cada query debe filtrar por `tenant_id` automáticamente vía RLS policies.

**Ejemplo de RLS policy**:
```sql
CREATE POLICY "tenant_isolation"
ON orders
FOR ALL
USING (tenant_id = (SELECT tenant_id FROM users WHERE auth.uid() = id));
```

**En el código**:
```typescript
// ✅ CORRECTO - RLS filtra automáticamente
const { data } = await supabase.from('orders').select('*')

// ❌ INCORRECTO - No hardcodear tenant_id
const { data } = await supabase.from('orders').select('*').eq('tenant_id', 'xxx')
```

### Optimización de Queries

- Usar `React Query` para cache (5 minutos default)
- Prefetch data en hover (anticipar navegación)
- Paginación server-side (no cargar todos los pedidos)

```typescript
// Prefetch en hover
<Link
  to="/orders/123"
  onMouseEnter={() => queryClient.prefetchQuery(['order', '123'])}
>
  Ver detalles
</Link>
```

### Seguridad

- ✅ Nunca exponer `SUPABASE_SERVICE_KEY` en frontend
- ✅ Usar solo `SUPABASE_ANON_KEY` (público)
- ✅ RLS policies son la capa de seguridad
- ✅ Validar permisos en backend (Supabase functions si es necesario)

### Testing

```bash
# Unit tests (opcional)
pnpm add -D vitest @testing-library/react

# E2E tests (opcional)
pnpm add -D playwright
```

---

## 🎯 Próximos Pasos

### Ahora mismo:

1. ✅ Leer y entender este documento completo
2. ⏳ Empezar con **Fase 0: Setup Inicial**
3. ⏳ Crear proyecto Vite + React + TS
4. ⏳ Instalar Tailwind + Shadcn/ui

### Esta semana:

- Completar Fase 0, 1, 2 (Setup + Supabase + Auth)
- Tener login funcional

### Próxima semana:

- Completar Fase 3, 4 (Layout + Dashboard)
- Visualizar primeras métricas

### Semana siguiente:

- Completar Fase 5, 6, 7 (Pedidos + Temas + Config)
- Panel completo funcional

---

## 📞 Preguntas Frecuentes

### ¿Por qué React y no Astro?

Astro es excelente para sitios con SSR/SSG, pero para un panel admin con mucha interactividad, React SPA es más simple.

### ¿Por qué React Query?

Simplifica data fetching, cache, refetching automático, loading states, etc. Reduce 80% del código de gestión de estado.

### ¿Por qué Shadcn/ui y no Material UI?

- Shadcn/ui: Copias el código, 100% personalizable, más ligero
- Material UI: Dependencia externa, más pesado, menos flexible

### ¿Puedo usar otro framework?

Sí, puedes usar Vue, Svelte, etc. La lógica de Supabase es la misma.

---

---

## 🔑 Credenciales Supabase (Fase 1 Completada)

### Información del Proyecto

```bash
# Proyecto: Ecommerciante
# Region: us-east-1
# Status: ACTIVE_HEALTHY ✅
# PostgreSQL: v17.6.1
# Plan: Free Tier (500 MB)

# URL del Proyecto
SUPABASE_URL=https://lcojyculicexqcpugrdf.supabase.co

# Anon Key (público - usar en frontend)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb2p5Y3VsaWNleHFjcHVncmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzgxODksImV4cCI6MjA3NTc1NDE4OX0.2Qans5bjV44Leu7Ut17s-rcKAcsTrmYazlzq3GkZ-iY
```

### 📊 Estado Actual de la Base de Datos

#### Tablas Creadas (4):
1. **themes** - 3 temas (Default, Black Friday, Navidad)
2. **tenants** - 2 tenants de prueba (demo1, demo2)
3. **orders** - 5 pedidos de ejemplo (3 para demo1, 2 para demo2)
4. **site_config** - 2 configuraciones (1 por tenant)

#### Vistas Disponibles (5):
1. **orders_summary** - Resumen de métricas por tenant
2. **top_products** - Productos más vendidos (usa LATERAL join)
3. **daily_revenue** - Revenue diario (últimos 30 días)
4. **orders_by_status** - Conteo por estado
5. **recent_orders** - Pedidos recientes (últimos 7 días)

#### RLS Policies (12):
- ✅ Aislamiento por tenant_id en todas las tablas
- ✅ Super admin puede ver todos los datos
- ✅ Themes públicos (accesibles sin auth)
- ✅ Security invoker en vistas (respeta RLS del usuario)

### 📁 Archivos de Migración

Los archivos SQL están en:
- `docs/supabase_migration_part1.sql` - Tablas + RLS + Seed (✅ aplicado)
- `docs/supabase_migration_part2.sql` - Vistas + Helpers (✅ aplicado)

---

## 🚀 Próximos Pasos Inmediatos

### 1. Configurar Supabase Auth (15 min)

```bash
# En Supabase Dashboard:
1. Ir a Authentication > Settings
2. Habilitar Email Provider
3. Configurar Email Templates (opcional)
4. Crear usuario de prueba manualmente
```

### 2. Crear Usuario Admin de Prueba (10 min)

```sql
-- En Supabase SQL Editor, ejecutar:

-- 1. Crear usuario en auth.users (esto se hace desde el dashboard)
-- 2. Agregar metadata al usuario
UPDATE auth.users
SET raw_user_meta_data = jsonb_build_object(
  'tenant_id', (SELECT id FROM public.tenants WHERE slug = 'demo1' LIMIT 1),
  'is_super_admin', false
)
WHERE email = 'admin@demo1.com';
```

### 3. Setup Proyecto React (2-3 horas)

```bash
# Crear proyecto en /admin-panel
cd /home/programmerdj/Programmerdj/quality_ecommerce
pnpm create vite admin-panel --template react-ts
cd admin-panel
pnpm install

# Instalar dependencias core
pnpm add @supabase/supabase-js @tanstack/react-query react-router-dom zod

# Instalar Tailwind + Shadcn/ui
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init

# Configurar .env.local
echo "VITE_SUPABASE_URL=https://lcojyculicexqcpugrdf.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=eyJh..." >> .env.local
```

### 4. Primer Componente (AuthProvider) (1 hora)

Ver sección "Fase 2: Autenticación" en este documento para el código completo.

---

## 📚 Recursos y Referencias

### Context7 Docs (para consultar)
```bash
# Cuando necesites docs actualizadas, usa:
context7 supabase              # Docs de Supabase
context7 shadcn/ui             # Componentes Shadcn
context7 tanstack/react-query  # React Query docs
```

### Ejemplos de Queries con RLS

```typescript
// ✅ CORRECTO - RLS filtra automáticamente por tenant_id
const { data } = await supabase.from('orders').select('*')

// ❌ INCORRECTO - No hardcodear tenant_id
const { data } = await supabase
  .from('orders')
  .select('*')
  .eq('tenant_id', 'xxx')
```

---

**Versión**: 1.1.0
**Última actualización**: 2025-10-11 14:30
**Autor**: Programmerdj
**Estado**: ✅ Fase 1 Completada - Ready para Fase 2
