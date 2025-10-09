/**
 * Middleware: tenant-resolver
 *
 * Resuelve el tenant actual basado en el dominio de la request.
 * El tenant se almacena en ctx.state.tenant para uso posterior.
 *
 * Uso:
 * - El frontend envía el header 'x-tenant-domain' con el dominio (ej: tienda.cliente1.com)
 * - El middleware busca el tenant en la BD por ese dominio
 * - Si no encuentra tenant o está inactivo, retorna 404
 * - Si encuentra tenant, lo guarda en ctx.state.tenant
 */

export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Obtener dominio desde header o hostname
    const domain = ctx.request.headers['x-tenant-domain'] ||
                  ctx.request.hostname ||
                  ctx.request.host;

    // Skip para rutas administrativas de Strapi
    if (ctx.request.url.startsWith('/admin') ||
        ctx.request.url.startsWith('/_health') ||
        ctx.request.url.startsWith('/api/tenants/by-domain')) {
      return await next();
    }

    try {
      // Buscar tenant por dominio
      const tenant = await strapi.db.query('api::tenant.tenant').findOne({
        where: {
          dominio: domain,
          activo: true
        }
      });

      if (!tenant) {
        strapi.log.warn(`⚠️ Tenant not found for domain: ${domain}`);
        return ctx.notFound(`Tenant not found for domain: ${domain}`);
      }

      // Guardar tenant en el contexto
      ctx.state.tenant = tenant;

      strapi.log.debug(`✅ Tenant resolved: ${tenant.nombre} (${tenant.slug})`);

    } catch (error) {
      strapi.log.error('❌ Error resolving tenant:', error);
      return ctx.internalServerError('Error resolving tenant');
    }

    await next();
  };
};
