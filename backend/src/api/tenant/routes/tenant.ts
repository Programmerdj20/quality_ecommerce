/**
 * Tenant router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tenant.tenant', {
  config: {
    find: {
      auth: false, // Permitir acceso público para buscar tenants
      policies: [],
      middlewares: [],
    },
    findOne: {
      auth: false,
      policies: [],
      middlewares: [],
    },
    create: {
      policies: [],
      middlewares: [],
    },
    update: {
      policies: [],
      middlewares: [],
    },
    delete: {
      policies: [],
      middlewares: [],
    },
  },
});
