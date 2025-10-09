/**
 * Order controller
 *
 * Controlador para la gestión de órdenes del e-commerce.
 * Todas las operaciones están protegidas por la política tenant-isolation
 * para asegurar el aislamiento multi-tenant.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order');
