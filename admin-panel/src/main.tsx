import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import './index.css'
import App from './App.tsx'

// Crear QueryClient con configuracion
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      refetchOnWindowFocus: false,
      retry: 1, // Solo 1 reintento máximo
      retryDelay: 1000, // 1 segundo entre reintentos
    },
  },
})

createRoot(document.getElementById('root')!).render(
  // Desactivado temporalmente para evitar doble renderizado en desarrollo
  // que podría multiplicar requests fallidos a Supabase
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  // </StrictMode>
)
