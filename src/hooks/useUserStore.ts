import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: { email: string; name: string } | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (name: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, name) => set({ user: { email, name } }),
      logout: () => set({ user: null }),
      updateUser: (name) => set((state) => ({ user: state.user ? { ...state.user, name } : null })),
    }),
    {
      name: 'spelobook-user',
    }
  )
);
