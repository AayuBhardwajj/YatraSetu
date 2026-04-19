# Yatra Setu — Bridging Journeys, Empowering Drivers 🚗💨

**Yatra Setu** is a next-generation, real-time ride-hailing and bid-based negotiation platform. Built for efficiency and transparency, it connects passengers directly with drivers through a dynamic negotiation system, ensuring fair pricing and reliable service.

![Yatra Setu Hero Banner](https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop) *(Example Hero Image)*

---

## 🚀 Key Features

### 1. Real-Time Ride Broadcasts
Passengers can request rides with a single click. The request is instantly broadcasted to all nearby online drivers via **Supabase Realtime**, creating a live, competitive feed.

### 2. Multi-Party Negotiation Room
Unlike traditional fixed-price apps, Yatra Setu features a private **Negotiation Room**. Drivers and passengers can counter-offer fares in real-time until a mutual agreement is reached.

### 3. Dynamic Pricing Engine
Integrated with a custom pricing engine that suggests base fares based on distance, fuel costs, and real-time demand ratios, providing a baseline for negotiations.

### 4. Seamless Driver Onboarding (KYC)
A professional onboarding flow for drivers, including:
- Vehicle detail registration.
- Aadhaar & PAN verification.
- Document uploads (DL, RC) via **Cloudinary**.
- Profile completion tracking.

### 5. Interactive Live Tracking
Integrated with **Leaflet** for real-time map visualization, showing nearby drivers and active trip progress.

### 6. Secure Role-Based Access
Granular security using **Postgres Row Level Security (RLS)** and Supabase Auth, supporting three distinct roles: `user` (passenger), `driver`, and `admin`.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Backend/DB**: [Supabase](https://supabase.com/) (Postgres + Auth + Realtime Broadcast)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Mapping**: [Leaflet](https://leafletjs.com/) (React-Leaflet)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **File Storage**: [Cloudinary](https://cloudinary.com/) (Driver Documentation)

---

## 📁 Directory Structure

| Directory | Purpose |
| :--- | :--- |
| `app/` | Next.js routes, layouts, and API endpoints (Role-grouped: `(user)`, `(driver)`, `(admin)`). |
| `components/` | Reusable UI components organized by feature (e.g., `user/`, `shared/`, `auth/`). |
| `store/` | Zustand stores for global state (Auth, Ride, Negotiation, Driver Feed). |
| `lib/` | Shared utilities, Supabase clients, Pricing engine, and Cloudinary logic. |
| `sql/` | Database migrations and schema definitions (The source of truth for the DB). |
| `hooks/` | Custom React hooks for Realtime Broadcasts and Destination Search. |

---

## ⚙️ Environment Setup

Create a `.env.local` file in the root directory and add the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary Configuration (For Driver Documents)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/yatra-setu.git
    cd yatra-setu
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Database**:
    Execute the SQL scripts found in the `sql/` directory in your Supabase SQL Editor. Start with `FinalSchema.sql`.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📄 License

This project is licensed under the MIT License.

---

*Build with ❤️ by the Yatra Setu Team.*
