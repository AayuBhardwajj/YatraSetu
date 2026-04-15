import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPriceSuggestion } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const {
    pickupLat, pickupLng, pickupLabel,
    dropLat, dropLng, dropLabel,
    distanceKm, passengerId,
    driverMileageKmpl = 18,
  } = body

  const now = new Date()

  // Count demand for multiplier
  const { count: activeRequests } = await supabase
    .from('ride_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  // Count online drivers
  const { count: onlineDrivers } = await supabase
    .from('driver_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_online', true)

  const pricing = getPriceSuggestion({
    distanceKm,
    driverMileageKmpl,
    hourOfDay: now.getHours(),
    dayOfWeek: now.getDay(),
    activeRequests: activeRequests ?? 1,
    onlineDrivers: onlineDrivers ?? 1,
  })

  const { data: ride, error } = await supabase
    .from('ride_requests')
    .insert({
      passenger_id: passengerId,
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      pickup_label: pickupLabel,
      drop_lat: dropLat,
      drop_lng: dropLng,
      drop_label: dropLabel,
      distance_km: distanceKm,
      suggested_price: pricing.price,
      status: 'open',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log pricing event for future ML training
  await supabase.from('pricing_events').insert({
    ride_id: ride.id,
    distance_km: distanceKm,
    hour_of_day: now.getHours(),
    day_of_week: now.getDay(),
    driver_mileage: driverMileageKmpl,
    fuel_price: 105,
    demand_ratio: (activeRequests ?? 1) / Math.max(onlineDrivers ?? 1, 1),
    active_requests: activeRequests ?? 0,
    online_drivers: onlineDrivers ?? 0,
    suggested_price: pricing.price,
  })

  return NextResponse.json({ ride, pricing })
}
