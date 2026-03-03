// ============================================================
// App.jsx — Router principal con rutas protegidas
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login      from './pages/Login'
import POS        from './pages/POS'
import SaleReceipt from './pages/SaleReceipt'

// Ruta protegida: redirige a /login si no hay sesión
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// Ruta pública: redirige a /pos si ya tiene sesión
function PublicRoute({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/pos" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <POS />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receipt"
        element={
          <ProtectedRoute>
            <SaleReceipt />
          </ProtectedRoute>
        }
      />
      {/* Redirect root to /pos or /login */}
      <Route path="/" element={<Navigate to="/pos" replace />} />
      <Route path="*" element={<Navigate to="/pos" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
