-- Ride requests (short-lived broadcast records)
CREATE TABLE public.ride_requests (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),
  expires_at        timestamptz DEFAULT now() + interval '3 minutes',

  -- Passenger
  passenger_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Locations
  pickup_lat        numeric(9,6) NOT NULL,
  pickup_lng        numeric(9,6) NOT NULL,
  pickup_label      text NOT NULL,
  drop_lat          numeric(9,6) NOT NULL,
  drop_lng          numeric(9,6) NOT NULL,
  drop_label        text NOT NULL,
  distance_km       numeric(6,2) NOT NULL,

  -- Pricing
  suggested_price   numeric(8,2) NOT NULL,
  final_price       numeric(8,2),

  -- State machine
  -- 'open' | 'negotiating' | 'accepted' | 'cancelled' | 'expired'
  status            text NOT NULL DEFAULT 'open',
  accepted_driver_id uuid REFERENCES auth.users(id),

  CONSTRAINT valid_status CHECK (
    status IN ('open','negotiating','accepted','cancelled','expired')
  )
);

-- Negotiation bids (append-only log)
CREATE TABLE public.negotiation_bids (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  ride_id     uuid NOT NULL REFERENCES public.ride_requests(id) ON DELETE CASCADE,
  bidder_id   uuid NOT NULL REFERENCES auth.users(id),
  bidder_role text NOT NULL CHECK (bidder_role IN ('passenger','driver')),
  amount      numeric(8,2) NOT NULL,
  is_accepted boolean NOT NULL DEFAULT false
);

-- Pricing events (training data for future ML)
CREATE TABLE public.pricing_events (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz DEFAULT now(),
  ride_id           uuid REFERENCES public.ride_requests(id),
  distance_km       numeric(6,2),
  hour_of_day       smallint,
  day_of_week       smallint,
  driver_mileage    numeric(5,1),
  fuel_price        numeric(5,2),
  demand_ratio      numeric(4,2),
  active_requests   smallint,
  online_drivers    smallint,
  suggested_price   numeric(8,2),
  negotiated_price  numeric(8,2),
  was_accepted      boolean,
  negotiation_rounds smallint
);

-- RLS
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negotiation_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_events ENABLE ROW LEVEL SECURITY;

-- Passengers can insert and read their own requests
CREATE POLICY "passenger_insert" ON public.ride_requests
  FOR INSERT WITH CHECK (auth.uid() = passenger_id);
CREATE POLICY "passenger_read_own" ON public.ride_requests
  FOR SELECT USING (auth.uid() = passenger_id);

-- Drivers can read open requests and ones assigned to them
CREATE POLICY "driver_read_open" ON public.ride_requests
  FOR SELECT USING (
    status = 'open'
    OR accepted_driver_id = auth.uid()
  );

-- Drivers can update status when accepting
CREATE POLICY "driver_accept" ON public.ride_requests
  FOR UPDATE USING (
    status = 'open' AND accepted_driver_id IS NULL
  ) WITH CHECK (
    accepted_driver_id = auth.uid()
  );

-- Both parties can insert bids for their negotiation
CREATE POLICY "bid_insert" ON public.negotiation_bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);
CREATE POLICY "bid_read" ON public.negotiation_bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ride_requests r
      WHERE r.id = ride_id
      AND (r.passenger_id = auth.uid() OR r.accepted_driver_id = auth.uid())
    )
  );

-- Pricing events: server-side only (no user RLS)
CREATE POLICY "pricing_server_only" ON public.pricing_events
  FOR ALL USING (false);

-- Add is_online to driver_profiles
ALTER TABLE public.driver_profiles ADD COLUMN IF NOT EXISTS is_online boolean DEFAULT false;
