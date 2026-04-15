import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // ✅ Dynamic Host Detection
  // Detects localhost or ngrok domain automatically from headers
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${host}`

  if (!code) return NextResponse.redirect(`${baseUrl}/login?error=missing_code`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${baseUrl}/login?error=no_user`)

  // ✅ Role Sync
  let role = searchParams.get('role') as 'user' | 'driver' | null
  if (role) {
    await supabase.auth.updateUser({ data: { role } })
  } else {
    role = user.user_metadata?.role as 'user' | 'driver' | undefined
  }

  if (role === 'driver') {
    const { data } = await supabase
      .from('driver_profiles')
      .select('is_onboarding_complete')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.redirect(
      `${baseUrl}${data?.is_onboarding_complete ? '/driver/dashboard' : '/driver/onboarding'}`
    )
  }

  const { data } = await supabase
    .from('user_profiles')
    .select('is_profile_complete')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.redirect(
    `${baseUrl}${data?.is_profile_complete ? '/home' : '/onboarding'}`
  )
}