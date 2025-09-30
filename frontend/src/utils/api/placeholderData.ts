/**
 * Datos placeholder para desarrollo y testing
 * Se usan cuando la API contable no está configurada o disponible
 */

import type { Product, ProductCategory, SiteConfig, Theme } from '@/types';

export const PLACEHOLDER_PRODUCTS: Product[] = [
  {
    id: '1',
    sku: 'TECH-LAP-001',
    nombre: 'Laptop Gaming RGB Pro 15.6"',
    descripcion: 'Laptop de alto rendimiento con iluminación RGB personalizable, procesador Intel Core i7 de 11va generación, 16GB de RAM DDR4, 512GB SSD NVMe para tiempos de carga ultra rápidos. Pantalla Full HD de 144Hz ideal para gaming y trabajo profesional.',
    precio: 3500000,
    precioDescuento: 2999000,
    stock: 15,
    categoria: 'tecnologia',
    subcategoria: 'laptops',
    imagenes: {
      principal: 'https://placehold.co/800x800/1a1a1a/white?text=Laptop+Gaming',
      galeria: [
        'https://placehold.co/800x800/1a1a1a/white?text=Vista+Frontal',
        'https://placehold.co/800x800/1a1a1a/white?text=Teclado+RGB',
        'https://placehold.co/800x800/1a1a1a/white?text=Lateral',
      ]
    },
    caracteristicas: {
      'Procesador': 'Intel Core i7 11th Gen',
      'RAM': '16GB DDR4 3200MHz',
      'Almacenamiento': '512GB NVMe SSD',
      'Pantalla': '15.6" FHD 144Hz',
      'Gráficos': 'NVIDIA GeForce RTX 3060',
      'Peso': '2.3 kg',
      'Batería': '6 horas'
    },
    slug: 'laptop-gaming-rgb-pro',
    activo: true,
    fechaCreacion: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    sku: 'TECH-PHO-002',
    nombre: 'Smartphone Pro Max 256GB',
    descripcion: 'Smartphone de última generación con cámara profesional de 108MP, pantalla AMOLED de 6.7 pulgadas, procesador octa-core, carga rápida de 65W y batería de 5000mAh.',
    precio: 2800000,
    stock: 28,
    categoria: 'tecnologia',
    subcategoria: 'smartphones',
    imagenes: {
      principal: 'https://placehold.co/800x800/4a5568/white?text=Smartphone+Pro',
      galeria: [
        'https://placehold.co/800x800/4a5568/white?text=Vista+Trasera',
        'https://placehold.co/800x800/4a5568/white?text=Cámara',
      ]
    },
    caracteristicas: {
      'Pantalla': '6.7" AMOLED 120Hz',
      'Procesador': 'Snapdragon 8 Gen 2',
      'RAM': '12GB',
      'Almacenamiento': '256GB',
      'Cámara': '108MP + 12MP + 8MP',
      'Batería': '5000mAh',
      'Sistema': 'Android 14'
    },
    slug: 'smartphone-pro-max-256gb',
    activo: true,
    fechaCreacion: '2025-01-14T14:30:00Z'
  },
  {
    id: '3',
    sku: 'HOME-SOF-003',
    nombre: 'Sofá Modular Escandinavo 3 Puestos',
    descripcion: 'Elegante sofá de diseño escandinavo con tapizado en tela premium resistente, estructura de madera maciza y cojines de espuma de alta densidad. Ideal para sala de estar moderna.',
    precio: 1899000,
    precioDescuento: 1599000,
    stock: 8,
    categoria: 'hogar',
    subcategoria: 'muebles',
    imagenes: {
      principal: 'https://placehold.co/800x800/e5e7eb/1f2937?text=Sofá+Escandinavo',
      galeria: [
        'https://placehold.co/800x800/e5e7eb/1f2937?text=Vista+Lateral',
        'https://placehold.co/800x800/e5e7eb/1f2937?text=Detalle+Tela',
      ]
    },
    caracteristicas: {
      'Material': 'Tela premium',
      'Estructura': 'Madera maciza',
      'Dimensiones': '210 x 90 x 85 cm',
      'Puestos': '3 personas',
      'Color': 'Gris claro',
      'Garantía': '2 años'
    },
    slug: 'sofa-modular-escandinavo-3-puestos',
    activo: true,
    fechaCreacion: '2025-01-10T09:15:00Z'
  },
  {
    id: '4',
    sku: 'FASH-ZAP-004',
    nombre: 'Zapatillas Deportivas Running Ultra',
    descripcion: 'Zapatillas de running con tecnología de amortiguación avanzada, diseño ergonómico y materiales transpirables. Perfectas para entrenamientos intensos y maratones.',
    precio: 389000,
    stock: 45,
    categoria: 'moda',
    subcategoria: 'calzado',
    imagenes: {
      principal: 'https://placehold.co/800x800/3b82f6/white?text=Zapatillas+Running',
      galeria: [
        'https://placehold.co/800x800/3b82f6/white?text=Vista+Lateral',
        'https://placehold.co/800x800/3b82f6/white?text=Suela',
      ]
    },
    caracteristicas: {
      'Material': 'Mesh transpirable',
      'Suela': 'Caucho antideslizante',
      'Tecnología': 'Amortiguación Air',
      'Tallas': '36-44',
      'Colores': 'Negro, Azul, Gris',
      'Peso': '280g'
    },
    slug: 'zapatillas-deportivas-running-ultra',
    activo: true,
    fechaCreacion: '2025-01-12T11:00:00Z'
  },
  {
    id: '5',
    sku: 'TECH-AUD-005',
    nombre: 'Audífonos Inalámbricos Noise Cancelling',
    descripcion: 'Audífonos over-ear con cancelación activa de ruido, audio de alta fidelidad, batería de 30 horas y conectividad Bluetooth 5.2.',
    precio: 599000,
    precioDescuento: 479000,
    stock: 22,
    categoria: 'tecnologia',
    subcategoria: 'audio',
    imagenes: {
      principal: 'https://placehold.co/800x800/1f2937/white?text=Audífonos+Premium',
      galeria: [
        'https://placehold.co/800x800/1f2937/white?text=Vista+Lateral',
        'https://placehold.co/800x800/1f2937/white?text=Doblados',
      ]
    },
    caracteristicas: {
      'Conexión': 'Bluetooth 5.2',
      'Batería': '30 horas',
      'Cancelación': 'ANC activa',
      'Drivers': '40mm neodimio',
      'Peso': '250g',
      'Incluye': 'Estuche y cable'
    },
    slug: 'audifonos-inalambricos-noise-cancelling',
    activo: true,
    fechaCreacion: '2025-01-13T16:45:00Z'
  },
  {
    id: '6',
    sku: 'HOME-CAF-006',
    nombre: 'Cafetera Espresso Automática Pro',
    descripcion: 'Cafetera espresso profesional con molino integrado, 15 bares de presión, pantalla táctil y preparación automática de cappuccino y latte.',
    precio: 1290000,
    stock: 12,
    categoria: 'hogar',
    subcategoria: 'electrodomesticos',
    imagenes: {
      principal: 'https://placehold.co/800x800/7c3aed/white?text=Cafetera+Espresso',
      galeria: [
        'https://placehold.co/800x800/7c3aed/white?text=Panel+Control',
        'https://placehold.co/800x800/7c3aed/white?text=Preparando',
      ]
    },
    caracteristicas: {
      'Presión': '15 bares',
      'Capacidad': '1.8 litros',
      'Molino': 'Cerámico integrado',
      'Programas': '8 bebidas',
      'Pantalla': 'Táctil LCD',
      'Potencia': '1450W'
    },
    slug: 'cafetera-espresso-automatica-pro',
    activo: true,
    fechaCreacion: '2025-01-11T13:20:00Z'
  }
];

