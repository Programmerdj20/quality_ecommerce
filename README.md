# Quality E-commerce - Plataforma Multi-Tenant SaaS

**Plataforma e-commerce multi-tenant para servir 400+ tiendas online con una sola infraestructura**

Arquitectura SaaS construida con **Astro.js** (Frontend), **React** (Admin Panel), **Supabase** (Backend) y **Mercado Pago** (Pagos).

---

## 🏢 Arquitectura Multi-Tenant

Quality Ecommerce es una **plataforma SaaS multi-tenant** que permite servir cientos de tiendas online independientes desde una sola infraestructura compartida.

### ¿Qué es Multi-Tenant?

Cada **tenant** (cliente) tiene su propia tienda online con:
- ✅ **Dominio propio** (ej: `cliente1.com`, `tienda-x.miapp.com`)
- ✅ **Branding personalizado** (logo, colores, temas)
- ✅ **Datos completamente aislados** (órdenes, configuración)
- ✅ **Tokens propios** (Quality API, Mercado Pago)
- ✅ **IVA y moneda configurables** por región

### Arquitectura de Alto Nivel

```
┌──────────────────────────────────────────────────┐
│  Usuarios → cliente1.com, cliente2.com, ...      │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  CLOUDFLARE PAGES (Frontend Multi-Tenant)        │
│  • Astro SSR Híbrido                             │
│  • Detecta tenant por hostname                   │
│  • Carga configuración y temas dinámicamente    │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  SUPABASE BACKEND                                │
│  • PostgreSQL con Row Level Security (RLS)       │
│  • Aislamiento multi-tenant automático           │
│  • Supabase Auth (JWT)                           │
│  • Vistas optimizadas para métricas              │
└─────────────────┬────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────┐
│  PANEL ADMINISTRATIVO (React SPA)                │
│  • Gestión de pedidos por tenant                 │
│  • Dashboard con métricas en tiempo real         │
│  • Gestión de temas y configuración              │
│  • Deploy en Cloudflare Pages                    │
└──────────────────────────────────────────────────┘
```

### Beneficios

| Sin Multi-Tenant | Con Multi-Tenant |
|------------------|------------------|
| 400 instancias separadas | 1 instancia compartida |
| $2000/mes de infraestructura | $25/mes de infraestructura |
| 400 deploys por cambio | 1 deploy para todos |
| Mantenimiento complejo | Mantenimiento centralizado |

**Costo por tenant**: $0.06 - $0.50/mes (vs $5/mes con infraestructura dedicada)
**Ahorro**: 96% en costos de infraestructura

---

## 🚀 Características Principales

### Core Features
- ✅ **Multi-Tenant SaaS** con aislamiento completo de datos
- ✅ **White-Label** completo (cada cliente con su branding)
- ✅ **Multi-Dominio** (subdominios + custom domains)
- ✅ **Tokens dinámicos** (Quality API + Mercado Pago por tenant)
- ✅ **Configuración regional** (IVA, moneda, país por tenant)
- ✅ **Row Level Security** garantizado en todas las tablas

---

## 🛍️ Frontend (Tienda E-commerce)

### Stack Tecnológico

- **Astro.js 5.14.1** - Framework web moderno con SSR híbrido
- **Tailwind CSS 4.1.13** - Framework CSS utility-first
- **TypeScript strict mode** - Tipado estático completo
- **Nanostores 1.0.1** - State management ligero y reactivo
- **Mercado Pago SDK 0.0.3** - Integración de pagos
- **Zod 4.1.11** - Validación de esquemas
- **node-cache 5.1.2** - Sistema de caché en memoria

### Funcionalidades Completadas ✅

- ✅ **Catálogo de productos** con filtros por categoría y precio
- ✅ **Sistema de temas dinámicos** con detección de tenant automática
- ✅ **Carrito de compras** persistente en localStorage
- ✅ **Detección multi-tenant** automática por hostname
- ✅ **Búsqueda modal** de productos
- ✅ **Scroll infinito** en catálogo
- ✅ **Banner carousel** en home
- ✅ **Responsive completo** (mobile, tablet, desktop)
- ✅ **Layouts principales** (Header, Footer, Navigation, MobileMenu)
- ✅ **Sistema de notificaciones** (toast)

### En Desarrollo 🚧

