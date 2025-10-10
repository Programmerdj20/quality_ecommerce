/**
 * API Route: Create Mercado Pago Preference
 *
 * Crea una preferencia de pago en Mercado Pago con la información
 * del carrito y del cliente
 * Soporta multi-tenant con tokens dinámicos por tenant
 *
 * POST /api/checkout/create-preference
 */

import type { APIRoute } from 'astro';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { CartItem, CheckoutFormData } from '@/types/order';
import { getTenantByDomain } from '@/utils/tenant/tenantResolver';
import { getTenantIVA, getTenantCurrency } from '@/types';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear el body
    const body = await request.json();
    const { items, customerInfo, orderReference, tenantDomain } = body as {
      items: CartItem[];
      customerInfo: CheckoutFormData;
      orderReference: string;
      tenantDomain?: string;
    };

    // Obtener dominio del request o del body
    const domain = tenantDomain || new URL(request.url).host;

    console.log(`🔍 [Mercado Pago] Buscando tenant para dominio: ${domain}`);

    // Buscar tenant para obtener tokens de Mercado Pago
    const tenant = await getTenantByDomain(domain);

    if (!tenant) {
      console.error(`❌ [Mercado Pago] Tenant no encontrado: ${domain}`);
      return new Response(
        JSON.stringify({
          error: 'Tenant no encontrado',
          details: `No se encontró configuración para el dominio: ${domain}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validar que el tenant tiene Mercado Pago configurado
    if (!tenant.mercadoPagoAccessToken) {
      console.error(`❌ [Mercado Pago] Tenant sin MP configurado: ${tenant.nombre}`);
      return new Response(
        JSON.stringify({
          error: 'Mercado Pago no configurado',
          details: 'Este comercio no tiene Mercado Pago configurado',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`✅ [Mercado Pago] Tenant encontrado: ${tenant.nombre}`);

    // Configurar Mercado Pago con el token del tenant
    const client = new MercadoPagoConfig({
      accessToken: tenant.mercadoPagoAccessToken,
      options: {
        timeout: 5000,
      },
    });

    const preference = new Preference(client);

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

    // Obtener URL del sitio (puede ser personalizada por tenant)
    const siteUrl = import.meta.env.PUBLIC_SITE_URL || `https://${domain}`;

    // Obtener IVA y moneda del tenant
    const ivaRate = getTenantIVA(tenant);
    const currency = getTenantCurrency(tenant);

    // Calcular totales con IVA del tenant
    const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const iva = subtotal * ivaRate;
    const total = subtotal + iva;

    // Construir items para Mercado Pago
    const mpItems = items.map((item) => ({
      id: item.sku,
      title: item.nombre,
      description: `SKU: ${item.sku}`,
      picture_url: item.imagen.startsWith('http') ? item.imagen : `${siteUrl}${item.imagen}`,
      category_id: 'electronics', // Puedes hacerlo dinámico según categoría
      quantity: item.cantidad,
      currency_id: currency,
      unit_price: item.precio,
    }));

    // Agregar IVA como un item adicional
    const ivaPercentage = Math.round(ivaRate * 100);
    mpItems.push({
      id: 'IVA',
      title: `IVA (${ivaPercentage}%)`,
      description: 'Impuesto al Valor Agregado',
      category_id: 'services',
      quantity: 1,
      currency_id: currency,
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

    // Crear la preferencia con tenant metadata
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
      statement_descriptor: tenant.configuracion?.nombre || tenant.nombre,
      metadata: {
        tenant_id: tenant.id.toString(),
        tenant_domain: tenant.dominio,
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
