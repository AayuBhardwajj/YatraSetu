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
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect(`${baseUrl}/login?error=no_session`)

  const role = session.user.user_metadata?.role ?? 'user'

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('user_id, role, is_profile_complete')
    .eq('user_id', session.user.id)
    .single()

  if (!existing) {
    // First login — create profile row
    await supabase.from('user_profiles').insert({
      user_id: session.user.id,
      email: session.user.email,
      role,
      is_profile_complete: false,
    })
  }

  // Redirect based on role and completion
  const isComplete = existing?.is_profile_complete ?? false
  const effectiveRole = existing?.role ?? role

  if (!isComplete) {
    if (effectiveRole === 'driver') {
      return NextResponse.redirect(new URL('/driver/onboarding', request.url))
    }
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  if (effectiveRole === 'driver') {
    return NextResponse.redirect(new URL('/driver/dashboard', request.url))
  }
  return NextResponse.redirect(new URL('/home', request.url))
}