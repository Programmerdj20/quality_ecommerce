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
│   ├── ui/              # Componentes Shadcn/ui (button, card, sheet, etc)
│   ├── auth/            # Autenticación (AuthProvider, LoginForm, ProtectedRoute)
│   └── layout/          # Layout (AppLayout, Sidebar, Header, MobileMenu) ✅
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
│   └── useAuth.ts      # Hook de autenticación
├── types/               # TypeScript types
│   ├── user.ts
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
- ✅ Páginas placeholder (Orders, Themes, Settings)
- ✅ Navegación completa entre secciones
- ✅ Build de producción exitoso
- ✅ Componentes Shadcn: sheet, avatar, dropdown-menu, separator

### ⏳ Pendiente
- Fase 4: Dashboard con métricas
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
