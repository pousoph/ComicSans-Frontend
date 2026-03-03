// ============================================================
// authService.js
// Simula autenticación del cajero
// API real: POST /usuarios/login (no especificado en el doc,
//           se infiere de HU-001 / SP1-QA-1)
// ============================================================

import { MOCK_USUARIOS } from './mockData.js'

const delay = (ms = 800) => new Promise(res => setTimeout(res, ms))

/**
 * Autentica al cajero
 * @param {string} usuario
 * @param {string} password
 * @returns {Promise<{ok: boolean, user: object|null, message: string}>}
 */
export async function login(usuario, password) {
  await delay(900)

  if (!usuario || !password) {
    return { ok: false, user: null, message: 'Usuario y contraseña son requeridos.' }
  }

  const user = MOCK_USUARIOS.find(
    u => u.usuario === usuario.trim() && u.password === password
  )

  if (user) {
    return {
      ok: true,
      user: {
        cedula:  user.cedula,
        nombre:  user.nombre,
        correo:  user.correo,
        usuario: user.usuario,
      },
      message: 'Ingreso exitoso.',
    }
  }

  // SP1-QA-2: "usuario o contraseña errados, intente de nuevo"
  return {
    ok: false,
    user: null,
    message: 'Usuario o contraseña incorrectos. Intente de nuevo.',
  }
}

export function logout() {
  return Promise.resolve({ ok: true })
}
