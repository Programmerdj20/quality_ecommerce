/**
 * Script Principal de Seeds - Quality E-commerce Backend
 *
 * Ejecuta todos los seeds en orden para crear datos de prueba
 * del sistema multi-tenant.
 *
 * Orden de ejecución:
 * 1. Tenants (base del sistema multi-tenant)
 * 2. Themes (vinculados a tenants)
 * 3. SiteConfig (vinculados a tenants y themes)
 * 4. Orders (vinculados a tenants)
 *
 * Uso:
 *   node database/seeds/index.js
 *
 * O desde package.json:
 *   npm run seed
 *   pnpm seed
 */

const path = require('path');
const { createStrapi } = require('@strapi/strapi');

// Importar todos los seeds
const { seed: seedTenants } = require('./01-tenants-seed');
const { seed: seedThemes } = require('./02-themes-seed');
const { seed: seedSiteConfig } = require('./03-site-config-seed');
const { seed: seedOrders } = require('./04-orders-seed');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  console.log('\n');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log(`  ${message}`, 'bright');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function runSeeds() {
  logHeader('🌱 QUALITY E-COMMERCE - SEED DATA GENERATOR');

  logInfo('Inicializando Strapi...');
  const startTime = Date.now();

  let app;
  let tenantsCreated = [];
  let themesCreated = [];
  let configsCreated = [];
  let ordersCreated = [];

  try {
    // Inicializar Strapi v5
    app = await createStrapi().load();
    logSuccess('Strapi inicializado correctamente\n');

    // FASE 1: Crear Tenants
    logHeader('FASE 1/4: Creando Tenants');
    tenantsCreated = await seedTenants(app);
    logSuccess(`${tenantsCreated.length} tenants creados`);
    console.log('');

    // FASE 2: Crear Themes
    logHeader('FASE 2/4: Creando Themes');
    themesCreated = await seedThemes(app, tenantsCreated);
    logSuccess(`${themesCreated.length} themes creados`);
    console.log('');

    // FASE 3: Crear Site Configs
    logHeader('FASE 3/4: Creando Site Configs');
    configsCreated = await seedSiteConfig(app, tenantsCreated, themesCreated);
    logSuccess(`${configsCreated.length} site configs creados`);
    console.log('');

    // FASE 4: Crear Orders
    logHeader('FASE 4/4: Creando Orders');
    ordersCreated = await seedOrders(app, tenantsCreated);
    logSuccess(`${ordersCreated.length} orders creados`);
    console.log('');

    // Resumen Final
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    logHeader('✨ SEED COMPLETADO EXITOSAMENTE');
    console.log('');
    log('📊 Resumen de Datos Creados:', 'bright');
    console.log('');
    logSuccess(`   • Tenants:      ${tenantsCreated.length}`);
    logSuccess(`   • Themes:       ${themesCreated.length}`);
    logSuccess(`   • Site Configs: ${configsCreated.length}`);
    logSuccess(`   • Orders:       ${ordersCreated.length}`);
    console.log('');
    log(`   Total de registros: ${tenantsCreated.length + themesCreated.length + configsCreated.length + ordersCreated.length}`, 'cyan');
    console.log('');
    logInfo(`⏱️  Tiempo de ejecución: ${duration} segundos`);
    console.log('');

    // Información útil para testing
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('🧪 Datos para Testing:', 'bright');
    console.log('');

    tenantsCreated.forEach((tenant, index) => {
      log(`   Tenant ${index + 1}:`, 'yellow');
      console.log(`      • Nombre: ${tenant.nombre}`);
      console.log(`      • Dominio: ${tenant.dominio}`);
      console.log(`      • ID: ${tenant.id}`);
      console.log(`      • Plan: ${tenant.planActual}`);
      console.log(`      • Moneda: ${tenant.configuracion.moneda}`);
      console.log(`      • IVA: ${(tenant.configuracion.iva * 100).toFixed(0)}%`);
      console.log('');
    });

    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('🚀 Próximos Pasos:', 'bright');
    console.log('');
    logInfo('1. Iniciar Strapi:        pnpm develop');
    logInfo('2. Login en admin:        http://localhost:1337/admin');
    logInfo('3. Ver documentación:     docs/TESTING_MULTI_TENANT.md');
    logInfo('4. Configurar /etc/hosts: Agregar demo2.local');
    logInfo('5. Testing de aislamiento multi-tenant');
    console.log('');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.log('');
    logHeader('💥 ERROR EN SEED');
    console.log('');
    logError('Ocurrió un error durante la ejecución del seed:');
    console.log('');
    console.error(error);
    console.log('');

    // Información de rollback
    logWarning('Estado del seed:');
    console.log(`   • Tenants creados: ${tenantsCreated.length}`);
    console.log(`   • Themes creados: ${themesCreated.length}`);
    console.log(`   • Configs creados: ${configsCreated.length}`);
    console.log(`   • Orders creados: ${ordersCreated.length}`);
    console.log('');

    logInfo('Para limpiar datos parciales, ejecuta:');
    console.log('   • Elimina manualmente desde Strapi Admin');
    console.log('   • O vuelve a ejecutar el seed (limpia automáticamente)');
    console.log('');

    process.exit(1);
  } finally {
    // Cerrar Strapi
    if (app) {
      await app.destroy();
    }
  }
}

// Manejo de señales para salida limpia
process.on('SIGINT', async () => {
  console.log('\n');
  logWarning('Seed interrumpido por el usuario (SIGINT)');
  process.exit(130);
});

process.on('SIGTERM', async () => {
  console.log('\n');
  logWarning('Seed interrumpido (SIGTERM)');
  process.exit(143);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.log('\n');
  logError('Error no manejado (unhandledRejection):');
  console.error(error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.log('\n');
  logError('Excepción no capturada (uncaughtException):');
  console.error(error);
  process.exit(1);
});

// Ejecutar seeds
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };
