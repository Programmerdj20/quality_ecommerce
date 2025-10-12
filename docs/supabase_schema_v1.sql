-- ============================================
-- Quality E-commerce - Supabase Schema v1.0
-- Multi-Tenant SaaS - Optimizado para Free Tier
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. TABLA: tenants (Clientes/Tiendas)
-- ============================================

CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identificación
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- para URLs amigables

  -- Branding
  active_theme_id UUID, -- FK a themes (se agrega después)
  logo_url TEXT, -- URL del logo (desde Quality API o externo)

  -- Contacto
  whatsapp TEXT,
  email TEXT,
  phone TEXT,

  -- Redes sociales
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,

  -- Configuración regional
  country TEXT DEFAULT 'CO', -- código ISO
  currency TEXT DEFAULT 'COP',
  tax_rate DECIMAL(5,2) DEFAULT 19.00, -- IVA en %

  -- Textos personalizables
  store_name TEXT,
  slogan TEXT,
  welcome_message TEXT,

  -- API Tokens (encriptados)
  quality_api_token TEXT, -- Token de Quality API
  mp_access_token TEXT, -- Mercado Pago access token
  mp_public_key TEXT, -- Mercado Pago public key

  -- Estado
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  settings JSONB DEFAULT '{}', -- Configuraciones adicionales flexibles

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tenants
CREATE INDEX idx_tenants_domain ON public.tenants(domain);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_active ON public.tenants(is_active);

-- Comentarios
COMMENT ON TABLE public.tenants IS 'Clientes/tiendas de la plataforma multi-tenant';
COMMENT ON COLUMN public.tenants.settings IS 'Configuraciones adicionales en formato JSON';

-- ============================================
-- 2. TABLA: themes (Temas Visuales)
-- ============================================

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
  is_seasonal BOOLEAN DEFAULT FALSE, -- Para temas temporales (Black Friday, Navidad)

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para themes
CREATE INDEX idx_themes_slug ON public.themes(slug);
CREATE INDEX idx_themes_active ON public.themes(is_active);

-- Comentarios
COMMENT ON TABLE public.themes IS 'Temas visuales disponibles para los tenants';
COMMENT ON COLUMN public.themes.colors IS 'Paleta de colores en formato JSON';

-- ============================================
-- 3. TABLA: orders (Pedidos)
-- ============================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relación con tenant
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  -- Cliente
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,

  -- Items del pedido (JSON array)
  items JSONB NOT NULL DEFAULT '[]', -- [{product_id, name, quantity, price, subtotal}]

  -- Totales
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,

  -- Estado del pedido
  status TEXT NOT NULL DEFAULT 'pending',
  -- Estados: pending, processing, completed, cancelled

  -- Mercado Pago
  mp_payment_id TEXT, -- ID del pago en Mercado Pago
  mp_preference_id TEXT, -- ID de la preferencia de pago
  payment_method TEXT, -- Método de pago usado

  -- Metadata
  notes TEXT, -- Notas del cliente
  admin_notes TEXT, -- Notas internas del admin
  metadata JSONB DEFAULT '{}', -- Datos adicionales flexibles

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ, -- Fecha de pago confirmado
  completed_at TIMESTAMPTZ -- Fecha de completado
);

