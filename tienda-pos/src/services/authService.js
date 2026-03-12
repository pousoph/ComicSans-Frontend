// ============================================================
// authService.js
// Autenticación del cajero contra el API Gateway
// API: POST /api/auth/login
// ============================================================

/**
 * Decodifica el payload de un JWT (sin verificar firma)
 * @param {string} token
 * @returns {object}
 */
function decodeJWT(token) {
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload))
}

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
 * Autentica al cajero
 * @param {string} usuario
 * @param {string} password
 * @returns {Promise<{ok: boolean, user: object|null, message: string}>}
 */
export async function login(usuario, password) {
  if (!usuario || !password) {
    return { ok: false, user: null, message: 'Usuario y contraseña son requeridos.' }
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usuario.trim(), password }),
    })

    const body = await res.json()

    if (!body.success) {
      // SP1-QA-2: "usuario o contraseña errados, intente de nuevo"
      return {
        ok: false,
        user: null,
        message: body.error || 'Usuario o contraseña incorrectos. Intente de nuevo.',
      }
    }

    const token = body.data.token
    localStorage.setItem('token', token)

    // Decodificar JWT para obtener user_id y username
    const { user_id, username } = decodeJWT(token)

    // Obtener datos completos del usuario
    const userRes = await fetch(`/api/users/${user_id}`, {
      headers: authHeaders(),
    })

    const userBody = await userRes.json()

    if (!userBody.success) {
      return {
        ok: false,
        user: null,
        message: userBody.error || 'No se pudo obtener los datos del usuario.',
      }
    }

    const u = userBody.data
    return {
      ok: true,
      user: {
        cedula:  u.cedula,
        nombre:  u.full_name,
        correo:  u.email,
        usuario: u.username,
      },
      message: 'Ingreso exitoso.',
    }
  } catch (err) {
    return {
      ok: false,
      user: null,
      message: 'Error de conexión con el servidor.',
    }
  }
}

export function logout() {
  localStorage.removeItem('token')
  return Promise.resolve({ ok: true })
}
