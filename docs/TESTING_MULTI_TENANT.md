# 🧪 Guía de Testing Multi-Tenant

> **Documento:** Guía completa para testing del sistema multi-tenant
> **Versión:** 1.0.0
> **Última actualización:** 2025-10-09

---

## 📋 Tabla de Contenidos

1. [Preparación del Entorno](#preparación-del-entorno)
2. [Ejecutar Seeds](#ejecutar-seeds)
3. [Configuración de Dominios Locales](#configuración-de-dominios-locales)
4. [Testing Backend](#testing-backend)
5. [Testing Frontend](#testing-frontend)
6. [Testing de Aislamiento](#testing-de-aislamiento)
7. [Testing End-to-End](#testing-end-to-end)
8. [Troubleshooting](#troubleshooting)

---

## 🔧 Preparación del Entorno

### Requisitos Previos

- Node.js 18+ instalado
- pnpm instalado (`npm install -g pnpm`)
- Backend de Strapi configurado
- Frontend de Astro configurado

### 1. Instalar Dependencias

```bash
# Backend
cd backend
pnpm install

# Frontend (en otra terminal)
cd frontend
pnpm install
```

### 2. Variables de Entorno

Asegúrate de tener configurados los archivos `.env`:

**Backend (.env):**
```env
# Backend ya usa SQLite por defecto, no requiere configuración adicional
DATABASE_FILENAME=.tmp/data.db
```

**Frontend (.env):**
```env
PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=tu_token_aqui
```

---

## 🌱 Ejecutar Seeds

### Opción 1: Seed Completo (Recomendado)

Ejecuta todos los seeds en orden automáticamente:

```bash
cd backend
pnpm seed
```

Esto creará:
- ✅ 2 Tenants (Tienda Demo 1 y Demo 2)
- ✅ 4 Themes (2 por tenant)
- ✅ 2 Site Configs (1 por tenant)
- ✅ 5 Orders (3 para Tenant 1, 2 para Tenant 2)

### Opción 2: Seeds Individuales

Si necesitas ejecutar seeds por separado:

```bash
# Solo tenants
pnpm seed:tenants

# Solo themes (requiere tenants)
pnpm seed:themes

# Solo site configs (requiere tenants y themes)
pnpm seed:site-config

# Solo orders (requiere tenants)
pnpm seed:orders
```

### Resultado Esperado

```
✨ SEED COMPLETADO EXITOSAMENTE

📊 Resumen de Datos Creados:
   • Tenants:      2
   • Themes:       4
   • Site Configs: 2
   • Orders:       5

   Total de registros: 13

⏱️  Tiempo de ejecución: 2.5 segundos
```

---

## 🌐 Configuración de Dominios Locales

Para simular múltiples dominios en local, necesitas modificar el archivo `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows).

### Linux/Mac

```bash
# Abrir con permisos de administrador
sudo nano /etc/hosts

# Agregar estas líneas al final:
127.0.0.1 demo2.local
```

### Windows

1. Abrir **Notepad como Administrador**
2. Abrir el archivo: `C:\Windows\System32\drivers\etc\hosts`
3. Agregar al final:
```
127.0.0.1 demo2.local
```

### Verificar Configuración

```bash
# Debería responder desde localhost
ping demo2.local
```

### Dominios Configurados para Testing

| Tenant | Dominio Local | Puerto |
|--------|---------------|--------|
| **Tienda Demo 1** | `localhost:4321` | 4321 |
| **Tienda Demo 2** | `demo2.local:4321` | 4321 |

---

## 🔙 Testing Backend

### 1. Iniciar Strapi

```bash
cd backend
pnpm develop
```

Strapi debería mostrar:
```
🚀 Quality E-commerce Backend - Multi-Tenant SaaS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Tenants registrados: 2
✅ Tenants activos: 2
🏪 Tiendas activas:
   • Tienda Quality Demo 1 (localhost:4321)
   • Tienda Quality Demo 2 (demo2.local:4321)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 Multi-tenant isolation: ENABLED
🌐 Tenant resolver middleware: ACTIVE
```

### 2. Login en Admin

- URL: http://localhost:1337/admin
- Crear usuario admin si es primera vez
- Explorar los datos creados en Content Manager

### 3. Testing de APIs con curl

#### Test 1: Obtener Orders de Tenant 1

```bash
curl -X GET "http://localhost:1337/api/orders" \
  -H "x-tenant-domain: localhost:4321" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** 3 órdenes (solo de Tenant 1)

#### Test 2: Obtener Orders de Tenant 2

```bash
curl -X GET "http://localhost:1337/api/orders" \
  -H "x-tenant-domain: demo2.local:4321" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** 2 órdenes (solo de Tenant 2)

#### Test 3: Sin Header de Tenant (debe fallar)

```bash
curl -X GET "http://localhost:1337/api/orders" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** Error 404 - Tenant no encontrado

#### Test 4: Obtener Themes de Tenant 1

```bash
curl -X GET "http://localhost:1337/api/themes" \
  -H "x-tenant-domain: localhost:4321" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** 2 themes (Default Azul + Black Friday)

#### Test 5: Obtener Site Config de Tenant 2

```bash
curl -X GET "http://localhost:1337/api/site-configs" \
  -H "x-tenant-domain: demo2.local:4321" \
  -H "Content-Type: application/json"
```

**Resultado esperado:** 1 site config con datos de Tenant 2

---

## 🎨 Testing Frontend

### 1. Iniciar Frontend

```bash
cd frontend
pnpm dev
```

### 2. Acceder a las Tiendas

**Tenant 1 (Tienda Quality Demo 1):**
- URL: http://localhost:4321
- Debe mostrar:
  - ✅ Logo con iniciales "QD1" (azul)
  - ✅ Colores: Azul primario (#2563eb)
  - ✅ Footer con datos de Tenant 1
  - ✅ Productos con token de Tenant 1

**Tenant 2 (Tienda Quality Demo 2):**
- URL: http://demo2.local:4321
- Debe mostrar:
  - ✅ Logo con iniciales "QD2" (verde)
  - ✅ Colores: Verde primario (#10b981)
  - ✅ Footer con datos de Tenant 2
  - ✅ Productos con token de Tenant 2

### 3. Verificar Tenant Context

Abrir la consola del navegador en cada dominio y ejecutar:

```javascript
console.log(window.__TENANT__);
```

Debe mostrar la información del tenant correspondiente.

---

## 🔒 Testing de Aislamiento

### Objetivo

Validar que cada tenant **SOLO** puede acceder a sus propios datos y **NO** puede ver datos de otros tenants.

### Test 1: Aislamiento de Orders

**Paso 1:** Obtener ID de una order de Tenant 1

```bash
curl -X GET "http://localhost:1337/api/orders" \
  -H "x-tenant-domain: localhost:4321" | jq '.[0].id'
```

Supongamos que devuelve `id: 1`

**Paso 2:** Intentar acceder a esa order desde Tenant 2

```bash
curl -X GET "http://localhost:1337/api/orders/1" \
  -H "x-tenant-domain: demo2.local:4321"
```

**✅ RESULTADO ESPERADO:** Error 404 - Order no encontrada (porque no pertenece a Tenant 2)

### Test 2: Aislamiento de Themes

**Paso 1:** Obtener theme ID de Tenant 1

```bash
curl -X GET "http://localhost:1337/api/themes" \
  -H "x-tenant-domain: localhost:4321" | jq '.[0].id'
```

**Paso 2:** Intentar acceder desde Tenant 2

```bash
curl -X GET "http://localhost:1337/api/themes/{theme_id}" \
  -H "x-tenant-domain: demo2.local:4321"
```

**✅ RESULTADO ESPERADO:** Error 404 - Theme no encontrado

### Test 3: Crear Order para Tenant Incorrecto

Intentar crear una order para Tenant 1 usando el dominio de Tenant 2:

```bash
curl -X POST "http://localhost:1337/api/orders" \
  -H "x-tenant-domain: demo2.local:4321" \
  -H "Content-Type: application/json" \
  -d '{
    "tenant": 1,
    "numero": "TEST-001",
    "fecha": "2025-10-09T00:00:00.000Z",
    "items": [{"productId": "TEST", "nombre": "Test", "precio": 100, "cantidad": 1, "subtotal": 100}],
    "subtotal": 100,
    "iva": 19,
    "total": 119,
    "estado": "pendiente"
  }'
```

**✅ RESULTADO ESPERADO:** Error 403 - No autorizado (tenant mismatch)

---

## 🔄 Testing End-to-End

### Flujo Completo: Tenant 1

1. **Acceder a la tienda:** http://localhost:4321
2. **Ver productos** (deben cargarse con token de Tenant 1)
3. **Agregar al carrito** (2-3 productos)
4. **Ir a checkout**
5. **Llenar formulario** con datos de prueba
6. **Crear preferencia de Mercado Pago** (debe usar tokens de Tenant 1)
7. **Verificar en Strapi Admin** que la order se creó con `tenant: Tenant 1`

### Flujo Completo: Tenant 2

1. **Acceder a la tienda:** http://demo2.local:4321
2. **Verificar tema diferente** (verde en lugar de azul)
3. **Ver productos** (diferentes precios si IVA es distinto)
4. **Agregar al carrito**
5. **Ir a checkout**
6. **Crear preferencia de Mercado Pago** (debe usar tokens de Tenant 2)
7. **Verificar en Strapi Admin** que la order se creó con `tenant: Tenant 2`

### Validaciones Críticas

- ✅ Orders de Tenant 1 NO aparecen en el listado de Tenant 2
- ✅ Themes de Tenant 1 NO se cargan para Tenant 2
- ✅ Site Config muestra datos correctos para cada tenant
- ✅ MP tokens son diferentes para cada tenant
- ✅ Moneda e IVA son correctos según tenant

---

## 🐛 Troubleshooting

### Problema: "Tenant no encontrado"

**Síntoma:** Error 404 al hacer requests

**Solución:**
1. Verificar que el header `x-tenant-domain` está presente
2. Verificar que el dominio coincide exactamente con el registrado en DB
3. Verificar que el tenant está activo (`activo: true`)

```bash
# Ver tenants en DB
curl http://localhost:1337/api/tenants
```

### Problema: Seeds fallan

**Síntoma:** Error al ejecutar `pnpm seed`

**Solución:**
```bash
# Limpiar base de datos (SQLite)
cd backend
rm -rf .tmp/data.db

# Volver a iniciar Strapi
pnpm develop

# En otra terminal, ejecutar seeds
pnpm seed
```

### Problema: Frontend muestra datos incorrectos

**Síntoma:** Tenant 1 muestra datos de Tenant 2

**Solución:**
1. Limpiar caché del navegador (Ctrl+Shift+R)
2. Verificar que el dominio en la URL es correcto
3. Abrir DevTools → Network → Ver header `x-tenant-domain` en requests

### Problema: demo2.local no resuelve

**Síntoma:** ERR_NAME_NOT_RESOLVED en navegador

**Solución:**
1. Verificar archivo `/etc/hosts` (debe tener `127.0.0.1 demo2.local`)
2. Reiniciar navegador después de modificar hosts
3. Probar con: `ping demo2.local` (debe responder)
4. En Mac: `sudo dscacheutil -flushcache`

### Problema: MP tokens no funcionan

**Síntoma:** Error al crear preferencia de pago

**Solución:**
1. Verificar que los tokens en los tenants son válidos
2. Usar tokens de sandbox de Mercado Pago
3. Verificar que el webhook de MP está configurado correctamente

---

## 📊 Checklist de Testing

### Backend
- [ ] Strapi inicia sin errores
- [ ] Seeds se ejecutan correctamente
- [ ] 2 tenants creados y activos
- [ ] Middleware tenant-resolver funciona
- [ ] Policy tenant-isolation bloquea acceso cross-tenant
- [ ] APIs retornan solo datos del tenant correcto

### Frontend
- [ ] Tenant 1 carga con branding correcto
- [ ] Tenant 2 carga con branding diferente
- [ ] Productos se cargan con token correcto
- [ ] Themes se aplican correctamente
- [ ] Footer muestra datos dinámicos por tenant
- [ ] `window.__TENANT__` está disponible en cliente

### Aislamiento
- [ ] Tenant 1 NO ve orders de Tenant 2
- [ ] Tenant 2 NO ve themes de Tenant 1
- [ ] Request sin header `x-tenant-domain` falla
- [ ] Request con dominio inválido falla
- [ ] Tenant inactivo retorna error 404

### End-to-End
- [ ] Flujo completo de compra en Tenant 1
- [ ] Flujo completo de compra en Tenant 2
- [ ] Orders creadas tienen el tenant correcto
- [ ] MP tokens usados son del tenant correcto
- [ ] Moneda e IVA aplicados correctamente

---

## 📝 Reportar Issues

Si encuentras problemas durante el testing:

1. **Tomar screenshots** de errores
2. **Copiar logs** de consola (backend y frontend)
3. **Documentar pasos** para reproducir el error
4. **Crear issue** en GitHub con toda la información

---

## 🎉 Testing Exitoso

Si todos los tests pasan, ¡felicidades! El sistema multi-tenant está funcionando correctamente.

**Próximos pasos:**
1. Deploy en Railway (backend)
2. Deploy en Cloudflare Pages (frontend)
3. Configuración de dominios custom
4. Onboarding de clientes reales

---

**Última actualización:** 2025-10-09
**Autor:** Quality E-commerce Team
**Versión del documento:** 1.0.0
