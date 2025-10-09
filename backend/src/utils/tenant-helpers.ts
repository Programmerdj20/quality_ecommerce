/**
 * Tenant Helpers
 *
 * Utilidades para trabajar con multi-tenancy
 */

export const getTenantFromContext = (ctx: any) => {
  return ctx.state.tenant;
};

export const validateTenantAccess = async (strapi: any, ctx: any, resourceId: string, contentType: string) => {
  const tenant = getTenantFromContext(ctx);

  if (!tenant) {
    return {
      valid: false,
      error: 'No tenant in context'
    };
  }

  try {
    // Buscar el recurso
    const resource = await strapi.db.query(contentType).findOne({
      where: { id: resourceId }
    });

    if (!resource) {
      return {
        valid: false,
        error: 'Resource not found'
      };
    }

    // Validar que pertenece al tenant
    if (resource.tenant?.id !== tenant.id) {
      return {
        valid: false,
        error: 'Access denied: resource belongs to different tenant'
      };
    }

    return {
      valid: true,
      resource
    };
  } catch (error) {
    return {
      valid: false,
      error: `Error validating access: ${error.message}`
    };
  }
};

export const filterByTenant = (query: any, tenantId: number) => {
  if (!query.filters) {
    query.filters = {};
  }

  query.filters.tenant = {
    id: {
      $eq: tenantId
    }
  };

  return query;
};

export const getTenantStats = async (strapi: any, tenantId: number) => {
  const stats = {
    totalOrders: 0,
    totalThemes: 0,
    activeDomains: 0
  };

  try {
    stats.totalOrders = await strapi.db.query('api::order.order').count({
      where: {
        tenant: { id: tenantId }
      }
    });

    stats.totalThemes = await strapi.db.query('api::theme.theme').count({
      where: {
        tenant: { id: tenantId }
      }
    });

    const tenant = await strapi.db.query('api::tenant.tenant').findOne({
      where: { id: tenantId }
    });

    stats.activeDomains = tenant?.activo ? 1 : 0;

  } catch (error) {
    strapi.log.error('Error getting tenant stats:', error);
  }

  return stats;
};
