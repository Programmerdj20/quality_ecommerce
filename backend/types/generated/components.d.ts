import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_banners';
  info: {
    description: 'Banner del carrusel principal';
    displayName: 'Banner';
  };
  attributes: {
    activo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    imagen: Schema.Attribute.String & Schema.Attribute.Required;
    orden: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
  };
}

export interface SharedClienteInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_cliente_infos';
  info: {
    description: 'Informaci\u00F3n del cliente';
    displayName: 'ClienteInfo';
  };
  attributes: {
    apellido: Schema.Attribute.String;
    direccion: Schema.Attribute.Component<'shared.direccion-envio', false> &
      Schema.Attribute.Required;
    documento: Schema.Attribute.String;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    nombre: Schema.Attribute.String & Schema.Attribute.Required;
    telefono: Schema.Attribute.String & Schema.Attribute.Required;
    tipoDocumento: Schema.Attribute.Enumeration<['CC', 'CE', 'NIT']>;
  };
}

export interface SharedDireccionEnvio extends Struct.ComponentSchema {
  collectionName: 'components_shared_direccion_envios';
  info: {
    description: 'Direcci\u00F3n de env\u00EDo del cliente';
    displayName: 'DireccionEnvio';
  };
  attributes: {
    calle: Schema.Attribute.String & Schema.Attribute.Required;
    ciudad: Schema.Attribute.String & Schema.Attribute.Required;
    codigoPostal: Schema.Attribute.String;
    departamento: Schema.Attribute.String & Schema.Attribute.Required;
    referencias: Schema.Attribute.Text;
  };
}

export interface SharedPagoInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_pago_infos';
  info: {
    description: 'Informaci\u00F3n del pago';
    displayName: 'PagoInfo';
  };
  attributes: {
    detalles: Schema.Attribute.JSON;
    estado: Schema.Attribute.Enumeration<
      ['pendiente', 'aprobado', 'rechazado', 'en_proceso', 'devuelto']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pendiente'>;
    fechaPago: Schema.Attribute.DateTime;
    mercadoPagoId: Schema.Attribute.String;
    metodo: Schema.Attribute.Enumeration<['mercadopago', 'transferencia']> &
      Schema.Attribute.Required;
    transferenciaCuenta: Schema.Attribute.String;
  };
}

export interface SharedTextosLegales extends Struct.ComponentSchema {
  collectionName: 'components_shared_textos_legales';
  info: {
    description: 'Textos legales y pol\u00EDticas del sitio';
    displayName: 'TextosLegales';
  };
  attributes: {
    politicaDevoluciones: Schema.Attribute.Text;
    politicaEnvios: Schema.Attribute.Text;
    privacidad: Schema.Attribute.Text & Schema.Attribute.Required;
    sobreNosotros: Schema.Attribute.Text & Schema.Attribute.Required;
    terminos: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.banner': SharedBanner;
      'shared.cliente-info': SharedClienteInfo;
      'shared.direccion-envio': SharedDireccionEnvio;
      'shared.pago-info': SharedPagoInfo;
      'shared.textos-legales': SharedTextosLegales;
    }
  }
}
