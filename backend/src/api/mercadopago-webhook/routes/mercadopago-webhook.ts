export default {
  routes: [
    {
      method: 'POST',
      path: '/mercadopago/webhook',
      handler: 'mercadopago-webhook.handleWebhook',
      config: {
        auth: false, // El webhook viene de Mercado Pago, sin autenticación
      },
    },
  ],
};
