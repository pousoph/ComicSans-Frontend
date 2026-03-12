// ============================================================
// adminService.js — Calls real backend API via gateway proxy
// ============================================================

const API = '/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

async function request(url, options = {}) {
  const res = await fetch(url, options)
  if (res.status === 204) return null
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = body?.message || body?.error || `Error ${res.status}`
    throw new Error(msg)
  }
  return body
}

// ── Mappers: backend (English) → frontend (Spanish) ─────────

function mapUserFromBackend(u, index) {
  return {
    id: u.cedula,
    cedula: u.cedula,
    nombre: u.full_name,
    correo: u.email,
    usuario: u.username,
    rol: 'CAJERO',
    estado: u.is_active ?? true,
    fechaCreacion: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  }
}

function mapUserToBackend(data) {
  const payload = {}
  if (data.cedula !== undefined) payload.cedula = data.cedula
  if (data.nombre !== undefined) payload.full_name = data.nombre
  if (data.correo !== undefined) payload.email = data.correo
  if (data.usuario !== undefined) payload.username = data.usuario
  if (data.password !== undefined) payload.password = data.password
  return payload
}

function mapCustomerFromBackend(c) {
  return {
    id: c.document_id,
    cedula: c.document_id,
    nombre: c.full_name,
    direccion: c.address,
    telefono: c.phone,
    correo: c.email,
    estado: true,
    fechaRegistro: c.created_at ? c.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
  }
}

function mapCustomerToBackend(data) {
  const payload = {}
  if (data.cedula !== undefined) payload.document_id = data.cedula
  if (data.nombre !== undefined) payload.full_name = data.nombre
  if (data.direccion !== undefined) payload.address = data.direccion
  if (data.telefono !== undefined) payload.phone = data.telefono
  if (data.correo !== undefined) payload.email = data.correo
  return payload
}

function mapSupplierFromBackend(s) {
  return {
    id: s.nit,
    nit: s.nit,
    nombre: s.supplier_name,
    direccion: s.address,
    telefono: s.phone,
    ciudad: s.city,
  }
}

function mapSupplierToBackend(data) {
  const payload = {}
  if (data.nit !== undefined) payload.nit = data.nit
  if (data.nombre !== undefined) payload.supplier_name = data.nombre
  if (data.direccion !== undefined) payload.address = data.direccion
  if (data.telefono !== undefined) payload.phone = data.telefono
  if (data.ciudad !== undefined) payload.city = data.ciudad
  return payload
}

// ── AUTH ──────────────────────────────────────────────────────
export async function adminLogin(usuario, password) {
  try {
    const body = await request(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usuario, password }),
    })
    const token = body?.data?.token
    if (token) {
      localStorage.setItem('token', token)
      // Decode JWT payload to extract user info
      let userInfo = {}
      try {
        const payloadB64 = token.split('.')[1]
        userInfo = JSON.parse(atob(payloadB64))
      } catch (_) { /* ignore decode errors */ }

      return {
        ok: true,
        user: {
          cedula: userInfo.cedula || userInfo.sub || '',
          nombre: userInfo.full_name || userInfo.nombre || usuario,
          usuario: userInfo.username || usuario,
          rol: userInfo.rol || 'ADMIN',
        },
      }
    }
    return { ok: false, message: 'No se recibió token.' }
  } catch (err) {
    return { ok: false, message: err.message || 'Usuario o contraseña incorrectos.' }
  }
}

