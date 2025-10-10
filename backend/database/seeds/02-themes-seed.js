/**
 * Seed de Themes para Testing Multi-Tenant
 *
 * Crea 4 themes de prueba:
 * - 2 themes para Tenant 1 (Default + Black Friday)
 * - 2 themes para Tenant 2 (Default + Navidad)
 *
 * Uso: node database/seeds/02-themes-seed.js
 */

async function getThemesSeedData(tenants) {
  if (!tenants || tenants.length < 2) {
    throw new Error('Se requieren al menos 2 tenants para crear themes');
  }

  const [tenant1, tenant2] = tenants;

  return [
    // TENANT 1 - Theme Default (Azul)
    {
      tenant: tenant1.id,
      nombre: 'Default Azul',
      slug: 'default-azul-tenant1',
      colores: {
        primario: '#2563eb',
        secundario: '#1e40af',
        acento: '#f59e0b',
        texto: '#1f2937',
        textoSecundario: '#6b7280',
        fondo: '#ffffff',
        fondoSecundario: '#f3f4f6',
        borde: '#e5e7eb',
        exito: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      },
      tipografias: {
        principal: {
          familia: 'Roboto',
          fuente: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
          pesos: [300, 400, 500, 700]
        },
        secundaria: {
          familia: 'Roboto Condensed',
          fuente: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&display=swap',
          pesos: [400, 700]
        }
      },
      activo: true
    },

    // TENANT 1 - Theme Black Friday (Negro/Rojo)
    {
      tenant: tenant1.id,
      nombre: 'Black Friday',
      slug: 'black-friday-tenant1',
      colores: {
        primario: '#000000',
        secundario: '#1f1f1f',
        acento: '#ef4444',
        texto: '#ffffff',
        textoSecundario: '#d1d5db',
        fondo: '#0f0f0f',
        fondoSecundario: '#1f1f1f',
        borde: '#374151',
        exito: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#ef4444'
      },
      tipografias: {
        principal: {
          familia: 'Montserrat',
          fuente: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap',
          pesos: [400, 600, 700, 900]
        },
        secundaria: {
          familia: 'Open Sans',
          fuente: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap',
          pesos: [400, 600]
        }
      },
      activo: false
    },

    // TENANT 2 - Theme Default (Verde)
    {
      tenant: tenant2.id,
      nombre: 'Default Verde',
      slug: 'default-verde-tenant2',
      colores: {
        primario: '#10b981',
        secundario: '#059669',
        acento: '#f97316',
        texto: '#111827',
        textoSecundario: '#6b7280',
        fondo: '#f9fafb',
        fondoSecundario: '#ffffff',
        borde: '#e5e7eb',
        exito: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#06b6d4'
      },
      tipografias: {
        principal: {
          familia: 'Open Sans',
          fuente: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
          pesos: [300, 400, 600, 700]
        },
        secundaria: {
          familia: 'Lato',
          fuente: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
          pesos: [400, 700]
        }
      },
      activo: true
    },

    // TENANT 2 - Theme Navidad (Rojo/Dorado)
    {
      tenant: tenant2.id,
      nombre: 'Navidad',
      slug: 'navidad-tenant2',
      colores: {
        primario: '#dc2626',
        secundario: '#991b1b',
        acento: '#fbbf24',
        texto: '#1f2937',
        textoSecundario: '#6b7280',
        fondo: '#fef2f2',
        fondoSecundario: '#ffffff',
        borde: '#fecaca',
        exito: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#dc2626'
      },
      tipografias: {
        principal: {
          familia: 'Playfair Display',
          fuente: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap',
          pesos: [400, 600, 700]
        },
        secundaria: {
          familia: 'Raleway',
          fuente: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap',
          pesos: [400, 600]
        }
      },
      activo: false
    }
  ];
}

async function seed(strapi, tenants) {
  console.log('🎨 Seeding Themes...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Si no se pasan tenants, buscarlos
    if (!tenants) {
      console.log('🔍 Buscando tenants...');
      tenants = await strapi.db.query('api::tenant.tenant').findMany({
        limit: 2,
        orderBy: { id: 'asc' }
      });

      if (tenants.length < 2) {
        throw new Error('Se requieren al menos 2 tenants. Ejecuta 01-tenants-seed.js primero.');
      }
    }

    // Limpiar themes existentes
    const existingThemes = await strapi.db.query('api::theme.theme').findMany();
    if (existingThemes.length > 0) {
      console.log(`⚠️  Encontrados ${existingThemes.length} themes existentes. Eliminando...`);
      await strapi.db.query('api::theme.theme').deleteMany({});
      console.log('✅ Themes existentes eliminados');
    }

    // Obtener datos de themes
    const themesSeedData = await getThemesSeedData(tenants);

    // Crear nuevos themes
    const createdThemes = [];
    for (const themeData of themesSeedData) {
      const tenantName = tenants.find(t => t.id === themeData.tenant)?.nombre || 'Unknown';
      console.log(`\n🎨 Creando theme: ${themeData.nombre} (${tenantName})`);

      const theme = await strapi.db.query('api::theme.theme').create({
        data: themeData
      });

      createdThemes.push(theme);

      console.log(`   ✅ ID: ${theme.id}`);
      console.log(`   🎯 Slug: ${theme.slug}`);
      console.log(`   🎨 Color primario: ${theme.colores.primario}`);
      console.log(`   📝 Tipografía: ${theme.tipografias.principal.familia}`);
      console.log(`   ${theme.activo ? '🟢 ACTIVO' : '⚪ Inactivo'}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${createdThemes.length} themes creados exitosamente`);
    console.log(`   • Tenant 1: 2 themes (Default activo)`);
    console.log(`   • Tenant 2: 2 themes (Default activo)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return createdThemes;
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const { createStrapi } = require('@strapi/strapi');

  createStrapi().load().then(async (app) => {
    try {
      await seed(app);
      console.log('\n🎉 Seed de themes completado');
      await app.destroy();
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Error en seed:', error);
      process.exit(1);
    }
  });
}

module.exports = { seed, getThemesSeedData };