- 🚧 **Checkout con Mercado Pago**
  - API Routes para crear preferencias
  - Webhooks de Mercado Pago
  - Páginas de resultado (success, pending, failure)
  - Store de órdenes

### Arquitectura Frontend

**Detección de Tenant**:
- Extrae hostname del request (ej: `cliente1.com`)
- Consulta Supabase por tenant usando `getTenantByDomain()`
- Carga configuración y tema activo del tenant
- Aplica branding dinámicamente
- Caché en memoria con TTL de 5 minutos

**Sistema de Temas**:
- Almacenados en tabla `themes` de Supabase
- ThemeProvider inyecta CSS Variables dinámicamente
- Tailwind CSS consume variables para estilos
- Cambios sin rebuild necesario

**State Management**:
- `cartStore` - Carrito de compras persistente
- `orderStore` - Órdenes completadas
- `toastStore` - Notificaciones

### Componentes Principales

```
src/components/
├── products/          # ProductCard, ProductGrid, ProductCarousel
├── cart/              # CartDrawer, CartItem
├── checkout/          # CheckoutForm, PaymentMethodSelector
├── home/              # BannerCarousel, CategorySidebar
├── layout/            # Header, Footer, Navigation
├── theme/             # ThemeProvider, themLoader
└── search/            # SearchModal
```

---

## 🎛️ Panel Administrativo

### Stack Tecnológico

- **React 19.1.1** - Library UI moderna
- **Vite 7.1.7** - Build tool ultra-rápido
- **TypeScript 5.9.3** - Tipado estático strict
- **React Router 7.30.1** - Routing client-side
- **TanStack Query 5.90.3** - Data fetching + cache
- **Shadcn/ui 20 componentes** - Componentes UI modernos
- **Tailwind CSS 4.1.14** - Framework CSS utility-first
- **Recharts 2.15.4** - Gráficos para dashboard
- **Sonner 2.0.7** - Sistema de notificaciones toast
- **Zod 4.1.12** - Validación de schemas
- **Lucide React 0.545.0** - Iconos modernos

### Fases Implementadas (7 de 8 - 87% Completado)

#### ✅ Fase 0: Setup Inicial
- Proyecto Vite + React + TypeScript
- Tailwind CSS 4 + Shadcn/ui
- Path aliases (@/ configurado)
- ESLint con React plugins

#### ✅ Fase 1: Supabase Setup
- Base de datos PostgreSQL 17.6.1 configurada
- Row Level Security (RLS) implementado - 12 policies
- Vistas analíticas creadas (5 vistas)
- Índices de performance (11 índices)
- Seed data inicial

#### ✅ Fase 2: Autenticación
- Login con email + password usando Supabase Auth
- Logout funcional
- Persistencia de sesión con JWT en localStorage
- Auto-refresh de tokens
- ProtectedRoute para rutas privadas
- Validación de formularios con Zod
- Manejo de errores de autenticación

#### ✅ Fase 3: Layout y Navegación
- Sidebar colapsable con navegación
- Header con avatar y dropdown menu
- Responsive mobile menu con Sheet
- Breadcrumbs y rutas activas
- 5 páginas principales (Login, Dashboard, Orders, Themes, Settings)
- Build de producción exitoso

#### ✅ Fase 4: Dashboard con Métricas
- **4 cards de estadísticas**:
  - Total de pedidos
  - Revenue total
  - Pedidos pendientes
  - Valor promedio de pedidos
- **Gráfico de ingresos** (Recharts) - últimos 7 días
- **Top 5 productos** más vendidos
- Loading states y error handling completo
- Formateo de moneda (COP) y fechas en español

#### ✅ Fase 5: Gestión de Pedidos
- Lista de pedidos con **paginación** (20 por página)
- **Filtros**: por estado (pending, processing, completed, cancelled)
- **Búsqueda**: por cliente o email
- **Modal de detalles** completo con información de orden
- **Cambio de estado inline** con actualización automática
- Badge de estados con colores distintivos
- Loading y error states

#### ✅ Fase 6: Gestión de Temas
- Lista de temas disponibles desde Supabase
- **Preview visual** de colores (primary, secondary, accent, background)
- Mostrar tema activo del tenant actual
- **Activar tema** con un clic
- Actualización automática en BD
- Notificaciones toast de éxito/error
- Grid responsive (1/2/3 columnas)

