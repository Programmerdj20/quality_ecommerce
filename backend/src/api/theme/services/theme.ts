/**
 * Theme service
 *
 * Servicio para la lógica de negocio de temas visuales.
 * Respeta el aislamiento multi-tenant automáticamente.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::theme.theme');
