# Quality E-commerce - Plataforma Multi-Tenant SaaS

**Plataforma e-commerce multi-tenant para servir 400+ tiendas online con una sola infraestructura**

Arquitectura SaaS construida con Astro.js, Strapi CMS multi-tenant, y Mercado Pago.

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
│  STRAPI BACKEND (Railway Multi-Tenant)           │
│  • Row-level isolation por tenant_id             │
│  • Middleware: tenant-resolver                   │
│  • Policy: tenant-isolation                      │
│  • PostgreSQL compartido                         │
└──────────────────────────────────────────────────┘
```

### Beneficios

| Sin Multi-Tenant | Con Multi-Tenant |
|------------------|------------------|
| 400 instancias separadas | 1 instancia compartida |
| $2000/mes de infraestructura | $75/mes de infraestructura |
| 400 deploys por cambio | 1 deploy para todos |
| Mantenimiento complejo | Mantenimiento centralizado |

**Costo por tenant**: $0.08 - $0.50/mes (vs $5/mes con infraestructura dedicada)

---

## 🚀 Características Principales

### Core Features
- ✅ **Multi-Tenant SaaS** con aislamiento completo de datos
- ✅ **White-Label** completo (cada cliente con su branding)
- ✅ **Multi-Dominio** (subdominios + custom domains)
- ✅ **Tokens dinámicos** (Quality API + Mercado Pago por tenant)
- ✅ **Configuración regional** (IVA, moneda, país por tenant)

### Frontend
- ✅ **Astro.js 4.x** con SSR híbrido
- ✅ **Tailwind CSS 4.x** con variables CSS dinámicas
- ✅ **Sistema de temas dinámicos** por tenant
- ✅ **Detección automática de tenant** por hostname
- ✅ **TypeScript strict** en todo el proyecto
- ✅ **Carrito de compras** con Nanostores y persistencia
- ✅ **Responsive y optimizado** para móviles

### Backend
- ✅ **Strapi 5.x Multi-Tenant** con aislamiento por policies
- ✅ **PostgreSQL** con row-level isolation
- ✅ **Middleware tenant-resolver** para detección
- ✅ **Policy tenant-isolation** para filtrado automático
- ✅ **API REST** con autenticación JWT

### Integraciones
- ✅ **Quality API** (backend contable existente) con tokens dinámicos
- ✅ **Mercado Pago Multi-Tenant** con tokens por cliente
- ✅ **Cloudflare CDN** global con SSL automático

## 📁 Estructura del Proyecto

```
quality_ecommerce/
├── frontend/                    # Astro.js
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── theme/         # Sistema de temas
│   │   │   ├── products/      # Componentes de productos
│   │   │   ├── cart/          # Carrito de compras
│   │   │   ├── seo/           # Componentes SEO
│   │   │   └── layout/        # Header, Footer, Navigation
│   │   ├── layouts/           # Layouts de páginas
│   │   ├── pages/             # Páginas y rutas
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Utilidades
│   │   │   ├── api/          # Clientes API
│   │   │   ├── cache/        # Sistema de caché
│   │   │   └── theme/        # Gestión de temas
│   │   └── styles/            # CSS global y temas
│   ├── public/                # Archivos estáticos
│   ├── astro.config.mjs       # Configuración de Astro
│   ├── tailwind.config.mjs    # Configuración de Tailwind
│   ├── tsconfig.json          # Configuración de TypeScript
│   ├── package.json           # Dependencias
│   └── .env.example           # Variables de entorno de ejemplo
│
├── backend/                    # Strapi CMS
│   ├── src/                   # Código fuente de Strapi
│   ├── config/                # Configuración de Strapi
│   ├── database/              # Migraciones y seeds
│   ├── package.json           # Dependencias
│   └── .env.example           # Variables de entorno de ejemplo
│
├── docs/                       # Documentación
└── README.md                   # Este archivo
```

## 🛠️ Stack Tecnológico

### Frontend
- **Astro.js 4.x** - Framework web moderno
- **Tailwind CSS 4.x** - Framework CSS utility-first
- **TypeScript** - Tipado estático
- **Nanostores** - State management ligero
- **Zod** - Validación de esquemas
- **node-cache** - Sistema de caché en memoria
- **Mercado Pago SDK** - Integración de pagos

### Backend
- **Strapi 5.x** - Headless CMS
- **PostgreSQL** - Base de datos (producción en Heroku)
- **Node.js** - Runtime

### Infraestructura Multi-Tenant
- **Cloudflare Pages** - Frontend Astro (gratis, ilimitado)
- **Railway** - Backend Strapi + PostgreSQL ($5-75/mes)
- **Cloudflare DNS** - Multi-dominio con SSL automático
- **Mercado Pago** - Pasarela de pagos (tokens dinámicos por tenant)

## 📦 Instalación

### Prerrequisitos
- Node.js >= 18.x
- pnpm >= 8.x
- PostgreSQL (para Strapi en producción)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/quality_ecommerce.git
cd quality_ecommerce
```