#### ✅ Fase 7: Configuración de Sitio
- **4 tabs organizados**:
  1. **Contacto**: WhatsApp, email, teléfono
  2. **Redes Sociales**: Facebook, Instagram, Twitter URLs
  3. **Regional**: IVA (%), moneda (ISO 3), país
  4. **Textos**: Nombre tienda, slogan, mensaje bienvenida
- Validación con Zod
- Auto-guardado con React Query mutations
- Crear o actualizar configuración automáticamente
- Loading states durante guardado

#### ⏳ Fase 8: Testing y Deploy (PENDIENTE)
- Testing manual de todas las features
- Testing E2E
- Deploy en Cloudflare Pages
- Variables de entorno en producción

### Custom Hooks (12 hooks)

**Autenticación**:
- `useAuth()` - Usuario actual, login, logout

**Data Fetching**:
- `useOrders()` - Pedidos con filtros y paginación
- `useThemes()` - Temas disponibles
- `useActiveTenant()` - Tenant del usuario actual
- `useSiteConfig()` - Configuración del sitio
- `useOrdersStats()` - Estadísticas dashboard
- `useRevenueChart()` - Gráfico de revenue
- `useTopProducts()` - Top productos

**Mutaciones**:
- `useOrderMutation()` - Actualizar estados de pedidos
- `useActivateTheme()` - Activar temas
- `useUpdateSiteConfig()` - Guardar configuración

**UI**:
- `use-mobile()` - Detectar dispositivo móvil

### Componentes Shadcn/ui (20 componentes)

Button, Input, Label, Card, Table, Dialog, Badge, Select, Tabs, Textarea, Sheet, Avatar, Dropdown Menu, Separator, Skeleton, Tooltip, Chart, Sidebar, Alert, Sonner

### Rutas

- `/login` - Login (público)
- `/dashboard` - Dashboard principal (protegido)
- `/orders` - Gestión de pedidos (protegido)
- `/themes` - Gestión de temas (protegido)
- `/settings` - Configuración (protegido)

### Credenciales de Prueba

```
Email: admin@demo1.com
Password: AdminDemo123!
Tenant: Tienda Demo 1 (demo1)
```

---

## 🗄️ Backend (Supabase)

### Información del Proyecto

- **URL**: https://lcojyculicexqcpugrdf.supabase.co
- **Región**: us-east-1
- **PostgreSQL**: 17.6.1
- **Plan**: Free Tier
- **Estado**: ACTIVE_HEALTHY ✅

### Schema de Base de Datos

**4 Tablas Principales**:

1. **themes** - Temas visuales reutilizables
   - 3 temas: Default, Black Friday, Navidad
   - JSONB colors (7 colores)
   - Público para lectura

2. **tenants** - Clientes/tiendas
   - Información de cada tenant
   - Tokens encriptados (Quality API, Mercado Pago)
   - Configuración regional

3. **orders** - Pedidos
   - Relación N:1 con tenants
   - Estados: pending, processing, completed, cancelled
   - JSONB items (array de productos)
   - 11 índices para performance

4. **site_config** - Configuración por tenant (1:1)
   - Contacto, redes sociales, políticas
   - JSONB features y business_hours

### Row Level Security (RLS)

**12 policies** implementadas para aislamiento multi-tenant:
- **themes**: Lectura pública, escritura solo super-admin
- **tenants**: Usuarios ven solo su tenant, super-admin ve todos
- **orders**: Aislamiento estricto por tenant_id
- **site_config**: Completamente aislado por tenant

**Seguridad garantizada**: Un tenant NUNCA ve datos de otro.

### Vistas Analíticas (5)

1. **orders_summary** - Métricas agregadas (total pedidos, revenue, etc.)
2. **top_products** - Productos más vendidos
3. **daily_revenue** - Ingresos diarios (últimos 30 días)
4. **orders_by_status** - Conteo por estado
5. **recent_orders** - Pedidos recientes (últimos 7 días)

---

## 📁 Estructura del Proyecto

