import { defineMiddleware } from "astro:middleware";
import { getTenantByDomain } from "@/utils/tenant/tenantResolver";
import { tenantToContext } from "@/types/tenant";

export const onRequest = defineMiddleware(async (context, next) => {
    // Ignorar archivos estáticos y API endpoints si es necesario
    // Pero para tenant, queremos que aplique a todo lo que renderiza páginas.

    // Evitar loop infinito en 404
    if (context.url.pathname === '/404') {
        return next();
    }

    const domain = context.url.host;

    try {
        let tenant = await getTenantByDomain(domain);

        // Fallback para desarrollo local si no se encuentra tenant en Strapi
        if (!tenant && (domain.includes('localhost') || domain.includes('127.0.0.1'))) {
            console.warn(`⚠️ Desarrollo local detectado sin tenant en Strapi. Usando tenant mock.`);
            tenant = {
                id: 'dev-tenant',
                nombre: 'Tienda de Desarrollo',
                slug: 'dev-store',
                dominio: domain,
                activo: true,
                planActual: 'premium',
                configuracion: {
                    nombre: 'Quality Ecommerce Dev',
                    descripcion: 'Tienda de prueba para desarrollo local',
                    logo: '/images/logo-placeholder.png', // Asegúrate de que exista o usa texto
                    colores: {
                        primary: '#000000',
                        secondary: '#ffffff',
                        accent: '#f59e0b'
                    }
                }
            };
        }

        if (!tenant) {
            console.error(`❌ No se encontró tenant para dominio: ${domain}`);
            return context.redirect('/404');
        }

        // Guardar en locals como TenantContext
        context.locals.tenant = tenantToContext(tenant);

        return next();
    } catch (error) {
        console.error('Error en middleware de tenant:', error);
        // En desarrollo, no redirigir a 404 por error, mostrar error en consola
        if (domain.includes('localhost')) {
            return next();
        }
        return context.redirect('/404');
    }
});
