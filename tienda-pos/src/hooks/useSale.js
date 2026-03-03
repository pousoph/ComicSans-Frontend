// ============================================================
// useSale.js
// Hook principal que encapsula toda la lógica de una venta:
//  - Estado de las 3 filas de productos
//  - Cálculos según el documento:
//      subtotal = Σ (cantidad × precioVenta)
//      IVA      = Σ (cantidad × precioVenta × ivaCompra/100 / (1 + ivaCompra/100))
//                 [extraemos el IVA ya incluido en precioVenta]
//      totalConIva = subtotal  [precioVenta ya incluye IVA]
//
// Nota del documento: precio_venta ya tiene IVA incluido.
// Para el desglose se extrae: valorSinIva = precioVenta / (1 + iva/100)
// IVA por producto = precioVenta - valorSinIva
// ============================================================

import { useState, useCallback, useMemo } from 'react'

const MAX_PRODUCTOS = 3

const emptyRow = () => ({
  codigo:        '',
  producto:      null,   // objeto producto del catálogo
  cantidad:      '',
  status:        'empty', // empty | searching | valid | invalid | complete
  errorMsg:      '',
  totalProducto: 0,
})

export function useSale() {
  const [filas, setFilas] = useState([emptyRow(), emptyRow(), emptyRow()])

  // ---- Helpers internos ----

  const calcTotalProducto = (producto, cantidad) => {
    if (!producto || !cantidad || Number(cantidad) <= 0) return 0
    return producto.precioVenta * Number(cantidad)
  }

  const updateFila = useCallback((index, patch) => {
    setFilas(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f))
  }, [])

  // ---- Acciones ----

  const setCodigoFila = useCallback((index, codigo) => {
    updateFila(index, {
      codigo,
      producto:      null,
      status:        'empty',
      errorMsg:      '',
      totalProducto: 0,
    })
  }, [updateFila])

  const setProductoEncontrado = useCallback((index, producto) => {
    setFilas(prev => prev.map((f, i) => {
      if (i !== index) return f
      const total = calcTotalProducto(producto, f.cantidad)
      return {
        ...f,
        producto,
        status:        f.cantidad && Number(f.cantidad) > 0 ? 'complete' : 'valid',
        errorMsg:      '',
        totalProducto: total,
      }
    }))
  }, [])

  const setProductoNoEncontrado = useCallback((index, errorMsg) => {
    updateFila(index, {
      producto:      null,
      status:        'invalid',
      errorMsg,
      totalProducto: 0,
    })
  }, [updateFila])

  const setSearchingFila = useCallback((index) => {
    updateFila(index, { status: 'searching', errorMsg: '', producto: null })
  }, [updateFila])

  const setCantidadFila = useCallback((index, cantidad) => {
    setFilas(prev => prev.map((f, i) => {
      if (i !== index) return f
      const cantNum = Number(cantidad)
      if (!f.producto) return { ...f, cantidad }

      if (cantidad === '' || cantNum <= 0) {
        return { ...f, cantidad, status: 'valid', totalProducto: 0 }
      }
      return {
        ...f,
        cantidad,
        status:        'complete',
        totalProducto: calcTotalProducto(f.producto, cantidad),
      }
    }))
  }, [])

  const resetFila = useCallback((index) => {
    setFilas(prev => prev.map((f, i) => i === index ? emptyRow() : f))
  }, [])

  const resetSale = useCallback(() => {
    setFilas([emptyRow(), emptyRow(), emptyRow()])
  }, [])

  // ---- Cálculos de totales ----
  const totales = useMemo(() => {
    const filasCompletas = filas.filter(
      f => f.status === 'complete' && f.producto && f.cantidad > 0
    )

    // subtotal = suma de (cantidad × precioVenta) — el precioVenta ya tiene IVA
    const totalConIva = filasCompletas.reduce((acc, f) => acc + f.totalProducto, 0)

    // Extraemos el IVA incluido en precio_venta
    // valorSinIva = precioVenta / (1 + iva/100)
    // iva_monto = totalProducto - (cantidad × valorSinIva)
    const totalIva = filasCompletas.reduce((acc, f) => {
      const ivaRate = f.producto.ivaCompra / 100
      const precioSinIva = f.producto.precioVenta / (1 + ivaRate)
      const ivaMonto = (f.producto.precioVenta - precioSinIva) * Number(f.cantidad)
      return acc + ivaMonto
    }, 0)

    const subtotal = totalConIva - totalIva

    return {
      subtotal:    Math.round(subtotal),
      totalIva:    Math.round(totalIva),
      totalConIva: Math.round(totalConIva),
    }
  }, [filas])

  // ---- Derivados ----
  const filasConProducto = filas.filter(
    f => f.status === 'complete' && f.producto
  )

  const isFilaHabilitada = (index) => {
    if (index === 0) return true
    return filas[index - 1].status === 'complete'
  }

  const puedeConfirmar =
    filasConProducto.length > 0 && totales.totalConIva > 0

  return {
    filas,
    totales,
    filasConProducto,
    puedeConfirmar,
    isFilaHabilitada,
    // acciones
    setCodigoFila,
    setProductoEncontrado,
    setProductoNoEncontrado,
    setSearchingFila,
    setCantidadFila,
    resetFila,
    resetSale,
  }
}
