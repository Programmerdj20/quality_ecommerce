/**
 * Theme router
 *
 * IMPORTANTE: Todas las rutas de Theme están protegidas con tenant-isolation
 * para asegurar que cada tenant solo puede acceder a sus propios temas.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::theme.theme', {
  config: {
    find: {
      policies: ['global::tenant-isolation'], // Filtrar temas por tenant
      middlewares: [],
    },
    findOne: {
      policies: ['global::tenant-isolation'], // Validar acceso a tema específico
      middlewares: [],
    },
    create: {
      policies: ['global::tenant-isolation'], // Asociar nuevo tema al tenant actual
      middlewares: [],
    },
    update: {
      policies: ['global::tenant-isolation'], // Solo actualizar temas del tenant
      middlewares: [],
    },
    delete: {
      policies: ['global::tenant-isolation'], // Solo eliminar temas del tenant
      middlewares: [],
    },
  },
});
