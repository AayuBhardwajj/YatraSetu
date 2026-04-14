-- ════════════════════════════════════════════════════════════
-- FINAL MIGRATION — run once, never touch again
-- ════════════════════════════════════════════════════════════

-- ── 1. CLEAN SLATE ──────────────────────────────────────────
DROP TRIGGER  IF EXISTS on_auth_user_created      ON auth.users;
DROP TRIGGER  IF EXISTS trg_user_profiles_updated_at   ON public.user_profiles;
DROP TRIGGER  IF EXISTS trg_driver_profiles_updated_at ON public.driver_profiles;
DROP TABLE    IF EXISTS public.driver_profiles CASCADE;
DROP TABLE    IF EXISTS public.user_profiles   CASCADE;
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
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 4. driver_profiles ──────────────────────────────────────
CREATE TABLE public.driver_profiles (
  user_id        UUID PRIMARY KEY REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  license_number TEXT,
  vehicle_type   TEXT,
  vehicle_plate  TEXT,
  is_verified    BOOLEAN NOT NULL DEFAULT FALSE,
  is_available   BOOLEAN NOT NULL DEFAULT FALSE,
  rating         NUMERIC(3,2) DEFAULT 5.00,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

-- ── 6. handle_new_user trigger function ─────────────────────
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name'
    ),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'user'
  )
  ON CONFLICT (user_id) DO NOTHING;
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