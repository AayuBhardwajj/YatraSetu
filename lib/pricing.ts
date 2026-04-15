import type { PricingInput, PricingResult } from '@/types/rides'

// --- Constants (Tailored for local context) ---
const BASE_FARE = 20          // ₹ flag-down charge
const RATE_PER_KM = 12        // ₹ per km
const FUEL_PRICE_PER_LITRE = 105  // ₹ local petrol price
const MIN_DEMAND_MULTIPLIER = 0.8
const MAX_DEMAND_MULTIPLIER = 2.0

// Peak hours: 8-10am and 5-8pm
const PEAK_HOURS = new Set([8, 9, 17, 18, 19])
const LATE_NIGHT_HOURS = new Set([23, 0, 1, 2, 3])

export function getPriceSuggestion(input: PricingInput): PricingResult {
  const {
    distanceKm,
    driverMileageKmpl,
    hourOfDay,
    activeRequests,
    onlineDrivers,
  } = input

  const baseFare = BASE_FARE
  const distanceFare = distanceKm * RATE_PER_KM
  const fuelSurcharge = (distanceKm / driverMileageKmpl) * FUEL_PRICE_PER_LITRE

  // Demand multiplier: higher ratio = higher multiplier
  // activeRequests / onlineDrivers ratio
  const rawRatio = onlineDrivers > 0
    ? activeRequests / onlineDrivers
    : MAX_DEMAND_MULTIPLIER
    
  // Clamp between min and max
  const demandMultiplier = Math.min(
    MAX_DEMAND_MULTIPLIER,
    Math.max(MIN_DEMAND_MULTIPLIER, rawRatio)
  )

  // Time-of-day multiplier
  const timeMultiplier = LATE_NIGHT_HOURS.has(hourOfDay)
    ? 1.3
    : PEAK_HOURS.has(hourOfDay)
    ? 1.2
    : 1.0

  const price = Math.round(
    (baseFare + distanceFare + fuelSurcharge) * demandMultiplier * timeMultiplier
  )

  return {
    price,
    breakdown: {
      baseFare,
      distanceFare: Math.round(distanceFare),
      fuelSurcharge: Math.round(fuelSurcharge),
      demandMultiplier,
      timeMultiplier,
    },
  }
}
