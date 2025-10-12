-- ============================================
-- Quality E-commerce - Supabase Migration Part 1
-- Multi-Tenant SaaS - Tablas + RLS + Seed Data
-- Version: 1.1 (Corregido con mejores prácticas)
-- ============================================
--
-- Esta migración incluye:
-- 1. Extensiones
-- 2. Tablas principales
-- 3. Índices (incluyendo los necesarios para RLS)
-- 4. Triggers
-- 5. RLS Policies (optimizadas)
-- 6. Seed Data
--
-- NO incluye: Vistas ni funciones helper (ver part2)
-- ============================================

-- ============================================
-- 1. EXTENSIONES
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. TABLAS
-- ============================================

-- ============================================
-- 2.1 TABLA: themes (Temas Visuales)
-- ============================================
-- NOTA: Creamos themes PRIMERO porque tenants tiene FK a themes

CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificación
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,

  -- Colores (JSON con toda la paleta)
  colors JSONB NOT NULL DEFAULT '{
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "foreground": "#000000",
    "muted": "#f3f4f6",
    "border": "#e5e7eb"
  }',

  -- Tipografía
  fonts JSONB DEFAULT '{
    "heading": "Inter",
    "body": "Inter"
  }',

  -- Preview
  preview_image_url TEXT,

  -- Estado
  is_active BOOLEAN DEFAULT TRUE,
  is_seasonal BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.themes IS 'Temas visuales disponibles para los tenants';
COMMENT ON COLUMN public.themes.colors IS 'Paleta de colores en formato JSON';
COMMENT ON COLUMN public.themes.is_seasonal IS 'Temas temporales como Black Friday, Navidad';

-- ============================================
-- 2.2 TABLA: tenants (Clientes/Tiendas)
-- ============================================

CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificación
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Branding
  active_theme_id UUID REFERENCES public.themes(id) ON DELETE SET NULL,
  logo_url TEXT,

  -- Contacto
  whatsapp TEXT,
  email TEXT,
  phone TEXT,

  -- Redes sociales
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,

  -- Configuración regional
  country TEXT DEFAULT 'CO',
  currency TEXT DEFAULT 'COP',
  tax_rate DECIMAL(5,2) DEFAULT 19.00,

  -- Textos personalizables
  store_name TEXT,
  slogan TEXT,
  welcome_message TEXT,

  -- API Tokens
  quality_api_token TEXT,
  mp_access_token TEXT,
  mp_public_key TEXT,

  -- Estado
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata flexible
  settings JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.tenants IS 'Clientes/tiendas de la plataforma multi-tenant';
COMMENT ON COLUMN public.tenants.settings IS 'Configuraciones adicionales en formato JSON';

-- ============================================
-- 2.3 TABLA: orders (Pedidos)
-- ============================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- FK a tenant
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Cliente
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,

  -- Items del pedido (JSON array)
  items JSONB NOT NULL DEFAULT '[]',

  -- Totales
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Estado del pedido
  status TEXT NOT NULL DEFAULT 'pending',

  -- Mercado Pago
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  payment_method TEXT,

  -- Metadata
  notes TEXT,
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.orders IS 'Pedidos de los clientes';
COMMENT ON COLUMN public.orders.items IS 'Array JSON: [{"product_id", "name", "quantity", "price", "subtotal"}]';
COMMENT ON COLUMN public.orders.status IS 'Estados: pending, processing, completed, cancelled';

-- ============================================
-- 2.4 TABLA: site_config (Configuración por tenant)
-- ============================================

CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- FK uno-a-uno con tenant
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Configuración de checkout
  enable_guest_checkout BOOLEAN DEFAULT TRUE,
  require_phone BOOLEAN DEFAULT FALSE,
  require_address BOOLEAN DEFAULT FALSE,

  -- Mensajes personalizados
  checkout_success_message TEXT,
  checkout_pending_message TEXT,
  out_of_stock_message TEXT,

  -- Políticas
  shipping_policy TEXT,
  return_policy TEXT,
  privacy_policy TEXT,
  terms_conditions TEXT,

  -- Horarios y disponibilidad
  business_hours JSONB DEFAULT '{}',
  holidays JSONB DEFAULT '[]',

  -- Features habilitadas
  features JSONB DEFAULT '{
    "cart": true,
    "wishlist": false,
    "reviews": false,
    "chat": false
  }',

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Analytics
  google_analytics_id TEXT,
  facebook_pixel_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.site_config IS 'Configuración adicional y personalizable por tenant';

