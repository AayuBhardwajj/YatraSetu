/**
 * Production-ready URL resolution utility.
 * Handles switching between localhost and ngrok/production domains dynamically.
 */
export function getBaseUrl() {
  // 1. Browser context: always use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 2. Server context (SSR / API Routes / Middleware)
  // Use Vercel URL if available, otherwise fallback to local/env
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Default to localhost, but this should be overridden by 
  // request-specific logic in SSR if using ngrok headers.
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Specifically tailored for Supabase Auth redirect URLs to handle Ngrok tunnels.
 */
export function getSupabaseSafeRedirectUrl(path: string = "/auth/callback") {
  const base = getBaseUrl();
  // Ensure we remove trailing slashes and normalize the path
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
