'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserSidebar } from '@/components/user/UserSidebar'
import { UserHeader } from '@/components/user/UserHeader'

const PREFETCH_ROUTES = ['/home', '/booking', '/activity', '/wallet', '/profile', '/tracking']

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Prefetch all user routes on layout mount — makes every nav click instant
  useEffect(() => {
    PREFETCH_ROUTES.forEach((route) => router.prefetch(route))
  }, [router])

  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col ml-[290px] min-h-screen">
        <UserHeader />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
