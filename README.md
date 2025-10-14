# Quality E-commerce - Plataforma Multi-Tenant SaaS

**Plataforma e-commerce multi-tenant para servir 400+ tiendas online con una sola infraestructura**

Arquitectura SaaS construida con Astro.js, Supabase, y Mercado Pago.

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
│  • Detecta tenant por hostname                   │
│  • Carga configuración del tenant                │
│  • Aplica branding dinámico                      │
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
│  • Dashboard con métricas                        │
│  • Configuración de temas                        │
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

---

## 🚀 Características Principales

### Core Features
- ✅ **Multi-Tenant SaaS** con aislamiento completo de datos
- ✅ **White-Label** completo (cada cliente con su branding)
- ✅ **Multi-Dominio** (subdominios + custom domains)
- ✅ **Tokens dinámicos** (Quality API + Mercado Pago por tenant)
- ✅ **Configuración regional** (IVA, moneda, país por tenant)

### Frontend (Tienda E-commerce)
- ✅ **Astro.js 5.x** con SSR híbrido
- ✅ **Tailwind CSS 4.x** con variables CSS dinámicas
- ✅ **Sistema de temas dinámicos** por tenant
- ✅ **Detección automática de tenant** por hostname
- ✅ **TypeScript strict** en todo el proyecto
- ✅ **Carrito de compras** con Nanostores y persistencia
- ✅ **Responsive y optimizado** para móviles

### Backend (Supabase)
- ✅ **PostgreSQL** con Row Level Security (RLS)
- ✅ **Supabase Auth** con JWT y sesiones persistentes
- ✅ **Aislamiento multi-tenant** automático vía RLS policies
- ✅ **Vistas optimizadas** (orders_summary, top_products, daily_revenue)
- ✅ **Índices de performance** en tablas críticas
- ✅ **Triggers automáticos** para updated_at

### Panel Administrativo
- ✅ **React 19** + **Vite 7** + **TypeScript**
- ✅ **Autenticación completa** (Fase 2 ✅)
- ✅ **Shadcn/ui** para componentes modernos
- ✅ **React Router 7** para navegación
- ✅ **TanStack Query** para data fetching
- 🚧 **Dashboard con métricas** (Fase 4)
- 🚧 **Gestión de pedidos** (Fase 5)
- 🚧 **Configuración de temas** (Fase 6)

### Integraciones
- ✅ **Quality API** (backend contable existente) con tokens dinámicos
- ✅ **Mercado Pago Multi-Tenant** con tokens por cliente
- ✅ **Cloudflare CDN** global con SSL automático

---

## 📁 Estructura del Proyecto

```
quality_ecommerce/
├── frontend/                    # Astro.js (Tienda E-commerce)
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── theme/         # Sistema de temas
│   │   │   ├── products/      # Componentes de productos
│   │   │   ├── cart/          # Carrito de compras
│   │   │   ├── checkout/      # Proceso de checkout
│   │   │   ├── seo/           # Componentes SEO
│   │   │   └── layout/        # Header, Footer, Navigation
│   │   ├── layouts/           # Layouts de páginas
│   │   ├── pages/             # Páginas y rutas
│   │   │   ├── index.astro    # Home
│   │   │   ├── productos/     # Catálogo
│   │   │   └── checkout/      # Checkout y resultados
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Utilidades
│   │   │   ├── api/          # Clientes API
│   │   │   ├── cache/        # Sistema de caché
│   │   │   └── theme/        # Gestión de temas
│   │   ├── stores/            # State management (Nanostores)
│   │   └── styles/            # CSS global
│   ├── public/                # Archivos estáticos
│   ├── astro.config.mjs       # Configuración de Astro
│   ├── tailwind.config.mjs    # Configuración de Tailwind
│   ├── tsconfig.json          # Configuración de TypeScript
│   ├── package.json           # Dependencias
│   └── .env.example           # Variables de entorno de ejemplo
│
├── admin-panel/                # Panel Administrativo (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   └── card.tsx
│   │   │   └── auth/          # Componentes de autenticación
│   │   │       ├── AuthProvider.tsx
│   │   │       ├── LoginForm.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── pages/             # Páginas de la app
│   │   │   ├── LoginPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── lib/               # Utilidades
│   │   │   ├── supabase.ts   # Cliente de Supabase
│   │   │   └── utils.ts      # Helpers (cn, formatDate)
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useAuth.ts
│   │   ├── types/             # TypeScript types
│   │   │   ├── user.ts
│   │   │   └── index.ts
│   │   ├── App.tsx            # Router principal
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globales
│   ├── vite.config.ts         # Configuración de Vite
│   ├── tailwind.config.js     # Configuración de Tailwind
│   ├── components.json        # Configuración de Shadcn/ui
│   ├── tsconfig.json          # Configuración de TypeScript
│   ├── package.json           # Dependencias
│   └── .env.local             # Variables de entorno
│
├── docs/                       # Documentación
│   ├── PANEL_ADMIN_GUIA.md    # Guía completa del panel admin
│   ├── SUPABASE_SCHEMA.md     # Schema de Supabase y RLS
│   └── ...
└── README.md                   # Este archivo
```

