// ============================================================
// productService.js
// Llamadas a la API de productos a través del API Gateway
// API: GET /api/catalog/products/:id
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
 * Busca un producto por código
 * @param {string} codigo
 * @returns {Promise<{ok: boolean, producto: object|null, message: string}>}
 */
export async function buscarProductoPorCodigo(codigo) {
  const codigoNorm = String(codigo).trim()
  if (!codigoNorm) {
    return { ok: false, producto: null, message: 'Ingrese un código de producto válido.' }
  }

  try {
    const res = await fetch(`/api/catalog/products/${codigoNorm}`, {
      headers: authHeaders(),
    })

    if (res.status === 404) {
      return {
        ok: false,
        producto: null,
        message: 'Código de producto no existe en el sistema.',
      }
    }

    const body = await res.json()

    if (!body.success) {
      return {
        ok: false,
        producto: null,
        message: body.error || 'Código de producto no existe en el sistema.',
      }
    }

    const p = body.data
    return {
      ok: true,
      producto: {
        codigo:        p.product_code,
        nombre:        p.product_name,
        nitProveedor:  p.nit_supplier,
        precioCompra:  p.purchase_price,
        ivaCompra:     p.purchase_vat,
        precioVenta:   p.sale_price,
      },
      message: 'Producto encontrado.',
    }
  } catch (err) {
    return {
      ok: false,
      producto: null,
      message: 'Error de conexión con el servidor.',
    }
  }
}
