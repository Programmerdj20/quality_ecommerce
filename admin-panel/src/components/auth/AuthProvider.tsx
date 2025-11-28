import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AuthContextType } from '@/types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [session, setSession] = useState<AuthContextType['session']>(null)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) throw error

        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          setConnectionError(null)
        }
      } catch (error) {
        console.error('Error connecting to Supabase:', error)
        if (mounted) {
          setConnectionError(
            'No se pudo conectar con el servidor. Verifica tu conexión y las variables de entorno.'
          )
          // No actualizar loading = false si hay error, para que se muestre spinner
          setLoading(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    connectionError,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
