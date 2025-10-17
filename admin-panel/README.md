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
│   │   ├── sidebar.tsx        # Sidebar colapsable oficial de Shadcn ✅
│   │   ├── tooltip.tsx        # Para tooltips en íconos del sidebar
│   │   └── skeleton.tsx       # Loading states
│   ├── auth/            # Autenticación (AuthProvider, LoginForm, ProtectedRoute)
│   ├── layout/          # Layout (AppLayout, AppSidebar, Header, MobileMenu) ✅
│   └── dashboard/       # Dashboard components ✅
│       ├── DashboardStats.tsx     # Cards de métricas
│       ├── RevenueChart.tsx       # Gráfico de revenue
│       └── TopProductsTable.tsx   # Tabla de top productos
├── pages/               # Páginas
│   ├── LoginPage.tsx        # Login
│   ├── DashboardPage.tsx    # Dashboard principal ✅
│   ├── OrdersPage.tsx       # Gestión de pedidos (placeholder)
│   ├── ThemesPage.tsx       # Gestión de temas (placeholder)
│   └── SettingsPage.tsx     # Configuración (placeholder)
├── lib/                 # Utilidades
│   ├── supabase.ts     # Cliente Supabase
│   └── utils.ts        # Helpers (cn, formatDate)
├── hooks/               # Custom hooks
│   ├── useAuth.ts           # Hook de autenticación
│   ├── use-mobile.ts        # Hook para detectar mobile (Shadcn) ✅
│   ├── useOrdersStats.ts    # Hook para métricas de pedidos ✅
│   ├── useRevenueChart.ts   # Hook para datos del gráfico ✅
│   └── useTopProducts.ts    # Hook para top productos ✅
├── types/               # TypeScript types
│   ├── user.ts
│   ├── dashboard.ts    # Types del dashboard ✅
│   └── index.ts
└── App.tsx              # Router principal con todas las rutas
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

### ⏳ Pendiente
- Fase 5: Gestión de pedidos
- Fase 6: Gestión de temas
- Fase 7: Configuración de sitio

## Documentación

Para más información, consulta:
- [Guía Completa del Panel Admin](/docs/PANEL_ADMIN_GUIA.md)
- [Schema de Supabase](/docs/SUPABASE_SCHEMA.md)
- [README Principal del Proyecto](../README.md)

## Licencia

Propietario - Todos los derechos reservados
