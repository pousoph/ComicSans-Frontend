// ============================================================
// AuthContext.jsx
// Contexto global de autenticación del cajero
// Guarda la sesión en sessionStorage para persistir en reload
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'pos_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Hora de inicio de turno
  const [turnoInicio] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  })

  const signIn = (userData) => {
    setUser(userData)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, turnoInicio, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
