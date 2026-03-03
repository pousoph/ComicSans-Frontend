// ============================================================
// MOCK DATA — basado en los datos reales del documento del proyecto
// Tienda Genérica Virtual
// ============================================================

// --- Usuarios (cajeros) ---
export const MOCK_USUARIOS = [
  {
    cedula: '1000000001',
    nombre: 'Juan Pérez',
    correo: 'juan.perez@tienda.com',
    usuario: 'jperez',
    password: '1234',
  },
  {
    cedula: '1000000002',
    nombre: 'María Rodríguez',
    correo: 'maria.rodriguez@tienda.com',
    usuario: 'mrodriguez',
    password: '1234',
  },
  {
    cedula: 'admininicial',
    nombre: 'Administrador',
    correo: 'admin@tienda.com',
    usuario: 'admininicial',
    password: 'admin123456',
  },
]

// --- Clientes ---
export const MOCK_CLIENTES = [
  {
    cedula: '1023456789',
    nombre: 'María García López',
    direccion: 'Calle 45 #23-10, Bogotá',
    telefono: '3001234567',
    correo: 'maria.garcia@email.com',
  },
  {
    cedula: '9876543210',
    nombre: 'Carlos Martínez Ruiz',
    direccion: 'Carrera 7 #12-34, Medellín',
    telefono: '3109876543',
    correo: 'carlos.martinez@email.com',
  },
  {
    cedula: '5551234567',
    nombre: 'Ana Lucía Pérez',
    direccion: 'Av. El Dorado #68B-45, Bogotá',
    telefono: '3204567890',
    correo: 'ana.perez@email.com',
  },
  {
    cedula: '3210987654',
    nombre: 'Luis Fernando Torres',
    direccion: 'Calle 100 #15-20, Cali',
    telefono: '3157891234',
    correo: 'luis.torres@email.com',
  },
]

// --- Productos (extraídos exactamente del documento del proyecto) ---
// Estructura: codigo, nombre, nitProveedor, precioCompra, ivaCompra, precioVenta
export const MOCK_PRODUCTOS = [
  { codigo: '1',  nombre: 'Melocotones',      nitProveedor: 1, precioCompra: 25505, ivaCompra: 19, precioVenta: 30351 },
  { codigo: '2',  nombre: 'Manzanas',         nitProveedor: 3, precioCompra: 18108, ivaCompra: 19, precioVenta: 21549 },
  { codigo: '3',  nombre: 'Plátanos',         nitProveedor: 4, precioCompra: 29681, ivaCompra: 19, precioVenta: 35320 },
  { codigo: '4',  nombre: 'Lechuga',          nitProveedor: 3, precioCompra: 29788, ivaCompra: 19, precioVenta: 35448 },
  { codigo: '5',  nombre: 'Tomates',          nitProveedor: 1, precioCompra: 12739, ivaCompra: 19, precioVenta: 15159 },
  { codigo: '6',  nombre: 'Calabaza',         nitProveedor: 1, precioCompra: 21315, ivaCompra: 19, precioVenta: 25365 },
  { codigo: '7',  nombre: 'Apio',             nitProveedor: 2, precioCompra: 19249, ivaCompra: 19, precioVenta: 22906 },
  { codigo: '8',  nombre: 'Pepino',           nitProveedor: 2, precioCompra: 10958, ivaCompra: 19, precioVenta: 13040 },
  { codigo: '9',  nombre: 'Champiñones',      nitProveedor: 2, precioCompra: 11046, ivaCompra: 19, precioVenta: 13145 },
  { codigo: '10', nombre: 'Leche',            nitProveedor: 5, precioCompra: 21150, ivaCompra: 19, precioVenta: 25169 },
  { codigo: '11', nombre: 'Queso',            nitProveedor: 5, precioCompra: 26571, ivaCompra: 19, precioVenta: 31619 },
  { codigo: '12', nombre: 'Huevos',           nitProveedor: 2, precioCompra: 12445, ivaCompra: 19, precioVenta: 14810 },
  { codigo: '13', nombre: 'Requesón',         nitProveedor: 1, precioCompra: 14329, ivaCompra: 19, precioVenta: 17052 },
  { codigo: '14', nombre: 'Crema agria',      nitProveedor: 1, precioCompra: 14856, ivaCompra: 19, precioVenta: 17679 },
  { codigo: '15', nombre: 'Yogur',            nitProveedor: 5, precioCompra: 14941, ivaCompra: 19, precioVenta: 17780 },
  { codigo: '16', nombre: 'Ternera',          nitProveedor: 5, precioCompra: 29335, ivaCompra: 19, precioVenta: 34909 },
  { codigo: '17', nombre: 'Salmón salvaje',   nitProveedor: 5, precioCompra: 11878, ivaCompra: 19, precioVenta: 14135 },
  { codigo: '18', nombre: 'Patas de cangrejo',nitProveedor: 1, precioCompra: 29951, ivaCompra: 19, precioVenta: 35642 },
]

// Consecutivo simulado (en producción viene del backend)
let _consecutivo = 247
export const getNextConsecutivo = () => {
  _consecutivo++
  return String(_consecutivo).padStart(5, '0')
}

// Ventas guardadas en memoria (mock de BD)
export const MOCK_VENTAS = []
