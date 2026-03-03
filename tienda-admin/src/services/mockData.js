// ============================================================
// mockData.js — Admin Panel
// ============================================================

// ---- Admins ----
export const MOCK_ADMINS = [
  { cedula: 'admin01', nombre: 'Ricardo Camargo', correo: 'rcamargo@tienda.com', usuario: 'admininicial', password: 'admin123456', rol: 'ADMIN', estado: true },
]

// ---- Usuarios (cajeros + admins) ----
let _usuariosId = 10
export let MOCK_USUARIOS = [
  { id: 1, cedula: '1000000001', nombre: 'Juan Pérez',       correo: 'jperez@tienda.com',      usuario: 'jperez',      password: '1234', rol: 'CAJERO', estado: true,  fechaCreacion: '2025-01-15' },
  { id: 2, cedula: '1000000002', nombre: 'María Rodríguez',  correo: 'mrodriguez@tienda.com',   usuario: 'mrodriguez',  password: '1234', rol: 'CAJERO', estado: true,  fechaCreacion: '2025-02-10' },
  { id: 3, cedula: '1000000003', nombre: 'Carlos Gómez',     correo: 'cgomez@tienda.com',       usuario: 'cgomez',      password: '1234', rol: 'CAJERO', estado: false, fechaCreacion: '2025-03-01' },
  { id: 4, cedula: '1000000004', nombre: 'Laura Sánchez',    correo: 'lsanchez@tienda.com',     usuario: 'lsanchez',    password: '1234', rol: 'ADMIN',  estado: true,  fechaCreacion: '2024-11-20' },
]
export const nextUsuarioId = () => ++_usuariosId

// ---- Clientes ----
let _clientesId = 10
export let MOCK_CLIENTES = [
  { id: 1, cedula: '1023456789', nombre: 'María García López',    direccion: 'Calle 45 #23-10, Bogotá',         telefono: '3001234567', correo: 'mgarcia@email.com',   estado: true,  fechaRegistro: '2025-01-20' },
  { id: 2, cedula: '9876543210', nombre: 'Carlos Martínez Ruiz',  direccion: 'Carrera 7 #12-34, Medellín',       telefono: '3109876543', correo: 'cmartinez@email.com', estado: true,  fechaRegistro: '2025-02-05' },
  { id: 3, cedula: '5551234567', nombre: 'Ana Lucía Pérez',       direccion: 'Av. El Dorado #68B-45, Bogotá',   telefono: '3204567890', correo: 'aperez@email.com',    estado: true,  fechaRegistro: '2025-02-18' },
  { id: 4, cedula: '3210987654', nombre: 'Luis Fernando Torres',  direccion: 'Calle 100 #15-20, Cali',          telefono: '3157891234', correo: 'ltorres@email.com',   estado: false, fechaRegistro: '2025-03-10' },
  { id: 5, cedula: '7654321098', nombre: 'Sofía Ramírez',         direccion: 'Carrera 50 #22-08, Barranquilla', telefono: '3002345678', correo: 'sramirez@email.com',  estado: true,  fechaRegistro: '2025-03-22' },
]
export const nextClienteId = () => ++_clientesId

// ---- Proveedores ----
let _provId = 10
export let MOCK_PROVEEDORES = [
  { id: 1, nit: '1', nombre: 'FrutasFrescas S.A.S',     direccion: 'Zona Industrial Norte',       telefono: '6011234567', ciudad: 'Bogotá' },
  { id: 2, nit: '2', nombre: 'VerdurasPro Ltda',         direccion: 'Mercado Central Km 3',        telefono: '6024567890', ciudad: 'Medellín' },
  { id: 3, nit: '3', nombre: 'AgroSur Colombia',          direccion: 'Parque Industrial del Sur',   telefono: '6023456789', ciudad: 'Cali' },
  { id: 4, nit: '4', nombre: 'CampoVerde Exportaciones',  direccion: 'Carretera Principal #40',     telefono: '6054321098', ciudad: 'Manizales' },
  { id: 5, nit: '5', nombre: 'LácteosPremium S.A',        direccion: 'Zona Franca de Bogotá',       telefono: '6019876543', ciudad: 'Bogotá' },
]
export const nextProvId = () => ++_provId

