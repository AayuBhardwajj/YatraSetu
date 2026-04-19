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

  const passenger_id = passengerId
  const pickup_lat = pickupLat
  const pickup_lng = pickupLng
  const pickup_label = pickupLabel
  const drop_lat = dropLat
  const drop_lng = dropLng
  const drop_label = dropLabel
  const distance_km = distanceKm

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

  const insertPayload = {
    passenger_id,
    pickup_lat,
    pickup_lng,
    pickup_label,
    drop_lat,
    drop_lng,
    drop_label,
    distance_km,
    suggested_price: pricing.price,
    status: 'open',
  }

  console.log("Inserting ride request:", insertPayload)

  const { data: ride, error } = await supabase
    .from('ride_requests')
    .insert(insertPayload)
    .select()
    .single()

  if (error) {
    console.error("ride_requests insert error:", error.code, error.message, error.details)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("Ride created successfully:", ride.id)

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