---

## 🛠️ Stack Tecnológico

### Frontend (Tienda E-commerce)
- **Astro.js 5.x** - Framework web moderno
- **Tailwind CSS 4.x** - Framework CSS utility-first
- **TypeScript** - Tipado estático
- **Nanostores** - State management ligero
- **Zod** - Validación de esquemas
- **node-cache** - Sistema de caché en memoria
- **Mercado Pago SDK** - Integración de pagos

### Panel Administrativo
- **React 19** - Library UI moderna
- **Vite 7** - Build tool ultra-rápido
- **TypeScript** - Type safety (strict mode)
- **React Router 7** - Routing con data loaders
- **TanStack Query 5** - Data fetching + cache
- **Zod** - Validación de schemas
- **Shadcn/ui** - Componentes UI (Radix + Tailwind)
- **Tailwind CSS 4** - Utility CSS
- **Lucide React** - Iconos modernos
- **Recharts** (próximamente) - Gráficos para dashboard

### Backend (Supabase)
- **PostgreSQL 17** - Base de datos relacional
- **Row Level Security (RLS)** - Aislamiento multi-tenant
- **Supabase Auth** - Autenticación JWT
- **Supabase Client** - SDK para React/Astro
- **Vistas Materializadas** - Performance optimizada
- **Triggers** - Automatización (updated_at)

### Infraestructura Multi-Tenant
- **Cloudflare Pages** - Frontend Astro + Panel Admin (gratis, ilimitado)
- **Supabase** - PostgreSQL + Auth + RLS ($0-25/mes según uso)
- **Cloudflare DNS** - Multi-dominio con SSL automático
- **Mercado Pago** - Pasarela de pagos (tokens dinámicos por tenant)

---

## 🎛️ Panel Administrativo

### ¿Qué es?

Panel administrativo **custom** para gestionar la plataforma multi-tenant Quality E-commerce. Reemplaza Strapi con una solución más simple, rápida y económica.

### Ventajas vs Strapi

| Strapi Admin | Panel Custom |
|--------------|--------------|
| 1500+ líneas código backend | ~500 líneas React |
| $85/mes (Railway + PostgreSQL) | $25/mes (Supabase) |
| Lento y pesado | Rápido y ligero |
| Difícil de personalizar | 100% personalizable |
| Multi-tenant complejo | Multi-tenant simple (RLS) |

### Stack Tecnológico

- **React 19** + **Vite 7** + **TypeScript 5**
- **Supabase** (PostgreSQL + Auth)
- **Shadcn/ui** (Radix UI + Tailwind CSS)
- **React Router 7** para navegación
- **TanStack Query 5** para data fetching
- **Zod** para validación

### Funcionalidades Implementadas

