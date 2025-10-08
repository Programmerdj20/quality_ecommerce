/**
 * Order Store - Gestión de pedidos con Nanostores
 *
 * Maneja el estado del pedido durante el checkout y
 * almacena la información del último pedido completado
 */

import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Order, CheckoutFormData, ClienteInfo } from '@/types/order';

// ==================================
// ATOMS
// ==================================

/**
 * Información del cliente durante el checkout
 */
export const $checkoutCustomerInfo = atom<CheckoutFormData | null>(null);

/**
 * ID de la preferencia de Mercado Pago actual
 */
export const $currentPreferenceId = atom<string | null>(null);

/**
 * Estado de carga durante el proceso de checkout
 */
export const $checkoutLoading = atom<boolean>(false);

/**
 * Errores durante el proceso de checkout
 */
export const $checkoutError = atom<string | null>(null);

/**
 * Último pedido completado (persistente en localStorage)
 */
export const $lastOrder = persistentAtom<Order | null>('lastOrder', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/**
 * External reference del pedido actual (para tracking)
 */
export const $currentOrderReference = atom<string | null>(null);

// ==================================
// COMPUTED VALUES
// ==================================

/**
 * Verifica si hay información de cliente válida
 */
export const $hasCustomerInfo = computed($checkoutCustomerInfo, (info) => {
  return info !== null && info.email && info.nombre && info.telefono;
});

/**
 * Verifica si el checkout está en progreso
 */
export const $isCheckoutInProgress = computed(
  [$currentPreferenceId, $checkoutLoading],
  (preferenceId, loading) => {
    return preferenceId !== null || loading;
  }
);

// ==================================
// ACTIONS
// ==================================

/**
 * Guarda la información del cliente
 */
export function setCheckoutCustomerInfo(info: CheckoutFormData) {
  $checkoutCustomerInfo.set(info);
}

/**
 * Limpia la información del cliente
 */
export function clearCheckoutCustomerInfo() {
  $checkoutCustomerInfo.set(null);
}

/**
 * Establece el ID de la preferencia de Mercado Pago
 */
export function setCurrentPreferenceId(preferenceId: string) {
  $currentPreferenceId.set(preferenceId);
}

/**
 * Limpia el ID de la preferencia
 */
export function clearCurrentPreferenceId() {
  $currentPreferenceId.set(null);
}

/**
 * Establece el estado de carga del checkout
 */
export function setCheckoutLoading(loading: boolean) {
  $checkoutLoading.set(loading);
}

/**
 * Establece un error en el checkout
 */
export function setCheckoutError(error: string | null) {
  $checkoutError.set(error);
}

/**
 * Limpia el error del checkout
 */
export function clearCheckoutError() {
  $checkoutError.set(null);
}

/**
 * Guarda el último pedido completado
 */
export function saveLastOrder(order: Order) {
  $lastOrder.set(order);
}

/**
 * Limpia el último pedido
 */
export function clearLastOrder() {
  $lastOrder.set(null);
}

/**
 * Genera una referencia única para el pedido
 */
export function generateOrderReference(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const reference = `ORDER-${timestamp}-${random}`.toUpperCase();
  $currentOrderReference.set(reference);
  return reference;
}

/**
 * Limpia la referencia del pedido actual
 */
export function clearOrderReference() {
  $currentOrderReference.set(null);
}

/**
 * Resetea todo el estado del checkout
 */
export function resetCheckoutState() {
  clearCheckoutCustomerInfo();
  clearCurrentPreferenceId();
  clearCheckoutError();
  clearOrderReference();
  setCheckoutLoading(false);
}

/**
 * Convierte CheckoutFormData a ClienteInfo
 */
export function checkoutFormToClienteInfo(formData: CheckoutFormData): ClienteInfo {
  return {
    email: formData.email,
    nombre: formData.nombre,
    apellido: formData.apellido,
    telefono: formData.telefono,
    documento: formData.documento,
    tipoDocumento: formData.tipoDocumento,
    direccion: {
      calle: formData.direccion,
      ciudad: formData.ciudad,
      departamento: formData.departamento,
      codigoPostal: formData.codigoPostal,
      referencias: formData.referencias,
    },
  };
}
