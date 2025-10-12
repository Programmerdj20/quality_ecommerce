-- ============================================
-- Quality E-commerce - Supabase Migration Part 2
-- Multi-Tenant SaaS - Vistas + Funciones Helper
-- Version: 1.1 (Corregido con mejores prácticas)
-- ============================================
--
-- Esta migración incluye:
-- 1. Funciones helper para RLS
-- 2. Vistas con security_invoker
-- 3. Vistas corregidas con LATERAL joins
--
-- PREREQUISITO: Haber aplicado supabase_migration_part1.sql
-- ============================================

-- ============================================
-- 1. FUNCIONES HELPER
-- ============================================

-- Función helper para obtener tenant_id del usuario actual
-- Uso: Simplifica las policies RLS
CREATE OR REPLACE FUNCTION auth.user_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid;
$$;

COMMENT ON FUNCTION auth.user_tenant_id() IS 'Retorna el tenant_id del usuario autenticado desde JWT user_metadata';

-- Función helper para verificar si es super admin
CREATE OR REPLACE FUNCTION auth.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE((auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean, false);
$$;

COMMENT ON FUNCTION auth.is_super_admin() IS 'Retorna true si el usuario es super admin';

-- ============================================
-- 2. VISTAS CON SECURITY INVOKER
-- ============================================

-- ============================================
-- 2.1 VISTA: orders_summary
-- ============================================
-- Resumen de pedidos por tenant con métricas agregadas

CREATE OR REPLACE VIEW public.orders_summary
WITH (security_invoker = true)
AS
SELECT
  t.id as tenant_id,
  t.name as tenant_name,
  t.slug as tenant_slug,
  COUNT(o.id) as total_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'pending') as pending_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'processing') as processing_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'completed') as completed_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') as cancelled_orders,
  COALESCE(SUM(o.total) FILTER (WHERE o.status = 'completed'), 0) as total_revenue,
  COALESCE(AVG(o.total) FILTER (WHERE o.status = 'completed'), 0) as avg_order_value,
  MAX(o.created_at) as last_order_date,
  MIN(o.created_at) as first_order_date
FROM public.tenants t
LEFT JOIN public.orders o ON o.tenant_id = t.id
GROUP BY t.id, t.name, t.slug;

COMMENT ON VIEW public.orders_summary IS 'Resumen de métricas de pedidos por tenant (respeta RLS)';

-- ============================================
-- 2.2 VISTA: top_products
-- ============================================
-- Top productos vendidos por tenant
-- NOTA: Usa LATERAL join para expandir JSONB array correctamente

CREATE OR REPLACE VIEW public.top_products
WITH (security_invoker = true)
AS
SELECT
  o.tenant_id,
  item->>'product_id' as product_id,
  item->>'name' as product_name,
  SUM((item->>'quantity')::int) as total_quantity,
  SUM((item->>'subtotal')::decimal) as total_revenue,
  COUNT(DISTINCT o.id) as total_orders,
  ROUND(AVG((item->>'price')::decimal), 2) as avg_price
FROM public.orders o
CROSS JOIN LATERAL jsonb_array_elements(o.items) as item
WHERE o.status = 'completed'
GROUP BY o.tenant_id, product_id, product_name
ORDER BY total_quantity DESC;

COMMENT ON VIEW public.top_products IS 'Top productos vendidos por tenant (respeta RLS)';

-- ============================================
-- 2.3 VISTA: daily_revenue
-- ============================================
-- Revenue diario por tenant (últimos 30 días)

CREATE OR REPLACE VIEW public.daily_revenue
WITH (security_invoker = true)
AS
SELECT
  tenant_id,
  DATE(created_at) as date,
  COUNT(id) as orders_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM public.orders
WHERE
  status = 'completed'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY tenant_id, DATE(created_at)
ORDER BY tenant_id, date DESC;

COMMENT ON VIEW public.daily_revenue IS 'Revenue diario por tenant (últimos 30 días, respeta RLS)';

-- ============================================
-- 2.4 VISTA: orders_by_status
-- ============================================
-- Conteo de pedidos por estado y tenant

CREATE OR REPLACE VIEW public.orders_by_status
WITH (security_invoker = true)
AS
SELECT
  tenant_id,
  status,
  COUNT(*) as count,
  SUM(total) as total_amount
FROM public.orders
GROUP BY tenant_id, status
ORDER BY tenant_id, status;

COMMENT ON VIEW public.orders_by_status IS 'Conteo de pedidos por estado y tenant (respeta RLS)';

-- ============================================
-- 2.5 VISTA: recent_orders
-- ============================================
-- Pedidos recientes (últimos 7 días)

CREATE OR REPLACE VIEW public.recent_orders
WITH (security_invoker = true)
AS
SELECT
  o.id,
  o.tenant_id,
  o.customer_name,
  o.customer_email,
  o.total,
  o.status,
  o.created_at,
  jsonb_array_length(o.items) as items_count
FROM public.orders o
WHERE o.created_at >= NOW() - INTERVAL '7 days'
ORDER BY o.created_at DESC;

COMMENT ON VIEW public.recent_orders IS 'Pedidos recientes (últimos 7 días, respeta RLS)';

-- ============================================
-- 3. PERMISOS PARA VISTAS
-- ============================================

-- Dar permisos de SELECT a roles autenticados
GRANT SELECT ON public.orders_summary TO authenticated;
GRANT SELECT ON public.top_products TO authenticated;
GRANT SELECT ON public.daily_revenue TO authenticated;
GRANT SELECT ON public.orders_by_status TO authenticated;
GRANT SELECT ON public.recent_orders TO authenticated;

-- También dar permisos a anon (para themes públicos)
GRANT SELECT ON public.themes TO anon;

-- ============================================
-- 4. VALIDACIÓN (Queries de Prueba)
-- ============================================

-- NOTA: Estas queries son comentadas, solo para referencia
-- Para probarlas, descomenta y ejecuta manualmente después de aplicar la migración

-- Probar vista orders_summary
-- SELECT * FROM public.orders_summary LIMIT 5;

-- Probar vista top_products
-- SELECT * FROM public.top_products LIMIT 10;

-- Probar vista daily_revenue
-- SELECT * FROM public.daily_revenue WHERE date >= CURRENT_DATE - 7 LIMIT 10;

-- Probar conteo de pedidos por tenant
-- SELECT tenant_id, COUNT(*) FROM public.orders GROUP BY tenant_id;

-- Probar que themes se crearon correctamente
-- SELECT name, slug, is_active FROM public.themes;

-- Probar que tenants se crearon correctamente
-- SELECT name, slug, domain, store_name FROM public.tenants;

-- ============================================
-- 5. COMENTARIOS FINALES
-- ============================================

COMMENT ON SCHEMA public IS 'Quality E-commerce Multi-Tenant Schema v1.1 - Complete';

-- Fin de Part 2
-- ============================================
-- Schema completo aplicado exitosamente ✅
-- ============================================
--
-- Próximos pasos:
-- 1. Crear usuario de prueba en Supabase Auth
-- 2. Agregar tenant_id a user_metadata
-- 3. Probar queries con RLS activo
-- 4. Crear proyecto React para panel admin
-- ============================================
