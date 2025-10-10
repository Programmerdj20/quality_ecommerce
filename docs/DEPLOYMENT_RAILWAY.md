# 🚂 Deployment en Railway - Backend Strapi Multi-Tenant

> **Guía completa para desplegar el backend Strapi en Railway con PostgreSQL**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Prerrequisitos](#prerrequisitos)
3. [Paso 1: Crear Proyecto en Railway](#paso-1-crear-proyecto-en-railway)
4. [Paso 2: Configurar PostgreSQL](#paso-2-configurar-postgresql)
5. [Paso 3: Configurar Variables de Entorno](#paso-3-configurar-variables-de-entorno)
6. [Paso 4: Conectar Repositorio GitHub](#paso-4-conectar-repositorio-github)
7. [Paso 5: Configurar Build](#paso-5-configurar-build)
8. [Paso 6: Deploy Inicial](#paso-6-deploy-inicial)
9. [Paso 7: Configurar Dominio Custom](#paso-7-configurar-dominio-custom)
10. [Verificación del Deploy](#verificación-del-deploy)
11. [Troubleshooting](#troubleshooting)
12. [Costos y Escalabilidad](#costos-y-escalabilidad)

---

## 🎯 Introducción

Este documento describe cómo desplegar el backend Strapi multi-tenant en **Railway**, un servicio de hosting moderno que ofrece:

- ✅ **PostgreSQL integrado** (addon gratuito en plan Starter)
- ✅ **Deploy automático desde GitHub** (CI/CD incluido)
- ✅ **SSL gratuito** con dominio custom
- ✅ **Variables de entorno seguras**
- ✅ **Escalabilidad horizontal** sencilla
- ✅ **Plan gratuito/barato** ($5/mes para empezar)

### Arquitectura Resultante

```
┌─────────────────────────────────────────────────────┐
│         Railway Project: quality-ecommerce          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────────┐    ┌──────────────────┐    │
│  │  Strapi Backend   │───▶│   PostgreSQL     │    │
│  │  (Node.js 18+)    │    │   Database       │    │
│  │  Port: 1337       │    │   (Addon)        │    │
│  └───────────────────┘    └──────────────────┘    │
│           │                                        │
│           │ (Exposed via Railway Domain)          │
│           ▼                                        │
│  https://quality-backend.up.railway.app           │
│  (o tu dominio custom)                            │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de tener:

- [x] Cuenta en [Railway](https://railway.app) (gratis o plan Starter)
- [x] Repositorio en GitHub con el código del proyecto
- [x] Node.js 18+ instalado localmente (para testing)
- [x] pnpm instalado (`npm install -g pnpm`)
- [x] Secrets generados (APP_KEYS, JWT_SECRET, etc.) - ver sección más abajo

---

## 🚀 Paso 1: Crear Proyecto en Railway

### 1.1 Iniciar Sesión

1. Ve a [railway.app](https://railway.app)
2. Click en **"Login"**
3. Autentícate con GitHub
4. Autoriza Railway a acceder a tus repositorios

### 1.2 Crear Nuevo Proyecto

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona tu repositorio: `quality_ecommerce`
4. Railway detectará automáticamente que es un proyecto Node.js

### 1.3 Configurar Root Directory

⚠️ **IMPORTANTE**: El backend está en un subdirectorio

1. Click en el servicio creado
2. Ve a **"Settings"** → **"General"**
3. En **"Root Directory"** escribe: `backend`
4. Click en **"Save"**

---

## 🗄️ Paso 2: Configurar PostgreSQL

### 2.1 Agregar PostgreSQL Addon

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará automáticamente una base de datos PostgreSQL
4. Espera ~30 segundos a que se provisione

### 2.2 Verificar Conexión

Railway automáticamente configura estas variables:

- `DATABASE_URL` - URL completa de conexión
- `PGHOST` - Host de la base de datos
- `PGPORT` - Puerto (5432)
- `PGUSER` - Usuario
- `PGPASSWORD` - Contraseña
- `PGDATABASE` - Nombre de la base de datos

✅ **No necesitas copiar estas variables manualmente**, Railway las inyecta automáticamente.

---

## 🔐 Paso 3: Configurar Variables de Entorno

### 3.1 Generar Secrets

Antes de configurar Railway, **genera valores seguros** para tus secrets:

```bash
# En tu terminal local
cd backend

# Generar APP_KEYS (necesitas 4 valores)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generar otros secrets (JWT_SECRET, API_TOKEN_SALT, etc.)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Guarda estos valores en un lugar seguro** (1Password, LastPass, etc.)

### 3.2 Configurar Variables en Railway

1. Ve a tu servicio de Strapi en Railway
2. Click en **"Variables"**
3. Agrega las siguientes variables:

#### Variables de Strapi

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `HOST` | `0.0.0.0` | Host para escuchar (obligatorio en Railway) |
| `PORT` | `1337` | Puerto de Strapi |
| `NODE_ENV` | `production` | Entorno de producción |
| `APP_KEYS` | `key1,key2,key3,key4` | 4 keys generadas separadas por comas |
| `API_TOKEN_SALT` | `valor_generado` | Salt para tokens de API |
| `ADMIN_JWT_SECRET` | `valor_generado` | Secret para JWT del admin |
| `TRANSFER_TOKEN_SALT` | `valor_generado` | Salt para transfer tokens |
| `JWT_SECRET` | `valor_generado` | Secret para JWT general |

#### Variables de Base de Datos

⚠️ **No agregues estas**, Railway las configura automáticamente:

- ~~`DATABASE_URL`~~ ✅ Auto-configurada
- ~~`DATABASE_CLIENT`~~ ✅ Strapi detecta PostgreSQL del `DATABASE_URL`

#### Variables Opcionales (API Contable)

Si necesitas que Strapi valide productos contra la API contable:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `API_CONTABLE_URL` | `https://tu-api.herokuapp.com` | URL de tu API existente |
| `API_CONTABLE_TOKEN` | `tu_token` | Token de autenticación |

### 3.3 Ejemplo Completo de Variables

```bash
# Strapi Core
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Strapi Secrets (GENERA VALORES ÚNICOS)
APP_KEYS=ABC123...,DEF456...,GHI789...,JKL012...
API_TOKEN_SALT=MNO345...
ADMIN_JWT_SECRET=PQR678...
TRANSFER_TOKEN_SALT=STU901...
JWT_SECRET=VWX234...

# API Contable (Opcional)
API_CONTABLE_URL=https://quality-api.herokuapp.com
API_CONTABLE_TOKEN=tu_token_aqui
```

---

## 📦 Paso 4: Conectar Repositorio GitHub

### 4.1 Configurar Deploy Automático

Railway ya conectó tu repo, pero verifica:

1. Ve a **"Settings"** → **"GitHub Repo"**
2. Asegúrate de que apunta a: `tu-usuario/quality_ecommerce`
3. Rama de deploy: `main` (o la que uses)

### 4.2 Configurar Triggers de Deploy

Por defecto, Railway hace deploy automático en cada push a `main`:

- ✅ Push a `main` → Deploy automático
- ✅ Pull Request mergeado → Deploy automático
- ❌ Push a otras ramas → No hace deploy (puedes configurarlo)

---

## 🔨 Paso 5: Configurar Build

### 5.1 Build Command

Railway detecta automáticamente los comandos de `package.json`, pero verifica:

1. Ve a **"Settings"** → **"Build"**
2. **Build Command**: `pnpm install && pnpm build`
3. **Start Command**: `pnpm start`

### 5.2 Verificar package.json

Asegúrate de que tu `/backend/package.json` tenga:

```json
{
  "scripts": {
    "develop": "strapi develop",
    "start": "strapi start",
    "build": "strapi build",
    "strapi": "strapi"
  },
  "engines": {
    "node": ">=18.0.0 <=22.x.x",
    "npm": ">=6.0.0"
  }
}
```

### 5.3 Configurar Node.js Version (Opcional)

Railway usa Node.js 18+ por defecto. Para forzar una versión específica:

1. Ve a **"Settings"** → **"Environment"**
2. Agrega variable: `NODE_VERSION=18.20.0`

---

## 🚀 Paso 6: Deploy Inicial

### 6.1 Iniciar Deploy

1. Railway inicia el deploy automáticamente al crear el servicio
2. Ve a **"Deployments"** para ver el progreso
3. El primer deploy toma **~3-5 minutos**

### 6.2 Monitorear Deploy

Observa los logs en tiempo real:

```bash
# Logs típicos durante deploy
Building...
Installing dependencies...
Running build command...
Starting Strapi...
Server listening on http://0.0.0.0:1337 ✓
```

### 6.3 Verificar Éxito

✅ **Deploy exitoso** si ves:

```
┌────────────────────────────────────────────────────┐
│ Project: quality-ecommerce-backend                 │
│ Status:  DEPLOYED ✓                                │
│ URL:     https://quality-backend.up.railway.app    │
└────────────────────────────────────────────────────┘
```

❌ **Deploy fallido** si ves errores (ver [Troubleshooting](#troubleshooting))

---

## 🌐 Paso 7: Configurar Dominio Custom

### 7.1 Opción A: Usar Dominio de Railway (Gratis)

Railway proporciona un dominio automático:

```
https://quality-backend.up.railway.app
```

✅ **Ventajas**: Gratis, SSL incluido, inmediato
❌ **Desventajas**: No es white-label, cambia si recreas el servicio

### 7.2 Opción B: Dominio Custom (Recomendado)

Para usar tu propio dominio (ej: `api.quality.com`):

1. Ve a **"Settings"** → **"Networking"**
2. Click en **"+ Custom Domain"**
3. Ingresa tu dominio: `api.quality.com`
4. Railway te da instrucciones de DNS:

```
Tipo: CNAME
Nombre: api
Valor: quality-backend.up.railway.app
```

5. Agrega este registro CNAME en tu proveedor de DNS (Cloudflare, GoDaddy, etc.)
6. Espera ~5-10 minutos para propagación de DNS
7. Railway emite automáticamente un certificado SSL (Let's Encrypt)

### 7.3 Verificar SSL

Una vez configurado, verifica:

```bash
curl https://api.quality.com/api/tenants
```

Debe responder con SSL válido (🔒 en navegador)

---

## ✅ Verificación del Deploy

### 1. Verificar Health Check

```bash
# Reemplaza con tu URL de Railway
curl https://quality-backend.up.railway.app/_health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

### 2. Verificar API de Tenants

```bash
curl https://quality-backend.up.railway.app/api/tenants \
  -H "Authorization: Bearer TU_STRAPI_API_TOKEN"
```

### 3. Acceder al Admin de Strapi

1. Ve a: `https://quality-backend.up.railway.app/admin`
2. Crea tu cuenta de administrador
3. Inicia sesión

⚠️ **IMPORTANTE**: Crea el admin en los primeros 15 minutos o Railway puede reiniciar el servicio.

### 4. Crear Primer Tenant

Desde el admin de Strapi:

1. Click en **"Content Manager"** → **"Tenant"**
2. Click en **"Create new entry"**
3. Completa los campos:
   - Nombre: `Tienda Demo`
   - Dominio: `demo.tuapp.com`
   - Quality API Token: `tu_token`
   - Mercado Pago Access Token: `tu_mp_token`
   - Configuración: `{"logo": "...", "colores": {...}}`
4. Click en **"Save"** y **"Publish"**

---

## 🐛 Troubleshooting

### Error: `Build failed - Module not found`

**Causa**: Dependencias no instaladas correctamente

**Solución**:

```bash
# Verifica que backend/package.json tenga todas las deps
# Verifica que Build Command sea: pnpm install && pnpm build
# Revisa logs para ver qué módulo falta
```

### Error: `Database connection failed`

**Causa**: Variables de base de datos mal configuradas

**Solución**:

1. Ve a **"Variables"**
2. Verifica que `DATABASE_URL` esté presente (debe aparecer automáticamente)
3. NO configures manualmente `DATABASE_CLIENT`, `DATABASE_HOST`, etc.
4. Strapi detecta PostgreSQL del `DATABASE_URL`

### Error: `PORT already in use`

**Causa**: Variable `PORT` no configurada

**Solución**:

1. Agrega variable: `PORT=1337`
2. Agrega variable: `HOST=0.0.0.0`
3. Re-deploy

### Error: `JWT_SECRET is required`

**Causa**: Variables de secrets no configuradas

**Solución**:

1. Genera secrets con el comando de Node.js (ver arriba)
2. Agrega todas las variables de la sección 3.2
3. Re-deploy

### Deploy Lento (>10 minutos)

**Causa**: Plan gratuito tiene CPU limitada

**Solución**:

- Espera pacientemente en el primer deploy
- Considera upgrade a plan Starter ($5/mes) para builds más rápidos
- Railway tier gratuito tiene límites de CPU compartida

### SSL Certificate no se emite

**Causa**: DNS no propagado o configurado incorrectamente

**Solución**:

1. Verifica CNAME con: `dig api.quality.com`
2. Espera hasta 24 horas para propagación DNS completa
3. Railway emite SSL automáticamente una vez que DNS apunta correctamente

---

## 💰 Costos y Escalabilidad

### Plan Gratuito (Trial)

- ✅ **$5 USD de crédito gratis** (sin tarjeta)
- ✅ Suficiente para 1-2 semanas de testing
- ⚠️ Se suspende al agotar crédito

### Plan Starter ($5/mes)

| Recurso | Límite |
|---------|--------|
| **Memoria** | 512 MB |
| **CPU** | Compartida (fair use) |
| **Ejecución** | $5 base + uso adicional |
| **PostgreSQL** | Incluido (500 MB de storage) |
| **SSL** | Incluido |
| **Tráfico** | Sin límite (fair use) |

**Ideal para**: 1-50 tenants, tráfico bajo-medio

### Plan Developer ($20/mes)

| Recurso | Límite |
|---------|--------|
| **Memoria** | 8 GB |
| **CPU** | Dedicada (2 vCPUs) |
| **Ejecución** | Incluido |
| **PostgreSQL** | Incluido (1 GB de storage) |
| **SSL** | Incluido |
| **Tráfico** | Sin límite |

**Ideal para**: 50-400 tenants, tráfico medio-alto

### Estimación de Costos Multi-Tenant

| Tenants | Plan Recomendado | Costo/mes | Costo/tenant |
|---------|------------------|-----------|--------------|
| 1-10 | Starter | $5 | $0.50 |
| 10-50 | Starter | $5-10 | $0.20 |
| 50-100 | Developer | $20 | $0.20 |
| 100-400 | Developer | $20-30 | $0.08 |

### Escalabilidad Horizontal

Para escalar más allá de 400 tenants:

1. **Opción A**: Upgrade a Railway Team Plan ($20+/mes por servicio)
2. **Opción B**: Migrar a VPS dedicado (Hetzner, DigitalOcean)
3. **Opción C**: Implementar sharding (dividir tenants en múltiples instancias)

---

## 🎯 Próximos Pasos

Después de desplegar el backend en Railway:

1. ✅ **Desplegar Frontend** en Cloudflare Pages (ver `/docs/DEPLOYMENT_CLOUDFLARE.md`)
2. ✅ **Configurar Multi-Dominio** (ver `/docs/DOMAIN_SETUP.md`)
3. ✅ **Onboarding de Clientes** (ver `/docs/CLIENT_ONBOARDING.md`)
4. ✅ **Testing en Producción**
5. ✅ **Monitoreo y Logs**

---

## 📞 Soporte

### Railway Support

- 📖 Docs: [docs.railway.app](https://docs.railway.app)
- 💬 Discord: [discord.gg/railway](https://discord.gg/railway)
- 📧 Email: team@railway.app

### Strapi Support

- 📖 Docs: [docs.strapi.io](https://docs.strapi.io)
- 💬 Discord: [discord.strapi.io](https://discord.strapi.io)
- 📧 Forum: [forum.strapi.io](https://forum.strapi.io)

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
