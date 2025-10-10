/**
 * Seed de Orders para Testing Multi-Tenant
 *
 * Crea 5 órdenes de prueba:
 * - 3 órdenes para Tenant 1 (diferentes estados)
 * - 2 órdenes para Tenant 2 (diferentes estados)
 *
 * Uso: node database/seeds/04-orders-seed.js
 */

async function getOrdersSeedData(tenants) {
  if (!tenants || tenants.length < 2) {
    throw new Error('Se requieren al menos 2 tenants para crear orders');
  }

  const [tenant1, tenant2] = tenants;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return [
    // TENANT 1 - ORDER 1 (Pendiente)
    {
      tenant: tenant1.id,
      numero: `QD1-${Date.now()}-001`,
      fecha: now.toISOString(),
      items: [
        {
          productId: 'PROD001',
          nombre: 'Laptop HP 15"',
          precio: 2500000,
          cantidad: 1,
          subtotal: 2500000,
          sku: 'HP-LAPTOP-15'
        },
        {
          productId: 'PROD002',
          nombre: 'Mouse Inalámbrico',
          precio: 45000,
          cantidad: 2,
          subtotal: 90000,
          sku: 'MOUSE-WIRELESS'
        }
      ],
      subtotal: 2590000,
      iva: 492100, // 19%
      envio: 15000,
      total: 3097100,
      estado: 'pendiente',
      cliente: {
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        telefono: '+57 300 111 2222',
        documento: '1234567890'
      },
      pago: {
        metodo: 'mercadopago',
        estado: 'pendiente',
        transaccionId: null,
        fechaPago: null
      },
      userId: 'user_test_123',
      notas: 'Cliente solicita entrega en horario de oficina'
    },

    // TENANT 1 - ORDER 2 (Pagado)
    {
      tenant: tenant1.id,
      numero: `QD1-${Date.now()}-002`,
      fecha: yesterday.toISOString(),
      items: [
        {
          productId: 'PROD003',
          nombre: 'Monitor Samsung 24"',
          precio: 650000,
          cantidad: 1,
          subtotal: 650000,
          sku: 'SAMSUNG-MON-24'
        },
        {
          productId: 'PROD004',
          nombre: 'Teclado Mecánico RGB',
          precio: 280000,
          cantidad: 1,
          subtotal: 280000,
          sku: 'KEYBOARD-MECH-RGB'
        }
      ],
      subtotal: 930000,
      iva: 176700, // 19%
      envio: 12000,
      total: 1118700,
      estado: 'pagado',
      cliente: {
        nombre: 'María González',
        email: 'maria.gonzalez@email.com',
        telefono: '+57 300 333 4444',
        documento: '9876543210'
      },
      pago: {
        metodo: 'mercadopago',
        estado: 'aprobado',
        transaccionId: 'MP_TEST_' + Date.now(),
        fechaPago: yesterday.toISOString()
      },
      userId: 'user_test_456',
      trackingNumber: null,
      notas: 'Pago confirmado, listo para despacho'
    },

    // TENANT 1 - ORDER 3 (Completado)
    {
      tenant: tenant1.id,
      numero: `QD1-${Date.now()}-003`,
      fecha: weekAgo.toISOString(),
      items: [
        {
          productId: 'PROD005',
          nombre: 'Silla Gamer Ergonómica',
          precio: 890000,
          cantidad: 1,
          subtotal: 890000,
          sku: 'CHAIR-GAMER-ERG'
        }
      ],
      subtotal: 890000,
      iva: 169100, // 19%
      envio: 25000,
      total: 1084100,
      estado: 'completado',
      cliente: {
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        telefono: '+57 300 555 6666',
        documento: '5555555555'
      },
      pago: {
        metodo: 'mercadopago',
        estado: 'aprobado',
        transaccionId: 'MP_TEST_' + (Date.now() - 604800000),
        fechaPago: weekAgo.toISOString()
      },
      userId: 'user_test_789',
      trackingNumber: 'TRK123456789CO',
      notas: 'Entregado exitosamente - Cliente satisfecho'
    },

    // TENANT 2 - ORDER 1 (Pendiente)
    {
      tenant: tenant2.id,
      numero: `QD2-${Date.now()}-001`,
      fecha: twoDaysAgo.toISOString(),
      items: [
        {
          productId: 'PROD101',
          nombre: 'iPhone 13 Pro 128GB',
          precio: 999,
          cantidad: 1,
          subtotal: 999,
          sku: 'IPHONE-13-PRO-128'
        },
        {
          productId: 'PROD102',
          nombre: 'AirPods Pro 2da Gen',
          precio: 249,
          cantidad: 1,
          subtotal: 249,
          sku: 'AIRPODS-PRO-2'
        },
        {
          productId: 'PROD103',
          nombre: 'Funda iPhone Silicona',
          precio: 29,
          cantidad: 2,
          subtotal: 58,
          sku: 'CASE-IPHONE-SIL'
        }
      ],
      subtotal: 1306,
      iva: 208.96, // 16%
      envio: 15,
      total: 1529.96,
      estado: 'pendiente',
      cliente: {
        nombre: 'Ana Martínez',
        email: 'ana.martinez@email.com',
        telefono: '+52 55 1111 2222',
        documento: 'MEX1234567890'
      },
      pago: {
        metodo: 'mercadopago',
        estado: 'pendiente',
        transaccionId: null,
        fechaPago: null
      },
      userId: 'user_test_mx_001',
      notas: 'Cliente preguntó por colores disponibles'
    },

    // TENANT 2 - ORDER 2 (Enviado)
    {
      tenant: tenant2.id,
      numero: `QD2-${Date.now()}-002`,
      fecha: threeDaysAgo.toISOString(),
      items: [
        {
          productId: 'PROD104',
          nombre: 'MacBook Air M2 256GB',
          precio: 1199,
          cantidad: 1,
          subtotal: 1199,
          sku: 'MBA-M2-256'
        },
        {
          productId: 'PROD105',
          nombre: 'Magic Mouse',
          precio: 79,
          cantidad: 1,
          subtotal: 79,
          sku: 'MAGIC-MOUSE'
        }
      ],
      subtotal: 1278,
      iva: 204.48, // 16%
      envio: 25,
      total: 1507.48,
      estado: 'enviado',
      cliente: {
        nombre: 'Luis Hernández',
        email: 'luis.hernandez@email.com',
        telefono: '+52 55 3333 4444',
        documento: 'MEX9876543210'
      },
      pago: {
        metodo: 'mercadopago',
        estado: 'aprobado',
        transaccionId: 'MP_TEST_MX_' + (Date.now() - 259200000),
        fechaPago: threeDaysAgo.toISOString()
      },
      userId: 'user_test_mx_002',
      trackingNumber: 'TRK987654321MX',
      notas: 'Envío express - En tránsito'
    }
  ];
}

