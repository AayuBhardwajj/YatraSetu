import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/auth/callback']

const PROTECTED_ROUTES: Record<string, 'user' | 'driver'> = {
  '/home': 'user',
  '/booking': 'user',
  '/activity': 'user',
  '/history': 'user',
  '/payment': 'user',
  '/profile': 'user',
  '/tracking': 'user',
  '/wallet': 'user',
  '/negotiate': 'user',
  '/onboarding': 'user',
  '/driver/dashboard': 'driver',
  '/driver/requests': 'driver',
  '/driver/earnings': 'driver',
  '/driver/profile': 'driver',
  '/driver/active-ride': 'driver',
  '/driver/negotiate': 'driver',
  '/driver/onboarding': 'driver',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public routes and static assets
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next({ request })
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated → redirect to login
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Determine required role for this route
  const requiredRole = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname === route || pathname.startsWith(route + '/')
  )?.[1]

  if (!requiredRole) return response

  // Fetch profile to check role + onboarding status
  const role = user.user_metadata?.role as 'user' | 'driver' | undefined

  if (role === 'driver') {
    // Wrong role trying to access user routes
    if (requiredRole === 'user') {
      return NextResponse.redirect(new URL('/driver/dashboard', request.url))
    }

    // Allow driver onboarding page through
    if (pathname === '/driver/onboarding') return response

    // Check onboarding completion
    const { data: driverProfile } = await supabase
      .from('driver_profiles')
      .select('is_onboarding_complete')
      .eq('user_id', user.id)
      .single()

    if (!driverProfile?.is_onboarding_complete) {
      return NextResponse.redirect(new URL('/driver/onboarding', request.url))
    }
  } else {
    // Wrong role trying to access driver routes
    if (requiredRole === 'driver') {
      return NextResponse.redirect(new URL('/home', request.url))
    }

    // Allow user onboarding page through
    if (pathname === '/onboarding') return response

    // Check onboarding completion
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('is_profile_complete')
      .eq('user_id', user.id)
      .single()

    if (!userProfile?.is_profile_complete) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
