import { create } from "zustand";

interface UserState {
  user: any | null; // Replace with User type
  setUser: (user: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
