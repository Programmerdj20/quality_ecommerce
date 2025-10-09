/**
 * Controlador para manejar webhooks de Mercado Pago
 */

export default {
  /**
   * Maneja las notificaciones de Mercado Pago
   * @param ctx - Contexto de Koa
   */
  async handleWebhook(ctx) {
    try {
      const { body } = ctx.request;

      // Log del webhook recibido
      strapi.log.info('Webhook de Mercado Pago recibido:', body);

      // Validar que sea una notificación de pago
      if (body.type !== 'payment') {
        ctx.body = { received: true };
        return;
      }

      const paymentId = body.data?.id;

      if (!paymentId) {
        ctx.status = 400;
        ctx.body = { error: 'Payment ID no encontrado' };
        return;
      }

      // TODO: Obtener información del pago desde Mercado Pago API
      // const payment = await getPaymentInfo(paymentId);

      // TODO: Buscar el pedido por external_reference
      // const order = await strapi.documents('api::order.order').findFirst({
      //   filters: { 'pago.mercadoPagoId': paymentId }
      // });

      // TODO: Actualizar estado del pedido según el estado del pago
      // if (payment.status === 'approved') {
      //   await strapi.documents('api::order.order').update({
      //     documentId: order.documentId,
      //     data: {
      //       estado: 'pagado',
      //       'pago.estado': 'aprobado',
      //       'pago.fechaPago': new Date(),
      //       'pago.detalles': {
      //         metodoPago: payment.payment_type_id,
      //         cuotas: payment.installments
      //       }
      //     }
      //   });
      // }

      ctx.body = { received: true };
    } catch (error) {
      strapi.log.error('Error procesando webhook de Mercado Pago:', error);
      ctx.status = 500;
      ctx.body = { error: 'Error interno del servidor' };
    }
  },
};
