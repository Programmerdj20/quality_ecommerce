import type { User, Session } from '@supabase/supabase-js'

export type { User, Session }

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  connectionError: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