-- Índices para orders (críticos para performance)
CREATE INDEX idx_orders_tenant_id ON public.orders(tenant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_tenant_created ON public.orders(tenant_id, created_at DESC);
CREATE INDEX idx_orders_email ON public.orders(customer_email);
CREATE INDEX idx_orders_mp_payment ON public.orders(mp_payment_id) WHERE mp_payment_id IS NOT NULL;

-- Comentarios
COMMENT ON TABLE public.orders IS 'Pedidos de los clientes';
COMMENT ON COLUMN public.orders.items IS 'Array JSON con los productos del pedido';
COMMENT ON COLUMN public.orders.status IS 'Estados: pending, processing, completed, cancelled';

-- ============================================
-- 4. TABLA: site_config (Configuración adicional por tenant)
-- ============================================

CREATE TABLE public.site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relación uno-a-uno con tenant
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
  business_hours JSONB DEFAULT '{}', -- {monday: "9-18", tuesday: "9-18", ...}
  holidays JSONB DEFAULT '[]', -- Array de fechas

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

-- Índice para site_config
CREATE INDEX idx_site_config_tenant ON public.site_config(tenant_id);

-- Comentarios
COMMENT ON TABLE public.site_config IS 'Configuración adicional y personalizable por tenant';

-- ============================================
-- 5. FOREIGN KEYS ADICIONALES
-- ============================================

-- Agregar FK de active_theme_id en tenants (ahora que themes existe)
ALTER TABLE public.tenants
ADD CONSTRAINT fk_tenants_theme
FOREIGN KEY (active_theme_id)
REFERENCES public.themes(id)
ON DELETE SET NULL;

-- ============================================
-- 6. FUNCIONES Y TRIGGERS
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
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: tenants
-- ============================================

-- Policy: Los usuarios solo pueden ver su propio tenant
CREATE POLICY "Users can view their own tenant"
  ON public.tenants
  FOR SELECT
  USING (
    id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Los usuarios pueden actualizar su propio tenant
CREATE POLICY "Users can update their own tenant"
  ON public.tenants
  FOR UPDATE
  USING (
    id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Super admins pueden ver todos los tenants
CREATE POLICY "Super admins can view all tenants"
  ON public.tenants
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- RLS POLICIES: themes
-- ============================================

-- Policy: Todos pueden leer themes (público)
CREATE POLICY "Anyone can view active themes"
  ON public.themes
  FOR SELECT
  USING (is_active = true);

-- Policy: Solo admins pueden modificar themes
CREATE POLICY "Admins can manage themes"
  ON public.themes
  FOR ALL
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- RLS POLICIES: orders
-- ============================================

-- Policy: Los usuarios solo ven pedidos de su tenant
CREATE POLICY "Users can view their tenant orders"
  ON public.orders
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Los usuarios pueden crear pedidos para su tenant
CREATE POLICY "Users can create orders for their tenant"
  ON public.orders
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Los usuarios pueden actualizar pedidos de su tenant
CREATE POLICY "Users can update their tenant orders"
  ON public.orders
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Super admins pueden ver todos los pedidos
CREATE POLICY "Super admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'is_super_admin')::boolean = true
  );

-- ============================================
-- RLS POLICIES: site_config
-- ============================================

-- Policy: Los usuarios solo ven config de su tenant
CREATE POLICY "Users can view their tenant config"
  ON public.site_config
  FOR SELECT
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Los usuarios pueden actualizar config de su tenant
CREATE POLICY "Users can update their tenant config"
  ON public.site_config
  FOR UPDATE
  USING (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- Policy: Los usuarios pueden crear config para su tenant
CREATE POLICY "Users can create config for their tenant"
  ON public.site_config
  FOR INSERT
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'user_metadata' ->> 'tenant_id')::uuid
  );

-- ============================================
-- 8. SEED DATA
-- ============================================

-- Insertar temas predeterminados
INSERT INTO public.themes (name, slug, description, colors, is_active, is_seasonal) VALUES
  (
    'Default',
    'default',
    'Tema corporativo con colores azul y morado',
    '{
      "primary": "#3b82f6",
      "secondary": "#8b5cf6",
      "accent": "#f59e0b",
      "background": "#ffffff",
      "foreground": "#000000",
      "muted": "#f3f4f6",
      "border": "#e5e7eb"
    }',
    true,
    false
  ),
  (
    'Black Friday',
    'black-friday',
    'Tema oscuro para promociones especiales',
    '{
      "primary": "#ef4444",
      "secondary": "#fbbf24",
      "accent": "#f97316",
      "background": "#111827",
      "foreground": "#ffffff",
      "muted": "#1f2937",
      "border": "#374151"
    }',
    true,
    true
  ),
  (
    'Navidad',
    'navidad',
    'Tema festivo con colores navideños',
    '{
      "primary": "#dc2626",
      "secondary": "#16a34a",
      "accent": "#fbbf24",
      "background": "#ffffff",
      "foreground": "#000000",
      "muted": "#fef2f2",
      "border": "#fee2e2"
    }',
    true,
    true
  );

-- Insertar tenants de prueba
INSERT INTO public.tenants (
  name,
  domain,
  slug,
  active_theme_id,
  whatsapp,
  email,
  country,
  currency,
  tax_rate,
  store_name,
  slogan
) VALUES
  (
    'Tienda Demo 1',
    'demo1.localhost',
    'demo1',
    (SELECT id FROM public.themes WHERE slug = 'default'),
    '+57 300 123 4567',
    'contacto@demo1.com',
    'CO',
    'COP',
    19.00,
    'Tienda Demo 1',
    'Los mejores productos al mejor precio'
  ),
  (
    'Tienda Demo 2',
    'demo2.localhost',
    'demo2',
    (SELECT id FROM public.themes WHERE slug = 'black-friday'),
    '+57 300 765 4321',
    'info@demo2.com',
    'CO',
    'COP',
    19.00,
    'Tienda Demo 2',
    'Tu tienda de confianza online'
  );

