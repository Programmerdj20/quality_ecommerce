/**
 * Seed de SiteConfig para Testing Multi-Tenant
 *
 * Crea configuraciones de sitio para ambos tenants.
 * Nota: SiteConfig es singleType pero con relación tenant,
 * así que se crea una entrada por tenant.
 *
 * Uso: node database/seeds/03-site-config-seed.js
 */

async function getSiteConfigSeedData(tenants, themes) {
  if (!tenants || tenants.length < 2) {
    throw new Error('Se requieren al menos 2 tenants para crear site configs');
  }

  if (!themes || themes.length < 4) {
    throw new Error('Se requieren al menos 4 themes para crear site configs');
  }

  const [tenant1, tenant2] = tenants;

  // Buscar themes activos de cada tenant
  const theme1 = themes.find(t => t.tenant === tenant1.id && t.activo === true);
  const theme2 = themes.find(t => t.tenant === tenant2.id && t.activo === true);

  return [
    // SITE CONFIG - TENANT 1
    {
      tenant: tenant1.id,
      temaActivo: theme1?.id || null,
      banners: [
        {
          titulo: '¡Bienvenido a Quality Demo 1!',
          subtitulo: 'Encuentra los mejores productos al mejor precio',
          imagen: null,
          link: '/productos',
          activo: true,
          orden: 1
        },
        {
          titulo: 'Envíos gratis',
          subtitulo: 'En compras mayores a $100.000',
          imagen: null,
          link: null,
          activo: true,
          orden: 2
        }
      ],
      textos: {
        terminosCondiciones: `# Términos y Condiciones - Tienda Quality Demo 1

## 1. Aceptación de los Términos
Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones.

## 2. Uso del Sitio
Este sitio es solo para fines de demostración y testing. No se procesan transacciones reales.

## 3. Privacidad
Nos comprometemos a proteger su información personal de acuerdo con nuestra política de privacidad.

## 4. Productos y Precios
Los precios mostrados son referenciales y pueden variar sin previo aviso.

## 5. Modificaciones
Nos reservamos el derecho de modificar estos términos en cualquier momento.

Última actualización: ${new Date().toISOString().split('T')[0]}`,

        politicaPrivacidad: `# Política de Privacidad - Tienda Quality Demo 1

## Información que Recopilamos
- Nombre y apellidos
- Dirección de correo electrónico
- Dirección de envío
- Información de pago (procesada de forma segura)

## Uso de la Información
Utilizamos su información para:
- Procesar sus pedidos
- Enviar confirmaciones y actualizaciones
- Mejorar nuestros servicios
- Comunicaciones de marketing (con su consentimiento)

## Seguridad
Implementamos medidas de seguridad para proteger su información personal.

## Cookies
Utilizamos cookies para mejorar su experiencia en el sitio.

## Contacto
Si tiene preguntas sobre esta política, contáctenos en demo1@quality.com

Última actualización: ${new Date().toISOString().split('T')[0]}`,

        politicaDevolucion: `# Política de Devolución - Tienda Quality Demo 1

## Plazo de Devolución
Tiene 30 días desde la recepción del producto para solicitar una devolución.

## Condiciones
- El producto debe estar en su empaque original
- No debe haber sido usado o dañado
- Debe incluir todos los accesorios originales

## Proceso
1. Contacte a nuestro servicio al cliente
2. Envíe el producto a nuestra dirección
3. Recibirá un reembolso una vez validado el producto

## Excepciones
Algunos productos no son elegibles para devolución por razones de higiene o seguridad.

Contacto: demo1@quality.com | +57 300 123 4567

Última actualización: ${new Date().toISOString().split('T')[0]}`
      },
      iva: 0.19,
      redesSociales: {
        facebook: 'https://facebook.com/qualitydemo1',
        instagram: 'https://instagram.com/qualitydemo1',
        twitter: 'https://twitter.com/qualitydemo1',
        whatsapp: '+573001234567',
        youtube: 'https://youtube.com/@qualitydemo1',
        linkedin: null
      },
      contacto: {
        email: 'demo1@quality.com',
        telefono: '+57 300 123 4567',
        direccion: 'Calle 123 #45-67, Bogotá, Colombia',
        horarioAtencion: 'Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 2:00 PM',
        mapaUrl: 'https://maps.google.com/?q=Bogotá,Colombia'
      }
    },

    // SITE CONFIG - TENANT 2
    {
      tenant: tenant2.id,
      temaActivo: theme2?.id || null,
      banners: [
        {
          titulo: 'Tienda Quality Demo 2',
          subtitulo: 'Calidad premium a tu alcance',
          imagen: null,
          link: '/productos',
          activo: true,
          orden: 1
        },
        {
          titulo: 'Ofertas especiales',
          subtitulo: 'Descuentos de hasta 50% en productos seleccionados',
          imagen: null,
          link: '/ofertas',
          activo: true,
          orden: 2
        },
        {
          titulo: '¡Nuevo!',
          subtitulo: 'Revisa nuestras últimas novedades',
          imagen: null,
          link: '/novedades',
          activo: true,
          orden: 3
        }
      ],
      textos: {
        terminosCondiciones: `# Términos y Condiciones - Tienda Quality Demo 2

## 1. Condiciones Generales
Este sitio es operado por Quality Demo 2. Al utilizar nuestro sitio, usted acepta estos términos.

## 2. Productos
Nos esforzamos por mostrar información precisa, pero no garantizamos que toda la información sea completamente exacta.

## 3. Precios
Todos los precios están en USD e incluyen impuestos aplicables.

## 4. Pagos
Aceptamos los principales medios de pago a través de Mercado Pago.

## 5. Envíos
Los tiempos de envío son estimados y pueden variar.

## 6. Responsabilidad
No somos responsables por daños indirectos o consecuenciales del uso de nuestros productos.

Última actualización: ${new Date().toISOString().split('T')[0]}`,

        politicaPrivacidad: `# Política de Privacidad - Tienda Quality Demo 2

## Protección de Datos
En Quality Demo 2 nos tomamos muy en serio la privacidad de nuestros clientes.

## Datos que Recopilamos
- Información de contacto (nombre, email, teléfono)
- Dirección de envío y facturación
- Historial de compras
- Preferencias de productos

## Cómo Usamos sus Datos
- Procesar y gestionar sus pedidos
- Comunicarnos con usted
- Personalizar su experiencia
- Análisis y mejora de servicios
- Marketing (solo con consentimiento)

## Compartir Información
No vendemos ni compartimos su información personal con terceros, excepto para procesar pagos.

## Sus Derechos
Tiene derecho a acceder, corregir o eliminar sus datos personales.

## Contacto
Para consultas sobre privacidad: demo2@quality.com

Última actualización: ${new Date().toISOString().split('T')[0]}`,

        politicaDevolucion: `# Política de Devolución y Reembolso - Tienda Quality Demo 2

## Garantía de Satisfacción
Ofrecemos una garantía de satisfacción de 30 días en todos nuestros productos.

## ¿Cómo Devolver un Producto?
1. Solicite autorización de devolución contactándonos
2. Empaque el producto con sus accesorios originales
3. Envíe el producto a nuestra dirección
4. Recibirá su reembolso en 5-10 días hábiles

## Condiciones para Devoluciones
- Producto sin usar y en empaque original
- Incluir factura de compra
- Dentro del período de 30 días

## Productos No Retornables
- Productos personalizados
- Software descargable
- Productos de higiene personal

## Costos de Envío
El cliente asume los costos de envío de devolución, excepto en caso de productos defectuosos.

## Reembolsos
Los reembolsos se procesan al mismo método de pago original.

Contacto: demo2@quality.com | +52 55 9876 5432

Última actualización: ${new Date().toISOString().split('T')[0]}`
      },
      iva: 0.16,
      redesSociales: {
        facebook: 'https://facebook.com/qualitydemo2',
        instagram: 'https://instagram.com/qualitydemo2',
        twitter: 'https://twitter.com/qualitydemo2',
        whatsapp: '+525598765432',
        youtube: null,
        linkedin: 'https://linkedin.com/company/qualitydemo2'
      },
      contacto: {
        email: 'demo2@quality.com',
        telefono: '+52 55 9876 5432',
        direccion: 'Av. Reforma 456, Ciudad de México, México',
        horarioAtencion: 'Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 3:00 PM\nDomingos: Cerrado',
        mapaUrl: 'https://maps.google.com/?q=Ciudad+de+México,México'
      }
    }
  ];
}

