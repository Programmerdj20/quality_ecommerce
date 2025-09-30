/**
 * toastStore - Store para manejo de notificaciones Toast
 */

import { atom } from 'nanostores';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Store de toasts activos
export const toastsStore = atom<Toast[]>([]);

/**
 * Genera un ID único para el toast
 */
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Agrega un nuevo toast
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  duration: number = 3000
): void {
  const toast: Toast = {
    id: generateId(),
    message,
    type,
    duration,
  };

  // Agregar toast al store
  toastsStore.set([...toastsStore.get(), toast]);

  // Auto-remover después de la duración especificada
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, duration);
  }
}

/**
 * Remueve un toast específico
 */
export function removeToast(id: string): void {
  toastsStore.set(toastsStore.get().filter(t => t.id !== id));
}

/**
 * Funciones auxiliares para tipos específicos
 */
export const toastSuccess = (message: string, duration?: number) =>
  showToast(message, 'success', duration);

export const toastError = (message: string, duration?: number) =>
  showToast(message, 'error', duration);

export const toastInfo = (message: string, duration?: number) =>
  showToast(message, 'info', duration);

export const toastWarning = (message: string, duration?: number) =>
  showToast(message, 'warning', duration);