export const PLACEHOLDER_CATEGORIES: ProductCategory[] = [
  {
    id: '1',
    nombre: 'Tecnología',
    slug: 'tecnologia',
    descripcion: 'Laptops, smartphones, accesorios y más',
    imagen: 'https://placehold.co/400x200/2563eb/white?text=Tecnología',
    productCount: 45
  },
  {
    id: '2',
    nombre: 'Hogar',
    slug: 'hogar',
    descripcion: 'Muebles, decoración y electrodomésticos',
    imagen: 'https://placehold.co/400x200/10b981/white?text=Hogar',
    productCount: 32
  },
  {
    id: '3',
    nombre: 'Moda',
    slug: 'moda',
    descripcion: 'Ropa, calzado y accesorios',
    imagen: 'https://placehold.co/400x200/f59e0b/white?text=Moda',
    productCount: 78
  },
  {
    id: '4',
    nombre: 'Deportes',
    slug: 'deportes',
    descripcion: 'Equipamiento deportivo y fitness',
    imagen: 'https://placehold.co/400x200/ef4444/white?text=Deportes',
    productCount: 25
  }
];

export const PLACEHOLDER_THEMES: Theme[] = [
  {
    id: '1',
    nombre: 'Default',
    slug: 'default',
    colores: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937',
      textSecondary: '#6b7280'
    },
    tipografias: {
      sans: 'Inter',
      heading: 'Poppins'
    },
    activo: true
  },
  {
    id: '2',
    nombre: 'Black Friday',
    slug: 'blackfriday',
    colores: {
      primary: '#000000',
      secondary: '#ef4444',
      accent: '#fbbf24',
      background: '#18181b',
      text: '#ffffff',
      textSecondary: '#d4d4d8'
    },
    tipografias: {
      sans: 'Roboto',
      heading: 'Bebas Neue'
    },
    activo: false
  },
  {
    id: '3',
    nombre: 'Navidad',
    slug: 'navidad',
    colores: {
      primary: '#dc2626',
      secondary: '#16a34a',
      accent: '#fef3c7',
      background: '#fef2f2',
      text: '#7f1d1d',
      textSecondary: '#991b1b'
    },
    tipografias: {
      sans: 'Montserrat',
      heading: 'Playfair Display'
    },
    activo: false
  }
];