#### ✅ Fase 2: Autenticación (COMPLETADA)
- ✅ Login con email + password
- ✅ Logout funcional
- ✅ Persistencia de sesión (JWT en localStorage)
- ✅ Protección de rutas (ProtectedRoute)
- ✅ Validación de formularios con Zod
- ✅ Manejo de errores de autenticación
- ✅ UI moderna con Shadcn/ui
- ✅ TypeScript type-safe

#### 🚧 Fase 3: Layout y Navegación (Pendiente)
- Sidebar con navegación
- Header con usuario + logout
- Responsive mobile menu
- Breadcrumbs

#### 🚧 Fase 4: Dashboard con Métricas (Pendiente)
- Total de pedidos (hoy, semana, mes)
- Revenue total por período
- Productos más vendidos (top 5)
- Gráfico de ventas por día
- Pedidos pendientes

#### 🚧 Fase 5: Gestión de Pedidos (Pendiente)
- Lista de pedidos con paginación
- Filtros por estado y fecha
- Ver detalles de pedido
- Cambiar estado de pedido
- Export CSV

### Credenciales de Supabase

```env
VITE_SUPABASE_URL=https://lcojyculicexqcpugrdf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Credenciales de Acceso al Panel Admin

**Usuario de Prueba**:
```
Email: admin@demo1.com
Password: AdminDemo123!
URL Local: http://localhost:5173
Tenant: Tienda Demo 1 (demo1)
```

**Nota**: El usuario fue creado usando el método oficial de Supabase Dashboard (Authentication > Users > Add user). Este es el método correcto que garantiza compatibilidad con `signInWithPassword()`.

### Instalación y Uso

```bash
# Ir al directorio del panel admin
cd admin-panel

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con credenciales de Supabase

# Iniciar servidor de desarrollo
pnpm dev
# Abre http://localhost:5173

# Build para producción
pnpm build
```

### Documentación Completa

Para más detalles sobre el panel administrativo, consulta:
- 📖 **[Panel Administrativo - Guía Completa](/docs/PANEL_ADMIN_GUIA.md)**
- 📖 **[Supabase Schema y RLS Policies](/docs/SUPABASE_SCHEMA.md)**

---

## 📦 Instalación

### Prerrequisitos
- Node.js >= 18.x
- pnpm >= 8.x
- Cuenta de Supabase (gratis)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/quality_ecommerce.git
cd quality_ecommerce
```

### 2. Instalar dependencias del Frontend (Tienda)
```bash
cd frontend
pnpm install
```

### 3. Configurar variables de entorno del Frontend
```bash
cp .env.example .env
```

Edita `.env` y configura:
- `PUBLIC_API_CONTABLE_URL` - URL de tu API contable
- `PUBLIC_SITE_URL` - URL pública de tu sitio
- `MP_ACCESS_TOKEN` - Access Token de Mercado Pago

### 4. Instalar dependencias del Panel Admin
```bash
cd ../admin-panel
pnpm install
```

### 5. Configurar variables de entorno del Panel Admin
```bash
cp .env.example .env.local
```

