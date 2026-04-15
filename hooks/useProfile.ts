import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/useAuthStore'
import type { UserProfile, DriverProfile } from '@/types/user'

// Query keys — centralised so invalidation is consistent
export const profileKeys = {
  user: (id: string) => ['profile', 'user', id] as const,
  driver: (id: string) => ['profile', 'driver', id] as const,
}

/**
 * Returns the cached user profile.
 * Falls back to Zustand store data immediately (no loading flash),
 * then silently revalidates in the background if stale.
 */
export function useUserProfile() {
  const { user, userProfile: cached } = useAuthStore()

  return useQuery<UserProfile | null>({
    queryKey: profileKeys.user(user?.id ?? ''),
    queryFn: async () => {
      if (!user) return null
      const supabase = createClient()
      const { data } = await supabase
        .from('user_profiles')
        .select('user_id, email, full_name, phone, role, avatar_url, is_profile_complete')
        .eq('user_id', user.id)
        .maybeSingle()
      return data
    },
    enabled: !!user,
    initialData: cached ?? undefined,   // serve store cache instantly
    staleTime: 10 * 60 * 1000,          // 10 min
    gcTime: 30 * 60 * 1000,             // 30 min
  })
}

/**
 * Returns the cached driver profile.
 */
export function useDriverProfile() {
  const { user, driverProfile: cached } = useAuthStore()

  return useQuery<DriverProfile | null>({
    queryKey: profileKeys.driver(user?.id ?? ''),
    queryFn: async () => {
      if (!user) return null
      const supabase = createClient()
      const { data } = await supabase
        .from('driver_profiles')
        .select('user_id, full_name, phone, city, vehicle_type, is_available, is_verified, onboarding_step, is_onboarding_complete')
        .eq('user_id', user.id)
        .maybeSingle()
      return data
    },
    enabled: !!user,
    initialData: cached ?? undefined,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
