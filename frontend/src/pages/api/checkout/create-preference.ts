/**
 * API Route: Create Mercado Pago Preference
 *
 * Crea una preferencia de pago en Mercado Pago con la información
 * del carrito y del cliente
 *
 * POST /api/checkout/create-preference
 */

import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { CartItem, CheckoutFormData } from '@/types/order';

// Configuración de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: import.meta.env.MP_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  },
});

const preference = new Preference(client);

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear el body
    const body = await request.json();
    const { items, customerInfo, orderReference } = body as {
      items: CartItem[];
      customerInfo: CheckoutFormData;
      orderReference: string;
    };

    // Validaciones básicas
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No hay items en el carrito',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!customerInfo || !customerInfo.email) {
      return new Response(
        JSON.stringify({
          error: 'Información del cliente incompleta',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Obtener URL del sitio
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://localhost:4321';

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva = subtotal * 0.19; // IVA 19% Colombia
    const total = subtotal + iva;

    // Construir items para Mercado Pago
    const mpItems = items.map((item) => ({
      id: item.sku,
      title: item.nombre,
      description: `SKU: ${item.sku}`,
      picture_url: item.imagen.startsWith('http') ? item.imagen : `${siteUrl}${item.imagen}`,
      category_id: 'electronics', // Puedes hacerlo dinámico según categoría
      quantity: item.cantidad,
      currency_id: 'COP',
      unit_price: item.precio,
    }));

    // Agregar IVA como un item adicional
    mpItems.push({
      id: 'IVA',
      title: 'IVA (19%)',
      description: 'Impuesto al Valor Agregado',
      category_id: 'services',
      quantity: 1,
      currency_id: 'COP',
      unit_price: Number(iva.toFixed(2)),
    });

    // Construir payer info
    const payer: any = {
      email: customerInfo.email,
    };

    if (customerInfo.nombre) {
      payer.name = customerInfo.nombre;
    }

    if (customerInfo.apellido) {
      payer.surname = customerInfo.apellido;
    }

    if (customerInfo.telefono) {
      payer.phone = {
        number: customerInfo.telefono,
      };
    }

    if (customerInfo.documento && customerInfo.tipoDocumento) {
      payer.identification = {
        type: customerInfo.tipoDocumento,
        number: customerInfo.documento,
      };
    }

    if (customerInfo.direccion) {
      payer.address = {
        street_name: customerInfo.direccion,
        zip_code: customerInfo.codigoPostal || '',
      };
    }

    // Crear la preferencia
    const preferenceData = {
      items: mpItems,
      payer,
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        failure: `${siteUrl}/checkout/failure`,
        pending: `${siteUrl}/checkout/pending`,
      },
      auto_return: 'approved' as const,
      external_reference: orderReference,
      notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      statement_descriptor: import.meta.env.PUBLIC_SITE_NAME || 'Quality Ecommerce',
      metadata: {
        customer_email: customerInfo.email,
        customer_name: `${customerInfo.nombre} ${customerInfo.apellido || ''}`.trim(),
        order_reference: orderReference,
        items_count: items.length,
      },
    };

    // Crear preferencia en Mercado Pago
    const response = await preference.create({
      body: preferenceData,
    });

    // Retornar la preferencia creada
    return new Response(
      JSON.stringify({
        preferenceId: response.id,
        initPoint: response.init_point,
        sandboxInitPoint: response.sandbox_init_point,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);

    return new Response(
      JSON.stringify({
        error: 'Error al crear la preferencia de pago',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
