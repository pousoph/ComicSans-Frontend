// ============================================================
// adminService.js — Simula todas las APIs del administrador
// ============================================================
import {
  MOCK_USUARIOS, MOCK_CLIENTES, MOCK_PROVEEDORES,
  MOCK_PRODUCTOS, MOCK_VENTAS, MOCK_ADMINS,
  MOCK_PROVEEDORES as PROVEEDORES_DB,
  nextUsuarioId, nextClienteId, nextProvId,
} from './mockData.js'

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

// ── AUTH ──────────────────────────────────────────────────────
export async function adminLogin(usuario, password) {
  await delay(900)
  const u = [...MOCK_ADMINS, ...MOCK_USUARIOS.filter(u => u.rol === 'ADMIN')]
    .find(u => u.usuario === usuario && u.password === password)
  if (u) return { ok: true,  user: { cedula: u.cedula, nombre: u.nombre, usuario: u.usuario, rol: u.rol } }
  return     { ok: false, message: 'Usuario o contraseña incorrectos.' }
}

// ── USUARIOS ──────────────────────────────────────────────────
export async function getUsuarios() {
  await delay(500)
  return { ok: true, data: [...MOCK_USUARIOS] }
}
export async function createUsuario(data) {
  await delay(800)
  if (!data.cedula||!data.nombre||!data.correo||!data.usuario||!data.password)
    return { ok:false, message:'Faltan datos del usuario.' }
  if (MOCK_USUARIOS.find(u => u.cedula === data.cedula || u.usuario === data.usuario))
    return { ok:false, message:'Cédula o usuario ya existe.' }
  const nuevo = { ...data, id: nextUsuarioId(), estado: true, fechaCreacion: new Date().toISOString().split('T')[0], rol: data.rol||'CAJERO' }
  MOCK_USUARIOS.push(nuevo)
  return { ok:true, data: nuevo, message:'Usuario creado.' }
}
export async function updateUsuario(id, data) {
  await delay(700)
  const idx = MOCK_USUARIOS.findIndex(u => u.id === id)
  if (idx === -1) return { ok:false, message:'Usuario no encontrado.' }
  MOCK_USUARIOS[idx] = { ...MOCK_USUARIOS[idx], ...data }
  return { ok:true, data: MOCK_USUARIOS[idx], message:'Usuario actualizado.' }
}
export async function deleteUsuario(id) {
  await delay(600)
  const idx = MOCK_USUARIOS.findIndex(u => u.id === id)
  if (idx === -1) return { ok:false, message:'Usuario no encontrado.' }
  MOCK_USUARIOS.splice(idx, 1)
  return { ok:true, message:'Usuario eliminado.' }
}
export async function toggleUsuarioEstado(id) {
  await delay(500)
  const u = MOCK_USUARIOS.find(u => u.id === id)
  if (!u) return { ok:false, message:'No encontrado.' }
  u.estado = !u.estado
  return { ok:true, data: u }
}

// ── CLIENTES ──────────────────────────────────────────────────
export async function getClientes() {
  await delay(500)
  return { ok:true, data: [...MOCK_CLIENTES] }
}
export async function createCliente(data) {
  await delay(800)
  if (!data.cedula||!data.nombre||!data.direccion||!data.telefono)
    return { ok:false, message:'Faltan datos del cliente.' }
  if (MOCK_CLIENTES.find(c => c.cedula === data.cedula))
    return { ok:false, message:'Ya existe un cliente con esta cédula.' }
  const nuevo = { ...data, id: nextClienteId(), estado: true, fechaRegistro: new Date().toISOString().split('T')[0] }
  MOCK_CLIENTES.push(nuevo)
  return { ok:true, data: nuevo, message:'Cliente creado.' }
}
export async function updateCliente(id, data) {
  await delay(700)
  const idx = MOCK_CLIENTES.findIndex(c => c.id === id)
  if (idx === -1) return { ok:false, message:'Cliente no encontrado.' }
  MOCK_CLIENTES[idx] = { ...MOCK_CLIENTES[idx], ...data }
  return { ok:true, data: MOCK_CLIENTES[idx], message:'Cliente actualizado.' }
}
export async function deleteCliente(id) {
  await delay(600)
  const idx = MOCK_CLIENTES.findIndex(c => c.id === id)
  if (idx === -1) return { ok:false, message:'No encontrado.' }
  MOCK_CLIENTES.splice(idx, 1)
  return { ok:true, message:'Cliente eliminado.' }
}

