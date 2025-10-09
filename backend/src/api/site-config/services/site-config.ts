/**
 * SiteConfig service
 *
 * Servicio para la lógica de negocio de configuración del sitio.
 * NOTA: SiteConfig es un singleType, solo tiene métodos find/update.
 * Respeta el aislamiento multi-tenant automáticamente.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::site-config.site-config');