### 2. Instalar dependencias del Frontend
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
- `PUBLIC_API_CONTABLE_TOKEN` - Token de autenticación
- `PUBLIC_STRAPI_URL` - URL de Strapi (http://localhost:1337 en desarrollo)
- `PUBLIC_MP_PUBLIC_KEY` - Public Key de Mercado Pago
- `MP_ACCESS_TOKEN` - Access Token de Mercado Pago

### 4. Instalar y configurar Strapi (Backend)
```bash
cd ../backend
pnpm install
```

Configura `.env` del backend según `.env.example`

### 5. Iniciar servidores de desarrollo

**Terminal 1 - Frontend:**
```bash
cd frontend
pnpm dev
# Abre http://localhost:4321
```

**Terminal 2 - Backend (Strapi):**
```bash
cd backend
pnpm develop
# Abre http://localhost:1337/admin
```

## 🎨 Sistema de Temas

El proyecto incluye un sistema de temas dinámicos que permite cambiar la apariencia del sitio desde el panel de administración de Strapi.

### Temas Incluidos
1. **Default** - Tema principal con colores azul/morado
2. **Black Friday** - Tema oscuro con rojo y amarillo
3. **Navidad** - Tema festivo con rojo y verde

### Cómo Funciona
- Los temas se almacenan en Strapi
- El `ThemeProvider` inyecta CSS Variables dinámicamente
- Tailwind CSS consume estas variables para estilizar componentes
- Los cambios se reflejan inmediatamente sin rebuild

### Personalización
Desde el admin de Strapi puedes:
- Seleccionar tema activo
- Modificar paleta de colores
- Cambiar tipografías (Google Fonts)
- Gestionar banners hero

## 🔌 Integración con API Contable

El sistema está diseñado para integrarse con tu API contable existente que maneja:
- Productos y catálogo
- Inventario en tiempo real
- Precios y descuentos
- Imágenes de productos
- Categorías

### Estructura Esperada de la API

Ver `docs/API_CONTABLE_SCHEMA.md` para la estructura completa del JSON esperado.

### Datos Placeholder

Mientras configuras la integración, el sistema usa datos placeholder automáticamente:
- 6 productos de ejemplo
- 4 categorías
- Stock y precios ficticios

## 💳 Mercado Pago

### Configuración
1. Crea una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Obtén tus credenciales de prueba y producción
3. Configura las URLs de retorno en `.env`:
   - `PUBLIC_SITE_URL` - URL pública de tu sitio

### Flujo de Pago
1. Usuario completa el checkout
2. Se crea un pedido en Strapi (estado: pendiente)
3. Se genera una preferencia de Mercado Pago
4. Usuario es redirigido a Mercado Pago
5. Webhook confirma el pago
6. Pedido se actualiza (estado: pagado)

## 📊 Tipos TypeScript

El proyecto incluye tipado completo para:
- `Product` - Productos del catálogo
- `ProductCategory` - Categorías
- `Theme` - Configuración de temas
- `SiteConfig` - Configuración del sitio
- `Cart` - Carrito de compras
- `Order` - Pedidos
- `User` - Usuarios

Ver `frontend/src/types/` para todos los tipos disponibles.

## 🗂️ Sistema de Caché

El proyecto incluye un sistema de caché simple que reduce llamadas a APIs externas:

```typescript
import { cache, CACHE_KEYS, CACHE_TTL } from '@/utils/cache/simpleCache';

// Obtener o cachear datos
const products = await cache.getOrSet(
  CACHE_KEYS.PRODUCTS,
  async () => await fetchProducts(),
  CACHE_TTL.MEDIUM // 5 minutos
);
```

### TTL Configurados
- `SHORT`: 1 minuto
- `MEDIUM`: 5 minutos
- `LONG`: 10 minutos
- `VERY_LONG`: 1 hora

## 🚀 Despliegue Multi-Tenant

### Guías Completas

Hemos creado guías paso a paso para el deployment de la arquitectura multi-tenant:

- 📖 **[Deployment en Railway (Backend)](/docs/DEPLOYMENT_RAILWAY.md)** - Strapi + PostgreSQL
- 📖 **[Deployment en Cloudflare Pages (Frontend)](/docs/DEPLOYMENT_CLOUDFLARE.md)** - Astro SSR
- 📖 **[Configuración Multi-Dominio](/docs/DOMAIN_SETUP.md)** - DNS y SSL para múltiples clientes
- 📖 **[Onboarding de Clientes](/docs/CLIENT_ONBOARDING.md)** - Proceso completo de agregar un nuevo cliente

### Quick Start - Deployment

#### 1. Backend (Railway)
```bash
# Sigue la guía completa en /docs/DEPLOYMENT_RAILWAY.md

1. Crear proyecto en Railway
2. Conectar GitHub repo
3. Agregar PostgreSQL addon
4. Configurar variables de entorno (APP_KEYS, JWT_SECRET, etc.)
5. Deploy automático ✓
```

#### 2. Frontend (Cloudflare Pages)
```bash
# Sigue la guía completa en /docs/DEPLOYMENT_CLOUDFLARE.md

1. Crear proyecto en Cloudflare Pages
2. Conectar GitHub repo
3. Configurar build: pnpm build (output: dist)
4. Configurar variables de entorno (PUBLIC_STRAPI_URL, etc.)
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
| 1-10 | Railway Starter + Cloudflare Free | $5 | $0.50 |
| 10-100 | Railway Developer + Cloudflare Free | $20 | $0.20 |
| 100-400 | Railway Team + Cloudflare Free | $75 | $0.18 |

## 📝 Scripts Disponibles

### Frontend
```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build para producción
pnpm preview      # Preview del build
pnpm type-check   # Verificar tipos TypeScript
```

### Backend
```bash
pnpm develop      # Servidor de desarrollo con auto-reload
pnpm start        # Servidor de producción
pnpm build        # Build de Strapi
pnpm strapi       # CLI de Strapi
```

## 🔐 Seguridad

- ✅ Variables de entorno para secrets
- ✅ Validación de webhooks de Mercado Pago
- ✅ Autenticación JWT en Strapi
- ✅ CORS configurado
- ✅ Rate limiting en APIs

## 🧪 Testing (Próximamente)

- Unit tests con Vitest
- E2E tests con Playwright
- Tests de integración de APIs

## 📈 Performance

- ✅ SSG para páginas estáticas
- ✅ SSR para contenido dinámico
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático
- ✅ Caché agresivo de datos

## 🤝 Contribución

Este es un proyecto privado. Para contribuir:
1. Crea una rama desde `main`
2. Realiza tus cambios
3. Crea un Pull Request con descripción detallada

## 📄 Licencia

Propietario - Todos los derechos reservados

## 📚 Documentación Completa

### Deployment y Configuración
- 📖 [Deployment en Railway (Backend)](/docs/DEPLOYMENT_RAILWAY.md)
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

## 📞 Contacto

Para soporte o preguntas, contacta a [tu-email@dominio.com]

---

## 🎯 Estado Actual del Proyecto

### ✅ Completado
- [x] Estructura base del proyecto
- [x] Configuración de Astro + Tailwind
- [x] Sistema de tipos TypeScript completo
- [x] Datos placeholder para desarrollo
- [x] Cliente API contable con caché
- [x] Cliente Strapi API
- [x] Sistema de temas dinámicos
- [x] Configuración de variables de entorno
- [x] **Componentes de productos** (ProductCard, ProductGrid, ProductCarousel)
- [x] **Páginas del catálogo** (index.astro, productos/index.astro, productos/[slug].astro)
- [x] **Carrito de compras completo** (CartDrawer, CartItem, cartStore con persistencia)
- [x] **Sistema de toasts** (ToastContainer, toastStore)
- [x] **Layouts principales** (Header, Footer, Navigation, MobileMenu)
- [x] **Sistema de filtros** (CategorySidebar con filtro de precio por rango)
- [x] **Búsqueda** (SearchModal)
- [x] **Scroll infinito** (ProductsWithInfiniteScroll)
- [x] **Animaciones y UX** (scroll animations, hover effects, marquesina de medios de pago)
- [x] **Home completo** (BannerCarousel, sección de beneficios, medios de pago)

### 🚧 En Desarrollo
- [x] **Checkout y Mercado Pago** (En progreso - iniciando implementación)
  - [ ] API Routes para crear preferencias
  - [ ] Webhooks de Mercado Pago
  - [ ] Página de checkout con formulario
  - [ ] Páginas de resultado (success, pending, failure)
  - [ ] Store de órdenes

### 📋 Pendiente (Prioridad Media-Baja)
- [ ] Componentes SEO (Schema.org, sitemap dinámico)
- [ ] Autenticación de usuarios (login/registro)
- [ ] Dashboard de usuario con historial de pedidos
- [ ] Instalación y configuración de Strapi
- [ ] Content Types de Strapi
- [ ] Seed data de temas en Strapi
- [ ] Emails transaccionales
- [ ] Testing (Unit + E2E)
- [ ] Documentación de API contable
- [ ] Guía de deployment completa

## 🏗️ Próximos Pasos Inmediatos

1. ✅ ~~Componentes de productos~~ **COMPLETADO**
2. ✅ ~~Carrito de compras~~ **COMPLETADO**
3. ✅ ~~Páginas del catálogo~~ **COMPLETADO**
4. 🚧 **Integrar checkout con Mercado Pago** (En progreso)
5. Configurar Strapi Content Types
6. Implementar autenticación de usuarios
7. Implementar SEO completo
8. Testing y optimización
9. Despliegue a producción

---

**Versión:** 0.2.0 (Beta)
**Última actualización:** 2025-10-08