// ── PROVEEDORES ──────────────────────────────────────────────
export async function getProveedores() {
  await delay(500)
  return { ok:true, data: [...MOCK_PROVEEDORES] }
}
export async function createProveedor(data) {
  await delay(800)
  if (!data.nit||!data.nombre||!data.direccion||!data.telefono||!data.ciudad)
    return { ok:false, message:'Faltan datos del proveedor.' }
  if (MOCK_PROVEEDORES.find(p => p.nit === data.nit))
    return { ok:false, message:'Ya existe un proveedor con este NIT.' }
  const nuevo = { ...data, id: nextProvId() }
  MOCK_PROVEEDORES.push(nuevo)
  return { ok:true, data: nuevo, message:'Proveedor creado.' }
}
export async function updateProveedor(id, data) {
  await delay(700)
  const idx = MOCK_PROVEEDORES.findIndex(p => p.id === id)
  if (idx === -1) return { ok:false, message:'No encontrado.' }
  MOCK_PROVEEDORES[idx] = { ...MOCK_PROVEEDORES[idx], ...data }
  return { ok:true, data: MOCK_PROVEEDORES[idx], message:'Proveedor actualizado.' }
}
export async function deleteProveedor(id) {
  await delay(600)
  const idx = MOCK_PROVEEDORES.findIndex(p => p.id === id)
  if (idx === -1) return { ok:false, message:'No encontrado.' }
  MOCK_PROVEEDORES.splice(idx, 1)
  return { ok:true, message:'Proveedor eliminado.' }
}

// ── PRODUCTOS (CSV) ──────────────────────────────────────────
export async function cargarProductosCSV(file) {
  await delay(1400)
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.trim().split('\n').filter(Boolean)
      const errores = []
      const productos = []

      lines.forEach((line, i) => {
        const parts = line.split(',').map(s => s.trim())
        if (parts.length < 6) { errores.push(`Fila ${i+1}: formato inválido.`); return }
        const [codigo, nombre, nitProveedor, precioCompra, ivaCompra, precioVenta] = parts
        if (!codigo||!nombre) { errores.push(`Fila ${i+1}: código o nombre vacío.`); return }
        const proveedor = MOCK_PROVEEDORES.find(p => p.nit === nitProveedor)
        if (!proveedor) { errores.push(`Fila ${i+1}: NIT proveedor '${nitProveedor}' no existe.`); return }
        productos.push({ codigo, nombre, nitProveedor, precioCompra: +precioCompra, ivaCompra: +ivaCompra, precioVenta: +precioVenta })
      })

      if (errores.length > 0) {
        resolve({ ok: false, errores, message: `${errores.length} errores encontrados.` })
        return
      }

      // Reemplazar todos los productos (según el documento)
      MOCK_PRODUCTOS.length = 0
      MOCK_PRODUCTOS.push(...productos)
      resolve({ ok: true, data: productos, message: `${productos.length} productos cargados exitosamente.` })
    }
    reader.onerror = () => resolve({ ok: false, message: 'Error leyendo el archivo.' })
    reader.readAsText(file)
  })
}

// ── REPORTES ──────────────────────────────────────────────────
export async function getReporteUsuarios() {
  await delay(600)
  return { ok:true, data: [...MOCK_USUARIOS] }
}
export async function getReporteClientes() {
  await delay(600)
  return { ok:true, data: [...MOCK_CLIENTES] }
}
export async function getReporteVentasPorCliente() {
  await delay(700)
  const mapa = {}
  MOCK_VENTAS.forEach(v => {
    const cliente = MOCK_CLIENTES.find(c => c.cedula === v.cedulaCliente)
    if (!mapa[v.cedulaCliente]) {
      mapa[v.cedulaCliente] = {
        cedula: v.cedulaCliente,
        nombre: cliente?.nombre || 'Desconocido',
        totalVentas: 0, cantidadVentas: 0
      }
    }
    mapa[v.cedulaCliente].totalVentas    += v.totalConIva
    mapa[v.cedulaCliente].cantidadVentas += 1
  })
  const rows = Object.values(mapa)
  const granTotal = rows.reduce((a,r) => a + r.totalVentas, 0)
  return { ok:true, data: rows, granTotal }
}

// ── DASHBOARD STATS ───────────────────────────────────────────
export async function getDashboardStats() {
  await delay(500)
  return {
    ok: true,
    data: {
      totalUsuarios:    MOCK_USUARIOS.length,
      usuariosActivos:  MOCK_USUARIOS.filter(u=>u.estado).length,
      totalClientes:    MOCK_CLIENTES.length,
      clientesActivos:  MOCK_CLIENTES.filter(c=>c.estado).length,
      totalProveedores: MOCK_PROVEEDORES.length,
      totalProductos:   MOCK_PRODUCTOS.length,
      totalVentas:      MOCK_VENTAS.length,
      ingresosTotales:  MOCK_VENTAS.reduce((a,v)=>a+v.totalConIva,0),
    }
  }
}
