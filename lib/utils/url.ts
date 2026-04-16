/**
 * Production-ready URL resolution utility.
 * Handles switching between localhost and ngrok/production domains dynamically.
 */
export function getBaseUrl() {
  // 1. Browser context: prioritize the environment variable if it's set
  // This provides stability during hydration for static ngrok domains.
  if (typeof window !== 'undefined') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl && appUrl.includes(window.location.hostname)) {
      return appUrl.replace(/\/$/, ""); // Remove trailing slash
    }
    return window.location.origin;
  }

  // 2. Server context (SSR / API Routes / Middleware)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // 3. Fallback to fixed APP_URL or localhost
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, "");
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
