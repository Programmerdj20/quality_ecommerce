/**
 * Cart Store - Store global del carrito con Nanostores
 * Persistente en localStorage
 */

import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import type { CartItem, Cart } from '@/types';

// Tasa de IVA en Colombia
const IVA_RATE = 0.19;

// Store principal del carrito (persistente en localStorage)
export const cartItemsStore = persistentAtom<CartItem[]>('cart-items', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// Store computado para datos derivados
export const cartStore = computed(cartItemsStore, (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

  return {
    items,
    subtotal,
    iva,
    total,
    itemCount,
  } as Cart;
});

/**
 * Agregar producto al carrito
 */
export function addToCart(product: {
  productId: string;
  sku: string;
  nombre: string;
  precio: number;
  imagen: string;
  stockDisponible: number;
}, quantity: number = 1) {
  const currentItems = cartItemsStore.get();
  const existingItem = currentItems.find(item => item.productId === product.productId);

  let newItems: CartItem[];

  if (existingItem) {
    // Verificar que no exceda el stock
    const newQuantity = existingItem.cantidad + quantity;

    if (newQuantity > product.stockDisponible) {
      console.warn(`No hay suficiente stock. Disponible: ${product.stockDisponible}`);
      return false;
    }

    newItems = currentItems.map(item =>
      item.productId === product.productId
        ? { ...item, cantidad: newQuantity }
        : item
    );
  } else {
    // Verificar stock antes de agregar
    if (quantity > product.stockDisponible) {
      console.warn(`No hay suficiente stock. Disponible: ${product.stockDisponible}`);
      return false;
    }

    newItems = [
      ...currentItems,
      {
        productId: product.productId,
        sku: product.sku,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: quantity,
        imagen: product.imagen,
        stockDisponible: product.stockDisponible,
      },
    ];
  }

  cartItemsStore.set(newItems);
  return true;
}

/**
 * Eliminar producto del carrito
 */
export function removeFromCart(productId: string) {
  const currentItems = cartItemsStore.get();
  const newItems = currentItems.filter(item => item.productId !== productId);
  cartItemsStore.set(newItems);
}

/**
 * Actualizar cantidad de un producto
 */
export function updateQuantity(productId: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const currentItems = cartItemsStore.get();
  const item = currentItems.find(i => i.productId === productId);

  if (!item) return;

  // Verificar stock
  if (quantity > item.stockDisponible) {
    console.warn(`Stock insuficiente. Disponible: ${item.stockDisponible}`);
    return;
  }

  const newItems = currentItems.map(i =>
    i.productId === productId
      ? { ...i, cantidad: quantity }
      : i
  );

  cartItemsStore.set(newItems);
}

/**
 * Incrementar cantidad en 1
 */
export function incrementQuantity(productId: string) {
  const currentItems = cartItemsStore.get();
  const item = currentItems.find(i => i.productId === productId);

  if (!item) return;

  updateQuantity(productId, item.cantidad + 1);
}

/**
 * Decrementar cantidad en 1
 */
export function decrementQuantity(productId: string) {
  const currentItems = cartItemsStore.get();
  const item = currentItems.find(i => i.productId === productId);

  if (!item) return;

  updateQuantity(productId, item.cantidad - 1);
}

/**
 * Limpiar todo el carrito
 */
export function clearCart() {
  cartItemsStore.set([]);
}

/**
 * Obtener cantidad de un producto en el carrito
 */
export function getItemQuantity(productId: string): number {
  const currentItems = cartItemsStore.get();
  const item = currentItems.find(i => i.productId === productId);
  return item?.cantidad || 0;
}

/**
 * Verificar si un producto está en el carrito
 */
export function isInCart(productId: string): boolean {
  const currentItems = cartItemsStore.get();
  return currentItems.some(item => item.productId === productId);
}

/**
 * Formatear precio en pesos colombianos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
