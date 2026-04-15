import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { rideId, driverId } = await req.json()

  // Optimistic lock: only update if status is 'open'
  const { data: ride, error } = await supabase
    .from('ride_requests')
    .update({ 
      status: 'negotiating', 
      accepted_driver_id: driverId 
    })
    .eq('id', rideId)
    .eq('status', 'open')
    .select()
    .single()

  if (error || !ride) {
    return NextResponse.json(
      { error: 'Ride already taken or not found' },
      { status: 409 }
    )
  }

  return NextResponse.json({ ride })
}
