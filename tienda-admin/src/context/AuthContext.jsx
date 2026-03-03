// AuthContext.jsx
import { createContext, useContext, useState } from 'react'
const AuthContext = createContext(null)
const KEY = 'admin_user'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { const s=sessionStorage.getItem(KEY); return s?JSON.parse(s):null } catch{return null} })
  const signIn = u => { setUser(u); sessionStorage.setItem(KEY, JSON.stringify(u)) }
  const signOut = () => { setUser(null); sessionStorage.removeItem(KEY) }
  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}
export function useAuth() { return useContext(AuthContext) }