// ── USUARIOS ──────────────────────────────────────────────────
export async function getUsuarios() {
  try {
    const data = await request(`${API}/users/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return { ok: true, data: list.map(mapUserFromBackend) }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

export async function createUsuario(data) {
  try {
    if (!data.cedula || !data.nombre || !data.correo || !data.usuario || !data.password)
      return { ok: false, message: 'Faltan datos del usuario.' }

    const payload = mapUserToBackend(data)
    const res = await request(`${API}/users/save`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapUserFromBackend(res.data || res) : { ...data, id: data.cedula, estado: true, rol: 'CAJERO', fechaCreacion: new Date().toISOString().split('T')[0] }
    return { ok: true, data: mapped, message: 'Usuario creado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function updateUsuario(id, data) {
  try {
    const payload = mapUserToBackend(data)
    payload.cedula = id
    const res = await request(`${API}/users/update`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapUserFromBackend(res.data || res) : { ...data, id, cedula: id }
    return { ok: true, data: mapped, message: 'Usuario actualizado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function deleteUsuario(id) {
  try {
    await request(`${API}/users/delete/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return { ok: true, message: 'Usuario eliminado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function toggleUsuarioEstado(id) {
  return { ok: false, message: 'Función no disponible' }
}

// ── CLIENTES ──────────────────────────────────────────────────
export async function getClientes() {
  try {
    const data = await request(`${API}/customers/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return { ok: true, data: list.map(mapCustomerFromBackend) }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

export async function createCliente(data) {
  try {
    if (!data.cedula || !data.nombre || !data.direccion || !data.telefono)
      return { ok: false, message: 'Faltan datos del cliente.' }

    const payload = mapCustomerToBackend(data)
    const res = await request(`${API}/customers/save`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapCustomerFromBackend(res.data || res) : { ...data, id: data.cedula, estado: true, fechaRegistro: new Date().toISOString().split('T')[0] }
    return { ok: true, data: mapped, message: 'Cliente creado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function updateCliente(id, data) {
  try {
    const payload = mapCustomerToBackend(data)
    payload.document_id = id
    const res = await request(`${API}/customers/update`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapCustomerFromBackend(res.data || res) : { ...data, id, cedula: id }
    return { ok: true, data: mapped, message: 'Cliente actualizado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function deleteCliente(id) {
  try {
    await request(`${API}/customers/delete/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return { ok: true, message: 'Cliente eliminado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

// ── PROVEEDORES ──────────────────────────────────────────────
export async function getProveedores() {
  try {
    const data = await request(`${API}/catalog/suppliers/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return { ok: true, data: list.map(mapSupplierFromBackend) }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

export async function createProveedor(data) {
  try {
    if (!data.nit || !data.nombre || !data.direccion || !data.telefono || !data.ciudad)
      return { ok: false, message: 'Faltan datos del proveedor.' }

    const payload = mapSupplierToBackend(data)
    const res = await request(`${API}/catalog/suppliers/save`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapSupplierFromBackend(res.data || res) : { ...data, id: data.nit }
    return { ok: true, data: mapped, message: 'Proveedor creado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function updateProveedor(id, data) {
  try {
    const payload = mapSupplierToBackend(data)
    payload.nit = id
    const res = await request(`${API}/catalog/suppliers/update`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    })
    const mapped = res ? mapSupplierFromBackend(res.data || res) : { ...data, id, nit: id }
    return { ok: true, data: mapped, message: 'Proveedor actualizado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

export async function deleteProveedor(id) {
  try {
    await request(`${API}/catalog/suppliers/delete/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    return { ok: true, message: 'Proveedor eliminado.' }
  } catch (err) {
    return { ok: false, message: err.message }
  }
}

// ── PRODUCTOS (CSV) ──────────────────────────────────────────
export async function cargarProductosCSV(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('token')
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    // Do NOT set Content-Type — browser sets it with boundary for multipart

    const res = await fetch(`${API}/catalog/products/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const body = await res.json().catch(() => null)

    if (!res.ok) {
      const msg = body?.message || body?.error || `Error ${res.status}`
      return { ok: false, message: msg }
    }

    const result = body?.data || body || {}
    const inserted = result.inserted || 0
    const updated = result.updated || 0
    const rejected = result.rejected || 0
    const rejectedRows = result.rejected_rows || []

    if (rejected > 0) {
      const errores = rejectedRows.map(r => typeof r === 'string' ? r : `Fila rechazada: ${JSON.stringify(r)}`)
      return { ok: false, errores, message: `${rejected} errores encontrados.` }
    }

    return {
      ok: true,
      data: { inserted, updated },
      message: `${inserted + updated} productos procesados exitosamente (${inserted} nuevos, ${updated} actualizados).`,
    }
  } catch (err) {
    return { ok: false, message: err.message || 'Error subiendo el archivo.' }
  }
}

// ── PRODUCTOS (LIST) ─────────────────────────────────────────
export async function getProductos() {
  try {
    const data = await request(`${API}/catalog/products/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return {
      ok: true,
      data: list.map(p => ({
        codigo: p.product_code,
        nombre: p.product_name,
        nitProveedor: p.nit_supplier,
        precioCompra: p.purchase_price,
        ivaCompra: p.purchase_vat,
        precioVenta: p.sale_price,
      })),
    }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

// ── REPORTES ──────────────────────────────────────────────────
export async function getReporteUsuarios() {
  try {
    const data = await request(`${API}/users/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return { ok: true, data: list.map(mapUserFromBackend) }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

export async function getReporteClientes() {
  try {
    const data = await request(`${API}/customers/list`, {
      headers: authHeaders(),
    })
    const list = Array.isArray(data) ? data : (data?.data || [])
    return { ok: true, data: list.map(mapCustomerFromBackend) }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

export async function getReporteVentasPorCliente() {
  try {
    const [salesRes, customersRes] = await Promise.all([
      request(`${API}/reports/sales-by-customer`, { headers: authHeaders() }),
      request(`${API}/customers/list`, { headers: authHeaders() }),
    ])

    const salesList = Array.isArray(salesRes) ? salesRes : (salesRes?.data || [])
    const customersList = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])

    // Build a lookup map for customer names
    const customerMap = {}
    customersList.forEach(c => {
      customerMap[c.document_id] = c.full_name
    })

    const rows = salesList.map(s => ({
      cedula: s.customer_id,
      nombre: customerMap[s.customer_id] || 'Desconocido',
      totalVentas: s.total_purchases || 0,
      cantidadVentas: s.sale_count || 0,
    }))

    const granTotal = rows.reduce((acc, r) => acc + r.totalVentas, 0)

    return { ok: true, data: rows, granTotal }
  } catch (err) {
    return { ok: false, data: [], granTotal: 0, message: err.message }
  }
}

// ── VENTAS RECIENTES (for dashboard) ─────────────────────────
export async function getVentasRecientes() {
  try {
    const [salesRes, customersRes] = await Promise.all([
      request(`${API}/sales/list`, { headers: authHeaders() }),
      request(`${API}/customers/list`, { headers: authHeaders() }),
    ])

    const salesList = Array.isArray(salesRes) ? salesRes : (salesRes?.data || [])
    const customersList = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])

    const customerMap = {}
    customersList.forEach(c => {
      customerMap[c.document_id] = c.full_name
    })

    const sales = salesList.map(s => ({
      codigoVenta: s.sale_code || s.id || '',
      cedulaCliente: s.customer_id || s.document_id || '',
      nombreCliente: customerMap[s.customer_id || s.document_id] || 'Cliente',
      totalConIva: s.total_with_vat || 0,
      fecha: s.created_at || '',
    }))

    // Sort by date descending
    sales.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

    return { ok: true, data: sales }
  } catch (err) {
    return { ok: false, data: [], message: err.message }
  }
}

// ── DASHBOARD STATS ───────────────────────────────────────────
export async function getDashboardStats() {
  try {
    const [usersRes, customersRes, suppliersRes, salesRes, productsRes] = await Promise.allSettled([
      request(`${API}/users/list`, { headers: authHeaders() }),
      request(`${API}/customers/list`, { headers: authHeaders() }),
      request(`${API}/catalog/suppliers/list`, { headers: authHeaders() }),
      request(`${API}/reports/sales-by-customer`, { headers: authHeaders() }),
      request(`${API}/catalog/products/list`, { headers: authHeaders() }),
    ])

    const extract = (res) => res.status === 'fulfilled'
      ? (Array.isArray(res.value) ? res.value : (res.value?.data || []))
      : []
    const users = extract(usersRes)
    const customers = extract(customersRes)
    const suppliers = extract(suppliersRes)
    const sales = extract(salesRes)
    const products = extract(productsRes)

    const totalVentas = sales.reduce((acc, s) => acc + (s.sale_count || 0), 0)
    const ingresosTotales = sales.reduce((acc, s) => acc + (s.total_purchases || 0), 0)

    return {
      ok: true,
      data: {
        totalUsuarios: users.length,
        usuariosActivos: users.filter(u => u.is_active).length,
        totalClientes: customers.length,
        clientesActivos: customers.length,
        totalProveedores: suppliers.length,
        totalProductos: products.length,
        totalVentas,
        ingresosTotales,
      },
    }
  } catch (err) {
    return {
      ok: false,
      data: {
        totalUsuarios: 0, usuariosActivos: 0,
        totalClientes: 0, clientesActivos: 0,
        totalProveedores: 0, totalProductos: 0,
        totalVentas: 0, ingresosTotales: 0,
      },
      message: err.message,
    }
  }
}
