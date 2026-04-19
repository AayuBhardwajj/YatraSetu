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
  profileFetchedAt: number | null
  setSession: (session: Session | null) => Promise<void>
  fetchProfile: (force?: boolean) => Promise<void>
  updateUserProfile: (patch: Partial<UserProfile>) => void
  updateDriverProfile: (patch: Partial<DriverProfile>) => void
  signOut: () => Promise<void>
}

const PROFILE_TTL_MS = 10 * 60 * 1000 // 10 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      role: null,
      userProfile: null,
      driverProfile: null,
      isLoading: true,
      profileFetchedAt: null,

      setSession: async (session) => {
        const prevUserId = get().user?.id
        const nextUserId = session?.user?.id
        set({ session, user: session?.user ?? null })

        if (!session) {
          set({ role: null, userProfile: null, driverProfile: null, isLoading: false, profileFetchedAt: null })
          return
        }

        // Force re-fetch only when the logged-in user changes
        const force = prevUserId !== nextUserId
        await get().fetchProfile(force)
      },

      fetchProfile: async (force = false) => {
        const { user, profileFetchedAt, userProfile, driverProfile } = get()
        if (!user) return set({ isLoading: false })

        // Cache hit: skip network call if data is fresh
        const isFresh = profileFetchedAt !== null && Date.now() - profileFetchedAt < PROFILE_TTL_MS
        const hasCached = userProfile !== null || driverProfile !== null
        if (!force && isFresh && hasCached) {
          set({ isLoading: false })
          return
        }

        set({ isLoading: true })
        const role = user.user_metadata?.role as UserRole | undefined
        const supabase = createClient()

        if (role === 'driver') {
          const [profileRes, vehiclesRes, docsRes] = await Promise.all([
            supabase
              .from('driver_profiles')
              .select('*, user_id, full_name, phone, city, vehicle_type, make, model, plate_number, year, is_available, is_verified, onboarding_step, is_onboarding_complete')
              .eq('user_id', user.id)
              .maybeSingle(),
            supabase
              .from('vehicles')
              .select('*')
              .eq('driver_id', user.id),
            supabase
              .from('driver_documents')
              .select('*')
              .eq('driver_id', user.id)
          ])

          const fullProfile = profileRes.data ? {
            ...profileRes.data,
            vehicles: vehiclesRes.data || [],
            documents: docsRes.data || []
          } : null

          set({ role: 'driver', driverProfile: fullProfile as DriverProfile, isLoading: false, profileFetchedAt: Date.now() })
        } else {
          const { data } = await supabase
            .from('user_profiles')
            .select('user_id, email, full_name, phone, role, avatar_url, is_profile_complete')
            .eq('user_id', user.id)
            .maybeSingle()
          set({ role: 'user', userProfile: data, isLoading: false, profileFetchedAt: Date.now() })
        }
      },

      // Optimistic local update — no re-fetch needed after a save
      updateUserProfile: (patch) => {
        const current = get().userProfile
        if (current) set({ userProfile: { ...current, ...patch }, profileFetchedAt: Date.now() })
      },

      updateDriverProfile: (patch) => {
        const current = get().driverProfile
        if (current) set({ driverProfile: { ...current, ...patch }, profileFetchedAt: Date.now() })
      },

      signOut: async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        set({
          user: null, session: null, role: null,
          userProfile: null, driverProfile: null,
          isLoading: false, profileFetchedAt: null,
        })
      },
    }),
    {
      name: 'zipp-auth-v2',
      storage: createJSONStorage(() => localStorage),
      // Persist only non-routing state
      partialize: (state) => ({
        user: state.user,
        // role, userProfile, and driverProfile must be fetched fresh
      }),
    }
  )
)
