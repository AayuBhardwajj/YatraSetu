-- ============================================================
-- MIGRATION 002: Role-Based Platform Schema
-- Replaces legacy profiles/drivers tables with spec-compliant ones
-- ============================================================

-- ── ENUMS ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'driver');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type_enum AS ENUM ('auto', 'bike', 'cab');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE doc_type_enum AS ENUM ('aadhaar', 'pan', 'dl', 'rc');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── TABLES ───────────────────────────────────────────────────

-- 1. user_profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT,
  phone                TEXT,
  city                 TEXT,
  avatar_url           TEXT,
  role                 user_role NOT NULL DEFAULT 'user',
  is_profile_complete  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. driver_profiles
CREATE TABLE IF NOT EXISTS driver_profiles (
  user_id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT,
  phone                   TEXT,
  city                    TEXT,
  aadhaar_number          TEXT,
  pan_number              TEXT,
  dl_number               TEXT,
  upi_id                  TEXT,
  bank_account            TEXT,
  bank_ifsc               TEXT,
  vehicle_type            vehicle_type_enum,
  is_available            BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
  onboarding_step         INT NOT NULL DEFAULT 1,
  is_onboarding_complete  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. driver_documents
CREATE TABLE IF NOT EXISTS driver_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id     UUID NOT NULL REFERENCES driver_profiles(user_id) ON DELETE CASCADE,
  doc_type      doc_type_enum NOT NULL,
  file_url      TEXT NOT NULL,
  cloudinary_id TEXT NOT NULL,
  uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. vehicles
CREATE TABLE IF NOT EXISTS vehicles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id    UUID NOT NULL REFERENCES driver_profiles(user_id) ON DELETE CASCADE,
  vehicle_type vehicle_type_enum NOT NULL,
  make         TEXT NOT NULL,
  model        TEXT NOT NULL,
  plate_number TEXT NOT NULL UNIQUE,
  year         INT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── RLS ──────────────────────────────────────────────────────

ALTER TABLE user_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles         ENABLE ROW LEVEL SECURITY;

-- user_profiles
CREATE POLICY "user_profiles_select_own" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_profiles_insert_own" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_profiles_update_own" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- driver_profiles
CREATE POLICY "driver_profiles_select_own" ON driver_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "driver_profiles_insert_own" ON driver_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "driver_profiles_update_own" ON driver_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- driver_documents
CREATE POLICY "driver_documents_select_own" ON driver_documents
  FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "driver_documents_insert_own" ON driver_documents
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- vehicles
CREATE POLICY "vehicles_select_own" ON vehicles
  FOR SELECT USING (auth.uid() = driver_id);

CREATE POLICY "vehicles_insert_own" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "vehicles_update_own" ON vehicles
  FOR UPDATE USING (auth.uid() = driver_id);

-- ── TRIGGER: Auto-create profile row on signup ────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

  IF v_role = 'driver' THEN
    INSERT INTO public.driver_profiles (user_id, full_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  ELSE
    INSERT INTO public.user_profiles (user_id, full_name, avatar_url, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
      'user'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop old trigger if exists, recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
