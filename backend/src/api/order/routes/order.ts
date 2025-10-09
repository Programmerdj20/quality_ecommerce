/**
 * Order router
 *
 * IMPORTANTE: Todas las rutas de Order están protegidas con tenant-isolation
 * para asegurar que cada tenant solo puede acceder a sus propias órdenes.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::order.order', {
  config: {
    find: {
      policies: ['global::tenant-isolation'], // Filtrar órdenes por tenant
      middlewares: [],
    },
    findOne: {
      policies: ['global::tenant-isolation'], // Validar acceso a orden específica
      middlewares: [],
    },
    create: {
      policies: ['global::tenant-isolation'], // Asociar nueva orden al tenant actual
      middlewares: [],
    },
    update: {
      policies: ['global::tenant-isolation'], // Solo actualizar órdenes del tenant
      middlewares: [],
    },
    delete: {
      policies: ['global::tenant-isolation'], // Solo eliminar órdenes del tenant
      middlewares: [],
    },
  },
});
