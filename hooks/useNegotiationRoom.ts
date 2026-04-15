import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useNegotiationStore } from '@/store/negotiationStore'
import type { NegotiationBid } from '@/types/rides'

/**
 * Shared hook for both passenger and driver to participate in a specific ride's negotiation.
 * Replaces Websockets with standard HTTP Polling (Interval: 2s).
 */
export function useNegotiationRoom(rideId: string | null, onAccepted?: () => void) {
  const { setBids, setConnected } = useNegotiationStore()
  const supabase = createClient()

  useEffect(() => {
    if (!rideId) return

    setConnected(true)

    const pollNegotiation = async () => {
      // 1. Fetch latest bids
      const { data: bids, error: bidsError } = await supabase
        .from('negotiation_bids')
        .select('*')
        .eq('ride_id', rideId)
        .order('created_at', { ascending: true })

      if (bids && !bidsError) {
        setBids(bids as NegotiationBid[])
        
        // Check if any bid is accepted
        const anyAccepted = bids.some(b => b.is_accepted)
        if (anyAccepted && onAccepted) {
          onAccepted()
        }
      }

      // 2. Also check ride status for finalization
      const { data: ride, error: rideError } = await supabase
        .from('ride_requests')
        .select('status')
        .eq('id', rideId)
        .single()
      
      if (ride?.status === 'accepted' && onAccepted) {
        onAccepted()
      }
    }

    pollNegotiation()
    const intervalId = setInterval(pollNegotiation, 2000)

    return () => {
      clearInterval(intervalId)
      setConnected(false)
    }
  }, [rideId, setBids, setConnected, onAccepted])
}
