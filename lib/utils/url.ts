import { type NextRequest } from 'next/server';

/**
 * Production-ready URL resolution utility.
 * Handles switching between localhost and ngrok/production domains dynamically.
 */
export function getBaseUrl(request?: Request | NextRequest) {
  // 1. Browser context
  if (typeof window !== 'undefined') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && (appUrl.includes(window.location.hostname) || window.location.hostname === 'localhost')) {
      return appUrl.replace(/\/$/, "");
    }
    return window.location.origin;
  }

  // 2. Server context with Request object (most accurate for ngrok)
  if (request) {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    // Ensure we don't return null/undefined hosts
    if (host) return `${protocol}://${host}`;
  }

  // 3. Server context fallback (Vercel)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 4. Global Fallback
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, "");
}


/**
 * Specifically tailored for Supabase Auth redirect URLs to handle Ngrok tunnels.
 */
export function getSupabaseSafeRedirectUrl(path: string = "/auth/callback", request?: Request | NextRequest) {
  const base = getBaseUrl(request);
  // Ensure we remove trailing slashes and normalize the path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
