/**
 * Seed de Tenants para Testing Multi-Tenant
 *
 * Crea 2 tenants de prueba con configuraciones diferentes:
 * - Tenant 1: Tienda Quality Demo 1 (localhost:4321)
 * - Tenant 2: Tienda Quality Demo 2 (demo2.local:4321)
 *
 * Uso: node database/seeds/01-tenants-seed.js
 */

const tenantsSeedData = [
  {
    nombre: 'Tienda Quality Demo 1',
    slug: 'tienda-quality-demo-1',
    dominio: 'localhost:4321',
    qualityApiToken: 'TEST_TOKEN_QUALITY_DEMO_1_ABC123',
    mercadoPagoAccessToken: 'TEST-1234567890-123456-1234567890abcdef-1234567890',
    mercadoPagoPublicKey: 'TEST-12345678-1234-1234-1234-123456789012',
    configuracion: {
      logo: {
        url: null,
        iniciales: 'QD1',
        backgroundColor: '#2563eb'
      },
      colores: {
        primario: '#2563eb',
        secundario: '#1e40af',
        acento: '#f59e0b',
        texto: '#1f2937',
        fondo: '#ffffff'
      },
      moneda: 'COP',
      iva: 0.19,
      pais: 'Colombia',
      idioma: 'es',
      descripcion: 'Tienda de demostración para testing multi-tenant - Cliente 1',
      email: 'demo1@quality.com',
      telefono: '+57 300 123 4567',
      direccion: 'Calle 123 #45-67, Bogotá, Colombia',
      redesSociales: {
        facebook: 'https://facebook.com/qualitydemo1',
        instagram: 'https://instagram.com/qualitydemo1',
        twitter: 'https://twitter.com/qualitydemo1',
        whatsapp: '+573001234567'
      }
    },
    activo: true,
    planActual: 'basic',
    fechaCreacion: new Date().toISOString(),
    notas: 'Tenant de prueba para desarrollo y testing - Dominio localhost'
  },
  {
    nombre: 'Tienda Quality Demo 2',
    slug: 'tienda-quality-demo-2',
    dominio: 'demo2.local:4321',
    qualityApiToken: 'TEST_TOKEN_QUALITY_DEMO_2_XYZ789',
    mercadoPagoAccessToken: 'TEST-0987654321-654321-0987654321fedcba-0987654321',
    mercadoPagoPublicKey: 'TEST-87654321-4321-4321-4321-210987654321',
    configuracion: {
      logo: {
        url: null,
        iniciales: 'QD2',
        backgroundColor: '#10b981'
      },
      colores: {
        primario: '#10b981',
        secundario: '#059669',
        acento: '#f97316',
        texto: '#111827',
        fondo: '#f9fafb'
      },
      moneda: 'USD',
      iva: 0.16,
      pais: 'México',
      idioma: 'es',
      descripcion: 'Segunda tienda de demostración - Testing de aislamiento de datos',
      email: 'demo2@quality.com',
      telefono: '+52 55 9876 5432',
      direccion: 'Av. Reforma 456, Ciudad de México, México',
      redesSociales: {
        facebook: 'https://facebook.com/qualitydemo2',
        instagram: 'https://instagram.com/qualitydemo2',
        twitter: 'https://twitter.com/qualitydemo2',
        whatsapp: '+525598765432'
      }
    },
    activo: true,
    planActual: 'premium',
    fechaCreacion: new Date().toISOString(),
    notas: 'Tenant de prueba para validar aislamiento multi-tenant - Dominio demo2.local'
  }
];

async function seed(strapi) {
  console.log('🌱 Seeding Tenants...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Limpiar tenants existentes (solo en desarrollo)
    const existingTenants = await strapi.db.query('api::tenant.tenant').findMany();
    if (existingTenants.length > 0) {
      console.log(`⚠️  Encontrados ${existingTenants.length} tenants existentes. Eliminando...`);
      await strapi.db.query('api::tenant.tenant').deleteMany({});
      console.log('✅ Tenants existentes eliminados');
    }

    // Crear nuevos tenants
    const createdTenants = [];
    for (const tenantData of tenantsSeedData) {
      console.log(`\n📦 Creando tenant: ${tenantData.nombre}`);

      const tenant = await strapi.db.query('api::tenant.tenant').create({
        data: tenantData
      });

      createdTenants.push(tenant);

      console.log(`   ✅ ID: ${tenant.id}`);
      console.log(`   🌐 Dominio: ${tenant.dominio}`);
      console.log(`   💼 Plan: ${tenant.planActual}`);
      console.log(`   💰 Moneda: ${tenant.configuracion.moneda}`);
      console.log(`   📊 IVA: ${(tenant.configuracion.iva * 100).toFixed(0)}%`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${createdTenants.length} tenants creados exitosamente`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return createdTenants;
  } catch (error) {
    console.error('❌ Error seeding tenants:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const { createStrapi } = require('@strapi/strapi');

  createStrapi().load().then(async (app) => {
    try {
      await seed(app);
      console.log('\n🎉 Seed de tenants completado');
      await app.destroy();
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Error en seed:', error);
      process.exit(1);
    }
  });
}

module.exports = { seed, tenantsSeedData };
