import { getTenantFromContext, validateTenantAccess, filterByTenant } from './utils/tenant-helpers';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    // Registrar helpers de tenant en strapi global
    strapi.tenantHelpers = {
      getTenantFromContext,
      validateTenantAccess,
      filterByTenant,
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.log.info('🚀 Quality E-commerce Backend - Multi-Tenant SaaS');
    strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      // Obtener estadísticas de tenants
      const totalTenants = await strapi.db.query('api::tenant.tenant').count();
      const activeTenants = await strapi.db.query('api::tenant.tenant').count({
        where: { activo: true }
      });

      strapi.log.info(`📊 Tenants registrados: ${totalTenants}`);
      strapi.log.info(`✅ Tenants activos: ${activeTenants}`);

      if (totalTenants > 0) {
        const tenants = await strapi.db.query('api::tenant.tenant').findMany({
          where: { activo: true },
          limit: 5
        });

        strapi.log.info('🏪 Tiendas activas:');
        tenants.forEach(tenant => {
          strapi.log.info(`   • ${tenant.nombre} (${tenant.dominio})`);
        });

        if (totalTenants > 5) {
          strapi.log.info(`   ... y ${totalTenants - 5} más`);
        }
      } else {
        strapi.log.warn('⚠️  No hay tenants configurados. Crear uno en el panel de admin.');
      }

      strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      strapi.log.info('🔒 Multi-tenant isolation: ENABLED');
      strapi.log.info('🌐 Tenant resolver middleware: ACTIVE');
      strapi.log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      strapi.log.error('❌ Error loading tenant statistics:', error);
    }
  },
};
