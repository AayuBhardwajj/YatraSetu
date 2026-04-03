import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "rider" | "driver" | "admin";
}

interface AuthState {
  user: User | null;
  role: "rider" | "driver" | "admin" | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, role: user.role, token, isAuthenticated: true });
        // Set cookies for middleware
        document.cookie = `zipp_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `zipp_role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
      },
      logout: () => {
        set({ user: null, role: null, token: null, isAuthenticated: false });
        document.cookie = "zipp_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "zipp_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem("zipp_token");
        localStorage.removeItem("zipp_role");
      },
    }),
    {
      name: "zipp-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
