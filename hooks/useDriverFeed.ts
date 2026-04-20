import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useDriverFeedStore } from '@/store/driverFeedStore'
import type { RideRequest } from '@/types/rides'

export function useDriverFeed() {
  // ✅ CHANGED: use setRequests instead of addRequest
  const { setRequests, setListening } = useDriverFeedStore()
  const supabase = createClient()

  useEffect(() => {
    setListening(true)

    const pollFeed = async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('status', 'open')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Poll error:', error.message)
        return
      }

      console.log('🔄 Polled rides:', data?.length ?? 0)
      // ✅ CHANGED: bulk replace so stale/accepted rides auto-disappear
      setRequests((data ?? []) as RideRequest[])
    }

    pollFeed() // immediate first call
    const intervalId = setInterval(pollFeed, 3000)

    return () => {
      clearInterval(intervalId)
      setListening(false)
    }
  }, []) // ✅ FIXED: empty deps — no re-subscribe loop
}