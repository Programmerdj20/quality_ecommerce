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
  },
  {
    id: '7',
    sku: 'TECH-MON-007',
    nombre: 'Monitor Gaming Curvo 27" 240Hz',
    descripcion: 'Monitor gaming de alta gama con pantalla curva VA de 27 pulgadas, tasa de refresco de 240Hz, tiempo de respuesta de 1ms, resolución QHD 2560x1440, compatible con FreeSync y G-Sync.',
    precio: 1799000,
    precioDescuento: 1499000,
    stock: 18,
    categoria: 'tecnologia',
    subcategoria: 'monitores',
    imagenes: {
      principal: 'https://placehold.co/800x800/1f2937/white?text=Monitor+Gaming+27',
      galeria: [
        'https://placehold.co/800x800/1f2937/white?text=Vista+Frontal',
        'https://placehold.co/800x800/1f2937/white?text=Base+RGB',
      ]
    },
    caracteristicas: {
      'Tamaño': '27 pulgadas',
      'Resolución': '2560x1440 QHD',
      'Tasa Refresco': '240Hz',
      'Tiempo Respuesta': '1ms MPRT',
      'Panel': 'VA Curvo 1500R',
      'Conectividad': 'HDMI 2.1, DisplayPort 1.4',
      'HDR': 'HDR10'
    },
    slug: 'monitor-gaming-curvo-27-240hz',
    activo: true,
    fechaCreacion: '2025-01-16T08:30:00Z'
  },
  {
    id: '8',
    sku: 'TECH-MOU-008',
    nombre: 'Mouse Gamer RGB Pro 16000 DPI',
    descripcion: 'Mouse gaming de alta precisión con sensor óptico de 16000 DPI, 8 botones programables, iluminación RGB personalizable, switches mecánicos de 50 millones de clics.',
    precio: 189000,
    stock: 65,
    categoria: 'tecnologia',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/374151/white?text=Mouse+Gamer',
      galeria: [
        'https://placehold.co/800x800/374151/white?text=RGB+Lights',
        'https://placehold.co/800x800/374151/white?text=Botones',
      ]
    },
    caracteristicas: {
      'Sensor': 'Óptico 16000 DPI',
      'Botones': '8 programables',
      'Iluminación': 'RGB 16.8M colores',
      'Switches': 'Mecánicos 50M clics',
      'Cable': 'Trenzado 1.8m',
      'Software': 'Compatible Windows/Mac'
    },
    slug: 'mouse-gamer-rgb-pro-16000-dpi',
    activo: true,
    fechaCreacion: '2025-01-17T10:15:00Z'
  },
  {
    id: '9',
    sku: 'TECH-KEY-009',
    nombre: 'Teclado Mecánico RGB Switch Blue',
    descripcion: 'Teclado mecánico gaming con switches blue táctiles y audibles, iluminación RGB por tecla, construcción en aluminio, reposamuñecas magnético, teclas anti-ghosting completas.',
    precio: 459000,
    precioDescuento: 379000,
    stock: 34,
    categoria: 'tecnologia',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/1a1a1a/white?text=Teclado+Mecánico',
      galeria: [
        'https://placehold.co/800x800/1a1a1a/white?text=RGB+Backlight',
        'https://placehold.co/800x800/1a1a1a/white?text=Switches',
      ]
    },
    caracteristicas: {
      'Switches': 'Mecánicos Blue',
      'Iluminación': 'RGB por tecla',
      'Material': 'Aluminio anodizado',
      'Anti-Ghosting': 'N-Key Rollover',
      'Cable': 'USB-C desmontable',
      'Incluye': 'Reposamuñecas magnético'
    },
    slug: 'teclado-mecanico-rgb-switch-blue',
    activo: true,
    fechaCreacion: '2025-01-18T14:00:00Z'
  },
  {
    id: '10',
    sku: 'TECH-CAM-010',
    nombre: 'Webcam 4K Streaming con Micrófono',
    descripcion: 'Webcam profesional 4K Ultra HD con enfoque automático, corrección de luz, doble micrófono con cancelación de ruido, compatible con Zoom, Teams, OBS. Perfecta para streaming y videoconferencias.',
    precio: 549000,
    stock: 27,
    categoria: 'tecnologia',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/4a5568/white?text=Webcam+4K',
      galeria: [
        'https://placehold.co/800x800/4a5568/white?text=Vista+Frontal',
        'https://placehold.co/800x800/4a5568/white?text=Con+Trípode',
      ]
    },
    caracteristicas: {
      'Resolución': '4K 30fps / 1080p 60fps',
      'Campo Visión': '90 grados',
      'Enfoque': 'Automático',
      'Micrófono': 'Dual con cancelación ruido',
      'Conexión': 'USB 3.0',
      'Incluye': 'Trípode y tapa privacidad'
    },
    slug: 'webcam-4k-streaming-microfono',
    activo: true,
    fechaCreacion: '2025-01-19T09:45:00Z'
  },
  {
    id: '11',
    sku: 'HOME-ASP-011',
    nombre: 'Aspiradora Robot Inteligente WiFi',
    descripcion: 'Robot aspirador con navegación láser, mapeo inteligente, succión de 2700Pa, control por app, compatible con Alexa y Google Home, limpieza programada y automática.',
    precio: 1399000,
    precioDescuento: 1099000,
    stock: 14,
    categoria: 'hogar',
    subcategoria: 'electrodomesticos',
    imagenes: {
      principal: 'https://placehold.co/800x800/1f2937/white?text=Robot+Aspiradora',
      galeria: [
        'https://placehold.co/800x800/1f2937/white?text=Vista+Superior',
        'https://placehold.co/800x800/1f2937/white?text=Base+Carga',
      ]
    },
    caracteristicas: {
      'Succión': '2700Pa',
      'Navegación': 'Láser LDS',
      'Batería': '5200mAh - 150min',
      'Depósito': '600ml',
      'Conectividad': 'WiFi, App móvil',
      'Compatible': 'Alexa, Google Home',
      'Incluye': 'Base carga, 4 filtros'
    },
    slug: 'aspiradora-robot-inteligente-wifi',
    activo: true,
    fechaCreacion: '2025-01-20T11:30:00Z'
  },
  {
    id: '12',
    sku: 'HOME-LED-012',
    nombre: 'Kit 3 Lámparas LED Inteligentes RGB',
    descripcion: 'Pack de 3 bombillas LED inteligentes con 16 millones de colores, control por voz y app, programación horaria, sincronización con música, bajo consumo de energía.',
    precio: 229000,
    precioDescuento: 179000,
    stock: 58,
    categoria: 'hogar',
    subcategoria: 'iluminacion',
    imagenes: {
      principal: 'https://placehold.co/800x800/374151/white?text=LED+Smart+Kit',
      galeria: [
        'https://placehold.co/800x800/374151/white?text=Colores+RGB',
        'https://placehold.co/800x800/374151/white?text=App+Control',
      ]
    },
    caracteristicas: {
      'Cantidad': '3 bombillas',
      'Potencia': '9W equivalente 60W',
      'Colores': '16 millones RGB',
      'Conectividad': 'WiFi 2.4GHz',
      'Control': 'App + Voz',
      'Compatible': 'Alexa, Google, Siri',
      'Vida Útil': '25.000 horas'
    },
    slug: 'kit-3-lamparas-led-inteligentes-rgb',
    activo: true,
    fechaCreacion: '2025-01-21T15:20:00Z'
  },
  {
    id: '13',
    sku: 'HOME-LIC-013',
    nombre: 'Licuadora Industrial 2000W 2.5L',
    descripcion: 'Licuadora de alta potencia con motor de 2000W, jarra de vidrio templado de 2.5 litros, 8 velocidades + pulse, cuchillas de acero inoxidable, base antideslizante.',
    precio: 489000,
    stock: 23,
    categoria: 'hogar',
    subcategoria: 'electrodomesticos',
    imagenes: {
      principal: 'https://placehold.co/800x800/4a5568/white?text=Licuadora+Industrial',
      galeria: [
        'https://placehold.co/800x800/4a5568/white?text=Vista+Lateral',
        'https://placehold.co/800x800/4a5568/white?text=Panel+Control',
      ]
    },
    caracteristicas: {
      'Potencia': '2000W',
      'Capacidad': '2.5 litros',
      'Velocidades': '8 + Pulse',
      'Jarra': 'Vidrio templado',
      'Cuchillas': 'Acero inoxidable 6 puntas',
      'Funciones': 'Hielo, smoothies, sopas',
      'Garantía': '3 años'
    },
    slug: 'licuadora-industrial-2000w-2-5l',
    activo: true,
    fechaCreacion: '2025-01-22T12:00:00Z'
  },
  {
    id: '14',
    sku: 'HOME-SAR-014',
    nombre: 'Set 5 Sartenes Antiadherentes Profesional',
    descripcion: 'Juego completo de sartenes de aluminio forjado con recubrimiento cerámico antiadherente libre de PFOA, aptas para todo tipo de cocinas incluida inducción, mangos ergonómicos.',
    precio: 359000,
    stock: 31,
    categoria: 'hogar',
    subcategoria: 'cocina',
    imagenes: {
      principal: 'https://placehold.co/800x800/1a1a1a/white?text=Set+Sartenes',
      galeria: [
        'https://placehold.co/800x800/1a1a1a/white?text=5+Piezas',
        'https://placehold.co/800x800/1a1a1a/white?text=Recubrimiento',
      ]
    },
    caracteristicas: {
      'Piezas': '5 sartenes (18/20/24/28/30cm)',
      'Material': 'Aluminio forjado',
      'Recubrimiento': 'Cerámico antiadherente',
      'Libre de': 'PFOA, PFOS, plomo',
      'Compatible': 'Todo tipo cocinas + inducción',
      'Mangos': 'Baquelita termorresistente',
      'Garantía': '2 años'
    },
    slug: 'set-5-sartenes-antiadherentes-profesional',
    activo: true,
    fechaCreacion: '2025-01-23T10:30:00Z'
  },
  {
    id: '15',
    sku: 'FASH-JAC-015',
    nombre: 'Chaqueta Impermeable Deportiva Unisex',
    descripcion: 'Chaqueta deportiva de alta calidad con tejido impermeable y transpirable, capucha ajustable, bolsillos con cierre, reflectivos de seguridad, perfecta para running y outdoor.',
    precio: 299000,
    precioDescuento: 229000,
    stock: 52,
    categoria: 'moda',
    subcategoria: 'deportivo',
    imagenes: {
      principal: 'https://placehold.co/800x800/1f2937/white?text=Chaqueta+Deportiva',
      galeria: [
        'https://placehold.co/800x800/1f2937/white?text=Vista+Trasera',
        'https://placehold.co/800x800/1f2937/white?text=Detalles',
      ]
    },
    caracteristicas: {
      'Material': 'Poliéster impermeable',
      'Transpirable': 'Sí, membrana técnica',
      'Capucha': 'Ajustable con cordón',
      'Bolsillos': '3 con cierre',
      'Reflectivos': 'Frontales y traseros',
      'Tallas': 'XS, S, M, L, XL, XXL',
      'Colores': 'Negro, Azul, Verde'
    },
    slug: 'chaqueta-impermeable-deportiva-unisex',
    activo: true,
    fechaCreacion: '2025-01-24T14:45:00Z'
  },
  {
    id: '16',
    sku: 'FASH-WAT-016',
    nombre: 'Reloj Inteligente Deportivo GPS',
    descripcion: 'Smartwatch deportivo con GPS integrado, monitor de frecuencia cardíaca 24/7, oxígeno en sangre, 100+ modos deportivos, resistente al agua 5ATM, batería 14 días.',
    precio: 699000,
    precioDescuento: 549000,
    stock: 41,
    categoria: 'moda',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/374151/white?text=Smartwatch+GPS',
      galeria: [
        'https://placehold.co/800x800/374151/white?text=Pantalla+AMOLED',
        'https://placehold.co/800x800/374151/white?text=Correas',
      ]
    },
    caracteristicas: {
      'Pantalla': '1.43" AMOLED',
      'GPS': 'Integrado + GLONASS',
      'Sensores': 'FC, SpO2, sueño, estrés',
      'Deportes': '100+ modos',
      'Batería': '14 días uso normal',
      'Resistencia': '5ATM (50m)',
      'Conectividad': 'Bluetooth 5.0',
      'Compatible': 'iOS y Android'
    },
    slug: 'reloj-inteligente-deportivo-gps',
    activo: true,
    fechaCreacion: '2025-01-25T09:00:00Z'
  },
  {
    id: '17',
    sku: 'FASH-BAG-017',
    nombre: 'Mochila Antirrobo USB Impermeable',
    descripcion: 'Mochila urbana de diseño moderno con puerto USB externo, compartimento para laptop 15.6", material impermeable, cierres ocultos antirrobo, correas ergonómicas acolchadas.',
    precio: 169000,
    stock: 67,
    categoria: 'moda',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/4a5568/white?text=Mochila+Antirrobo',
      galeria: [
        'https://placehold.co/800x800/4a5568/white?text=Puerto+USB',
        'https://placehold.co/800x800/4a5568/white?text=Compartimentos',
      ]
    },
    caracteristicas: {
      'Capacidad': '25 litros',
      'Laptop': 'Hasta 15.6 pulgadas',
      'Puerto USB': 'Carga externa',
      'Material': 'Poliéster impermeable',
      'Cierres': 'Ocultos antirrobo',
      'Bolsillos': '8 compartimentos',
      'Correas': 'Ergonómicas acolchadas',
      'Colores': 'Negro, Gris'
    },
    slug: 'mochila-antirrobo-usb-impermeable',
    activo: true,
    fechaCreacion: '2025-01-26T11:15:00Z'
  },
  {
    id: '18',
    sku: 'FASH-SUN-018',
    nombre: 'Gafas de Sol Polarizadas UV400',
    descripcion: 'Gafas de sol deportivas con lentes polarizadas, protección UV400, montura de aluminio-magnesio ultraligera, diseño aerodinámico, incluye estuche rígido y paño de limpieza.',
    precio: 149000,
    precioDescuento: 99000,
    stock: 78,
    categoria: 'moda',
    subcategoria: 'accesorios',
    imagenes: {
      principal: 'https://placehold.co/800x800/1a1a1a/white?text=Gafas+Sol',
      galeria: [
        'https://placehold.co/800x800/1a1a1a/white?text=Vista+Lateral',
        'https://placehold.co/800x800/1a1a1a/white?text=Estuche',
      ]
    },
    caracteristicas: {
      'Lentes': 'Polarizadas TAC',
      'Protección': 'UV400 100%',
      'Montura': 'Aluminio-magnesio',
      'Peso': '26 gramos',
      'Categoría': 'CAT 3',
      'Incluye': 'Estuche rígido, paño, caja',
      'Colores': 'Negro, Plata, Azul'
    },
    slug: 'gafas-sol-polarizadas-uv400',
    activo: true,
    fechaCreacion: '2025-01-27T13:30:00Z'
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
      primary: '#1d4ed8',
      secondary: '#6d28d9',
      accent: '#ea580c',
      background: '#ffffff',
      text: '#111827',
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
