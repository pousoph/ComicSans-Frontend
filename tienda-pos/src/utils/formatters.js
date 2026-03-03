// ============================================================
// formatters.js — Utilidades de formato
// ============================================================

/**
 * Formatea un número como moneda colombiana
 * Ej: 30351 → "$30.351"
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formatea fecha ISO a "DD/MM/YYYY — HH:MM AM/PM"
 */
export function formatDateTime(isoString) {
  const date = isoString ? new Date(isoString) : new Date()
  const fecha = date.toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
  const hora = date.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
  return `${fecha} — ${hora}`
}

/**
 * Formatea fecha ISO a "DD/MM/YYYY"
 */
export function formatDate(isoString) {
  const date = isoString ? new Date(isoString) : new Date()
  return date.toLocaleDateString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  })
}

/**
 * Formatea hora ISO a "HH:MM AM/PM"
 */
export function formatTime(isoString) {
  const date = isoString ? new Date(isoString) : new Date()
  return date.toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })
}

/**
 * Formatea consecutivo a "#00247"
 */
export function formatConsecutivo(code) {
  return `#${String(code).padStart(5, '0')}`
}

/**
 * Obtiene iniciales del nombre (ej: "Juan Pérez" → "JP")
 */
export function getInitials(nombre = '') {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(w => w[0] || '')
    .join('')
    .toUpperCase()
}
