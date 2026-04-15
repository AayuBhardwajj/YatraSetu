'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DriverSidebar } from '@/components/driver/DriverSidebar'
import { DriverHeader } from '@/components/driver/DriverHeader'

const PREFETCH_ROUTES = ['/driver/dashboard', '/driver/requests', '/driver/earnings', '/driver/profile']

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    PREFETCH_ROUTES.forEach((route) => router.prefetch(route))
  }, [router])

  return (
    <div className="min-h-screen bg-muted/30">
      <DriverSidebar />
      <div className="pl-[260px] flex flex-col min-h-screen">
        <DriverHeader />
        <main className="flex-1 w-full bg-[#FAFBFF]">
          {children}
        </main>
      </div>
    </div>
  )
}
