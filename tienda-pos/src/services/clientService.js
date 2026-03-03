// ============================================================
// clientService.js
// Simula las llamadas a la API de clientes
// En producción: reemplazar fetch mock por axios/fetch real
// API real: GET /clientes/listar, POST /clientes/agregar
// ============================================================

import { MOCK_CLIENTES } from './mockData.js'

const delay = (ms = 600) => new Promise(res => setTimeout(res, ms))

// Estado mutable del mock (permite agregar clientes en la sesión)
let clientesDB = [...MOCK_CLIENTES]

/**
 * Busca un cliente por cédula
 * @param {string} cedula
 * @returns {Promise<{ok: boolean, cliente: object|null, message: string}>}
 */
export async function buscarClientePorCedula(cedula) {
  await delay(700)

  const cedulaNorm = String(cedula).trim()
  if (!cedulaNorm) {
    return { ok: false, cliente: null, message: 'Ingrese una cédula válida.' }
  }

  const cliente = clientesDB.find(c => c.cedula === cedulaNorm)

  if (cliente) {
    return { ok: true, cliente, message: 'Cliente encontrado.' }
  }

  return {
    ok: false,
    cliente: null,
    message: 'No existe un cliente registrado con esta cédula.',
  }
}

/**
 * Registra un nuevo cliente
 * @param {{cedula, nombre, direccion, telefono, correo}} data
 * @returns {Promise<{ok: boolean, cliente: object|null, message: string}>}
 */
export async function registrarCliente(data) {
  await delay(900)

  const { cedula, nombre, direccion, telefono, correo } = data

  // Validaciones básicas (SP2-QA-1, SP2-QA-2 del documento)
  if (!cedula || !nombre || !direccion || !telefono || !correo) {
    return { ok: false, cliente: null, message: 'Faltan datos del cliente.' }
  }

  // Verificar si ya existe (SP2-QA-3)
  const existe = clientesDB.find(c => c.cedula === String(cedula).trim())
  if (existe) {
    return { ok: false, cliente: null, message: 'Ya existe un cliente con esta cédula.' }
  }

  const nuevoCliente = {
    cedula: String(cedula).trim(),
    nombre: String(nombre).trim(),
    direccion: String(direccion).trim(),
    telefono: String(telefono).trim(),
    correo: String(correo).trim(),
  }

  // Guardar en mock DB
  clientesDB.push(nuevoCliente)

  return { ok: true, cliente: nuevoCliente, message: 'Cliente registrado exitosamente.' }
}
