/**
 * API Route: Mercado Pago Webhook
 *
 * Recibe notificaciones de Mercado Pago cuando cambia el estado de un pago
 * Soporta multi-tenant identificando el tenant desde metadata
 *
 * POST /api/webhooks/mercadopago
 *
 * Tipos de notificaciones:
 * - payment: Notificación de pago
 * - merchant_order: Notificación de orden
 */

import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import type { MercadoPagoWebhook } from '@/types/order';
import { getTenantById } from '@/utils/tenant/tenantResolver';
import { updateOrderStatus } from '@/utils/api/strapiApi';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear el body del webhook
    const body = (await request.json()) as MercadoPagoWebhook;

    console.log('🔔 Webhook recibido de Mercado Pago:', {
      id: body.id,
      type: body.type,
      action: body.action,
      data: body.data,
    });

    // Validar que sea una notificación de pago
    if (body.type !== 'payment') {
      console.log('ℹ️ Tipo de notificación no procesada:', body.type);
      return new Response(JSON.stringify({ message: 'OK' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Obtener el ID del pago
    const paymentId = body.data.id;

    if (!paymentId) {
      console.error('❌ No se encontró ID de pago en el webhook');
      return new Response(JSON.stringify({ error: 'Missing payment ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ============================================
    // MULTI-TENANT: Primero obtener info básica para extraer tenant_id
    // ============================================

    // Para obtener el tenant, necesitamos primero hacer una consulta preliminar
    // Usamos un cliente temporal con variables de entorno (fallback)
    const tempClient = new MercadoPagoConfig({
      accessToken: import.meta.env.MP_ACCESS_TOKEN || '',
      options: {
        timeout: 5000,
      },
    });

    const tempPayment = new Payment(tempClient);
    let paymentInfo;

    try {
      paymentInfo = await tempPayment.get({ id: paymentId });
    } catch (error) {
      // Si falla con el token por defecto, intentaremos con cada tenant
      console.warn('⚠️ No se pudo obtener pago con token por defecto');
      throw error;
    }

    console.log('💳 Información preliminar del pago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      external_reference: paymentInfo.external_reference,
      metadata: paymentInfo.metadata,
    });

    // Extraer tenant_id de metadata
    const tenantId = paymentInfo.metadata?.tenant_id;

    if (!tenantId) {
      console.error('❌ No se encontró tenant_id en metadata del pago');
      // Retornar 200 para evitar reintentos pero loggear el error
      return new Response(
        JSON.stringify({
          message: 'OK',
          warning: 'No se encontró tenant_id en metadata',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Buscar tenant por ID
    const tenant = await getTenantById(tenantId);

    if (!tenant || !tenant.mercadoPagoAccessToken) {
      console.error(`❌ Tenant no encontrado o sin MP: ${tenantId}`);
      return new Response(
        JSON.stringify({
          message: 'OK',
          warning: 'Tenant no encontrado',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`✅ Tenant identificado: ${tenant.nombre} (ID: ${tenant.id})`);

    // Ahora consultar el pago con el token correcto del tenant
    const client = new MercadoPagoConfig({
      accessToken: tenant.mercadoPagoAccessToken,
      options: {
        timeout: 5000,
      },
    });

    const payment = new Payment(client);
    paymentInfo = await payment.get({ id: paymentId });

    console.log('💳 Información del pago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
      payer_email: paymentInfo.payer?.email,
    });

    // Procesar el pago según su estado y actualizar order en Strapi
    const orderReference = paymentInfo.external_reference;

    switch (paymentInfo.status) {
      case 'approved':
        console.log(`✅ Pago aprobado: ${paymentInfo.id} para order: ${orderReference}`);
        // Actualizar pedido en Strapi con el tenant correcto
        await updateOrderStatus(
          orderReference || '',
          'completada',
          {
            metodo: 'mercadopago',
            estado: 'aprobado',
            transaccionId: paymentInfo.id?.toString(),
            monto: paymentInfo.transaction_amount,
            fechaPago: new Date().toISOString(),
          },
          tenant.dominio
        );
        // TODO: Enviar email de confirmación
        // TODO: Actualizar stock de productos
        break;

      case 'pending':
      case 'in_process':
        console.log(`⏳ Pago pendiente: ${paymentInfo.id}`);
        await updateOrderStatus(
          orderReference || '',
          'pendiente',
          {
            metodo: 'mercadopago',
            estado: 'pendiente',
            transaccionId: paymentInfo.id?.toString(),
          },
          tenant.dominio
        );
        break;

      case 'rejected':
      case 'cancelled':
        console.log(`❌ Pago rechazado/cancelado: ${paymentInfo.id}`);
        await updateOrderStatus(
          orderReference || '',
          'cancelada',
          {
            metodo: 'mercadopago',
            estado: 'rechazado',
            transaccionId: paymentInfo.id?.toString(),
          },
          tenant.dominio
        );
        // TODO: Liberar stock reservado
        break;

      case 'refunded':
      case 'charged_back':
        console.log(`💸 Pago devuelto: ${paymentInfo.id}`);
        await updateOrderStatus(
          orderReference || '',
          'devuelta',
          {
            metodo: 'mercadopago',
            estado: 'devuelto',
            transaccionId: paymentInfo.id?.toString(),
          },
          tenant.dominio
        );
        // TODO: Restaurar stock
        break;

      default:
        console.log('❓ Estado de pago desconocido:', paymentInfo.status);
    }

    // Mercado Pago requiere una respuesta 200 OK
    return new Response(
      JSON.stringify({
        message: 'Webhook procesado correctamente',
        payment_id: paymentId,
        status: paymentInfo.status,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error procesando webhook de Mercado Pago:', error);

    // Aún así retornar 200 para evitar reintentos innecesarios de Mercado Pago
    return new Response(
      JSON.stringify({
        message: 'Error procesando webhook',
        error: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

/**
 * Método GET para verificar que el webhook está activo
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      message: 'Webhook de Mercado Pago activo',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
