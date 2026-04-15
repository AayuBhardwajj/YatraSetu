import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { rideId, bidId, finalPrice } = await req.json()

  // 1. Mark the winning bid
  await supabase
    .from('negotiation_bids')
    .update({ is_accepted: true })
    .eq('id', bidId)

  // 2. Update ride to accepted
  const { data: ride, error } = await supabase
    .from('ride_requests')
    .update({ 
      status: 'accepted', 
      final_price: finalPrice 
    })
    .eq('id', rideId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 3. Complete the pricing event ML log
  const { count: rounds } = await supabase
    .from('negotiation_bids')
    .select('*', { count: 'exact', head: true })
    .eq('ride_id', rideId)

  await supabase
    .from('pricing_events')
    .update({
      negotiated_price: finalPrice,
      was_accepted: true,
      negotiation_rounds: rounds ?? 0,
    })
    .eq('ride_id', rideId)

  return NextResponse.json({ ride })
}