```
quality_ecommerce/
├── frontend/                    # Astro.js (Tienda E-commerce)
│   ├── src/
│   │   ├── components/         # ProductCard, Cart, Checkout, etc.
│   │   ├── layouts/            # BaseLayout
│   │   ├── pages/              # Home, productos, checkout
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # API, cache, tenant, theme
│   │   ├── stores/             # Nanostores
│   │   └── styles/             # CSS global
│   ├── astro.config.mjs        # Configuración Astro
│   └── package.json
│
├── admin-panel/                 # React + Vite (Panel Administrativo)
│   ├── src/
│   │   ├── components/         # Auth, Layout, Dashboard, Orders, etc.
│   │   ├── pages/              # LoginPage, DashboardPage, etc.
│   │   ├── hooks/              # 12 custom hooks
│   │   ├── lib/                # supabase.ts, utils.ts
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Router
│   │   └── main.tsx            # Entry point
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                        # Documentación
│   ├── PANEL_ADMIN_GUIA.md      # Guía completa
│   ├── DEPLOYMENT_CLOUDFLARE.md # Deploy frontend
│   ├── DOMAIN_SETUP.md          # Multi-dominio
│   ├── supabase_schema_v1.sql   # Schema completo
│   └── supabase_migration_*.sql # Migraciones
│
└── README.md                    # Este archivo
```

---

## 🛠️ Stack Tecnológico Completo

### Frontend (Astro)
- Astro 5.14.1
- Tailwind CSS 4.1.13
- TypeScript
- Nanostores 1.0.1
- Mercado Pago SDK

### Admin Panel (React)
- React 19.1.1
- Vite 7.1.7
- TypeScript 5.9.3
- TanStack Query 5.90.3
- Shadcn/ui (20 componentes)
- Recharts 2.15.4
- Sonner 2.0.7

### Backend
- PostgreSQL 17.6.1
- Supabase Auth
- Row Level Security (RLS)
- Vistas optimizadas

### Infraestructura
- Cloudflare Pages (gratis, ilimitado)
- Supabase ($0-25/mes)
- Mercado Pago (integrado)

---

## 📦 Instalación

