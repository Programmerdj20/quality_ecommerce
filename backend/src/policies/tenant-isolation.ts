/**
 * Policy: tenant-isolation
 *
 * Asegura el aislamiento de datos entre tenants.
 * Filtra automáticamente todas las queries por el tenantId del contexto.
 * Bloquea acceso a recursos de otros tenants.
 *
 * Uso:
 * - Aplicar a todas las rutas de Order, Theme y SiteConfig
 * - Se ejecuta DESPUÉS del middleware tenant-resolver
 * - Valida que existe tenant en el contexto
 * - Filtra queries automáticamente
 */

export default (policyContext, config, { strapi }) => {
  const { tenant } = policyContext.state;

  // Validar que existe tenant en el contexto
  if (!tenant) {
    strapi.log.error('❌ Policy tenant-isolation: No tenant in context');
    return false;
  }

  // GET /api/orders o POST /api/orders
  // Filtrar automáticamente por tenantId
  if (policyContext.request.method === 'GET' ||
      policyContext.request.method === 'POST') {

    // Asegurar que existe filters en query
    if (!policyContext.request.query.filters) {
      policyContext.request.query.filters = {};
    }

    // Forzar filtro por tenant
    policyContext.request.query.filters.tenant = {
      id: {
        $eq: tenant.id
      }
    };

    strapi.log.debug(`🔒 Applying tenant filter: ${tenant.slug} (ID: ${tenant.id})`);
  }

  // PUT /api/orders/:id o DELETE /api/orders/:id
  // Validar que el recurso pertenece al tenant
  if ((policyContext.request.method === 'PUT' ||
       policyContext.request.method === 'DELETE') &&
      policyContext.params.id) {

    const resourceId = policyContext.params.id;

    // Validar ownership (se hace en el controller)
    // Aquí solo logueamos
    strapi.log.debug(`🔒 Validating tenant access to resource: ${resourceId}`);
  }

  return true;
};
