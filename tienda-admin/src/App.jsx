// ============================================================
// App.jsx — Admin Panel Router
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AdminLogin   from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Usuarios     from './pages/Usuarios'
import Clientes     from './pages/Clientes'
import Proveedores  from './pages/Proveedores'
import Productos    from './pages/Productos'
import Reportes     from './pages/Reportes'

function Protected({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/admin/login" replace />
}

function Public({ children }) {
  const { user } = useAuth()
  return !user ? children : <Navigate to="/admin" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Public><AdminLogin/></Public>}/>
      <Route path="/admin"            element={<Protected><Dashboard/></Protected>}/>
      <Route path="/admin/usuarios"   element={<Protected><Usuarios/></Protected>}/>
      <Route path="/admin/clientes"   element={<Protected><Clientes/></Protected>}/>
      <Route path="/admin/proveedores"element={<Protected><Proveedores/></Protected>}/>
      <Route path="/admin/productos"  element={<Protected><Productos/></Protected>}/>
      <Route path="/admin/reportes"   element={<Protected><Reportes/></Protected>}/>
      <Route path="*" element={<Navigate to="/admin" replace/>}/>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
  )
}
