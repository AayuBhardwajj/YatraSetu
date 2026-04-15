import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRideRequestStore } from '@/store/rideRequestStore'
import type { RideRequest } from '@/types/rides'

/**
 * Passenger-side hook to poll for status updates on their own ride request.
 * Replaces Websockets with standard HTTP Polling (Interval: 2s).
 */
export function useRideBroadcast(rideId: string | null) {
  const { setActiveRequest } = useRideRequestStore()
  const supabase = createClient()

  useEffect(() => {
    if (!rideId) return

    const pollStatus = async () => {
      const { data, error } = await supabase
        .from('ride_requests')
        .select('*')
        .eq('id', rideId)
        .single()

      if (data && !error) {
        setActiveRequest(data as RideRequest)
      }
    }

    // Initial fetch
    pollStatus()

    // Setup interval
    const intervalId = setInterval(pollStatus, 2000)

    return () => clearInterval(intervalId)
  }, [rideId, setActiveRequest])
}