Edita `.env.local` con las credenciales de Supabase:
- `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- `VITE_SUPABASE_ANON_KEY` - Anon Key de Supabase

### 6. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el schema SQL desde `docs/supabase_migration_part1.sql` y `part2.sql`
3. Habilita Email Provider en Authentication > Settings
4. Crea un usuario de prueba en Supabase Dashboard:
   - Email: `admin@demo1.com`
   - Password: (tu contraseña segura)

### 7. Iniciar servidores de desarrollo

**Terminal 1 - Frontend (Tienda):**
```bash
cd frontend
pnpm dev
# Abre http://localhost:4321
```

**Terminal 2 - Panel Admin:**
```bash
cd admin-panel
pnpm dev
# Abre http://localhost:5173
```

---

## 🎨 Sistema de Temas

El proyecto incluye un sistema de temas dinámicos almacenados en Supabase.

### Temas Incluidos
1. **Default** - Tema principal con colores azul/morado
2. **Black Friday** - Tema oscuro con rojo y amarillo
3. **Navidad** - Tema festivo con rojo y verde

### Cómo Funciona
- Los temas se almacenan en la tabla `themes` de Supabase
- El `ThemeProvider` inyecta CSS Variables dinámicamente
- Tailwind CSS consume estas variables para estilizar componentes
- Los cambios se reflejan inmediatamente sin rebuild

---

## 💳 Mercado Pago

### Configuración
1. Crea una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Obtén tus credenciales de prueba y producción
3. Configura las URLs de retorno en `.env`:
   - `PUBLIC_SITE_URL` - URL pública de tu sitio (debe ser HTTPS)

### Flujo de Pago
1. Usuario completa el checkout
2. Se crea una preferencia de Mercado Pago
3. Usuario es redirigido a Mercado Pago
4. Webhook confirma el pago
5. Usuario retorna a página de éxito/pendiente/error

---

## 📊 Tipos TypeScript

El proyecto incluye tipado completo para:
- `Product` - Productos del catálogo
- `ProductCategory` - Categorías
- `Theme` - Configuración de temas
- `SiteConfig` - Configuración del sitio
- `Cart` - Carrito de compras
- `Order` - Pedidos
- `User` - Usuarios (Supabase Auth)

Ver `frontend/src/types/` y `admin-panel/src/types/` para todos los tipos disponibles.

---

## 🚀 Despliegue Multi-Tenant

### Guías Completas

Hemos creado guías paso a paso para el deployment de la arquitectura multi-tenant:

- 📖 **[Deployment en Cloudflare Pages (Frontend)](/docs/DEPLOYMENT_CLOUDFLARE.md)** - Astro SSR
- 📖 **[Configuración Multi-Dominio](/docs/DOMAIN_SETUP.md)** - DNS y SSL para múltiples clientes
- 📖 **[Onboarding de Clientes](/docs/CLIENT_ONBOARDING.md)** - Proceso completo de agregar un nuevo cliente

### Quick Start - Deployment

#### 1. Frontend (Cloudflare Pages)
```bash
# Sigue la guía completa en /docs/DEPLOYMENT_CLOUDFLARE.md

1. Crear proyecto en Cloudflare Pages
2. Conectar GitHub repo (carpeta: frontend)
3. Configurar build: pnpm build (output: dist)
4. Configurar variables de entorno
5. Deploy automático ✓
```

#### 2. Panel Admin (Cloudflare Pages)
```bash
# Similar al frontend, pero con carpeta: admin-panel

1. Crear proyecto en Cloudflare Pages
2. Conectar GitHub repo (carpeta: admin-panel)
3. Configurar build: pnpm build (output: dist)
4. Configurar variables de entorno (Supabase)
5. Deploy automático ✓
```

#### 3. Multi-Dominio
```bash
# Sigue la guía completa en /docs/DOMAIN_SETUP.md

