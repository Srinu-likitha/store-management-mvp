import { create } from 'zustand';
import { localKey } from "../lib/api"

export type Role =
  "ADMIN" |
  "STORE_INCHARGE" |
  "PROCUREMENT_MANAGER" |
  "ACCOUNTS_MANAGER"

interface UserStore {
  token: string | null;
  setToken: (token: string) => void;
  role: Role | null;
  setRole: (role: Role) => void;
  email: string | null;
  setEmail: (email: string) => void;
}

export const userStore = create<UserStore>((set) => ({
  token: localStorage.getItem(localKey.token) || null,
  setToken: (token) => {
    localStorage.setItem(localKey.token, token);
    set({ token });
  },
  role: null,
  setRole: (role) => set({ role }),
  email: null,
  setEmail: (email) => set({ email }),
}));