### Prerrequisitos
- Node.js >= 18.x
- pnpm >= 8.x
- Cuenta de Supabase (gratis)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/quality_ecommerce.git
cd quality_ecommerce
```

2. **Instalar dependencias del Frontend**
```bash
cd frontend
pnpm install
cp .env.example .env
# Editar .env con tus variables
pnpm dev  # http://localhost:4321
```

3. **Instalar dependencias del Admin Panel**
```bash
cd ../admin-panel
pnpm install
cp .env.example .env.local
# Editar .env.local con credenciales Supabase
pnpm dev  # http://localhost:5173
```

4. **Configurar Supabase**
   - Ejecutar migraciones SQL desde `docs/supabase_migration_*.sql`
   - Crear usuario admin en Supabase Dashboard
   - Configurar variables de entorno

---

## 🎨 Sistema de Temas Dinámicos

- **3 temas incluidos**: Default, Black Friday, Navidad
- **CSS Variables dinámicas** inyectadas por ThemeProvider
- **Cambios en tiempo real** sin rebuild necesario
- **Multi-tenant**: Cada tenant puede activar su tema

---

## 💳 Integración Mercado Pago

- **SDK oficial** de Mercado Pago
- **Tokens dinámicos** por tenant desde Supabase
- **Checkout seguro** con preferencias
- **Webhooks** para confirmación de pagos
- **Multi-tenant**: Cada tenant con sus credenciales

---

## 🚀 Despliegue Multi-Tenant

### Guías Completas

- 📖 [Deployment en Cloudflare Pages (Frontend)](/docs/DEPLOYMENT_CLOUDFLARE.md)
- 📖 [Configuración Multi-Dominio](/docs/DOMAIN_SETUP.md)
- 📖 [Panel Admin - Guía Completa](/docs/PANEL_ADMIN_GUIA.md)

### Costos de Infraestructura

| Tenants | Infraestructura | Costo/mes | Por Tenant |
|---------|-----------------|-----------|------------|
| 1-100 | Supabase Free + CF Free | $0 | $0 |
| 100-400 | Supabase Pro + CF Free | $25 | $0.06 |
| 400+ | Supabase Pro + CF Pro | $45 | $0.08 |

**Ahorro vs arquitectura tradicional**: 96% ($2000/mes → $45/mes)

---

## 📝 Scripts Disponibles

### Frontend
```bash
cd frontend
pnpm dev          # Desarrollo
pnpm build        # Build producción
pnpm preview      # Preview del build
```

### Admin Panel
```bash
cd admin-panel
pnpm dev          # Desarrollo (http://localhost:5173)
pnpm build        # Build producción
pnpm preview      # Preview del build
pnpm lint         # ESLint
```

---

## 🔐 Seguridad

- ✅ Variables de entorno para secrets
- ✅ Autenticación JWT con Supabase Auth
- ✅ Row Level Security (RLS) para multi-tenant
- ✅ 12 policies RLS en todas las tablas
- ✅ CORS configurado
- ✅ Sesiones persistentes y seguras
- ✅ Validación de webhooks de Mercado Pago

---

## 📈 Performance

- ✅ SSG para páginas estáticas
- ✅ SSR para contenido dinámico
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Caché en múltiples niveles
- ✅ Vistas pre-calculadas en Supabase
- ✅ 11 índices de base de datos

---

## 🎯 Estado Actual del Proyecto

### ✅ Completado (87%)

**Frontend (Tienda E-commerce)**:
- [x] Estructura base del proyecto
- [x] Sistema de temas dinámicos
- [x] Catálogo de productos
- [x] Carrito de compras persistente
- [x] Detección multi-tenant automática
- [x] Layouts principales (Header, Footer, Navigation)
- [x] Sistema de filtros y búsqueda
- [x] Home completo con banner carousel
- [x] Responsive mobile

**Backend (Supabase)**:
- [x] Migración completa de Strapi a Supabase
- [x] Schema PostgreSQL con 4 tablas
- [x] Row Level Security (12 policies)
- [x] 5 vistas optimizadas
- [x] 11 índices de performance
- [x] Seed data inicial

**Admin Panel**:
- [x] Fase 0: Setup Inicial
- [x] Fase 1: Supabase Setup
- [x] Fase 2: Autenticación
- [x] Fase 3: Layout y Navegación
- [x] Fase 4: Dashboard con Métricas
- [x] Fase 5: Gestión de Pedidos
- [x] Fase 6: Gestión de Temas
- [x] Fase 7: Configuración de Sitio

### 🚧 En Desarrollo

- 🚧 **Checkout con Mercado Pago** (frontend)
  - API Routes
  - Webhooks
  - Páginas de resultado

### ⏳ Pendiente (13%)

- [ ] Fase 8: Testing y Deploy (Admin Panel)
- [ ] Autenticación de usuarios (Frontend)
- [ ] Dashboard de usuario (Frontend)
- [ ] Emails transaccionales
- [ ] Testing E2E completo
- [ ] Deploy en producción

---

## 🏗️ Próximos Pasos Inmediatos

1. ✅ **Componentes de productos** - COMPLETADO
2. ✅ **Carrito de compras** - COMPLETADO
3. ✅ **Migración a Supabase** - COMPLETADO
4. ✅ **Admin Panel Fases 2-7** - COMPLETADO
5. 🚧 **Checkout con Mercado Pago** - EN DESARROLLO
6. ⏳ **Testing manual del admin panel** - SIGUIENTE
7. ⏳ **Deploy admin panel en Cloudflare Pages** - SIGUIENTE
8. ⏳ **Deploy frontend en producción** - SIGUIENTE

---

## 📝 Migración Strapi → Supabase

**Completada exitosamente** ✅

- Migración de todas las tablas a PostgreSQL
- Implementación de RLS para multi-tenant
- Variables de entorno obsoletas (STRAPI_URL) en frontend pueden eliminarse
- Archivos de migración SQL disponibles en `/docs`

---

## 📚 Documentación Completa

### Panel Administrativo
- 📖 [Panel Administrativo - Guía Completa](/docs/PANEL_ADMIN_GUIA.md)
- 📖 [Supabase Schema y RLS Policies](/docs/SUPABASE_SCHEMA.md)

### Deployment y Configuración
- 📖 [Deployment en Cloudflare Pages (Frontend)](/docs/DEPLOYMENT_CLOUDFLARE.md)
- 📖 [Configuración Multi-Dominio](/docs/DOMAIN_SETUP.md)

### Arquitectura
- 📖 [Arquitectura Multi-Tenant](/docs/MULTI_TENANT_ARCHITECTURE.md)
- 📖 [API Reference](/docs/API_REFERENCE.md)

---

## 📄 Licencia

Propietario - Todos los derechos reservados

---

**Versión**: 0.8.7 (Beta) - Panel Admin Fase 7 completada - 87% del proyecto
**Última actualización**: 2025-11-25
