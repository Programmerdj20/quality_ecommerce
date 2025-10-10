# 👥 Onboarding de Clientes - Proceso Completo

> **Guía paso a paso para agregar nuevos clientes a la plataforma multi-tenant**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Checklist de Onboarding](#checklist-de-onboarding)
3. [Pre-Onboarding: Recopilación de Información](#pre-onboarding-recopilación-de-información)
4. [Paso 1: Crear Tenant en Strapi](#paso-1-crear-tenant-en-strapi)
5. [Paso 2: Configurar Quality API Token](#paso-2-configurar-quality-api-token)
6. [Paso 3: Configurar Mercado Pago](#paso-3-configurar-mercado-pago)
7. [Paso 4: Configurar Dominio](#paso-4-configurar-dominio)
8. [Paso 5: Crear Theme Inicial](#paso-5-crear-theme-inicial)
9. [Paso 6: Crear Site Config](#paso-6-crear-site-config)
10. [Paso 7: Testing de la Tienda](#paso-7-testing-de-la-tienda)
11. [Post-Onboarding: Entrega y Capacitación](#post-onboarding-entrega-y-capacitación)
12. [Script Automatizado](#script-automatizado)
13. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

Este documento describe el proceso completo para agregar un nuevo cliente a la plataforma multi-tenant.

### Tiempo Estimado

| Método | Tiempo |
|--------|--------|
| **Manual** (Strapi Admin) | 15-20 minutos |
| **Script CLI** | 5 minutos |
| **API** (futuro) | 2 minutos |

### Roles Involucrados

| Rol | Responsabilidad |
|-----|-----------------|
| **Admin de Plataforma** | Crear tenant, configurar tokens |
| **Cliente** | Proveer información, configurar DNS (si tiene dominio custom) |
| **Soporte** | Asistir al cliente, validar configuración |

---

## ✅ Checklist de Onboarding

Usa esta checklist para cada nuevo cliente:

### Pre-Onboarding
- [ ] Recopilar información del cliente (ver sección siguiente)
- [ ] Validar que cliente tiene cuenta en Quality API
- [ ] Validar que cliente tiene cuenta en Mercado Pago
- [ ] Confirmar plan contratado (Free, Basic, Premium)

### Configuración Técnica
- [ ] Crear tenant en Strapi
- [ ] Configurar Quality API Token
- [ ] Configurar Mercado Pago Access Token
- [ ] Configurar Mercado Pago Public Key
- [ ] Asignar dominio (subdominio o custom)
- [ ] Configurar DNS (si es dominio custom)
- [ ] Crear theme default
- [ ] Crear site-config con datos del cliente

### Testing
- [ ] Verificar que la tienda carga correctamente
- [ ] Probar búsqueda y filtros de productos
- [ ] Probar agregar al carrito
- [ ] Probar checkout con Mercado Pago (sandbox)
- [ ] Validar que datos están aislados (no ve otros tenants)
- [ ] Verificar SSL y dominio

### Entrega
- [ ] Enviar credenciales de acceso al cliente
- [ ] Proveer guía de uso
- [ ] Capacitación inicial (opcional)
- [ ] Programar seguimiento (1 semana)

---

## 📝 Pre-Onboarding: Recopilación de Información

Antes de crear el tenant, recopila esta información del cliente:

### Información Requerida

#### 1. Información del Negocio

```yaml
Nombre del Negocio: _____________________________
Slug (URL-friendly): _____________________________
  Ejemplo: "Tienda María" → "tienda-maria"

País: _____________________________
Moneda: _____________________________
  Opciones: COP, USD, MXN, etc.

Tasa de IVA: _____________________________
  Ejemplo: 0.19 (Colombia), 0.16 (México)
```

#### 2. Información de Contacto

```yaml
Email de Contacto: _____________________________
Teléfono: _____________________________
Dirección: _____________________________
WhatsApp: _____________________________ (opcional)
```

#### 3. Redes Sociales (Opcional)

```yaml
Facebook: _____________________________
Instagram: _____________________________
Twitter/X: _____________________________
```

#### 4. Tokens y Credenciales

```yaml
Quality API Token: _____________________________
  (Proporcionado por el backend contable existente)

Mercado Pago Access Token: _____________________________
  (Obtener desde: https://www.mercadopago.com/developers)

Mercado Pago Public Key: _____________________________
  (Obtener desde: https://www.mercadopago.com/developers)
```

#### 5. Dominio

```yaml
Tipo de Dominio:
  [ ] Subdominio (cliente-nombre.miapp.com) - Gratis, rápido
  [ ] Dominio Custom (tiendacliente.com) - Requiere configuración DNS

Dominio Deseado: _____________________________
```

#### 6. Branding (Opcional)

```yaml
Logo URL: _____________________________
  (Imagen cuadrada, mín 200x200px, formato PNG/JPG)

Color Primario: _____________________________
  Ejemplo: #2563eb (azul), #10b981 (verde)

Color Secundario: _____________________________
```

#### 7. Plan Contratado

```yaml
Plan:
  [ ] Free (prueba)
  [ ] Basic ($X/mes)
  [ ] Premium ($Y/mes)
```

---

## 🏗️ Paso 1: Crear Tenant en Strapi

### Opción A: Manual (Strapi Admin)

1. Accede a Strapi Admin:
   ```
   https://quality-backend.up.railway.app/admin
   ```

2. Inicia sesión con tus credenciales de administrador

3. Ve a **Content Manager** → **Tenant** → **Create new entry**

4. Completa el formulario:

#### Campos Básicos

| Campo | Valor | Ejemplo |
|-------|-------|---------|
| **Nombre** | Nombre del negocio | "Tienda María Calzados" |
| **Slug** | URL-friendly (auto-generado) | "tienda-maria-calzados" |
| **Dominio** | Dominio asignado | "tienda-maria.miapp.com" |
| **Activo** | ✅ Checked | true |
| **Plan Actual** | Plan contratado | "basic" |

#### Tokens de API

| Campo | Valor |
|-------|-------|
| **Quality API Token** | Token proporcionado por el cliente |
| **Mercado Pago Access Token** | Token de MP del cliente |
| **Mercado Pago Public Key** | Public Key de MP del cliente |

#### Configuración (JSON)

```json
{
  "logo": "https://ejemplo.com/logo.png",
  "logoAlt": "Logo de Tienda María",
  "colores": {
    "primario": "#2563eb",
    "secundario": "#1e40af",
    "acento": "#f59e0b"
  },
  "moneda": "COP",
  "simboloMoneda": "$",
  "locale": "es-CO",
  "pais": "Colombia",
  "iva": 0.19,
  "contacto": {
    "email": "contacto@tiendamaria.com",
    "telefono": "+57 300 123 4567",
    "direccion": "Calle 123 #45-67, Bogotá",
    "whatsapp": "+57 300 123 4567"
  },
  "redesSociales": {
    "facebook": "https://facebook.com/tiendamaria",
    "instagram": "https://instagram.com/tiendamaria",
    "twitter": "https://twitter.com/tiendamaria"
  },
  "seo": {
    "tituloSitio": "Tienda María - Calzados y Accesorios",
    "descripcion": "La mejor tienda de calzados en Colombia",
    "keywords": "calzados, zapatos, colombia, tienda online"
  }
}
```

5. Click en **Save**

6. Click en **Publish**

7. **Copia el ID del tenant** (lo necesitarás para crear theme y site-config)

### Opción B: Script CLI (Automatizado)

```bash
# Desde el directorio backend
cd backend

# Ejecutar script de creación de tenant
node scripts/create-tenant.js \
  --nombre="Tienda María Calzados" \
  --dominio="tienda-maria.miapp.com" \
  --qualityToken="ABC123..." \
  --mpAccessToken="TEST-123..." \
  --mpPublicKey="TEST-abc..." \
  --plan="basic" \
  --email="contacto@tiendamaria.com" \
  --telefono="+57 300 123 4567"

# El script crea automáticamente:
# - Tenant
# - Theme default
# - Site-config default
```

Ver sección [Script Automatizado](#script-automatizado) para más detalles.

---

## 🔑 Paso 2: Configurar Quality API Token

### ¿Qué es el Quality API Token?

El token que permite al frontend consultar productos del backend contable existente del cliente.

### Obtener el Token

1. El cliente debe tener cuenta en el backend Quality (Heroku)
2. El token se genera desde el panel de Quality API
3. Cada cliente tiene un token único que solo ve sus productos

### Validar el Token

```bash
# Probar que el token funciona
curl https://quality-api.herokuapp.com/api/productos \
  -H "Authorization: Bearer QUALITY_TOKEN_DEL_CLIENTE"

# Debe retornar lista de productos (status 200)
```

### Configurar en Strapi

Ya lo configuraste en el Paso 1, pero verifica:

1. Ve al tenant creado
2. Campo **Quality API Token** debe tener el token
3. El token es **privado** (no se expone al cliente final)

---

## 💳 Paso 3: Configurar Mercado Pago

### Obtener Credenciales de Mercado Pago

El cliente debe:

1. Crear cuenta en [Mercado Pago](https://www.mercadopago.com)
2. Ir a [Developers Panel](https://www.mercadopago.com/developers)
3. Ir a **Tus credenciales**
4. Copiar:
   - **Access Token** (TEST para sandbox, PROD para producción)
   - **Public Key** (TEST para sandbox, PROD para producción)

### Credenciales de Prueba vs Producción

| Entorno | Access Token | Public Key | Cuándo Usar |
|---------|--------------|------------|-------------|
| **TEST** | Empieza con `TEST-` | Empieza con `TEST-` | Desarrollo, pruebas |
| **PROD** | Empieza con `APP_USR-` | Empieza con `APP_USR-` | Producción real |

⚠️ **IMPORTANTE**: Nunca uses tokens PROD en desarrollo.

### Configurar en Strapi

Ya lo configuraste en el Paso 1, verifica:

1. Campo **Mercado Pago Access Token**: `TEST-123...` o `APP_USR-123...`
2. Campo **Mercado Pago Public Key**: `TEST-abc...` o `APP_USR-abc...`

### Validar Configuración

```bash
# Probar Access Token
curl -X GET \
  "https://api.mercadopago.com/v1/payment_methods" \
  -H "Authorization: Bearer ACCESS_TOKEN_DEL_CLIENTE"

# Debe retornar lista de métodos de pago disponibles
```

---

## 🌐 Paso 4: Configurar Dominio

### Opción A: Subdominio (Recomendado para Inicio)

1. Ya asignaste el dominio en el Paso 1: `tienda-maria.miapp.com`
2. El wildcard DNS (`*.miapp.com`) ya está configurado (ver `/docs/DOMAIN_SETUP.md`)
3. ✅ **No requiere acción adicional** - funciona inmediatamente

### Opción B: Dominio Custom del Cliente

Si el cliente quiere usar su propio dominio (`tiendamaria.com`):

1. Agrega el dominio a Cloudflare Pages:
   - Ve a **Workers & Pages** → Tu proyecto → **Custom domains**
   - Click en **Set up a custom domain**
   - Ingresa: `tiendamaria.com`

2. Envía instrucciones DNS al cliente:

```
Para: contacto@tiendamaria.com
Asunto: Configuración de DNS para tu tienda

Hola,

Para activar tu tienda en tiendamaria.com, configura esto en tu proveedor de dominios:

Tipo: CNAME
Nombre: @ (o www)
Destino: quality-frontend.pages.dev
TTL: 3600

Espera 1-24 horas para propagación.

Saludos,
Quality Team
```

3. Actualiza el tenant en Strapi:
   - Campo **Dominio**: Cambia de `tienda-maria.miapp.com` a `tiendamaria.com`

4. Espera propagación DNS (1-24 horas)

Ver `/docs/DOMAIN_SETUP.md` para más detalles.

---

## 🎨 Paso 5: Crear Theme Inicial

### Opción A: Manual (Strapi Admin)

1. Ve a **Content Manager** → **Theme** → **Create new entry**

2. Completa el formulario:

| Campo | Valor | Ejemplo |
|-------|-------|---------|
| **Nombre** | Nombre del theme | "Default Azul" |
| **Tenant** | Selecciona el tenant creado | "Tienda María Calzados" |
| **Activo** | ✅ Checked | true |

3. Configuración de Colores (JSON):

```json
{
  "primario": "#2563eb",
  "secundario": "#1e40af",
  "acento": "#f59e0b",
  "fondo": "#ffffff",
  "texto": "#1f2937",
  "error": "#ef4444",
  "exito": "#10b981",
  "advertencia": "#f59e0b"
}
```

4. Tipografía (JSON):

```json
{
  "fuente": "Inter",
  "fuenteURL": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap",
  "fuenteTitulos": "Inter",
  "tamanoBase": "16px"
}
```

5. Click en **Save** y **Publish**

### Opción B: Script CLI

El script `create-tenant.js` crea automáticamente un theme default.

### Themes Pre-configurados

Puedes ofrecer themes predefinidos:

| Theme | Colores | Ideal Para |
|-------|---------|------------|
| **Azul Corporativo** | Azul + Blanco | Empresas, tecnología |
| **Verde Ecológico** | Verde + Beige | Productos orgánicos, naturaleza |
| **Rojo Energético** | Rojo + Negro | Deportes, energía |
| **Rosa Elegante** | Rosa + Blanco | Moda femenina, belleza |

---

## ⚙️ Paso 6: Crear Site Config

### Manual (Strapi Admin)

1. Ve a **Content Manager** → **Site Config** → **Create new entry**

2. Completa el formulario:

| Campo | Valor |
|-------|-------|
| **Tenant** | Selecciona el tenant |
| **Theme** | Selecciona el theme creado |
| **Site Name** | Nombre de la tienda |
| **Tagline** | Slogan corto |

3. Banners (JSON):

```json
[
  {
    "titulo": "Bienvenido a Tienda María",
    "subtitulo": "Los mejores calzados de Colombia",
    "imagen": "https://ejemplo.com/banner1.jpg",
    "cta": "Ver Productos",
    "link": "/productos"
  }
]
```

4. Textos Legales (JSON):

```json
{
  "terminosYCondiciones": "https://tiendamaria.com/terminos",
  "politicaPrivacidad": "https://tiendamaria.com/privacidad",
  "politicaDevoluciones": "https://tiendamaria.com/devoluciones"
}
```

5. Click en **Save** y **Publish**

### Script CLI

El script `create-tenant.js` crea automáticamente un site-config básico.

---

## ✅ Paso 7: Testing de la Tienda

### Testing Manual

#### 1. Acceder a la Tienda

```bash
# Si es subdominio:
https://tienda-maria.miapp.com

# Si es dominio custom:
https://tiendamaria.com
```

#### 2. Verificar Branding

- [x] Logo se muestra correctamente
- [x] Colores del theme aplicados
- [x] Nombre de la tienda correcto
- [x] Footer con información de contacto

#### 3. Verificar Productos

- [x] Productos se cargan (del Quality API del cliente)
- [x] Imágenes se muestran
- [x] Precios correctos (con IVA aplicado)
- [x] Stock actualizado

#### 4. Probar Carrito

- [x] Agregar producto al carrito
- [x] Modificar cantidad
- [x] Eliminar producto
- [x] Carrito persiste en localStorage

#### 5. Probar Checkout (Sandbox)

```bash
# Usar tarjeta de prueba de Mercado Pago:
Número: 5031 7557 3453 0604
CVV: 123
Vencimiento: 11/25
Titular: APRO
DNI: 12345678
```

- [x] Formulario de checkout carga
- [x] Crear preferencia de MP funciona
- [x] Redirección a Mercado Pago
- [x] Pago se procesa (sandbox)
- [x] Webhook actualiza orden en Strapi
- [x] Email de confirmación (opcional)

#### 6. Verificar Aislamiento

Accede a otro tenant y verifica que:

- [x] No ve productos del cliente nuevo
- [x] No ve órdenes del cliente nuevo
- [x] Themes y configs son independientes

### Testing Automatizado (Opcional)

```bash
# Desde el frontend
cd frontend

# Ejecutar tests E2E
pnpm playwright test --project=chromium

# Tests específicos de multi-tenant
pnpm playwright test tests/multi-tenant.spec.ts
```

---

## 📧 Post-Onboarding: Entrega y Capacitación

### Email de Bienvenida al Cliente

```
Asunto: ¡Tu tienda online está lista! 🎉

Hola [Nombre del Cliente],

¡Tu tienda online ya está activa!

🌐 URL de tu tienda: https://tienda-maria.miapp.com

📊 Panel de Administración: (próximamente)

🎨 Configuración:
- Logo: ✅ Configurado
- Colores: ✅ Aplicados
- Productos: ✅ Sincronizados con Quality API
- Mercado Pago: ✅ Activo (modo prueba)

📝 Próximos Pasos:

1. Revisa tu tienda y valida que todo esté correcto
2. Prueba un pedido de prueba (usa tarjeta sandbox)
3. Si tienes dominio propio, configura DNS (ver guía adjunta)
4. Cuando estés listo, cambiamos a modo producción

¿Necesitas ayuda?
📧 soporte@miapp.com
💬 WhatsApp: +57 300 123 4567

¡Éxito con tu tienda! 🚀

Saludos,
Quality Ecommerce Team
```

### Guía de Uso (Adjunta)

Incluye un PDF con:

1. Cómo acceder a la tienda
2. Cómo se sincronizan los productos
3. Cómo configurar DNS (si tiene dominio custom)
4. Cómo cambiar de sandbox a producción en Mercado Pago
5. Soporte y contacto

### Capacitación Inicial (Opcional)

Programa una videollamada de 30 minutos para:

- Mostrar la tienda funcionando
- Explicar cómo se actualizan productos
- Enseñar a ver órdenes en Strapi
- Responder preguntas

### Seguimiento

- **Día 1**: Email de bienvenida
- **Día 7**: Check-in (¿cómo va todo?)
- **Día 30**: Solicitar feedback
- **Día 60**: Ofrecer upgrade de plan (si aplica)

---

## 🤖 Script Automatizado

El script `create-tenant.js` automatiza todo el proceso.

### Instalación

El script ya está en:

```
/backend/scripts/create-tenant.js
```

### Uso

```bash
cd backend

node scripts/create-tenant.js \
  --nombre="Tienda María Calzados" \
  --slug="tienda-maria" \
  --dominio="tienda-maria.miapp.com" \
  --qualityToken="ABC123..." \
  --mpAccessToken="TEST-123..." \
  --mpPublicKey="TEST-abc..." \
  --plan="basic" \
  --email="contacto@tiendamaria.com" \
  --telefono="+57 300 123 4567" \
  --pais="Colombia" \
  --moneda="COP" \
  --iva="0.19"
```

### Parámetros

| Parámetro | Requerido | Descripción | Ejemplo |
|-----------|-----------|-------------|---------|
| `--nombre` | ✅ | Nombre del negocio | "Tienda María" |
| `--slug` | ❌ | Slug (auto-generado) | "tienda-maria" |
| `--dominio` | ✅ | Dominio asignado | "tienda-maria.miapp.com" |
| `--qualityToken` | ✅ | Token de Quality API | "ABC123..." |
| `--mpAccessToken` | ✅ | MP Access Token | "TEST-123..." |
| `--mpPublicKey` | ✅ | MP Public Key | "TEST-abc..." |
| `--plan` | ❌ | Plan (default: free) | "basic" |
| `--email` | ❌ | Email de contacto | "info@tienda.com" |
| `--telefono` | ❌ | Teléfono | "+57 300 123 4567" |
| `--pais` | ❌ | País (default: Colombia) | "Colombia" |
| `--moneda` | ❌ | Moneda (default: COP) | "COP" |
| `--iva` | ❌ | IVA (default: 0.19) | "0.19" |

### Output

```bash
✓ Conectado a Strapi
✓ Tenant creado: ID 5
✓ Theme default creado: ID 12
✓ Site-config creado: ID 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cliente onboarding completado! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Información del Tenant:

  Nombre: Tienda María Calzados
  Dominio: https://tienda-maria.miapp.com
  Plan: basic
  Tenant ID: 5

🎨 Theme: Default Azul (ID: 12)
⚙️  Site Config: ID 8

🔗 Próximos pasos:

  1. Accede a: https://tienda-maria.miapp.com
  2. Valida que productos se cargan
  3. Prueba checkout con tarjeta sandbox
  4. Envía email de bienvenida al cliente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ver `/backend/scripts/create-tenant.js` para detalles de implementación.

---

## 🐛 Troubleshooting

### Problema: Tenant creado pero tienda muestra "Tenant no encontrado"

**Causa**: Dominio mal configurado

**Solución**:

1. Verifica que el campo **Dominio** en Strapi sea exactamente: `tienda-maria.miapp.com`
2. NO incluyas `http://` o `https://`
3. NO incluyas puerto (`:4321`)
4. Re-publica el tenant (Save + Publish)

### Problema: Productos no se cargan

**Causa**: Quality API Token inválido

**Solución**:

```bash
# Validar token
curl https://quality-api.herokuapp.com/api/productos \
  -H "Authorization: Bearer QUALITY_TOKEN"

# Si falla (401), el token es inválido
# Solicita nuevo token al cliente
```

### Problema: Checkout falla con "Invalid credentials"

**Causa**: Mercado Pago tokens incorrectos

**Solución**:

1. Verifica que Access Token empiece con `TEST-` (sandbox) o `APP_USR-` (prod)
2. Verifica que Public Key coincida con el Access Token
3. Prueba los tokens directamente:

```bash
curl -X GET \
  "https://api.mercadopago.com/v1/payment_methods" \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

### Problema: Dominio custom no funciona (DNS)

**Causa**: DNS no propagado o mal configurado

**Solución**:

```bash
# Verificar DNS
dig tiendamaria.com CNAME

# Debe retornar:
tiendamaria.com. 300 IN CNAME quality-frontend.pages.dev.

# Si no retorna esto, DNS está mal configurado
```

Ver `/docs/DOMAIN_SETUP.md` → Troubleshooting DNS

### Problema: SSL no se emite para dominio custom

**Causa**: DNS no propagado

**Solución**:

1. Espera 24 horas después de configurar DNS
2. Verifica en Cloudflare Pages → Custom domains
3. Debe mostrar: ✅ Active
4. Si muestra "Pending", espera más tiempo

---

## 📊 Métricas de Onboarding

Rastrea estas métricas:

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| **Tiempo de onboarding** | <15 min | ___ min |
| **Tasa de éxito first-try** | >90% | ___% |
| **Clientes activos/mes** | 10+ | ___ |
| **Tickets de soporte/cliente** | <2 | ___ |

---

## 🎯 Resumen

### Onboarding Rápido (5 pasos)

1. ✅ **Recopilar información** del cliente
2. ✅ **Crear tenant** en Strapi (manual o script)
3. ✅ **Asignar dominio** (subdominio o custom)
4. ✅ **Validar configuración** (productos, MP, branding)
5. ✅ **Entregar tienda** y capacitar al cliente

### Checklist Final

Antes de dar por completado el onboarding:

- [x] Tienda carga sin errores
- [x] Productos se muestran correctamente
- [x] Checkout funciona (sandbox)
- [x] Branding aplicado (logo, colores)
- [x] Dominio configurado y SSL activo
- [x] Cliente recibió email de bienvenida
- [x] Soporte programado (seguimiento)

---

## 📞 Soporte

¿Problemas durante onboarding?

- 📧 Email: soporte@miapp.com
- 💬 Slack: #onboarding
- 📖 Docs: miapp.com/docs/onboarding

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