async function seed(strapi, tenants, themes) {
  console.log('⚙️  Seeding SiteConfig...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    // Si no se pasan tenants o themes, buscarlos
    if (!tenants) {
      console.log('🔍 Buscando tenants...');
      tenants = await strapi.db.query('api::tenant.tenant').findMany({
        limit: 2,
        orderBy: { id: 'asc' }
      });
    }

    if (!themes) {
      console.log('🔍 Buscando themes...');
      themes = await strapi.db.query('api::theme.theme').findMany({
        orderBy: { id: 'asc' }
      });
    }

    if (tenants.length < 2) {
      throw new Error('Se requieren al menos 2 tenants. Ejecuta 01-tenants-seed.js primero.');
    }

    if (themes.length < 4) {
      throw new Error('Se requieren al menos 4 themes. Ejecuta 02-themes-seed.js primero.');
    }

    // Limpiar site configs existentes
    const existingConfigs = await strapi.db.query('api::site-config.site-config').findMany();
    if (existingConfigs.length > 0) {
      console.log(`⚠️  Encontrados ${existingConfigs.length} site configs existentes. Eliminando...`);
      await strapi.db.query('api::site-config.site-config').deleteMany({});
      console.log('✅ Site configs existentes eliminados');
    }

    // Obtener datos de site configs
    const siteConfigSeedData = await getSiteConfigSeedData(tenants, themes);

    // Crear nuevos site configs
    const createdConfigs = [];
    for (const configData of siteConfigSeedData) {
      const tenantName = tenants.find(t => t.id === configData.tenant)?.nombre || 'Unknown';
      console.log(`\n⚙️  Creando site config: ${tenantName}`);

      const config = await strapi.db.query('api::site-config.site-config').create({
        data: configData
      });

      createdConfigs.push(config);

      console.log(`   ✅ ID: ${config.id}`);
      console.log(`   🎨 Tema activo: ${config.temaActivo || 'Sin tema'}`);
      console.log(`   📢 Banners: ${config.banners?.length || 0}`);
      console.log(`   📊 IVA: ${(config.iva * 100).toFixed(0)}%`);
      console.log(`   📧 Email: ${config.contacto.email}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${createdConfigs.length} site configs creados exitosamente`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return createdConfigs;
  } catch (error) {
    console.error('❌ Error seeding site configs:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const { createStrapi } = require('@strapi/strapi');

  createStrapi().load().then(async (app) => {
    try {
      await seed(app);
      console.log('\n🎉 Seed de site configs completado');
      await app.destroy();
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Error en seed:', error);
      process.exit(1);
    }
  });
}

module.exports = { seed, getSiteConfigSeedData };
