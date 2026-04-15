import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) return NextResponse.redirect(`${origin}/login?error=missing_code`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/login?error=auth_failed`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${origin}/login?error=no_user`)

  // ✅ New Fix: Extract role from URL and sync to permanent user metadata
  // This ensures the first redirect and future logins have the correct role.
  let role = searchParams.get('role') as 'user' | 'driver' | null
  if (role) {
    await supabase.auth.updateUser({ data: { role } })
  } else {
    // Fallback to existing metadata if not in URL
    role = user.user_metadata?.role as 'user' | 'driver' | undefined
  }

  const baseUrl = process.env.NODE_ENV === 'development'
    ? origin
    : `https://${request.headers.get('x-forwarded-host') ?? new URL(origin).host}`

  if (role === 'driver') {
    const { data } = await supabase
      .from('driver_profiles')
      .select('is_onboarding_complete')  // ✅ now exists
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.redirect(
      `${baseUrl}${data?.is_onboarding_complete ? '/driver/dashboard' : '/driver/onboarding'}`
    )
  }

  const { data } = await supabase
    .from('user_profiles')
    .select('is_profile_complete')  // ✅ now exists
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.redirect(
    `${baseUrl}${data?.is_profile_complete ? '/home' : '/onboarding'}`
  )
}