/**
 * SiteConfig controller
 *
 * Controlador para la configuración global del sitio e-commerce.
 * NOTA: SiteConfig es un singleType, solo tiene métodos find/update.
 * Todas las operaciones están protegidas por tenant-isolation.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::site-config.site-config');
