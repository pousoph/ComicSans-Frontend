# TiendaGenérica — Frontend POS (Cajero)

Frontend del módulo de **Punto de Venta** para el cajero de TiendaGenérica.
Desarrollado con **React + Vite**, sin librerías de UI externas — diseño propio con CSS Modules.

---

## Cómo iniciar

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
http://localhost:3000
```

---

## Estructura del proyecto

```
src/
├── pages/
│   ├── Login.jsx           # Autenticación del cajero
│   ├── POS.jsx             # Pantalla principal de ventas
│   └── SaleReceipt.jsx     # Comprobante de venta
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx      # Botón con 4 variantes + loading
│   │   ├── Input.jsx       # Input con íconos y estados de error
│   │   └── StatusBadge.jsx # Badge de estado (success/error/loading)
│   │
│   ├── layout/
│   │   ├── Navbar.jsx      # Barra de navegación fija
│   │   └── PageLayout.jsx  # Wrapper con Navbar
│   │
│   └── pos/
│       ├── ClientSearch.jsx       # Búsqueda y verificación de cliente
│       ├── ClientRegisterForm.jsx # Registro inline de cliente nuevo
│       ├── ProductRow.jsx         # Fila de producto en tabla de venta
│       ├── TotalsPanel.jsx        # Panel derecho con resumen
│       └── ConfirmModal.jsx       # Modal de confirmación
│
├── services/
│   ├── mockData.js         # Datos de prueba (productos, clientes, usuarios)
│   ├── authService.js      # Login/logout
│   ├── clientService.js    # Buscar y registrar clientes
│   ├── productService.js   # Buscar productos por código
│   └── saleService.js      # Guardar venta + detalleVentas
│
├── context/
│   └── AuthContext.jsx     # Estado global de autenticación
│
├── hooks/
│   └── useSale.js          # Lógica y cálculos de una venta
│
└── utils/
    └── formatters.js       # Moneda, fechas, consecutivos
```

---

## Pasar de mocks a APIs reales

Cada service tiene comentarios que indican el endpoint real.  
Solo reemplazar el cuerpo de cada función:

**`authService.js`**
```js
// Reemplazar por:
const res = await fetch('http://tu-backend/usuarios/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ usuario, password })
})
```

**`clientService.js`**
```js
// buscarClientePorCedula → GET /clientes/listar?cedula=XXXX
// registrarCliente       → POST /clientes/agregar
```

**`productService.js`**
```js
// buscarProductoPorCodigo → GET /productos/listar?codigo=XXXX
```

**`saleService.js`**
```js
// guardarVenta → POST /ventas/agregar  +  POST /detalleVentas/guardar
```

---
## 🎨 Sistema de diseño

| Token | Valor |
|---|---|
| Color primario | `#0F4C35` |
| Color acción | `#1A6B4A`  |
| Acento | `#22C55E` |
| Font display | Fraunces (serif) |
| Font UI | Plus Jakarta Sans |
| Font monospace | JetBrains Mono |

---

## Tecnologías

- **React 18** con hooks
- **React Router v6** con rutas protegidas
- **Vite 5** como bundler
- **CSS Modules** para estilos scoped (sin Tailwind, sin Bootstrap)
- **Google Fonts** (Fraunces, Plus Jakarta Sans, JetBrains Mono)

---

## Notas importantes

1. **El cajero debe estar autenticado** para acceder a `/pos`. Su cédula (`user.cedula`) se envía al guardar la venta como `cedulaUsuario` en la tabla `ventas`.
2. **Máximo 3 productos por venta** — las filas 2 y 3 se habilitan secuencialmente.
3. **Registro inline de cliente** — si el cliente no existe, el cajero puede registrarlo sin salir del flujo de venta.
4. La sesión persiste en `sessionStorage` durante la sesión del navegador.
