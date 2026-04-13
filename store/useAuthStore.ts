import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: "user" | "driver" | null;
  isLoading: boolean;
  setSession: (session: Session | null) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      role: null,
      isLoading: true,
      
      setSession: async (session) => {
        set({ session, user: session?.user ?? null, isLoading: true });
        if (session) {
          await get().fetchProfile();
        } else {
          set({ role: null, isLoading: false });
        }
      },

      signOut: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        set({ user: null, session: null, role: null, isAuthenticated: false } as any);
        // Clear legacy cookies if any
        document.cookie = "zipp_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "zipp_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },

      fetchProfile: async () => {
        const session = get().session;
        if (!session) return;

        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          set({ role: profile.role, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "zipp-auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
