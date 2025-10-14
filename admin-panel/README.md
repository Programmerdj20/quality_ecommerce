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
│   ├── ui/              # Componentes Shadcn/ui
│   ├── auth/            # Autenticación (AuthProvider, LoginForm, etc)
│   └── layout/          # Layout (Sidebar, Header, etc) [Fase 3]
├── pages/               # Páginas
│   ├── LoginPage.tsx
│   └── DashboardPage.tsx
├── lib/                 # Utilidades
│   ├── supabase.ts     # Cliente Supabase
│   └── utils.ts        # Helpers
├── hooks/               # Custom hooks
│   └── useAuth.ts
├── types/               # TypeScript types
└── App.tsx              # Router principal
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

### 🚧 Fase 3: Layout y Navegación (En progreso)
- AppLayout con sidebar + header
- Sidebar con navegación
- Header con usuario + logout
- Responsive mobile menu

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
