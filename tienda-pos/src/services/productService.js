// ============================================================
// productService.js
// Simula las llamadas a la API de productos
// API real: GET /productos/listar
// ============================================================

import { MOCK_PRODUCTOS } from './mockData.js'

const delay = (ms = 500) => new Promise(res => setTimeout(res, ms))

/**
 * Busca un producto por código
 * @param {string} codigo
 * @returns {Promise<{ok: boolean, producto: object|null, message: string}>}
 */
export async function buscarProductoPorCodigo(codigo) {
  await delay(600)

  const codigoNorm = String(codigo).trim()
  if (!codigoNorm) {
    return { ok: false, producto: null, message: 'Ingrese un código de producto válido.' }
  }

  const producto = MOCK_PRODUCTOS.find(p => p.codigo === codigoNorm)

  if (producto) {
    return { ok: true, producto, message: 'Producto encontrado.' }
  }

  return {
    ok: false,
    producto: null,
    message: 'Código de producto no existe en el sistema.',
  }
}
