/**
 * Order service
 *
 * Servicio para la lógica de negocio de órdenes del e-commerce.
 * Todas las operaciones respetan el aislamiento multi-tenant.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::order.order');
