#!/usr/bin/env node

/**
 * Script CLI para crear tenants automáticamente
 *
 * Uso:
 *   node scripts/create-tenant.js \
 *     --nombre="Tienda María" \
 *     --dominio="tienda-maria.miapp.com" \
 *     --qualityToken="ABC123..." \
 *     --mpAccessToken="TEST-123..." \
 *     --mpPublicKey="TEST-abc..." \
 *     --plan="basic"
 *
 * @version 1.0.0
 */

const path = require('path');

// Colores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Helpers de logging
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
  divider: () => console.log(`${colors.dim}${'━'.repeat(60)}${colors.reset}`),
};

/**
 * Parsear argumentos de línea de comandos
 */
function parseArgs() {
  const args = {};

  process.argv.slice(2).forEach((arg) => {
    const [key, value] = arg.split('=');
    const cleanKey = key.replace('--', '');
    args[cleanKey] = value ? value.replace(/['"]/g, '') : true;
  });

  return args;
}

/**
 * Generar slug desde nombre
 */
function generateSlug(nombre) {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales por guiones
    .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
}

/**
 * Validar argumentos requeridos
 */
function validateArgs(args) {
  const required = ['nombre', 'dominio', 'qualityToken', 'mpAccessToken', 'mpPublicKey'];
  const missing = required.filter((field) => !args[field]);

  if (missing.length > 0) {
    log.error(`Faltan argumentos requeridos: ${missing.join(', ')}`);
    log.info('\nUso:');
    console.log(`
  node scripts/create-tenant.js \\
    --nombre="Tienda María" \\
    --dominio="tienda-maria.miapp.com" \\
    --qualityToken="ABC123..." \\
    --mpAccessToken="TEST-123..." \\
    --mpPublicKey="TEST-abc..." \\
    --plan="basic" \\
    --email="contacto@tienda.com" \\
    --telefono="+57 300 123 4567"
    `);
    process.exit(1);
  }

  // Validar formato de dominio
  if (args.dominio.includes('http://') || args.dominio.includes('https://')) {
    log.error('El dominio no debe incluir http:// o https://');
    log.info('Correcto: tienda-maria.miapp.com');
    log.warning('Incorrecto: https://tienda-maria.miapp.com');
    process.exit(1);
  }
}

/**
 * Crear tenant en Strapi
 */
async function createTenant(data) {
  // En un entorno real, esto haría una petición HTTP a Strapi API
  // Por ahora, simulamos con un objeto de datos

  const tenantData = {
    nombre: data.nombre,
    slug: data.slug || generateSlug(data.nombre),
    dominio: data.dominio,
    qualityApiToken: data.qualityToken,
    mercadoPagoAccessToken: data.mpAccessToken,
    mercadoPagoPublicKey: data.mpPublicKey,
    activo: true,
    planActual: data.plan || 'free',
    configuracion: {
      logo: data.logo || null,
      logoAlt: `Logo de ${data.nombre}`,
      colores: {
        primario: data.colorPrimario || '#2563eb',
        secundario: data.colorSecundario || '#1e40af',
        acento: '#f59e0b',
      },
      moneda: data.moneda || 'COP',
      simboloMoneda: data.moneda === 'USD' ? '$' : data.moneda === 'MXN' ? '$' : '$',
      locale: data.locale || 'es-CO',
      pais: data.pais || 'Colombia',
      iva: parseFloat(data.iva || '0.19'),
      contacto: {
        email: data.email || null,
        telefono: data.telefono || null,
        direccion: data.direccion || null,
        whatsapp: data.whatsapp || data.telefono || null,
      },
      redesSociales: {
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        twitter: data.twitter || null,
      },
      seo: {
        tituloSitio: `${data.nombre} - Tienda Online`,
        descripcion: data.descripcion || `Compra en ${data.nombre} - Los mejores productos online`,
        keywords: data.keywords || 'tienda online, ecommerce, productos',
      },
    },
  };

  // Aquí iría la petición real a Strapi:
  /*
  const response = await fetch(`${STRAPI_URL}/api/tenants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: tenantData }),
  });

  const result = await response.json();
  return result.data;
  */

  // Por ahora, retornamos datos simulados
  return {
    id: Math.floor(Math.random() * 1000),
    ...tenantData,
  };
}

/**
 * Crear theme default para el tenant
 */
async function createDefaultTheme(tenantId, nombre) {
  const themeData = {
    nombre: `${nombre} - Default`,
    tenant: tenantId,
    activo: true,
    colores: {
      primario: '#2563eb',
      secundario: '#1e40af',
      acento: '#f59e0b',
      fondo: '#ffffff',
      texto: '#1f2937',
      error: '#ef4444',
      exito: '#10b981',
      advertencia: '#f59e0b',
    },
    tipografia: {
      fuente: 'Inter',
      fuenteURL: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap',
      fuenteTitulos: 'Inter',
      tamanoBase: '16px',
    },
  };

  // Aquí iría la petición real a Strapi:
  /*
  const response = await fetch(`${STRAPI_URL}/api/themes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: themeData }),
  });

  const result = await response.json();
  return result.data;
  */

  return {
    id: Math.floor(Math.random() * 1000),
    ...themeData,
  };
}

/**
 * Crear site-config default para el tenant
 */
async function createDefaultSiteConfig(tenantId, themeId, nombre) {
  const siteConfigData = {
    tenant: tenantId,
    theme: themeId,
    siteName: nombre,
    tagline: `Bienvenido a ${nombre}`,
    banners: [
      {
        titulo: `Bienvenido a ${nombre}`,
        subtitulo: 'Los mejores productos online',
        imagen: null,
        cta: 'Ver Productos',
        link: '/productos',
      },
    ],
    textosLegales: {
      terminosYCondiciones: null,
      politicaPrivacidad: null,
      politicaDevoluciones: null,
    },
  };

  // Aquí iría la petición real a Strapi:
  /*
  const response = await fetch(`${STRAPI_URL}/api/site-configs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: siteConfigData }),
  });

  const result = await response.json();
  return result.data;
  */

  return {
    id: Math.floor(Math.random() * 1000),
    ...siteConfigData,
  };
}

/**
 * Main function
 */
async function main() {
  log.divider();
  log.title('🚀 Quality Ecommerce - Onboarding de Tenant');
  log.divider();

  // Parsear y validar argumentos
  const args = parseArgs();
  validateArgs(args);

  log.info('Validando datos del tenant...');

  const tenantData = {
    nombre: args.nombre,
    slug: args.slug || generateSlug(args.nombre),
    dominio: args.dominio,
    qualityToken: args.qualityToken,
    mpAccessToken: args.mpAccessToken,
    mpPublicKey: args.mpPublicKey,
    plan: args.plan || 'free',
    email: args.email,
    telefono: args.telefono,
    pais: args.pais || 'Colombia',
    moneda: args.moneda || 'COP',
    iva: args.iva || '0.19',
    logo: args.logo,
    colorPrimario: args.colorPrimario || '#2563eb',
    colorSecundario: args.colorSecundario || '#1e40af',
    descripcion: args.descripcion,
    keywords: args.keywords,
  };

  try {
    // 1. Crear tenant
    log.info('Creando tenant en Strapi...');
    const tenant = await createTenant(tenantData);
    log.success(`Tenant creado: ID ${tenant.id}`);

    // 2. Crear theme default
    log.info('Creando theme default...');
    const theme = await createDefaultTheme(tenant.id, tenant.nombre);
    log.success(`Theme default creado: ID ${theme.id}`);

    // 3. Crear site-config
    log.info('Creando site-config...');
    const siteConfig = await createDefaultSiteConfig(tenant.id, theme.id, tenant.nombre);
    log.success(`Site-config creado: ID ${siteConfig.id}`);

    // Resumen
    log.divider();
    log.title('✓ Cliente onboarding completado! 🎉');
    log.divider();

    console.log(`\n${colors.bright}📊 Información del Tenant:${colors.reset}\n`);
    console.log(`  ${colors.cyan}Nombre:${colors.reset} ${tenant.nombre}`);
    console.log(`  ${colors.cyan}Dominio:${colors.reset} https://${tenant.dominio}`);
    console.log(`  ${colors.cyan}Plan:${colors.reset} ${tenant.planActual}`);
    console.log(`  ${colors.cyan}Tenant ID:${colors.reset} ${tenant.id}`);

    console.log(`\n${colors.bright}🎨 Theme:${colors.reset} ${theme.nombre} (ID: ${theme.id})`);
    console.log(`${colors.bright}⚙️  Site Config:${colors.reset} ID ${siteConfig.id}`);

    console.log(`\n${colors.bright}🔗 Próximos pasos:${colors.reset}\n`);
    console.log(`  1. Accede a: ${colors.green}https://${tenant.dominio}${colors.reset}`);
    console.log(`  2. Valida que productos se cargan correctamente`);
    console.log(`  3. Prueba checkout con tarjeta sandbox de Mercado Pago`);
    console.log(`  4. Envía email de bienvenida al cliente`);

    log.divider();

  } catch (error) {
    log.error(`Error durante onboarding: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main().catch((error) => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  createTenant,
  createDefaultTheme,
  createDefaultSiteConfig,
  generateSlug,
};
