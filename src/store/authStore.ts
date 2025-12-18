import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    role: 'admin' | 'user';
  } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, password: string) => {
        // Simple authentication logic
        if (username === 'admin' && password === 'admin123') {
          set({ isAuthenticated: true, user: { id: username, role: 'admin' } });
          return true;
        } else if (username === 'user' && password === 'user123') {
          set({ isAuthenticated: true, user: { id: username, role: 'user' } });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;