-- Insertar site_config para cada tenant
INSERT INTO public.site_config (tenant_id, meta_title, meta_description)
SELECT
  id,
  store_name,
  slogan
FROM public.tenants;

-- Insertar pedidos de ejemplo (tenant 1)
INSERT INTO public.orders (
  tenant_id,
  customer_name,
  customer_email,
  customer_phone,
  items,
  subtotal,
  tax,
  total,
  status
) VALUES
  (
    (SELECT id FROM public.tenants WHERE slug = 'demo1'),
    'Juan Pérez',
    'juan@example.com',
    '+57 300 111 2222',
    '[
      {"product_id": "prod-1", "name": "Producto A", "quantity": 2, "price": 50000, "subtotal": 100000},
      {"product_id": "prod-2", "name": "Producto B", "quantity": 1, "price": 75000, "subtotal": 75000}
    ]',
    175000,
    33250,
    208250,
    'completed'
  ),
  (
    (SELECT id FROM public.tenants WHERE slug = 'demo1'),
    'María García',
    'maria@example.com',
    '+57 300 333 4444',
    '[
      {"product_id": "prod-3", "name": "Producto C", "quantity": 3, "price": 30000, "subtotal": 90000}
    ]',
    90000,
    17100,
    107100,
    'pending'
  ),
  (
    (SELECT id FROM public.tenants WHERE slug = 'demo1'),
    'Carlos López',
    'carlos@example.com',
    '+57 300 555 6666',
    '[
      {"product_id": "prod-1", "name": "Producto A", "quantity": 1, "price": 50000, "subtotal": 50000},
      {"product_id": "prod-4", "name": "Producto D", "quantity": 2, "price": 40000, "subtotal": 80000}
    ]',
    130000,
    24700,
    154700,
    'processing'
  );

-- Insertar pedidos de ejemplo (tenant 2)
INSERT INTO public.orders (
  tenant_id,
  customer_name,
  customer_email,
  items,
  subtotal,
  tax,
  total,
  status
) VALUES
  (
    (SELECT id FROM public.tenants WHERE slug = 'demo2'),
    'Ana Martínez',
    'ana@example.com',
    '[
      {"product_id": "prod-5", "name": "Producto E", "quantity": 1, "price": 120000, "subtotal": 120000}
    ]',
    120000,
    22800,
    142800,
    'completed'
  ),
  (
    (SELECT id FROM public.tenants WHERE slug = 'demo2'),
    'Luis Rodríguez',
    'luis@example.com',
    '[
      {"product_id": "prod-6", "name": "Producto F", "quantity": 4, "price": 25000, "subtotal": 100000}
    ]',
    100000,
    19000,
    119000,
    'pending'
  );

-- ============================================
-- 9. VISTAS ÚTILES (Opcional)
-- ============================================

-- Vista: Resumen de pedidos por tenant
CREATE OR REPLACE VIEW public.orders_summary AS
SELECT
  t.id as tenant_id,
  t.name as tenant_name,
  COUNT(o.id) as total_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'pending') as pending_orders,
  COUNT(o.id) FILTER (WHERE o.status = 'completed') as completed_orders,
  SUM(o.total) FILTER (WHERE o.status = 'completed') as total_revenue,
  MAX(o.created_at) as last_order_date
FROM public.tenants t
LEFT JOIN public.orders o ON o.tenant_id = t.id
GROUP BY t.id, t.name;

-- Vista: Top productos vendidos
CREATE OR REPLACE VIEW public.top_products AS
SELECT
  tenant_id,
  jsonb_array_elements(items)->>'product_id' as product_id,
  jsonb_array_elements(items)->>'name' as product_name,
  SUM((jsonb_array_elements(items)->>'quantity')::int) as total_quantity,
  SUM((jsonb_array_elements(items)->>'subtotal')::decimal) as total_revenue
FROM public.orders
WHERE status = 'completed'
GROUP BY tenant_id, product_id, product_name
ORDER BY total_quantity DESC;

-- ============================================
-- 10. COMENTARIOS FINALES
-- ============================================

COMMENT ON SCHEMA public IS 'Quality E-commerce Multi-Tenant Schema v1.0 - Optimizado para Supabase Free Tier';

-- Fin del script
-- ============================================
-- TOTAL: ~300 líneas
-- Base de datos lista para panel admin React
-- ============================================
