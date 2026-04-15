'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000,   // 10 min — data stays fresh
            gcTime: 30 * 60 * 1000,       // 30 min — cache kept in memory
            retry: 1,
            refetchOnWindowFocus: false,   // no surprise refetches on tab switch
            refetchOnReconnect: false,
          },
        },
      })
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