-- ============================================
-- 3. ÍNDICES
-- ============================================

-- Índices para themes
CREATE INDEX idx_themes_slug ON public.themes(slug);
CREATE INDEX idx_themes_active ON public.themes(is_active);

-- Índices para tenants
CREATE INDEX idx_tenants_domain ON public.tenants(domain);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active ON public.tenants(is_active);

-- Índices para orders (CRÍTICOS para performance con RLS)
CREATE INDEX idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_tenant_created ON public.orders(tenant_id, created_at DESC);
CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_mp_payment ON public.orders(mp_payment_id) WHERE mp_payment_id IS NOT NULL;

-- Índice para site_config
CREATE INDEX idx_site_config_tenant ON public.site_config(tenant_id);

-- ============================================
-- 4. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON public.themes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at
  BEFORE UPDATE ON public.site_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5.1 RLS POLICIES: themes
-- ============================================

-- Todos pueden leer themes activos (público)
CREATE POLICY "Anyone can view active themes"
  ON public.themes
  FOR SELECT
  USING (is_active = true);

-- Solo super admins pueden modificar themes
CREATE POLICY "Super admins can manage themes"
  ON public.themes
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- 5.2 RLS POLICIES: tenants
-- ============================================

-- Users solo ven su propio tenant
-- NOTA: Usa (SELECT auth.uid()) para mejor performance (caching)
CREATE POLICY "Users can view their own tenant"
  ON public.tenants
  FOR SELECT
  USING (
    id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Users pueden actualizar su propio tenant
CREATE POLICY "Users can update their own tenant"
  ON public.tenants
  FOR UPDATE
  USING (
    id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Super admins pueden ver todos los tenants
CREATE POLICY "Super admins can view all tenants"
  ON public.tenants
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- 5.3 RLS POLICIES: orders
-- ============================================

-- Users solo ven pedidos de su tenant
CREATE POLICY "Users can view their tenant orders"
  ON public.orders
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Users pueden crear pedidos para su tenant
CREATE POLICY "Users can create orders for their tenant"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Users pueden actualizar pedidos de su tenant
CREATE POLICY "Users can update their tenant orders"
  ON public.orders
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Super admins pueden ver todos los pedidos
CREATE POLICY "Super admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- 5.4 RLS POLICIES: site_config
-- ============================================

-- Users solo ven config de su tenant
CREATE POLICY "Users can view their tenant config"
  ON public.site_config
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Users pueden actualizar config de su tenant
CREATE POLICY "Users can update their tenant config"
  ON public.site_config
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Users pueden crear config para su tenant
CREATE POLICY "Users can create config for their tenant"
  ON public.site_config
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- ============================================
-- 6. SEED DATA
-- ============================================

-- 6.1 Insertar temas predeterminados
INSERT INTO public.themes (name, slug, description, colors, is_active, is_seasonal) VALUES
  (
    'Default',
    'default',
    'Tema corporativo con colores azul y morado',
    '{"primary": "#3b82f6", "secondary": "#8b5cf6", "accent": "#f59e0b", "background": "#ffffff", "foreground": "#000000", "muted": "#f3f4f6", "border": "#e5e7eb"}',
    true,
    false
  ),
  (
    'Black Friday',
    'black-friday',
    'Tema oscuro para promociones especiales',
    '{"primary": "#ef4444", "secondary": "#fbbf24", "accent": "#f97316", "background": "#111827", "foreground": "#ffffff", "muted": "#1f2937", "border": "#374151"}',
    true,
    true
  ),
  (
    'Navidad',
    'navidad',
    'Tema festivo con colores navideños',
    '{"primary": "#dc2626", "secondary": "#16a34a", "accent": "#fbbf24", "background": "#ffffff", "foreground": "#000000", "muted": "#fef2f2", "border": "#fee2e2"}',
    true,
    true
  );

-- 6.2 Insertar tenants de prueba
WITH theme_ids AS (
  SELECT id, slug FROM public.themes
)
INSERT INTO public.tenants (
  name, domain, slug, active_theme_id,
  whatsapp, email, country, currency, tax_rate,
  store_name, slogan
)
SELECT
  'Tienda Demo 1',
  'demo1.localhost',
  'demo1',
  (SELECT id FROM theme_ids WHERE slug = 'default'),
  '+57 300 123 4567',
  'contacto@demo1.com',
  'CO',
  'COP',
  19.00,
  'Tienda Demo 1',
  'Los mejores productos al mejor precio'
UNION ALL
SELECT
  'Tienda Demo 2',
  'demo2.localhost',
  'demo2',
  (SELECT id FROM theme_ids WHERE slug = 'black-friday'),
  '+57 300 765 4321',
  'info@demo2.com',
  'CO',
  'COP',
  19.00,
  'Tienda Demo 2',
  'Tu tienda de confianza online';

-- 6.3 Insertar site_config para cada tenant
INSERT INTO public.site_config (tenant_id, meta_title, meta_description)
SELECT
  id,
  store_name,
  slogan
FROM public.tenants;

-- 6.4 Insertar pedidos de ejemplo (tenant 1)
WITH tenant1 AS (
  SELECT id FROM public.tenants WHERE slug = 'demo1' LIMIT 1
)
INSERT INTO public.orders (
  tenant_id, customer_name, customer_email, customer_phone,
  items, subtotal, tax, total, status
)
SELECT
  (SELECT id FROM tenant1),
  'Juan Pérez',
  'juan@example.com',
  '+57 300 111 2222',
  '[{"product_id": "prod-1", "name": "Producto A", "quantity": 2, "price": 50000, "subtotal": 100000}, {"product_id": "prod-2", "name": "Producto B", "quantity": 1, "price": 75000, "subtotal": 75000}]'::jsonb,
  175000,
  33250,
  208250,
  'completed'
UNION ALL
SELECT
  (SELECT id FROM tenant1),
  'María García',
  'maria@example.com',
  '+57 300 333 4444',
  '[{"product_id": "prod-3", "name": "Producto C", "quantity": 3, "price": 30000, "subtotal": 90000}]'::jsonb,
  90000,
  17100,
  107100,
  'pending'
UNION ALL
SELECT
  (SELECT id FROM tenant1),
  'Carlos López',
  'carlos@example.com',
  '+57 300 555 6666',
  '[{"product_id": "prod-1", "name": "Producto A", "quantity": 1, "price": 50000, "subtotal": 50000}, {"product_id": "prod-4", "name": "Producto D", "quantity": 2, "price": 40000, "subtotal": 80000}]'::jsonb,
  130000,
  24700,
  154700,
  'processing';

-- 6.5 Insertar pedidos de ejemplo (tenant 2)
WITH tenant2 AS (
  SELECT id FROM public.tenants WHERE slug = 'demo2' LIMIT 1
)
INSERT INTO public.orders (
  tenant_id, customer_name, customer_email,
  items, subtotal, tax, total, status
)
SELECT
  (SELECT id FROM tenant2),
  'Ana Martínez',
  'ana@example.com',
  '[{"product_id": "prod-5", "name": "Producto E", "quantity": 1, "price": 120000, "subtotal": 120000}]'::jsonb,
  120000,
  22800,
  142800,
  'completed'
UNION ALL
SELECT
  (SELECT id FROM tenant2),
  'Luis Rodríguez',
  'luis@example.com',
  '[{"product_id": "prod-6", "name": "Producto F", "quantity": 4, "price": 25000, "subtotal": 100000}]'::jsonb,
  100000,
  19000,
  119000,
  'pending';

-- ============================================
-- 7. COMENTARIOS FINALES
-- ============================================

COMMENT ON SCHEMA public IS 'Quality E-commerce Multi-Tenant Schema v1.1 - Part 1';

-- Fin de Part 1
-- ============================================
-- SIGUIENTE: Aplicar supabase_migration_part2.sql (vistas)
-- ============================================
