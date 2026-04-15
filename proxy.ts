import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_PATHS.includes(pathname) ||
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

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = user.user_metadata?.role as 'user' | 'driver' | undefined
  const isDriverRoute = pathname.startsWith('/driver')

  if (isDriverRoute && role !== 'driver') {
    return NextResponse.redirect(new URL('/home', request.url))
  }
  if (!isDriverRoute && role === 'driver') {
    return NextResponse.redirect(new URL('/driver/dashboard', request.url))
  }

  if (pathname === '/onboarding' || pathname.startsWith('/driver/onboarding')) {
      response.headers.set('ngrok-skip-browser-warning', 'true')
  return response
  }

  if (role === 'driver') {
    const { data } = await supabase
      .from('driver_profiles')
      .select('is_onboarding_complete')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data?.is_onboarding_complete) {
      return NextResponse.redirect(new URL('/driver/onboarding', request.url))
    }
  } else {
    const { data } = await supabase
      .from('user_profiles')
      .select('is_profile_complete')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data?.is_profile_complete) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

    response.headers.set('ngrok-skip-browser-warning', 'true')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
