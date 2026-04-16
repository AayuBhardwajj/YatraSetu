import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // ✅ Dynamic Host Detection for Ngrok Tunnels
  // Prioritize headers sent by ngrok to ensure we redirect back to the tunnel, not localhost
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  if (!code) return NextResponse.redirect(`${baseUrl}/login?error=missing_code`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${baseUrl}/login?error=no_user`)

  // ✅ Role Sync (Fast)
  // We skip supabase.auth.updateUser here as it's slow (3.6s delay).
  let role = searchParams.get('role') as 'user' | 'driver' | null
  if (!role) {
    role = user.user_metadata?.role as 'user' | 'driver' | undefined
  }

  // ✅ Lazy Profile Verification
  // Ensures user_profiles exists before checking completion.
  // Both roles MUST have a user_profiles entry (driver_profiles depends on it).
  const { data: profile } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      role: (role === 'driver' ? 'driver' : 'user')
    }, { onConflict: 'user_id' })
    .select('is_profile_complete')
    .maybeSingle()

  if (role === 'driver') {
    const { data: driver } = await supabase
      .from('driver_profiles')
      .upsert({ 
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || ''
      }, { onConflict: 'user_id' })
      .select('is_onboarding_complete')
      .maybeSingle()

    return NextResponse.redirect(
      `${baseUrl}${driver?.is_onboarding_complete ? '/driver/dashboard' : '/driver/onboarding'}`
    )
  }

  return NextResponse.redirect(
    `${baseUrl}${profile?.is_profile_complete ? '/home' : '/onboarding'}`
  )
}