async function seed(strapi, tenants) {
  console.log('📦 Seeding Orders...');
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

    // Limpiar orders existentes
    const existingOrders = await strapi.db.query('api::order.order').findMany();
    if (existingOrders.length > 0) {
      console.log(`⚠️  Encontrados ${existingOrders.length} orders existentes. Eliminando...`);
      await strapi.db.query('api::order.order').deleteMany({});
      console.log('✅ Orders existentes eliminados');
    }

    // Obtener datos de orders
    const ordersSeedData = await getOrdersSeedData(tenants);

    // Crear nuevos orders
    const createdOrders = [];
    for (const orderData of ordersSeedData) {
      const tenantName = tenants.find(t => t.id === orderData.tenant)?.nombre || 'Unknown';
      console.log(`\n📦 Creando order: ${orderData.numero} (${tenantName})`);

      const order = await strapi.db.query('api::order.order').create({
        data: orderData
      });

      createdOrders.push(order);

      const moneda = tenants.find(t => t.id === orderData.tenant)?.configuracion?.moneda || 'COP';
      const simbolo = moneda === 'USD' ? '$' : '$';

      console.log(`   ✅ ID: ${order.id}`);
      console.log(`   👤 Cliente: ${order.cliente.nombre}`);
      console.log(`   📧 Email: ${order.cliente.email}`);
      console.log(`   💰 Total: ${simbolo}${order.total.toLocaleString()}`);
      console.log(`   📊 Estado: ${order.estado}`);
      console.log(`   🛍️  Items: ${order.items.length} producto(s)`);

      if (order.trackingNumber) {
        console.log(`   📮 Tracking: ${order.trackingNumber}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ${createdOrders.length} orders creados exitosamente`);
    console.log(`   • Tenant 1: 3 orders (pendiente, pagado, completado)`);
    console.log(`   • Tenant 2: 2 orders (pendiente, enviado)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return createdOrders;
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  const { createStrapi } = require('@strapi/strapi');

  createStrapi().load().then(async (app) => {
    try {
      await seed(app);
      console.log('\n🎉 Seed de orders completado');
      await app.destroy();
      process.exit(0);
    } catch (error) {
      console.error('\n💥 Error en seed:', error);
      process.exit(1);
    }
  });
}

module.exports = { seed, getOrdersSeedData };
