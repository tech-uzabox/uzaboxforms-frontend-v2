import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TokenStore {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;

  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
  getToken: () => string | null;
}

export const useTokenStore = create<TokenStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      token: null,
      
      setTokens: (accessToken, refreshToken) => set({ 
        accessToken, 
        refreshToken,
        token: accessToken
      }),
      
      clearTokens: () => set({ 
        accessToken: null, 
        refreshToken: null,
        token: null
      }),
      
      getAccessToken: () => get().accessToken,
      getRefreshToken: () => get().refreshToken,
      
      setToken: (token) => set({ 
        token,
        accessToken: token 
      }),
      clearToken: () => set({ 
        token: null,
        accessToken: null,
        refreshToken: null
      }),
      getToken: () => get().accessToken || get().token,
    }),
    {
      name: "auth-tokens",
    }
  )
);