// ---- Productos (del CSV del documento) ----
export let MOCK_PRODUCTOS = [
  { codigo: '1',  nombre: 'Melocotones',       nitProveedor: '1', precioCompra: 25505, ivaCompra: 19, precioVenta: 30351 },
  { codigo: '2',  nombre: 'Manzanas',          nitProveedor: '3', precioCompra: 18108, ivaCompra: 19, precioVenta: 21549 },
  { codigo: '3',  nombre: 'Plátanos',          nitProveedor: '4', precioCompra: 29681, ivaCompra: 19, precioVenta: 35320 },
  { codigo: '4',  nombre: 'Lechuga',           nitProveedor: '3', precioCompra: 29788, ivaCompra: 19, precioVenta: 35448 },
  { codigo: '5',  nombre: 'Tomates',           nitProveedor: '1', precioCompra: 12739, ivaCompra: 19, precioVenta: 15159 },
  { codigo: '6',  nombre: 'Calabaza',          nitProveedor: '1', precioCompra: 21315, ivaCompra: 19, precioVenta: 25365 },
  { codigo: '7',  nombre: 'Apio',              nitProveedor: '2', precioCompra: 19249, ivaCompra: 19, precioVenta: 22906 },
  { codigo: '8',  nombre: 'Pepino',            nitProveedor: '2', precioCompra: 10958, ivaCompra: 19, precioVenta: 13040 },
  { codigo: '9',  nombre: 'Champiñones',       nitProveedor: '2', precioCompra: 11046, ivaCompra: 19, precioVenta: 13145 },
  { codigo: '10', nombre: 'Leche',             nitProveedor: '5', precioCompra: 21150, ivaCompra: 19, precioVenta: 25169 },
  { codigo: '11', nombre: 'Queso',             nitProveedor: '5', precioCompra: 26571, ivaCompra: 19, precioVenta: 31619 },
  { codigo: '12', nombre: 'Huevos',            nitProveedor: '2', precioCompra: 12445, ivaCompra: 19, precioVenta: 14810 },
  { codigo: '13', nombre: 'Requesón',          nitProveedor: '1', precioCompra: 14329, ivaCompra: 19, precioVenta: 17052 },
  { codigo: '14', nombre: 'Crema agria',       nitProveedor: '1', precioCompra: 14856, ivaCompra: 19, precioVenta: 17679 },
  { codigo: '15', nombre: 'Yogur',             nitProveedor: '5', precioCompra: 14941, ivaCompra: 19, precioVenta: 17780 },
  { codigo: '16', nombre: 'Ternera',           nitProveedor: '5', precioCompra: 29335, ivaCompra: 19, precioVenta: 34909 },
  { codigo: '17', nombre: 'Salmón salvaje',    nitProveedor: '5', precioCompra: 11878, ivaCompra: 19, precioVenta: 14135 },
  { codigo: '18', nombre: 'Patas de cangrejo', nitProveedor: '1', precioCompra: 29951, ivaCompra: 19, precioVenta: 35642 },
]

// ---- Ventas (para reportes) ----
export const MOCK_VENTAS = [
  { codigoVenta: '00241', cedulaCliente: '1023456789', cedulaUsuario: '1000000001', totalVenta: 152000, totalIva: 28880, totalConIva: 180880, fecha: '2026-02-10' },
  { codigoVenta: '00242', cedulaCliente: '9876543210', cedulaUsuario: '1000000002', totalVenta: 65000,  totalIva: 12350, totalConIva: 77350,  fecha: '2026-02-14' },
  { codigoVenta: '00243', cedulaCliente: '1023456789', cedulaUsuario: '1000000001', totalVenta: 89000,  totalIva: 16910, totalConIva: 105910, fecha: '2026-02-20' },
  { codigoVenta: '00244', cedulaCliente: '5551234567', cedulaUsuario: '1000000002', totalVenta: 43000,  totalIva: 8170,  totalConIva: 51170,  fecha: '2026-02-25' },
  { codigoVenta: '00245', cedulaCliente: '3210987654', cedulaUsuario: '1000000001', totalVenta: 120000, totalIva: 22800, totalConIva: 142800, fecha: '2026-03-01' },
  { codigoVenta: '00246', cedulaCliente: '9876543210', cedulaUsuario: '1000000002', totalVenta: 77000,  totalIva: 14630, totalConIva: 91630,  fecha: '2026-03-02' },
]
