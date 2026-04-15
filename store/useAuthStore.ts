import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile, DriverProfile, UserRole } from '@/types/user'

interface AuthState {
  user: User | null
  session: Session | null
  role: UserRole | null
  userProfile: UserProfile | null
  driverProfile: DriverProfile | null
  isLoading: boolean
  setSession: (session: Session | null) => Promise<void>
  signOut: () => Promise<void>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      role: null,
      userProfile: null,
      driverProfile: null,
      isLoading: true,

      setSession: async (session) => {
        set({ session, user: session?.user ?? null, isLoading: true })
        if (session) {
          await get().fetchProfile()
        } else {
          set({ role: null, userProfile: null, driverProfile: null, isLoading: false })
        }
      },

      fetchProfile: async () => {
        const { user } = get()
        if (!user) return set({ isLoading: false })

        const role = user.user_metadata?.role as UserRole | undefined
        const supabase = createClient()

        if (role === 'driver') {
          const { data } = await supabase
            .from('driver_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
          set({ role: 'driver', driverProfile: data, isLoading: false })
        } else {
          const { data } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle()
          set({ role: 'user', userProfile: data, isLoading: false })
        }
      },

      signOut: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({ user: null, session: null, role: null, userProfile: null, driverProfile: null })
      },
    }),
    {
      name: 'zipp-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ role: state.role }),
    }
  )
)
