// ============================================================
// saleService.js
// Guarda venta + detalle a través del API Gateway
// API: POST /api/sales/save
//
// El gateway inyecta X-User-Id desde el JWT automáticamente
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
 * Guarda la venta y su detalle
 * @param {{
 *   cliente: object,
 *   cajero: object,
 *   productos: Array<{producto, cantidad, totalProducto}>,
 *   subtotal: number,
 *   totalIva: number,
 *   totalConIva: number
 * }} ventaData
 * @returns {Promise<{ok: boolean, codigoVenta: string, message: string}>}
 */
export async function guardarVenta(ventaData) {
  const { cliente, cajero, productos, subtotal, totalIva, totalConIva } = ventaData

  // Validación mínima
  if (!cliente || !cajero || !productos || productos.length === 0) {
    return { ok: false, codigoVenta: null, message: 'Datos de venta incompletos.' }
  }

  try {
    const res = await fetch('/api/sales/save', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        customer_id: cliente.cedula,
        details: productos.map(item => ({
          product_code: item.producto.codigo,
          product_name: item.producto.nombre,
          quantity:     item.cantidad,
          unit_price:   item.producto.precioVenta,
          vat_rate:     item.producto.ivaCompra,
        })),
      }),
    })

    const body = await res.json()

    if (!body.success) {
      return {
        ok: false,
        codigoVenta: null,
        message: body.error || 'No se pudo registrar la venta.',
      }
    }

    const sale = body.data
    return {
      ok: true,
      codigoVenta: sale.sale_code,
      venta: sale,
      detalle: sale.details || [],
      message: 'Venta registrada exitosamente.',
    }
  } catch (err) {
    return {
      ok: false,
      codigoVenta: null,
      message: 'Error de conexión con el servidor.',
    }
  }
}
