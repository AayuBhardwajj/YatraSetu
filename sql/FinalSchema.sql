-- ════════════════════════════════════════════════════════════
-- FINAL MIGRATION — run once, never touch again
-- ════════════════════════════════════════════════════════════

-- ── 1. CLEAN SLATE ──────────────────────────────────────────
DROP TRIGGER  IF EXISTS on_auth_user_created      ON auth.users;
DROP TRIGGER  IF EXISTS trg_user_profiles_updated_at   ON public.user_profiles;
DROP TRIGGER  IF EXISTS trg_driver_profiles_updated_at ON public.driver_profiles;
DROP TABLE    IF EXISTS public.bookings         CASCADE;
DROP TABLE    IF EXISTS public.vehicles         CASCADE;
DROP TABLE    IF EXISTS public.driver_documents  CASCADE;
DROP TABLE    IF EXISTS public.driver_profiles  CASCADE;
DROP TABLE    IF EXISTS public.user_profiles    CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user()  CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at()   CASCADE;
DROP TYPE     IF EXISTS public.user_role           CASCADE;

-- ── 2. ENUM ─────────────────────────────────────────────────
CREATE TYPE public.user_role AS ENUM ('user', 'driver');

-- ── 3. user_profiles ────────────────────────────────────────
-- NOTE: primary key is user_id (not id) to match your frontend queries
CREATE TABLE public.user_profiles (
  user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  role        public.user_role NOT NULL DEFAULT 'user',
  is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. driver_profiles ──────────────────────────────────────
CREATE TABLE public.driver_profiles (
  user_id        UUID PRIMARY KEY REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  full_name      TEXT,
  phone          TEXT,
  city           TEXT,
  license_number TEXT,
  vehicle_type   TEXT,
  vehicle_plate  TEXT,
  aadhaar_number TEXT,
  pan_number     TEXT,
  dl_number      TEXT,
  upi_id         TEXT,
  bank_account   TEXT,
  bank_ifsc      TEXT,
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  is_available   BOOLEAN NOT NULL DEFAULT FALSE,
  rating         NUMERIC(3,2) DEFAULT 5.00,
  make           TEXT,
  model          TEXT,
  plate_number   TEXT,
  year           INTEGER,
  onboarding_step INTEGER NOT NULL DEFAULT 1,
  is_onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4.1 driver_documents ─────────────────────────────────────
CREATE TABLE public.driver_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id     UUID NOT NULL REFERENCES public.driver_profiles(user_id) ON DELETE CASCADE,
  doc_type      TEXT NOT NULL,
  file_url      TEXT NOT NULL,
  cloudinary_id TEXT NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(driver_id, doc_type)
);

-- ── 4.2 vehicles ─────────────────────────────────────────────
CREATE TABLE public.vehicles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id     UUID NOT NULL REFERENCES public.driver_profiles(user_id) ON DELETE CASCADE,
  vehicle_type  TEXT NOT NULL,
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  plate_number  TEXT UNIQUE NOT NULL,
  year          INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4.3 bookings ─────────────────────────────────────────────
CREATE TABLE public.bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id  UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  driver_id     UUID REFERENCES public.driver_profiles(user_id) ON DELETE SET NULL,
  pickup_name   TEXT NOT NULL,
  pickup_lat    DOUBLE PRECISION NOT NULL,
  pickup_lng    DOUBLE PRECISION NOT NULL,
  dropoff_name  TEXT NOT NULL,
  dropoff_lat   DOUBLE PRECISION NOT NULL,
  dropoff_lng   DOUBLE PRECISION NOT NULL,
  status        TEXT NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, ACCEPTED, COMPLETED, CANCELLED
  fare          NUMERIC(10, 2),
  distance_km   NUMERIC(10, 2),
  payment_status TEXT NOT NULL DEFAULT 'PENDING',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5. updated_at helper ────────────────────────────────────
CREATE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_driver_profiles_updated_at
  BEFORE UPDATE ON public.driver_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 6. handle_new_user trigger function ─────────────────────
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- 1. Create entry in user_profiles
  INSERT INTO public.user_profiles (user_id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name'
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'user')::public.user_role
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 2. If role is 'driver', create entry in driver_profiles
  IF (NEW.raw_user_meta_data ->> 'role' = 'driver') THEN
    INSERT INTO public.driver_profiles (user_id, full_name)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'name'
      )
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ── 7. trigger on auth.users ────────────────────────────────
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 8. RLS ──────────────────────────────────────────────────
ALTER TABLE public.user_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "select own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- driver_profiles policies
CREATE POLICY "select own driver profile"
  ON public.driver_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "insert own driver profile"
  ON public.driver_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update own driver profile"
  ON public.driver_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- driver_documents policies
ALTER TABLE public.driver_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own documents"
  ON public.driver_documents FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "insert own documents"
  ON public.driver_documents FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "update own documents"
  ON public.driver_documents FOR UPDATE
  USING (auth.uid() = driver_id);

-- vehicles policies
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select own vehicles"
  ON public.vehicles FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "insert own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "update own vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() = driver_id);

-- bookings policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "passengers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = passenger_id);

CREATE POLICY "drivers can view own assigned bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "drivers can view requested bookings"
  ON public.bookings FOR SELECT
  USING (status = 'REQUESTED');

CREATE POLICY "passengers can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "participants can update bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = passenger_id OR auth.uid() = driver_id);

-- ── 9. BACKFILL existing auth users ─────────────────────────
INSERT INTO public.user_profiles (user_id, email, full_name, avatar_url, role)
SELECT
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name'
  ),
  u.raw_user_meta_data ->> 'avatar_url',
  'user'::public.user_role
FROM auth.users u
ON CONFLICT (user_id) DO NOTHING;