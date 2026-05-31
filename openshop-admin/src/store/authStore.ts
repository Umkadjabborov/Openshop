import create from 'zustand'

interface Admin {
  id: string
  name: string
  email?: string
  role?: string
}

interface AuthState {
  admin: Admin | null
  setAdmin: (a: Admin | null) => void
  token: string | null
  setToken: (t: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  token: null,
  setAdmin: (a) => set({ admin: a }),
  setToken: (t) => set({ token: t }),
}))
