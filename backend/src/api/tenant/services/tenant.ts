/**
 * Tenant service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::tenant.tenant', ({ strapi }) => ({
  /**
   * Find active tenant by domain
   */
  async findByDomain(domain: string) {
    return await strapi.db.query('api::tenant.tenant').findOne({
      where: {
        dominio: domain,
        activo: true
      }
    });
  },

  /**
   * Validate tenant has required configuration
   */
  async validateTenantConfig(tenantId: number) {
    const tenant = await strapi.db.query('api::tenant.tenant').findOne({
      where: { id: tenantId }
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const errors = [];

    if (!tenant.qualityApiToken) {
      errors.push('Quality API Token is missing');
    }

    if (!tenant.mercadoPagoAccessToken) {
      errors.push('Mercado Pago Access Token is missing');
    }

    if (!tenant.mercadoPagoPublicKey) {
      errors.push('Mercado Pago Public Key is missing');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors
      };
    }

    return {
      valid: true,
      errors: []
    };
  },

  /**
   * Get tenant statistics
   */
  async getTenantStats(tenantId: number) {
    const totalOrders = await strapi.db.query('api::order.order').count({
      where: {
        tenant: { id: tenantId }
      }
    });

    const totalThemes = await strapi.db.query('api::theme.theme').count({
      where: {
        tenant: { id: tenantId }
      }
    });

    return {
      totalOrders,
      totalThemes
    };
  }
}));
