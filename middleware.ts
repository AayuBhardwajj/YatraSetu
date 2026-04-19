import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Always allow — never intercept these
  const alwaysAllow = ['/_next', '/favicon.ico', '/api', '/auth/callback']
  if (alwaysAllow.some(p => pathname.startsWith(p))) return response

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Public routes
  const publicRoutes = ['/login', '/signup']
  if (publicRoutes.some(r => pathname.startsWith(r))) {
    if (session) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, is_profile_complete')
        .eq('user_id', session.user.id)
        .single()
      if (profile?.role === 'driver') return NextResponse.redirect(new URL('/driver/dashboard', request.url))
      if (profile?.role === 'user') return NextResponse.redirect(new URL('/home', request.url))
    }
    return response
  }

  // No session
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fetch role — DB is source of truth
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_profile_complete')
    .eq('user_id', session.user.id)
    .single()

  const role = profile?.role
  const isComplete = profile?.is_profile_complete

  // No profile yet — route to onboarding based on auth metadata
  if (!role) {
    const metaRole = session.user.user_metadata?.role
    if (metaRole === 'driver' && !pathname.startsWith('/driver/onboarding')) {
      return NextResponse.redirect(new URL('/driver/onboarding', request.url))
    }
    if (metaRole !== 'driver' && !pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return response
  }

  // Profile incomplete — block and redirect to onboarding
  if (!isComplete) {
    if (role === 'driver' && !pathname.startsWith('/driver/onboarding')) {
      return NextResponse.redirect(new URL('/driver/onboarding', request.url))
    }
    if (role === 'user' && !pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return response
  }

  // Strict role enforcement
  if (role === 'driver' && !pathname.startsWith('/driver')) {
    return NextResponse.redirect(new URL('/driver/dashboard', request.url))
  }
  if (role === 'user' && pathname.startsWith('/driver')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
