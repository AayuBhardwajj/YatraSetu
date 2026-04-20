import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getBaseUrl } from '@/lib/utils/url'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/auth/callback']

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const baseUrl = getBaseUrl(request)

  // ✅ Catch-all for OAuth codes/errors landing on public paths (like "/")
  // Redirect them to the formal callback handler
  const hasAuthParams = searchParams.has('code') || searchParams.has('error')
  if (hasAuthParams && pathname !== '/auth/callback') {
    const callbackUrl = new URL('/auth/callback', baseUrl)
    searchParams.forEach((value, key) => callbackUrl.searchParams.set(key, value))
    const response = NextResponse.redirect(callbackUrl)
    response.headers.set('ngrok-skip-browser-warning', 'true')
    return response
  }

  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    const response = NextResponse.next({ request })
    response.headers.set('ngrok-skip-browser-warning', 'true')
    return response
  }

  let response = NextResponse.next({ request })
  response.headers.set('ngrok-skip-browser-warning', 'true')

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // Preserve existing headers when recreating the response
          const existingHeaders = new Headers(response.headers)
          response = NextResponse.next({ request })
          existingHeaders.forEach((value, key) => {
            response.headers.set(key, value)
          })

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', baseUrl)
    loginUrl.searchParams.set('next', pathname)
    const res = NextResponse.redirect(loginUrl)
    res.headers.set('ngrok-skip-browser-warning', 'true')
    return res
  }

  const role = user.user_metadata?.role as 'user' | 'driver' | undefined
  const isDriverRoute = pathname.startsWith('/driver')

  if (isDriverRoute && role !== 'driver') {
    const res = NextResponse.redirect(new URL('/home', baseUrl))
    res.headers.set('ngrok-skip-browser-warning', 'true')
    return res
  }
  if (!isDriverRoute && role === 'driver') {
    const res = NextResponse.redirect(new URL('/driver/dashboard', baseUrl))
    res.headers.set('ngrok-skip-browser-warning', 'true')
    return res
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
      const res = NextResponse.redirect(new URL('/driver/onboarding', baseUrl))
      res.headers.set('ngrok-skip-browser-warning', 'true')
      return res
    }
  } else {
    const { data } = await supabase
      .from('user_profiles')
      .select('is_profile_complete')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!data?.is_profile_complete) {
      const res = NextResponse.redirect(new URL('/onboarding', baseUrl))
      res.headers.set('ngrok-skip-browser-warning', 'true')
      return res
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
