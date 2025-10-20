# Panel Administrativo - Quality E-commerce

Panel de administración para la plataforma multi-tenant Quality E-commerce.

## Stack Tecnológico

- **React 19** + **TypeScript 5**
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Componentes UI
- **Supabase** - Backend (PostgreSQL + Auth)
- **React Router 7** - Navegación
- **TanStack Query 5** - Data fetching
- **Recharts 3** - Gráficos y visualizaciones

## Instalación

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar servidor de desarrollo
pnpm dev
```

## Credenciales de Prueba

### Usuario Admin
```
Email: admin@demo1.com
Password: AdminDemo123!
Tenant: Tienda Demo 1 (demo1)
```

### Supabase
```
URL: https://lcojyculicexqcpugrdf.supabase.co
Project: Ecommerciante
Region: us-east-1
```

## Scripts

```bash
pnpm dev          # Servidor desarrollo (http://localhost:5173)
pnpm build        # Build producción
pnpm preview      # Preview del build
pnpm lint         # ESLint
```

## Estructura del Proyecto

```
src/
├── components/
│   ├── ui/              # Componentes Shadcn/ui ✅
│   │   ├── button.tsx, card.tsx, table.tsx, sheet.tsx
│   │   ├── dialog.tsx, select.tsx, input.tsx, badge.tsx   # ✅ Nuevos
│   │   ├── sidebar.tsx        # Sidebar colapsable oficial de Shadcn ✅
│   │   ├── tooltip.tsx        # Para tooltips en íconos del sidebar
│   │   └── skeleton.tsx       # Loading states
│   ├── auth/            # Autenticación (AuthProvider, LoginForm, ProtectedRoute) ✅
│   ├── layout/          # Layout (AppLayout, AppSidebar, Header, MobileMenu) ✅
│   ├── dashboard/       # Dashboard components ✅
│   │   ├── stats-cards.tsx        # Cards de métricas
│   │   ├── revenue-chart.tsx      # Gráfico de revenue
│   │   └── top-products-table.tsx # Tabla de top productos
│   └── orders/          # Orders components ✅ NUEVO
│       ├── order-status-badge.tsx # Badge de estados
│       ├── order-filters.tsx      # Filtros y búsqueda
│       ├── orders-table.tsx       # Tabla de pedidos
│       └── order-details.tsx      # Modal de detalles
├── pages/               # Páginas
│   ├── LoginPage.tsx        # Login ✅
│   ├── DashboardPage.tsx    # Dashboard principal ✅
│   ├── OrdersPage.tsx       # Gestión de pedidos ✅ COMPLETO
│   ├── ThemesPage.tsx       # Gestión de temas (placeholder)
│   └── SettingsPage.tsx     # Configuración (placeholder)
├── lib/                 # Utilidades
│   ├── supabase.ts     # Cliente Supabase ✅
│   └── utils.ts        # Helpers (cn, formatDate) ✅
├── hooks/               # Custom hooks
│   ├── useAuth.ts           # Hook de autenticación ✅
│   ├── use-mobile.ts        # Hook para detectar mobile ✅
│   ├── useOrdersStats.ts    # Hook para métricas de pedidos ✅
│   ├── useRevenueChart.ts   # Hook para datos del gráfico ✅
│   ├── useTopProducts.ts    # Hook para top productos ✅
│   ├── useOrders.ts         # Hook para pedidos con filtros ✅ NUEVO
│   └── useOrderMutation.ts  # Hook para actualizar pedidos ✅ NUEVO
├── types/               # TypeScript types
│   ├── user.ts          # Types de usuario ✅
│   ├── dashboard.ts     # Types del dashboard ✅
│   ├── order.ts         # Types de pedidos ✅ NUEVO
│   └── index.ts
└── App.tsx              # Router principal con todas las rutas ✅
```

## Estado del Proyecto

### ✅ Fase 0: Setup Inicial
- Proyecto Vite + React + TypeScript
- Tailwind CSS 4 + Shadcn/ui
- Path aliases configurados

### ✅ Fase 1: Supabase Setup
- Base de datos creada y funcional
- RLS policies implementadas
- Vistas y triggers configurados

### ✅ Fase 2: Autenticación
- Cliente de Supabase configurado
- AuthProvider con Context
- LoginForm con validación Zod
- ProtectedRoute para rutas privadas
- useAuth custom hook
- Usuario de prueba creado

### ✅ Fase 3: Layout y Navegación
- ✅ AppLayout con sidebar + header integrados
- ✅ Sidebar con navegación y rutas activas
- ✅ Header con avatar, dropdown menu y logout
- ✅ Responsive mobile menu con Sheet de Shadcn
- ✅ **ACTUALIZADO**: Sidebar colapsable con componentes oficiales de Shadcn ✨
  - Sidebar oficial con `collapsible="icon"` (colapsa a solo íconos)
  - `SidebarProvider` con `defaultOpen={false}` (inicia colapsado)
  - `SidebarTrigger` en el header para toggle
  - Tooltips automáticos cuando está colapsado
  - Persistencia en localStorage (Shadcn)
  - Responsive automático (desktop colapsable, mobile Sheet)
- ✅ Páginas placeholder (Orders, Themes, Settings)
- ✅ Navegación completa entre secciones
- ✅ Build de producción exitoso
- ✅ Componentes Shadcn: sheet, avatar, dropdown-menu, separator, **sidebar, tooltip, skeleton**

### ✅ Fase 4: Dashboard con Métricas
- ✅ React Query configurado y funcionando
- ✅ Recharts instalado para gráficos
- ✅ TypeScript types para dashboard (OrdersSummary, DailyRevenue, TopProduct)
- ✅ Custom hooks de data fetching:
  - `useOrdersStats()` - Métricas generales desde `orders_summary`
  - `useRevenueChart()` - Datos del gráfico desde `daily_revenue`
  - `useTopProducts()` - Top 5 productos desde `top_products`
- ✅ Componentes del dashboard:
  - `DashboardStats` - 4 cards con métricas (total pedidos, revenue, pendientes, valor promedio)
  - `RevenueChart` - Gráfico de línea con Recharts (últimos 7 días)
  - `TopProductsTable` - Tabla con top 5 productos más vendidos
- ✅ Loading states y error handling en todos los componentes
- ✅ Formateo de moneda (COP) y fechas en español
- ✅ Componentes Shadcn: table
- ✅ Build de producción exitoso (939 KB con sidebar colapsable)

### ✅ Fase 5: Gestión de Pedidos
- ✅ Sistema completo de gestión de pedidos implementado
- ✅ TypeScript types para Order, OrderStatus, OrderFilters
- ✅ Custom hooks:
  - `useOrders()` - Fetching con filtros y paginación
  - `useOrderMutation()` - Actualización de estados
- ✅ Componentes implementados:
  - `OrderStatusBadge` - Badge con colores por estado
  - `OrderFilters` - Buscador y filtro por estado
  - `OrdersTable` - Tabla responsive con paginación
  - `OrderDetails` - Modal completo con detalles y cambio de estado
- ✅ Funcionalidades:
  - Lista de pedidos con paginación (20 por página)
  - Filtro por estado (pending, processing, completed, cancelled)
  - Búsqueda por cliente o email
  - Modal de detalles con información completa del pedido
  - Cambio de estado inline con actualización automática
  - Formateo de moneda y fechas
  - Loading states y error handling completos
- ✅ Componentes Shadcn: dialog, select (además de los anteriores)
- ✅ Build de producción exitoso (1.07 MB)

### ⏳ Pendiente
- Fase 6: Gestión de temas
- Fase 7: Configuración de sitio
- Fase 8: Testing y Deploy

## Documentación

Para más información, consulta:
- [Guía Completa del Panel Admin](/docs/PANEL_ADMIN_GUIA.md)
- [Schema de Supabase](/docs/SUPABASE_SCHEMA.md)
- [README Principal del Proyecto](../README.md)

## Licencia

Propietario - Todos los derechos reservados
