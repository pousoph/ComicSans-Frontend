// ============================================================
// saleService.js
// Simula guardar venta + detalleVentas
// API real: POST /ventas/agregar  + POST /detalleVentas/guardar
//
// Campos tabla ventas (según el documento):
//   codigoVenta (consecutivo), cedulaCliente, cedulaUsuario,
//   totalVenta, totalIva, totalConIva
//
// Campos tabla detalleVentas:
//   codigoProducto, cantidad, valorUnitario, valorTotal, codigoVenta
// ============================================================

import { MOCK_VENTAS, getNextConsecutivo } from './mockData.js'

const delay = (ms = 1000) => new Promise(res => setTimeout(res, ms))

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
  await delay(1100)

  const { cliente, cajero, productos, subtotal, totalIva, totalConIva } = ventaData

  // Validación mínima
  if (!cliente || !cajero || !productos || productos.length === 0) {
    return { ok: false, codigoVenta: null, message: 'Datos de venta incompletos.' }
  }

  const codigoVenta = getNextConsecutivo()

  // Registro en tabla ventas
  const venta = {
    codigoVenta,
    cedulaCliente:  cliente.cedula,
    cedulaUsuario:  cajero.cedula,
    totalVenta:     subtotal,
    totalIva,
    totalConIva,
    fecha:          new Date().toISOString(),
  }

  // Registro en tabla detalleVentas
  const detalle = productos.map(item => ({
    codigoVenta,
    codigoProducto: item.producto.codigo,
    cantidad:       item.cantidad,
    valorUnitario:  item.producto.precioVenta,
    valorTotal:     item.totalProducto,
  }))

  // Guardar en mock DB
  MOCK_VENTAS.push({ venta, detalle })

  return {
    ok: true,
    codigoVenta,
    venta,
    detalle,
    message: 'Venta registrada exitosamente.',
  }
}
