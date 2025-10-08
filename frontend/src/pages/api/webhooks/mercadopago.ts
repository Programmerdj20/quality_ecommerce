/**
 * API Route: Mercado Pago Webhook
 *
 * Recibe notificaciones de Mercado Pago cuando cambia el estado de un pago
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

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  },
});

const payment = new Payment(client);

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

    // Consultar información del pago
    const paymentInfo = await payment.get({ id: paymentId });

    console.log('💳 Información del pago:', {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      external_reference: paymentInfo.external_reference,
      transaction_amount: paymentInfo.transaction_amount,
      payer_email: paymentInfo.payer?.email,
    });

    // Aquí puedes procesar el pago según su estado
    switch (paymentInfo.status) {
      case 'approved':
        console.log('✅ Pago aprobado:', paymentInfo.id);
        // TODO: Actualizar pedido en la base de datos (Strapi)
        // TODO: Enviar email de confirmación
        // TODO: Actualizar stock de productos
        break;

      case 'pending':
      case 'in_process':
        console.log('⏳ Pago pendiente:', paymentInfo.id);
        // TODO: Actualizar pedido como pendiente
        break;

      case 'rejected':
      case 'cancelled':
        console.log('❌ Pago rechazado/cancelado:', paymentInfo.id);
        // TODO: Actualizar pedido como fallido
        // TODO: Liberar stock reservado
        break;

      case 'refunded':
      case 'charged_back':
        console.log('💸 Pago devuelto:', paymentInfo.id);
        // TODO: Procesar devolución
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
