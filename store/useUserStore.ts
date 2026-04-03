import { create } from "zustand";
import type { User } from "@/types/user";

type UserStore = {
  token: string | null;
  profile: User | null;
  setToken: (token: string | null) => void;
  setProfile: (profile: User) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  token: null,
  profile: null,
  setToken: (token) => set({ token }),
  setProfile: (profile) => set({ profile })
}));
