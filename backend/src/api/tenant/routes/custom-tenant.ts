/**
 * Custom tenant routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/tenants/by-domain/:domain',
      handler: 'tenant.findByDomain',
      config: {
        auth: false, // Acceso público para detectar tenant
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/tenants/:id/config',
      handler: 'tenant.getConfig',
      config: {
        // auth: true, // Solo accesible con autenticación
        policies: [],
        middlewares: [],
      },
    },
  ],
};
