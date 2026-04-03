export const MOCK_USERS = [
  { id: "u1", name: "Arjun Singh", email: "user@zipp.com", role: "rider", location: "Sector 17, Chandigarh" },
  { id: "u2", name: "Priya Sharma", email: "priya@example.com", role: "rider", location: "Model Town, Ludhiana" },
];

export const MOCK_DRIVERS = [
  { 
    id: "d1", 
    name: "Rajesh Kumar", 
    email: "driver@zipp.com", 
    role: "driver", 
    rating: 4.8, 
    vehicle: "Maruti Swift", 
    plate: "PB-10-AB-1234",
    location: "Zirakpur, Chandigarh"
  },
  { 
    id: "d2", 
    name: "Gurpreet Singh", 
    email: "gurpreet@example.com", 
    role: "driver", 
    rating: 4.9, 
    vehicle: "Honda Amaze", 
    plate: "PB-01-XY-5678",
    location: "Saraba Nagar, Ludhiana"
  },
];

export const MOCK_ADMINS = [
  { id: "a1", name: "Admin Zipp", email: "admin@zipp.com", role: "admin" },
];

export const MOCK_RIDE_HISTORY = [
  { id: "r1", date: "2024-04-01", from: "Sector 17", to: "Chandigarh Airport", price: 240, status: "completed" },
  { id: "r2", date: "2024-03-30", from: "Ludhiana Railway Station", to: "MBD Mall", price: 120, status: "completed" },
];

export const MOCK_ML_PRICING = {
  suggestedPrice: 180,
  minPrice: 150,
  maxPrice: 220,
  reason: "Moderate demand",
  eta: 12
};

export const MOCK_ADMIN_STATS = {
  activeRides: 47,
  onlineDrivers: 134,
  todayRevenue: 18420,
  pendingDisputes: 3
};

export const delay = (ms: number = 600) => new Promise(resolve => setTimeout(resolve, ms));
