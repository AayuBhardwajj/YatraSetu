import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`)
  }

  const role = user.user_metadata?.role as 'user' | 'driver' | undefined

  const baseUrl = process.env.NODE_ENV === 'development'
    ? origin
    : `https://${request.headers.get('x-forwarded-host') ?? new URL(origin).host}`

  if (role === 'driver') {
    const { data: driverProfile } = await supabase
      .from('driver_profiles')
      .select('is_onboarding_complete')
      .eq('user_id', user.id)
      .single()

    const dest = driverProfile?.is_onboarding_complete
      ? '/driver/dashboard'
      : '/driver/onboarding'

    return NextResponse.redirect(`${baseUrl}${dest}`)
  }

  // Default: user role
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('is_profile_complete')
    .eq('user_id', user.id)
    .single()

  const dest = userProfile?.is_profile_complete ? '/home' : '/onboarding'
  return NextResponse.redirect(`${baseUrl}${dest}`)
}
