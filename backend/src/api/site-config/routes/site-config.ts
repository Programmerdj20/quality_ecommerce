/**
 * SiteConfig router
 *
 * IMPORTANTE: Todas las rutas de SiteConfig están protegidas con tenant-isolation
 * para asegurar que cada tenant solo puede acceder a su propia configuración.
 *
 * NOTA: SiteConfig es un singleType, por lo que solo hay find/update (no findOne, create, delete)
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::site-config.site-config', {
  config: {
    find: {
      policies: ['global::tenant-isolation'], // Filtrar configuración por tenant
      middlewares: [],
    },
    update: {
      policies: ['global::tenant-isolation'], // Solo actualizar configuración del tenant
      middlewares: [],
    },
  },
});
