# 🌐 Configuración Multi-Dominio - DNS y SSL

> **Guía completa para configurar múltiples dominios custom en la arquitectura multi-tenant**
>
> **Última actualización:** 2025-10-09
> **Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Opciones de Configuración Multi-Dominio](#opciones-de-configuración-multi-dominio)
3. [Opción A: Subdominios con Wildcard DNS](#opción-a-subdominios-con-wildcard-dns)
4. [Opción B: Dominios Custom por Cliente](#opción-b-dominios-custom-por-cliente)
5. [Opción C: Híbrida (Ambas)](#opción-c-híbrida-ambas)
6. [Configuración DNS en Cloudflare](#configuración-dns-en-cloudflare)
7. [Guía para Clientes (Apuntar su Dominio)](#guía-para-clientes-apuntar-su-dominio)
8. [Verificación de DNS y SSL](#verificación-de-dns-y-ssl)
9. [Troubleshooting DNS](#troubleshooting-dns)
10. [Best Practices](#best-practices)

---

## 🎯 Introducción

La plataforma multi-tenant soporta **múltiples configuraciones de dominio** para máxima flexibilidad:

### Tipos de Configuración

| Opción | Ejemplo | Ventajas | Ideal Para |
|--------|---------|----------|------------|
| **Subdominios** | `cliente1.miapp.com` | ✅ Gratis, fácil setup, SSL automático | Clientes sin dominio propio |
| **Dominios Custom** | `tiendacliente.com` | ✅ White-label completo, mejor branding | Clientes con dominio propio |
| **Híbrida** | Ambas opciones | ✅ Máxima flexibilidad | Todos los casos |

### Arquitectura DNS Multi-Tenant

```
┌─────────────────────────────────────────────────────────┐
│            Clientes con Diferentes Dominios              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  cliente1.com    │  │  tienda-x.com    │            │
│  │  (CNAME)         │  │  (CNAME)         │            │
│  └────────┬─────────┘  └────────┬─────────┘            │
│           │                     │                       │
│           │  ┌──────────────────┐                      │
│           │  │ demo.miapp.com   │                      │
│           │  │ (Wildcard)       │                      │
│           │  └────────┬─────────┘                      │
│           │           │                                 │
│           ▼           ▼                                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │     Cloudflare Pages (Frontend)                  │  │
│  │     • Detecta tenant por hostname                │  │
│  │     • SSL automático para todos los dominios     │  │
│  │     • quality-frontend.pages.dev                 │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Opciones de Configuración Multi-Dominio

### Comparativa Detallada

| Característica | Subdominios | Dominios Custom | Híbrida |
|----------------|-------------|-----------------|---------|
| **Setup Inicial** | ⚡ 5 min | ⏱️ 1-24 hrs | ⏱️ Variable |
| **Costo** | 🆓 Gratis | 💰 Cliente paga dominio | 💰 Variable |
| **SSL** | ✅ Automático | ✅ Automático | ✅ Automático |
| **Branding** | 🟡 Compartido | ✅ White-label | ✅ White-label |
| **Complejidad** | ⭐ Fácil | ⭐⭐ Media | ⭐⭐ Media |
| **Control** | 🏢 Tú controlas | 👤 Cliente controla | 🤝 Compartido |

---

## 🏠 Opción A: Subdominios con Wildcard DNS

**Ideal para**: Clientes que no tienen dominio propio o quieren empezar rápido.

### Ventajas

- ✅ **Setup instantáneo** (5 minutos)
- ✅ **Gratis** (incluido en Cloudflare)
- ✅ **SSL automático** (sin configuración)
- ✅ **Tú controlas el DNS** (no depende del cliente)
- ✅ **Fácil de escalar** (agregar clientes = crear tenant en Strapi)

### Desventajas

- ❌ **No es white-label completo** (todos comparten `miapp.com`)
- ❌ **Menos personalización** de branding

### Configuración Paso a Paso

#### 1. Registrar Dominio Base

Registra un dominio para tu plataforma (ej: `miapp.com`):

- Namecheap, GoDaddy, Google Domains, etc.
- Costo: ~$10-15/año

#### 2. Agregar Dominio a Cloudflare

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click en **"Add a Site"**
3. Ingresa: `miapp.com`
4. Selecciona plan **Free**
5. Cloudflare escanea tus DNS records existentes
6. Click en **"Continue"**

#### 3. Cambiar Nameservers

Cloudflare te da 2 nameservers:

```
ns1.cloudflare.com
ns2.cloudflare.com
```

1. Ve a tu registrador de dominios (Namecheap, GoDaddy, etc.)
2. Busca **"Nameservers"** o **"DNS Settings"**
3. Cambia de **Custom Nameservers** a los de Cloudflare
4. Espera propagación (5-60 minutos)

#### 4. Configurar Wildcard DNS

En Cloudflare DNS:

1. Ve a **"DNS"** → **"Records"**
2. Click en **"Add record"**
3. Configura:

| Tipo | Nombre | Destino | Proxy |
|------|--------|---------|-------|
| `CNAME` | `*` | `quality-frontend.pages.dev` | ✅ Proxied |

Esto hace que **todos los subdominios** (`*.miapp.com`) apunten al frontend.

#### 5. Agregar Dominio Wildcard a Cloudflare Pages

1. Ve a tu proyecto en Cloudflare Pages
2. Click en **"Custom domains"**
3. Click en **"Set up a custom domain"**
4. Ingresa: `*.miapp.com`
5. Cloudflare verifica automáticamente (ya que controla el DNS)
6. SSL se emite automáticamente (~1-5 minutos)

#### 6. Crear Tenants en Strapi

Para cada cliente, crea un tenant con dominio de subdominio:

| Cliente | Dominio en Strapi |
|---------|-------------------|
| Cliente 1 | `cliente1.miapp.com` |
| Cliente 2 | `tienda-demo.miapp.com` |
| Cliente 3 | `ecommerce-x.miapp.com` |

#### 7. Verificar Funcionamiento

```bash
# Probar subdominios
curl https://cliente1.miapp.com
curl https://tienda-demo.miapp.com
curl https://ecommerce-x.miapp.com

# Todos deben retornar 200 OK con SSL válido
```

### Ejemplo de URL para Clientes

```
Cliente 1: https://tienda-calzado.miapp.com
Cliente 2: https://boutique-ropa.miapp.com
Cliente 3: https://electronics-store.miapp.com
```

---

## 🎨 Opción B: Dominios Custom por Cliente

**Ideal para**: Clientes que tienen su propio dominio y quieren white-label completo.

### Ventajas

- ✅ **White-label 100%** (cliente usa su dominio)
- ✅ **Mejor branding** y credibilidad
- ✅ **SSL automático** (Cloudflare se encarga)
- ✅ **Cliente controla su dominio**

### Desventajas

- ❌ **Setup más lento** (depende del cliente)
- ❌ **Requiere soporte** para guiar al cliente
- ❌ **Propagación DNS** puede tomar 1-24 horas

### Configuración Paso a Paso

#### 1. Cliente Registra Dominio

El cliente debe tener un dominio registrado (ej: `tiendacliente.com`)

#### 2. Agregar Dominio Custom a Cloudflare Pages

1. Ve a tu proyecto en Cloudflare Pages
2. Click en **"Custom domains"**
3. Click en **"Set up a custom domain"**
4. Ingresa: `tiendacliente.com`
5. Cloudflare muestra instrucciones DNS para el cliente

#### 3. Guiar al Cliente (Configuración DNS)

Envía al cliente estas instrucciones:

---

### 📧 Email para el Cliente

**Asunto:** Configuración de DNS para tu tienda online

Hola [Nombre del Cliente],

Para activar tu tienda en **tiendacliente.com**, necesitas configurar un registro DNS.

**Pasos:**

1. Inicia sesión en tu proveedor de dominios (Namecheap, GoDaddy, etc.)
2. Ve a **DNS Settings** o **DNS Management**
3. Agrega un nuevo registro **CNAME**:

```
Tipo: CNAME
Nombre: @ (o www, según prefieras)
Destino: quality-frontend.pages.dev
TTL: Automático (o 3600)
```

4. Guarda los cambios
5. Espera 1-24 horas para propagación DNS

**Verificación:**

Una vez configurado, tu tienda estará disponible en:
- https://tiendacliente.com (si usaste `@`)
- https://www.tiendacliente.com (si usaste `www`)

El certificado SSL se emitirá automáticamente (puede tomar 5-30 minutos).

¿Necesitas ayuda? Responde este email.

Saludos,
Quality Ecommerce Team

---

#### 4. Verificar Configuración del Cliente

```bash
# Verificar que DNS apunta correctamente
dig tiendacliente.com CNAME

# Debe retornar:
tiendacliente.com. 300 IN CNAME quality-frontend.pages.dev.
```

#### 5. Crear Tenant en Strapi

Una vez que el DNS esté configurado:

1. Ve a Strapi Admin
2. Crea nuevo tenant con:
   - **Nombre**: Tienda del Cliente
   - **Dominio**: `tiendacliente.com`
   - **Quality API Token**: `token_del_cliente`
   - **Mercado Pago Tokens**: `tokens_del_cliente`

#### 6. Verificar SSL y Funcionamiento

```bash
curl https://tiendacliente.com

# Debe retornar:
# - Status 200
# - SSL válido (🔒)
# - Contenido de la tienda del cliente
```

---

## 🔀 Opción C: Híbrida (Ambas)

**Ideal para**: Ofrecer máxima flexibilidad a los clientes.

### Estrategia

1. **Por defecto**: Todos los clientes empiezan con subdominio (`cliente.miapp.com`)
2. **Opcional**: Clientes pueden agregar su dominio custom después
3. **Resultado**: Cliente tiene ambas URLs funcionando

### Ejemplo

```
Cliente 1:
  - Subdominio: https://tienda-calzado.miapp.com ✅
  - Custom:     https://tiendacalzado.com ✅

Cliente 2:
  - Subdominio: https://boutique-x.miapp.com ✅
  - Custom:     (No configurado aún)
```

### Configuración en Strapi

Strapi soporta **múltiples dominios por tenant**:

Opción 1: Crear 2 tenants (uno por dominio)
Opción 2: Configurar redirect (subdominio → custom)

**Recomendado**: Crear 1 tenant con dominio primary y alias.

---

## ⚙️ Configuración DNS en Cloudflare

### Tipos de Registros DNS

| Tipo | Cuándo Usar | Ejemplo |
|------|-------------|---------|
| `CNAME` | Subdominios | `www` → `quality-frontend.pages.dev` |
| `CNAME` | Wildcard | `*` → `quality-frontend.pages.dev` |
| `A` | Root domain (alternativa) | `@` → IP de Cloudflare |

### Registro CNAME (Recomendado)

```
Tipo: CNAME
Nombre: www (o @ para root)
Destino: quality-frontend.pages.dev
Proxy: ✅ Proxied (naranja)
TTL: Auto
```

### Wildcard CNAME

```
Tipo: CNAME
Nombre: *
Destino: quality-frontend.pages.dev
Proxy: ✅ Proxied
TTL: Auto
```

### Proxy Status

| Estado | Descripción | Ventajas |
|--------|-------------|----------|
| **Proxied** 🟧 | Tráfico pasa por Cloudflare | ✅ SSL, caché, protección DDoS |
| **DNS only** ⚪ | Tráfico directo | ❌ Sin beneficios de Cloudflare |

**Recomendado**: Siempre usar **Proxied** (naranja)

---

## 📖 Guía para Clientes (Apuntar su Dominio)

### Instrucciones Simplificadas

Envía esto a tus clientes:

---

### 🎯 Cómo Conectar Tu Dominio a Tu Tienda

**Tiempo estimado:** 5 minutos + 1-24 horas de propagación

#### Paso 1: Acceder a tu Proveedor de Dominios

Ve al sitio donde compraste tu dominio:
- **Namecheap**: namecheap.com
- **GoDaddy**: godaddy.com
- **Google Domains**: domains.google.com
- Etc.

#### Paso 2: Ir a Configuración de DNS

Busca una opción llamada:
- "DNS Settings"
- "DNS Management"
- "Manage DNS"
- "Advanced DNS"

#### Paso 3: Agregar Registro CNAME

1. Click en **"Add Record"** o **"Add New Record"**
2. Completa:
   - **Tipo**: CNAME
   - **Host/Nombre**: `www` (o `@` si quieres sin www)
   - **Valor/Destino**: `quality-frontend.pages.dev`
   - **TTL**: Automático (o 3600)
3. Click en **"Save"** o **"Add Record"**

#### Paso 4: Esperar Propagación

- ⏱️ DNS tarda en propagarse: 5 minutos a 24 horas
- ✅ Recibirás un email cuando esté listo
- 🔒 SSL se activará automáticamente

#### ¿Tienes problemas?

Contáctanos: soporte@miapp.com

---

### Video Tutorial (Opcional)

Puedes grabar un video de 2-3 minutos mostrando estos pasos y compartirlo con clientes.

---

## ✅ Verificación de DNS y SSL

### Herramientas de Verificación

#### 1. Verificar DNS con dig

```bash
# Linux/Mac
dig tiendacliente.com CNAME

# Windows (PowerShell)
Resolve-DnsName tiendacliente.com -Type CNAME
```

Resultado esperado:

```
tiendacliente.com. 300 IN CNAME quality-frontend.pages.dev.
```

#### 2. Verificar DNS con nslookup

```bash
nslookup tiendacliente.com
```

Debe retornar IPs de Cloudflare:
```
Name:    quality-frontend.pages.dev
Addresses:  104.26.x.x
            172.67.x.x
```

#### 3. Verificar SSL

```bash
# Con curl
curl -I https://tiendacliente.com

# Debe retornar:
HTTP/2 200
```

#### 4. Verificar SSL en Navegador

1. Abre: `https://tiendacliente.com`
2. Click en el candado 🔒
3. Verifica:
   - ✅ Certificado válido
   - ✅ Emitido por: Let's Encrypt / Cloudflare
   - ✅ Sin advertencias

### Herramientas Online

- **DNS Checker**: [dnschecker.org](https://dnschecker.org)
- **SSL Checker**: [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)
- **Cloudflare Radar**: [radar.cloudflare.com](https://radar.cloudflare.com)

---

## 🐛 Troubleshooting DNS

### Problema: DNS no propaga (>24 horas)

**Causas posibles:**

1. **CNAME incorrecto**
   ```bash
   # Verificar con:
   dig tiendacliente.com CNAME

   # Debe apuntar a: quality-frontend.pages.dev
   ```

2. **TTL muy alto**
   - Verifica que TTL sea ≤ 3600 (1 hora)
   - Espera el tiempo del TTL anterior

3. **Caché de DNS local**
   ```bash
   # Limpiar caché DNS (Mac/Linux)
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns
   ```

**Solución:**

1. Verifica CNAME en proveedor de DNS
2. Espera TTL completo
3. Usa herramientas online para verificar desde diferentes ubicaciones

### Problema: SSL no se emite

**Causas:**

1. **DNS no propagado**
   - Cloudflare solo emite SSL cuando DNS está correcto
   - Espera a que `dig` retorne correctamente

2. **CAA Record bloqueando**
   ```bash
   dig tiendacliente.com CAA

   # Si existe, debe permitir Let's Encrypt:
   0 issue "letsencrypt.org"
   ```

3. **Dominio en blacklist**
   - Verifica que el dominio no esté en blacklist de certificadoras

**Solución:**

1. Espera 24 horas después de configurar DNS
2. Elimina CAA records restrictivos
3. Contacta soporte de Cloudflare si persiste

### Problema: "Error 522 - Connection Timed Out"

**Causa:** Cloudflare no puede conectar con el origen (Cloudflare Pages)

**Solución:**

1. Verifica que el dominio esté agregado en **Cloudflare Pages** → **Custom domains**
2. Verifica que el deploy esté activo (no pausado)
3. Revisa logs de Cloudflare Pages por errores

### Problema: "Error 525 - SSL Handshake Failed"

**Causa:** Problema de configuración SSL

**Solución:**

1. Ve a Cloudflare Dashboard → **SSL/TLS**
2. Configura modo: **Full** (no Full Strict)
3. Espera 5-10 minutos

---

## 📋 Best Practices

### 1. Estrategia Recomendada para Nuevos Clientes

```
┌─────────────────────────────────────────┐
│  Onboarding de Cliente                  │
├─────────────────────────────────────────┤
│  1. Crear tenant en Strapi              │
│  2. Asignar subdominio automáticamente  │
│     (cliente-nombre.miapp.com)          │
│  3. Cliente prueba la tienda            │
│  4. (Opcional) Cliente agrega dominio   │
│     custom (tiendacliente.com)          │
│  5. Migración suave (ambos funcionan)   │
└─────────────────────────────────────────┘
```

### 2. Naming Convention para Subdominios

Usa nombres cortos, descriptivos y sin espacios:

✅ **Bueno:**
- `tienda-calzado.miapp.com`
- `boutique-maria.miapp.com`
- `electronica-pro.miapp.com`

❌ **Malo:**
- `tienda del cliente 1.miapp.com` (espacios)
- `cliente1.miapp.com` (no descriptivo)
- `muy-largo-nombre-de-tienda-ejemplo.miapp.com` (muy largo)

### 3. Documentación para Clientes

Crea una página de ayuda pública:

```
https://miapp.com/help/custom-domain
```

Con:
- Video tutorial
- Screenshots paso a paso
- FAQs
- Soporte por email/chat

### 4. Automatización

Considera automatizar:

1. **Creación de subdominios**: Al crear tenant, auto-genera subdominio
2. **Emails de configuración**: Al agregar custom domain, auto-envía instrucciones
3. **Verificación de DNS**: Chequear automáticamente cada hora
4. **Notificaciones**: Avisar al cliente cuando DNS esté listo

### 5. Plan de Escalamiento

| Clientes | Estrategia |
|----------|------------|
| **1-10** | Subdominios manuales + soporte 1:1 para custom |
| **10-50** | Subdominios automáticos + guía self-service |
| **50-100** | Automatización completa + dashboard de cliente |
| **100+** | API para partners + white-label completo |

---

## 🎯 Resumen

### Configuración Rápida (5 minutos)

1. Configura wildcard DNS: `*.miapp.com` → `quality-frontend.pages.dev`
2. Agrega `*.miapp.com` a Cloudflare Pages
3. Crea tenants con subdominios
4. ✅ Listo - clientes pueden usar subdominios inmediatamente

### Configuración Custom (1-24 horas)

1. Cliente te da su dominio: `tiendacliente.com`
2. Agregas dominio a Cloudflare Pages
3. Envías instrucciones DNS al cliente
4. Cliente configura CNAME en su proveedor
5. Esperas propagación DNS (1-24 hrs)
6. SSL se emite automáticamente
7. ✅ Listo - cliente tiene su dominio custom

---

## 📞 Soporte

¿Problemas con DNS o SSL?

- 📧 Email: soporte@miapp.com
- 💬 Chat: miapp.com/chat
- 📖 Docs: miapp.com/docs

---

**Última actualización:** 2025-10-09
**Mantenido por:** Quality Ecommerce Team
**Versión:** 1.0.0
