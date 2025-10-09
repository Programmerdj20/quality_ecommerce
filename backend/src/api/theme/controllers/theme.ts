/**
 * Theme controller
 *
 * Controlador para la gestión de temas visuales del e-commerce.
 * Todas las operaciones están protegidas por tenant-isolation.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::theme.theme');
