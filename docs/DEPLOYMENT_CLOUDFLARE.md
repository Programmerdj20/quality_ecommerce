# ☁️ Deployment en Cloudflare Pages - Frontend Astro Multi-Tenant

> **Guía completa para desplegar el frontend Astro en Cloudflare Pages**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Prerrequisitos](#prerrequisitos)
3. [Paso 1: Crear Proyecto en Cloudflare Pages](#paso-1-crear-proyecto-en-cloudflare-pages)
4. [Paso 2: Conectar Repositorio GitHub](#paso-2-conectar-repositorio-github)
5. [Paso 3: Configurar Build](#paso-3-configurar-build)
6. [Paso 4: Configurar Variables de Entorno](#paso-4-configurar-variables-de-entorno)
7. [Paso 5: Deploy Inicial](#paso-5-deploy-inicial)
8. [Paso 6: Configurar Dominio Custom](#paso-6-configurar-dominio-custom)
9. [Paso 7: Configurar Multi-Dominio (Wildcard)](#paso-7-configurar-multi-dominio-wildcard)
10. [Verificación del Deploy](#verificación-del-deploy)
11. [Troubleshooting](#troubleshooting)
12. [Performance y Optimización](#performance-y-optimización)

---

## 🎯 Introducción

Este documento describe cómo desplegar el frontend Astro multi-tenant en **Cloudflare Pages**, la plataforma ideal para aplicaciones multi-tenant por:

- ✅ **Completamente gratuito** (sin límites de tráfico)
- ✅ **CDN global** de Cloudflare (200+ ubicaciones)
- ✅ **SSL automático** para dominios custom
- ✅ **Deploy automático** desde GitHub
- ✅ **Multi-dominio soportado** (wildcard `*.tudominio.com`)
- ✅ **Edge computing** (Astro SSR en Cloudflare Workers)
- ✅ **Performance excepcional** (TTFB <50ms)

### Arquitectura Resultante

```
┌────────────────────────────────────────────────────────────┐
│              Cloudflare Pages Project                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────┐          │
│  │         Astro Frontend (SSR + SSG)           │          │
│  │  • Detecta tenant por hostname               │          │
│  │  • Carga configuración del tenant            │          │
│  │  • Aplica branding dinámico                  │          │
│  └─────────────────────────────────────────────┘          │
│                      │                                      │
│                      │ (API calls)                         │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────┐          │
│  │   Backend Strapi (Railway)                   │          │
│  │   https://api.quality.com                    │          │
│  └─────────────────────────────────────────────┘          │
│                                                             │
│  Dominios configurados:                                    │
│  • quality-frontend.pages.dev (default)                   │
│  • cliente1.com                                            │
│  • cliente2.com                                            │
│  • cliente3.com                                            │
│  • *.miapp.com (wildcard para subdominios)               │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Prerrequisitos

Antes de comenzar:

- [x] Cuenta en [Cloudflare](https://dash.cloudflare.com/sign-up) (gratis)
- [x] Repositorio en GitHub con el código del proyecto
- [x] Backend desplegado en Railway (ver `/docs/DEPLOYMENT_RAILWAY.md`)
- [x] Node.js 18+ instalado localmente
- [x] pnpm instalado (`npm install -g pnpm`)
- [x] Dominio registrado (opcional, para custom domains)

---

## 🚀 Paso 1: Crear Proyecto en Cloudflare Pages

### 1.1 Acceder a Cloudflare Pages

1. Inicia sesión en [dash.cloudflare.com](https://dash.cloudflare.com)
2. En el menú lateral, click en **"Workers & Pages"**
3. Click en **"Create application"**
4. Selecciona la pestaña **"Pages"**
5. Click en **"Connect to Git"**

### 1.2 Autorizar GitHub

1. Click en **"Connect GitHub"**
2. Autoriza Cloudflare Pages en GitHub
3. Selecciona acceso a **todos los repositorios** o solo `quality_ecommerce`

---

## 📦 Paso 2: Conectar Repositorio GitHub

### 2.1 Seleccionar Repositorio

1. Busca y selecciona: `tu-usuario/quality_ecommerce`
2. Click en **"Begin setup"**

### 2.2 Configurar Proyecto

Completa el formulario:

| Campo | Valor |
|-------|-------|
| **Project name** | `quality-frontend` (o tu preferencia) |
| **Production branch** | `main` |

---

## 🔨 Paso 3: Configurar Build

### 3.1 Build Settings

Cloudflare detecta Astro automáticamente, pero verifica:

| Setting | Valor |
|---------|-------|
| **Framework preset** | `Astro` |
| **Build command** | `pnpm build` |
| **Build output directory** | `dist` |
| **Root directory** | `frontend` |

⚠️ **IMPORTANTE**: Configura **Root directory** como `frontend` porque el proyecto está en un subdirectorio.

### 3.2 Advanced Settings

Click en **"Advanced"** y configura:

| Setting | Valor | Descripción |
|---------|-------|-------------|
| **Node.js version** | `18` | Compatible con Astro 4+ |
| **Package manager** | `pnpm` | Más rápido que npm |

### 3.3 Verificar astro.config.mjs

Asegúrate de que tu configuración de Astro soporta SSR:

```javascript
// frontend/astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'hybrid', // SSR + SSG híbrido
  adapter: cloudflare(), // Adapter para Cloudflare Pages

  server: {
    host: true, // Permite acceso desde cualquier host
  },
});
```

Si usas el adapter de Cloudflare:

```bash
# Instalar adapter
cd frontend
pnpm add @astrojs/cloudflare
```

---

## 🔐 Paso 4: Configurar Variables de Entorno

### 4.1 Variables Requeridas

En la sección **"Environment variables"**, agrega:

#### Variables Públicas (Expuestas al cliente)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PUBLIC_STRAPI_URL` | `https://api.quality.com` | URL del backend en Railway |
| `PUBLIC_API_CONTABLE_URL` | `https://quality-api.herokuapp.com` | URL de tu API existente |
| `PUBLIC_SITE_URL` | `https://quality-frontend.pages.dev` | URL de tu sitio |
| `PUBLIC_CURRENCY` | `COP` | Moneda por defecto |
| `PUBLIC_LOCALE` | `es-CO` | Locale de Colombia |
| `PUBLIC_IVA_RATE` | `0.19` | IVA Colombia (19%) |

#### Variables Privadas (Solo servidor)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `STRAPI_API_TOKEN` | `tu_token_strapi` | Token de API de Strapi |
| `MP_ACCESS_TOKEN` | `tu_mp_token_fallback` | Mercado Pago fallback (opcional) |

### 4.2 Ejemplo Completo

```bash
# Públicas (expuestas al cliente con PUBLIC_)
PUBLIC_STRAPI_URL=https://quality-backend.up.railway.app
PUBLIC_API_CONTABLE_URL=https://quality-api.herokuapp.com
PUBLIC_SITE_URL=https://quality-frontend.pages.dev
PUBLIC_CURRENCY=COP
PUBLIC_LOCALE=es-CO
PUBLIC_IVA_RATE=0.19

# Privadas (solo servidor)
STRAPI_API_TOKEN=abcdef123456...
MP_ACCESS_TOKEN=TEST-1234567890-...
```

### 4.3 Variables por Entorno

Cloudflare permite diferentes variables para **Production** y **Preview**:

1. Selecciona **"Production"** para variables de producción
2. Selecciona **"Preview"** para variables de desarrollo/testing
3. Agrega las mismas variables en ambos (con valores diferentes si es necesario)

---

## 🚀 Paso 5: Deploy Inicial

### 5.1 Iniciar Deploy

1. Después de configurar todo, click en **"Save and Deploy"**
2. Cloudflare Pages inicia el build automáticamente
3. El primer deploy toma **~2-4 minutos**

### 5.2 Monitorear Deploy

Observa los logs en tiempo real:

```bash
# Logs típicos durante build
Cloning repository...
Installing dependencies with pnpm...
Running build command: pnpm build...
Building pages...
Deploying to Cloudflare Pages...
Success! Deployed to https://quality-frontend.pages.dev
```

### 5.3 Verificar Éxito

✅ **Deploy exitoso** si ves:

```
┌────────────────────────────────────────────────────┐
│ Deployment successful!                             │
│ URL: https://quality-frontend.pages.dev            │
│ Build time: 2m 34s                                 │
└────────────────────────────────────────────────────┘
```

---

## 🌐 Paso 6: Configurar Dominio Custom

### 6.1 Opción A: Dominio Principal

Para usar tu dominio principal (ej: `quality.com`):

1. Ve a tu proyecto en Cloudflare Pages
2. Click en **"Custom domains"**
3. Click en **"Set up a custom domain"**
4. Ingresa: `quality.com`
5. Cloudflare detecta automáticamente si el dominio está en tu cuenta

#### Si el dominio YA está en Cloudflare:

✅ Cloudflare configura todo automáticamente (DNS + SSL)

#### Si el dominio NO está en Cloudflare:

1. Cloudflare te muestra instrucciones DNS:

```
Tipo: CNAME
Nombre: @
Valor: quality-frontend.pages.dev
```

2. Agrega este registro en tu proveedor de DNS actual
3. Espera propagación DNS (~5-60 minutos)

### 6.2 Opción B: Subdominio

Para usar un subdominio (ej: `tienda.quality.com`):

1. Click en **"Set up a custom domain"**
2. Ingresa: `tienda.quality.com`
3. Agrega registro CNAME:

```
Tipo: CNAME
Nombre: tienda
Valor: quality-frontend.pages.dev
```

### 6.3 Verificar SSL

Cloudflare emite certificados SSL automáticamente:

- 🔒 **SSL Universal** (gratis) - Listo en 1-5 minutos
- 🔒 **SSL Advanced** (gratis) - Para dominios complejos

Verifica en navegador: `https://quality.com` debe mostrar 🔒

---

## 🌍 Paso 7: Configurar Multi-Dominio (Wildcard)

Para soportar múltiples clientes con sus propios dominios:

### 7.1 Agregar Dominios de Clientes

Cada cliente puede tener su propio dominio:

1. Ve a **"Custom domains"**
2. Click en **"Add a custom domain"**
3. Agrega dominios uno por uno:
   - `cliente1.com`
   - `cliente2.com`
   - `cliente3.com`
   - etc.

### 7.2 Configurar Wildcard (Subdominios)

Si quieres que todos tus clientes usen subdominios de tu dominio principal:

Ejemplo: `cliente1.miapp.com`, `cliente2.miapp.com`, etc.

1. Agrega dominio wildcard: `*.miapp.com`
2. Cloudflare te pedirá verificación de dominio
3. Agrega registro DNS:

```
Tipo: CNAME
Nombre: *
Valor: quality-frontend.pages.dev
```

⚠️ **IMPORTANTE**: Wildcard SSL requiere que el dominio base (`miapp.com`) esté en Cloudflare.

### 7.3 Ejemplo de Configuración Multi-Tenant

Tenants configurados en Strapi:

| Tenant ID | Dominio | CNAME apunta a |
|-----------|---------|----------------|
| 1 | `localhost:4321` | (desarrollo) |
| 2 | `cliente1.com` | `quality-frontend.pages.dev` |
| 3 | `cliente2.com` | `quality-frontend.pages.dev` |
| 4 | `tienda-demo.miapp.com` | `quality-frontend.pages.dev` |
| 5 | `tienda-x.miapp.com` | `quality-frontend.pages.dev` |

Todos apuntan al **mismo deployment** de Cloudflare Pages, pero detectan el tenant por hostname.

---

## ✅ Verificación del Deploy

### 1. Verificar Health Check

```bash
curl https://quality-frontend.pages.dev
```

Debe retornar HTML con status 200.

### 2. Verificar Detección de Tenant

```bash
# Simular request con dominio de cliente
curl https://quality-frontend.pages.dev \
  -H "Host: cliente1.com"
```

Verifica en el HTML que se carga la configuración del tenant correcto.

### 3. Verificar API Calls

Abre DevTools en navegador y verifica que:

- ✅ Requests a Strapi incluyen header `x-tenant-domain`
- ✅ Configuración de tenant se carga correctamente
- ✅ Theme se aplica según el tenant

### 4. Testing Multi-Tenant Local

Antes de configurar dominios reales, puedes probar localmente:

1. Edita `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 cliente1.local
127.0.0.1 cliente2.local
```

2. Ejecuta frontend localmente:

```bash
cd frontend
pnpm dev
```

3. Abre en navegador:
   - `http://cliente1.local:4321` → Ve datos de Tenant 1
   - `http://cliente2.local:4321` → Ve datos de Tenant 2

---

## 🐛 Troubleshooting

### Error: `Build failed - Command not found: pnpm`

**Causa**: Cloudflare no detectó pnpm

**Solución**:

1. Ve a **"Settings"** → **"Builds & deployments"**
2. En **"Build command"**, cambia a: `npm install -g pnpm && pnpm install && pnpm build`
3. Re-deploy

### Error: `Module not found: @astrojs/cloudflare`

**Causa**: Adapter de Cloudflare no instalado

**Solución**:

```bash
cd frontend
pnpm add @astrojs/cloudflare
git commit -am "Add Cloudflare adapter"
git push
```

### Error: `404 Not Found` en rutas dinámicas

**Causa**: Astro configurado como SSG (static) en vez de SSR

**Solución**:

Verifica `astro.config.mjs`:

```javascript
export default defineConfig({
  output: 'hybrid', // ✅ Correcto para multi-tenant
  adapter: cloudflare(),
});
```

### Error: Variables de entorno no definidas

**Causa**: Variables no configuradas o sin prefijo `PUBLIC_`

**Solución**:

- Variables del cliente **DEBEN** tener prefijo `PUBLIC_`
- Variables del servidor **NO deben** tener prefijo `PUBLIC_`
- Verifica en **"Settings"** → **"Environment variables"**

### Error: SSL Certificate not issued

**Causa**: DNS no propagado o CNAME incorrecto

**Solución**:

```bash
# Verifica DNS con dig
dig cliente1.com CNAME

# Debe retornar:
cliente1.com. 300 IN CNAME quality-frontend.pages.dev.
```

Espera propagación DNS (hasta 24 horas).

### Error: `getaddrinfo ENOTFOUND` al llamar API

**Causa**: `PUBLIC_STRAPI_URL` mal configurada

**Solución**:

1. Verifica que la variable sea: `https://quality-backend.up.railway.app`
2. NO incluyas trailing slash: ~~`https://api.com/`~~ ❌
3. Debe ser HTTPS, no HTTP

---

## ⚡ Performance y Optimización

### 1. Caché de Cloudflare

Cloudflare cachea automáticamente assets estáticos:

- ✅ Imágenes (`.png`, `.jpg`, `.webp`)
- ✅ CSS/JS (`.css`, `.js`)
- ✅ Fonts (`.woff`, `.woff2`)

### 2. Edge Caching para Páginas

Para cachear páginas SSR, configura headers en Astro:

```astro
---
// En tus páginas .astro
Astro.response.headers.set('Cache-Control', 'public, max-age=300');
---
```

### 3. Optimización de Imágenes

Usa el componente `<Image>` de Astro:

```astro
---
import { Image } from 'astro:assets';
---

<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  format="webp"
/>
```

Cloudflare optimiza automáticamente las imágenes.

### 4. Code Splitting

Astro hace code splitting automáticamente:

- ✅ Cada página es un bundle separado
- ✅ Componentes lazy-loaded cuando es posible
- ✅ CSS crítico inlined

### 5. Métricas Esperadas

Con Cloudflare Pages deberías ver:

| Métrica | Valor Esperado |
|---------|----------------|
| **TTFB** | <50ms (con caché) / <200ms (sin caché) |
| **FCP** | <800ms |
| **LCP** | <1.2s |
| **TTI** | <2s |
| **Lighthouse Score** | 90-100 |

### 6. Monitoring

Cloudflare Pages incluye analytics gratis:

1. Ve a tu proyecto
2. Click en **"Analytics"**
3. Observa:
   - Requests por segundo
   - Bandwidth usado
   - Errors 4xx/5xx
   - Geo-distribución de usuarios

---

## 🔄 Deploy Automático

### Configuración de Branches

Cloudflare Pages despliega automáticamente:

| Branch | Deploy a | URL |
|--------|----------|-----|
| `main` | **Production** | `https://quality-frontend.pages.dev` |
| `develop` | **Preview** | `https://develop.quality-frontend.pages.dev` |
| `feature/*` | **Preview** | `https://feature-x.quality-frontend.pages.dev` |

### Deshabilitar Deploy de Previews

Si solo quieres deploy en `main`:

1. Ve a **"Settings"** → **"Builds & deployments"**
2. En **"Production branch"**: `main`
3. En **"Preview deployments"**: selecciona **"None"**

---

## 💰 Costos

### Plan Gratuito (Free)

- ✅ **Completamente gratis** ✨
- ✅ **Requests ilimitados**
- ✅ **Bandwidth ilimitado**
- ✅ **500 builds/mes**
- ✅ **20,000 páginas estáticas**
- ✅ **SSL incluido**
- ✅ **CDN global**

### Plan Pro ($20/mes) - Opcional

Solo necesario si:

- Más de 500 builds/mes
- Más de 20,000 archivos
- Requieres analytics avanzados

**Para 99% de casos, el plan gratuito es suficiente.**

---

## 🎯 Próximos Pasos

Después de desplegar en Cloudflare Pages:

1. ✅ **Configurar Multi-Dominio** (ver `/docs/DOMAIN_SETUP.md`)
2. ✅ **Onboarding de Clientes** (ver `/docs/CLIENT_ONBOARDING.md`)
3. ✅ **Testing en Producción**
4. ✅ **Configurar Analytics**
5. ✅ **Monitoreo continuo**

---

## 📞 Soporte

### Cloudflare Support

- 📖 Docs: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- 💬 Community: [community.cloudflare.com](https://community.cloudflare.com)
- 📧 Email: Solo en planes Pro+

### Astro Support

- 📖 Docs: [docs.astro.build](https://docs.astro.build)
- 💬 Discord: [astro.build/chat](https://astro.build/chat)
- 📧 GitHub: [github.com/withastro/astro](https://github.com/withastro/astro)

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