export const PLACEHOLDER_SITE_CONFIG: SiteConfig = {
  id: '1',
  temaActivo: PLACEHOLDER_THEMES[0],
  banners: [
    {
      id: '1',
      imagen: 'https://placehold.co/1920x600/2563eb/white?text=¡Ofertas+de+Lanzamiento!',
      titulo: '¡Ofertas de Lanzamiento!',
      subtitulo: 'Hasta 40% de descuento en tecnología',
      cta: {
        texto: 'Ver Ofertas',
        url: '/productos'
      },
      orden: 1,
      activo: true
    },
    {
      id: '2',
      imagen: 'https://placehold.co/1920x600/7c3aed/white?text=Envío+Gratis',
      titulo: 'Envío Gratis',
      subtitulo: 'En compras mayores a $150.000',
      cta: {
        texto: 'Comprar Ahora',
        url: '/productos'
      },
      orden: 2,
      activo: true
    }
  ],
  textos: {
    terminos: 'Términos y condiciones por definir. Consulta con el equipo legal para completar este documento.',
    privacidad: 'Política de privacidad por definir. Consulta con el equipo legal para completar este documento.',
    sobreNosotros: 'Somos una tienda online líder en Colombia, comprometidos con ofrecer los mejores productos al mejor precio.',
    politicaEnvios: 'Realizamos envíos a toda Colombia. Tiempo estimado: 2-5 días hábiles.',
    politicaDevoluciones: 'Aceptamos devoluciones dentro de los 30 días posteriores a la compra.'
  },
  iva: 0.19,
  redesSociales: {
    facebook: 'https://facebook.com/tutienda',
    instagram: 'https://instagram.com/tutienda',
    whatsapp: '+573001234567'
  },
  contacto: {
    email: 'contacto@tutienda.com',
    telefono: '+57 300 123 4567',
    direccion: 'Bogotá D.C., Colombia'
  }
};
