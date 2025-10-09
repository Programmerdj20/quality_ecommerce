/**
 * Tenant controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::tenant.tenant', ({ strapi }) => ({
  /**
   * Find tenant by domain
   * GET /api/tenants/by-domain/:domain
   */
  async findByDomain(ctx) {
    const { domain } = ctx.params;

    if (!domain) {
      return ctx.badRequest('Domain parameter is required');
    }

    try {
      const tenant = await strapi.db.query('api::tenant.tenant').findOne({
        where: {
          dominio: domain,
          activo: true
        }
      });

      if (!tenant) {
        return ctx.notFound('Tenant not found or inactive');
      }

      // Remover campos privados antes de enviar
      const sanitizedTenant = {
        ...tenant,
        qualityApiToken: undefined,
        mercadoPagoAccessToken: undefined,
        mercadoPagoPublicKey: undefined
      };

      return ctx.send({
        data: sanitizedTenant
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  /**
   * Get tenant configuration (including private tokens)
   * Solo accesible desde server-side
   * GET /api/tenants/:id/config
   */
  async getConfig(ctx) {
    const { id } = ctx.params;

    try {
      const tenant = await strapi.db.query('api::tenant.tenant').findOne({
        where: { id }
      });

      if (!tenant) {
        return ctx.notFound('Tenant not found');
      }

      // Retornar configuración completa (con tokens)
      return ctx.send({
        data: tenant
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}));
