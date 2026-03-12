// ============================================================
// clientService.js
// Llamadas a la API de clientes a través del API Gateway
// API: GET /api/customers/:id, POST /api/customers/save
// ============================================================

/**
 * Construye headers con Authorization Bearer
 * @returns {object}
 */
function authHeaders() {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

/**
 * Busca un cliente por cédula
 * @param {string} cedula
 * @returns {Promise<{ok: boolean, cliente: object|null, message: string}>}
 */
export async function buscarClientePorCedula(cedula) {
  const cedulaNorm = String(cedula).trim()
  if (!cedulaNorm) {
    return { ok: false, cliente: null, message: 'Ingrese una cédula válida.' }
  }

  try {
    const res = await fetch(`/api/customers/${cedulaNorm}`, {
      headers: authHeaders(),
    })

    // 404 significa que el cliente no existe
    if (res.status === 404) {
      return {
        ok: false,
        cliente: null,
        message: 'No existe un cliente registrado con esta cédula.',
      }
    }

    const body = await res.json()

    if (!body.success) {
      return {
        ok: false,
        cliente: null,
        message: body.error || 'No existe un cliente registrado con esta cédula.',
      }
    }

    const c = body.data
    return {
      ok: true,
      cliente: {
        cedula:    c.document_id,
        nombre:    c.full_name,
        direccion: c.address,
        telefono:  c.phone,
        correo:    c.email,
      },
      message: 'Cliente encontrado.',
    }
  } catch (err) {
    return {
      ok: false,
      cliente: null,
      message: 'Error de conexión con el servidor.',
    }
  }
}

/**
 * Registra un nuevo cliente
 * @param {{cedula, nombre, direccion, telefono, correo}} data
 * @returns {Promise<{ok: boolean, cliente: object|null, message: string}>}
 */
export async function registrarCliente(data) {
  const { cedula, nombre, direccion, telefono, correo } = data

  // Validaciones básicas (SP2-QA-1, SP2-QA-2 del documento)
  if (!cedula || !nombre || !direccion || !telefono || !correo) {
    return { ok: false, cliente: null, message: 'Faltan datos del cliente.' }
  }

  try {
    const res = await fetch('/api/customers/save', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        document_id: String(cedula).trim(),
        full_name:   String(nombre).trim(),
        address:     String(direccion).trim(),
        phone:       String(telefono).trim(),
        email:       String(correo).trim(),
      }),
    })

    const body = await res.json()

    if (!body.success) {
      return {
        ok: false,
        cliente: null,
        message: body.error || 'No se pudo registrar el cliente.',
      }
    }

    const c = body.data
    const nuevoCliente = {
      cedula:    c.document_id,
      nombre:    c.full_name,
      direccion: c.address,
      telefono:  c.phone,
      correo:    c.email,
    }

    return { ok: true, cliente: nuevoCliente, message: 'Cliente registrado exitosamente.' }
  } catch (err) {
    return {
      ok: false,
      cliente: null,
      message: 'Error de conexión con el servidor.',
    }
  }
}