1. Configurar wildcard DNS: *.miapp.com → cloudflare pages
2. Agregar dominios custom de clientes
3. SSL automático por Cloudflare
```

### Costos de Infraestructura

| Tenants | Infraestructura | Costo/mes | Por Tenant |
|---------|-----------------|-----------|------------|
| 1-100 | Supabase Free + Cloudflare Free | $0 | $0 |
| 100-400 | Supabase Pro + Cloudflare Free | $25 | $0.06 |
| 400+ | Supabase Pro + Cloudflare Pro | $45 | $0.08 |

**Ahorro vs arquitectura tradicional**: 96% ($2000/mes → $45/mes para 400 tenants)

---

## 📝 Scripts Disponibles

### Frontend (Tienda)
```bash
cd frontend
pnpm dev          # Servidor de desarrollo
pnpm build        # Build para producción
pnpm preview      # Preview del build
```

### Panel Admin
```bash
cd admin-panel
pnpm install      # Instalar dependencias
pnpm dev          # Servidor de desarrollo (http://localhost:5173)
pnpm build        # Build para producción
pnpm preview      # Preview del build
```

---

## 🔐 Seguridad

- ✅ Variables de entorno para secrets
- ✅ Validación de webhooks de Mercado Pago
- ✅ Autenticación JWT con Supabase Auth
- ✅ Row Level Security (RLS) para multi-tenant
- ✅ Políticas RLS en todas las tablas
- ✅ CORS configurado
- ✅ Sesiones persistentes y seguras

---

## 📈 Performance

- ✅ SSG para páginas estáticas
- ✅ SSR para contenido dinámico
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Caché agresivo de datos
- ✅ Vistas optimizadas en Supabase
- ✅ Índices de base de datos

---

## 🔧 Notas Técnicas y Troubleshooting

### Panel Administrativo

#### ✅ Creación de Usuarios Admin

**Método CORRECTO**: Usar el Dashboard de Supabase o `supabase.auth.admin.createUser()`

**❌ NO hacer**: Insertar directamente en `auth.users` con SQL manual (causa error "Database error querying schema")

**Pasos verificados para crear usuarios**:
1. Ir a Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Llenar email, password, activar "Auto Confirm User"
4. Agregar User Metadata JSON con `tenant_id`
5. El usuario funcionará correctamente con `signInWithPassword()`

**Error común**: Si intentas crear usuarios manualmente con `INSERT INTO auth.users`, obtendrás un error 500 "Database error querying schema" al hacer login. Esto sucede porque Supabase Auth requiere campos internos específicos que solo se configuran correctamente usando los métodos oficiales.

---

## 📄 Licencia

Propietario - Todos los derechos reservados

---

## 📚 Documentación Completa

### Panel Administrativo
- 📖 [Panel Administrativo - Guía Completa](/docs/PANEL_ADMIN_GUIA.md)
- 📖 [Migración de Strapi a Supabase](/docs/SUPABASE_MIGRATION.md)
- 📖 [Supabase Schema y RLS Policies](/docs/SUPABASE_SCHEMA.md)

### Deployment y Configuración
- 📖 [Deployment en Cloudflare Pages (Frontend)](/docs/DEPLOYMENT_CLOUDFLARE.md)
- 📖 [Configuración Multi-Dominio](/docs/DOMAIN_SETUP.md)
- 📖 [Onboarding de Clientes](/docs/CLIENT_ONBOARDING.md)

### Arquitectura y API
- 📖 [Arquitectura Multi-Tenant (Detallada)](/docs/MULTI_TENANT_ARCHITECTURE.md)
- 📖 [API Reference](/docs/API_REFERENCE.md)
- 📖 [Testing Multi-Tenant](/docs/TESTING_MULTI_TENANT.md)

### Progreso del Proyecto
- 📊 [Implementation Progress](/IMPLEMENTATION_PROGRESS.md) - Roadmap y estado actual

---

## 🎯 Estado Actual del Proyecto

### ✅ Completado

**Tienda E-commerce (Frontend):**
- [x] Estructura base del proyecto
- [x] Configuración de Astro + Tailwind
- [x] Sistema de tipos TypeScript completo
- [x] Cliente API contable con caché
- [x] Sistema de temas dinámicos
- [x] Componentes de productos (ProductCard, ProductGrid, ProductCarousel)
- [x] Páginas del catálogo (index, productos, producto individual)
- [x] Carrito de compras completo (CartDrawer, CartItem, persistencia)
- [x] Sistema de toasts
- [x] Layouts principales (Header, Footer, Navigation, MobileMenu)
- [x] Sistema de filtros (CategorySidebar con rango de precio)
- [x] Búsqueda (SearchModal)
- [x] Scroll infinito (ProductsWithInfiniteScroll)
- [x] Home completo (BannerCarousel, beneficios, medios de pago)

**Backend (Supabase):**
- [x] Migración de Strapi a Supabase
- [x] Schema de PostgreSQL con 4 tablas (themes, tenants, orders, site_config)
- [x] Row Level Security (RLS) - 12 policies
- [x] Vistas optimizadas (orders_summary, top_products, daily_revenue, etc.)
- [x] Índices de performance (11 índices)
- [x] Triggers automáticos (updated_at)
- [x] Seed data inicial

**Panel Administrativo:**
- [x] **Fase 0: Setup Inicial** ✅
  - Proyecto Vite + React + TypeScript
  - Tailwind CSS 4 + Shadcn/ui
  - Path aliases configurados
- [x] **Fase 1: Supabase Setup** ✅
  - Base de datos creada y funcional
  - RLS policies implementadas
  - Vistas y triggers configurados
- [x] **Fase 2: Autenticación** ✅ FUNCIONAL
  - Cliente de Supabase configurado
  - AuthProvider con Context de React
  - LoginForm con validación Zod
  - ProtectedRoute para rutas privadas
  - useAuth custom hook
  - LoginPage y DashboardPage
  - React Router 7 configurado
  - TanStack Query 5 configurado
  - Build de producción exitoso
  - ✅ Usuario admin creado correctamente (admin@demo1.com)
  - ✅ Login funcional verificado
  - ✅ Dashboard accesible
  - ✅ Logout funcional

### 🚧 En Desarrollo

**Panel Administrativo:**
- [ ] **Fase 3: Layout y Navegación** (Siguiente)
  - AppLayout con sidebar + header
  - Sidebar con navegación
  - Header con usuario + logout
  - Responsive mobile menu

**Tienda E-commerce:**
- [x] **Checkout y Mercado Pago** (En progreso)
  - [ ] API Routes para crear preferencias
  - [ ] Webhooks de Mercado Pago
  - [ ] Página de checkout con formulario
  - [ ] Páginas de resultado (success, pending, failure)
  - [ ] Store de órdenes

### 📋 Pendiente (Prioridad Media-Baja)

**Panel Administrativo:**
- [ ] **Fase 4: Dashboard con Métricas**
  - Métricas de pedidos y revenue
  - Gráficos con Recharts
  - Top productos
- [ ] **Fase 5: Gestión de Pedidos**
  - Lista de pedidos con paginación
  - Filtros por estado y fecha
  - Ver detalles de pedido
  - Cambiar estado de pedido
  - Export CSV
- [ ] **Fase 6: Gestión de Temas**
  - Lista de temas
  - Activar/desactivar temas
  - Preview de temas
- [ ] **Fase 7: Configuración de Sitio**
  - Editar configuración del tenant
  - Contacto, redes sociales, IVA

**Tienda E-commerce:**
- [ ] Componentes SEO (Schema.org, sitemap dinámico)
- [ ] Autenticación de usuarios (login/registro)
- [ ] Dashboard de usuario con historial de pedidos
- [ ] Emails transaccionales
- [ ] Testing (Unit + E2E)

---

## 🏗️ Próximos Pasos Inmediatos

1. ✅ ~~Componentes de productos~~ **COMPLETADO**
2. ✅ ~~Carrito de compras~~ **COMPLETADO**
3. ✅ ~~Páginas del catálogo~~ **COMPLETADO**
4. ✅ ~~Migración a Supabase~~ **COMPLETADO**
5. ✅ ~~Panel Admin - Fase 2: Autenticación~~ **COMPLETADO Y VERIFICADO** ✅
6. 🚧 **Panel Admin - Fase 3: Layout y Navegación** (Siguiente - LISTO PARA EMPEZAR)
7. **Panel Admin - Fase 4: Dashboard con métricas**
8. **Panel Admin - Fase 5: Gestión de pedidos**
9. **Completar integración checkout con Mercado Pago**
10. Implementar autenticación de usuarios en tienda
11. Testing y optimización
12. Despliegue a producción

---

**Versión:** 0.3.1 (Beta) - Panel Admin Fase 2 completada y verificada
**Última actualización:** 2025-10-14
