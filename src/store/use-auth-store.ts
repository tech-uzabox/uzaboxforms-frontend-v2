import { create } from "zustand";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  roles: string[] | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  setUser: (data: User | null) => void;
  setRoles: (data: string[] | null) => void;
  clearAuth: () => void;
  setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  roles: null,
  users: [],
  isAuthenticated: false,
  isAuthLoading: false,
  setUser: (data) => set({ 
    user: data, 
    isAuthenticated: !!data 
  }),
  setRoles: (data) => set({ roles: data }),
  clearAuth: () => set({ 
    user: null, 
    roles: null, 
    isAuthenticated: false,
    isAuthLoading: false
  }),
  setAuthLoading: (loading) => set({ isAuthLoading: loading }),
}));