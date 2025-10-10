# 🌱 Seeds para Testing Multi-Tenant

Este directorio contiene scripts para crear datos de prueba en el sistema multi-tenant.

## 📦 Archivos Incluidos

- `01-tenants-seed.js` - Crea 2 tenants de prueba
- `02-themes-seed.js` - Crea 4 themes (2 por tenant)
- `03-site-config-seed.js` - Crea configuraciones de sitio
- `04-orders-seed.js` - Crea 5 órdenes de prueba
- `index.js` - Script principal que ejecuta todos los seeds en orden

## ⚠️ Limitación Importante: TypeScript

**Problema:** Los scripts de seed no pueden ejecutarse directamente con `pnpm seed` porque Strapi usa archivos de configuración TypeScript (`.ts`) y el loader de Node.js no puede cargarlos en tiempo de ejecución.

**Soluciones disponibles:**

### Opción 1: Crear datos desde Strapi Admin (Recomendado para pruebas rápidas)

1. Iniciar Strapi:
```bash
pnpm develop
```

2. Acceder al admin: http://localhost:1337/admin

3. Crear manualmente:
   - 2 Tenants (Content Manager → Tenant)
   - 4 Themes vinculados a los tenants
   - 2 Site Configs
   - 5 Orders de prueba

**Datos de los tenants:**

```
Tenant 1:
- Nombre: "Tienda Quality Demo 1"
- Dominio: "localhost:4321"
- Quality API Token: "TEST_TOKEN_QUALITY_DEMO_1_ABC123"
- MP Access Token: "TEST-1234567890-123456-1234567890abcdef-1234567890"
- MP Public Key: "TEST-12345678-1234-1234-1234-123456789012"
- Plan: basic
- Moneda: COP
- IVA: 0.19

Tenant 2:
- Nombre: "Tienda Quality Demo 2"
- Dominio: "demo2.local:4321"
- Quality API Token: "TEST_TOKEN_QUALITY_DEMO_2_XYZ789"
- MP Access Token: "TEST-0987654321-654321-0987654321fedcba-0987654321"
- MP Public Key: "TEST-87654321-4321-4321-4321-210987654321"
- Plan: premium
- Moneda: USD
- IVA: 0.16
```

### Opción 2: Usar TypeScript directamente

1. Instalar `ts-node` y `tsx`:
```bash
pnpm add -D ts-node tsx
```

2. Ejecutar con tsx:
```bash
npx tsx database/seeds/index.js
```

### Opción 3: Convertir configuración a JavaScript

1. Convertir archivos `.ts` en `/config` a `.js`:
   - `config/database.ts` → `config/database.js`
   - `config/server.ts` → `config/server.js`
   - `config/admin.ts` → `config/admin.js`
   - `config/middlewares.ts` → `config/middlewares.js`
   - `config/api.ts` → `config/api.js`

2. Luego ejecutar:
```bash
pnpm seed
```

## 🚀 Uso de los Seeds (Una vez resuelto el problema de TS)

### Ejecutar todos los seeds en orden:

```bash
pnpm seed
```

### Ejecutar seeds individuales:

```bash
# Solo tenants
pnpm seed:tenants

# Solo themes (requiere tenants creados)
pnpm seed:themes

# Solo site configs (requiere tenants y themes)
pnpm seed:site-config

# Solo orders (requiere tenants)
pnpm seed:orders
```

## 📊 Datos Creados

Cuando se ejecutan los seeds exitosamente:

```
✅ 2 Tenants
   • Tienda Quality Demo 1 (localhost:4321)
   • Tienda Quality Demo 2 (demo2.local:4321)

✅ 4 Themes
   • Default Azul (Tenant 1) - ACTIVO
   • Black Friday (Tenant 1) - Inactivo
   • Default Verde (Tenant 2) - ACTIVO
   • Navidad (Tenant 2) - Inactivo

✅ 2 Site Configs
   • Configuración completa para Tenant 1
   • Configuración completa para Tenant 2

✅ 5 Orders
   • 3 orders para Tenant 1 (estados: pendiente, pagado, completado)
   • 2 orders para Tenant 2 (estados: pendiente, enviado)
```

## 🧪 Próximos Pasos

Una vez creados los datos:

1. Verificar en Strapi Admin que los datos se crearon correctamente
2. Configurar `/etc/hosts` para agregar `demo2.local`
3. Seguir la guía: `/docs/TESTING_MULTI_TENANT.md`
4. Validar aislamiento de datos entre tenants

## 🐛 Troubleshooting

### Error: "Config file not loaded"

Esto significa que Strapi no puede cargar archivos `.ts` en tiempo de ejecución. Usa una de las opciones descritas arriba.

### Error: "Cannot destructure property 'client'"

La configuración de database no se cargó. Verifica que `config/database.ts` exporta correctamente o conviértelo a `.js`.

### Seeds se ejecutan pero no crean datos

Verifica:
1. Que Strapi esté detenido (no puede estar corriendo con `pnpm develop`)
2. Que la base de datos esté accesible
3. Los logs de error en consola

## 📝 Notas

- Los seeds limpian datos existentes antes de crear nuevos
- Usa datos de sandbox de Mercado Pago (no son tokens reales)
- Los Quality API tokens son de prueba
- Las fechas de las orders son relativas a la fecha de ejecución

---

**Última actualización:** 2025-10-09
**Autor:** Quality E-commerce Team
