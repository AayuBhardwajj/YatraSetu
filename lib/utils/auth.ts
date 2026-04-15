import { createClient } from '@/lib/supabase/server'
import type { UserProfile, DriverProfile } from '@/types/user'

export async function getServerUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

export async function getDriverProfile(userId: string): Promise<DriverProfile | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('driver_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

export async function requireAuth() {
  const user = await getServerUser()
  if (!user) throw new Error('Unauthenticated')
  return user
}
