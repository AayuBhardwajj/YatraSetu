-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'driver');
CREATE TYPE driver_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE vehicle_type AS ENUM ('auto', 'bike', 'cab');
CREATE TYPE doc_type AS ENUM ('aadhaar', 'pan', 'driving_license', 'rc');

-- 2. TABLES

-- profiles: Public user profile
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT, -- Cloudinary public_id
    role user_role NOT NULL DEFAULT 'user',
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- drivers: Driver-specific data linked to profiles
CREATE TABLE drivers (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    status driver_status NOT NULL DEFAULT 'pending',
    is_available BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 0,
    total_rides INT DEFAULT 0,
    payment_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- driver_documents: KYC and legal docs
CREATE TABLE driver_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    doc_type doc_type NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    cloudinary_url TEXT NOT NULL, -- Optimized CDN delivery URL
    verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- driver_vehicles: Vehicle-specific data
CREATE TABLE driver_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT NOT NULL,
    plate_number TEXT NOT NULL UNIQUE,
    vehicle_type vehicle_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS POLICIES

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_vehicles ENABLE ROW LEVEL SECURITY;

-- profiles: Anyone can read, user can update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- drivers: User can read own, admin can update status
CREATE POLICY "Drivers can view their own status" ON drivers FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own driver record" ON drivers FOR INSERT WITH CHECK (auth.uid() = id);

-- driver_documents: Driver can insert, select own
CREATE POLICY "Drivers can view their own documents" ON driver_documents FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can insert their own documents" ON driver_documents FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- driver_vehicles: Driver can insert, select own
CREATE POLICY "Drivers can view their own vehicles" ON driver_vehicles FOR SELECT USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can insert/update their own vehicles" ON driver_vehicles FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update their own vehicles" ON driver_vehicles FOR UPDATE USING (auth.uid() = driver_id);

-- 4. FUNCTION: Handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
