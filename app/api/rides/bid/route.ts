import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { rideId, bidderId, bidderRole, amount } = await req.json()

  const { data: bid, error } = await supabase
    .from('negotiation_bids')
    .insert({ 
      ride_id: rideId, 
      bidder_id: bidderId, 
      bidder_role: bidderRole, 
      amount 
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // NOTE: The broadcast to the room will be handled by the client 
  // immediately after successful API response to minimize latency.

  return NextResponse.json({ bid })
}
