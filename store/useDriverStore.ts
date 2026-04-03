import { create } from "zustand";

type DriverStore = {
  isOnline: boolean;
  setOnline: (value: boolean) => void;
};

export const useDriverStore = create<DriverStore>((set) => ({
  isOnline: false,
  setOnline: (value) => set({ isOnline: value })
}));
