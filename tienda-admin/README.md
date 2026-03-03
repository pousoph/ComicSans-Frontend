# TiendaGenérica — Frontend Administrador

Panel de administración completo para gestionar usuarios, clientes, proveedores, productos y reportes.
**React 18 + Vite 5 + CSS Modules** — sin librerías UI externas. Diseño inspirado en Donezo Dashboard.

---

## 🚀 Cómo iniciar

```bash
npm install
npm run dev
# → http://localhost:3001
```

**Credenciales demo:**
| Usuario | Contraseña |
|---|---|
| `admininicial` | `admin123456` |

---

## 📁 Estructura del proyecto

```
src/
├── pages/
│   ├── Login.jsx           # Autenticación (split layout)
│   ├── Dashboard.jsx       # Panel principal con stats y gráfica
│   ├── Usuarios.jsx        # CRUD Usuarios
│   ├── Clientes.jsx        # CRUD Clientes
│   ├── Proveedores.jsx     # CRUD Proveedores
│   ├── Productos.jsx       # Carga masiva CSV
│   ├── Reportes.jsx        # 3 reportes con tabs
│   └── CrudPage.jsx        # Componente genérico CRUD reutilizable
│
├── components/
│   ├── layout/
│   │   └── AdminLayout.jsx  # Sidebar + Topbar (inspirado en Donezo)
│   └── ui/
│       └── index.jsx        # Btn, Input, Select, Badge, Avatar,
│                            # StatCard, Modal, Confirm, Toast,
│                            # SearchBar, EmptyState
│
├── services/
│   ├── mockData.js          # Datos de prueba
│   └── adminService.js      # Todas las APIs simuladas
│
├── context/
│   └── AuthContext.jsx      # Sesión admin en sessionStorage
│
├── hooks/
│   └── useCrud.js           # Hook genérico para cualquier CRUD
│
└── utils/
    └── formatters.js        # Moneda, fechas, iniciales, roles
```

---

## 🗺 Rutas del sistema

| Ruta | Página | Protegida |
|---|---|---|
| `/admin/login` | Login | No |
| `/admin` | Dashboard | ✅ |
| `/admin/usuarios` | CRUD Usuarios | ✅ |
| `/admin/clientes` | CRUD Clientes | ✅ |
| `/admin/proveedores` | CRUD Proveedores | ✅ |
| `/admin/productos` | Carga CSV | ✅ |
| `/admin/reportes` | Reportes | ✅ |

---

## 📋 Funcionalidades implementadas

### 🔐 Autenticación
- Login con animación shake en error
- Sesión persistida en `sessionStorage`
- Rutas protegidas (redirige a `/admin/login` si no hay sesión)

### 👤 Usuarios (CRUD completo)
- Tabla con búsqueda en tiempo real
- Modal crear/editar con validaciones
- Toggle Activo/Inactivo con un clic
- Confirmación antes de eliminar
- Rol: CAJERO o ADMIN (badge de color)

### 👥 Clientes (CRUD completo)
- Misma estructura que Usuarios
- Campos: cédula, nombre, dirección, teléfono, correo

### 🚚 Proveedores (CRUD completo)
- Campos: NIT, nombre, dirección, teléfono, ciudad
- El NIT es la clave de relación con productos

### 📦 Productos (carga masiva CSV)
- Drop zone con drag & drop
- Validación de estructura (6 columnas)
- Validación de existencia del proveedor por NIT
- Reemplaza todos los productos al cargar
- Tabla de productos actuales en tiempo real

### 📊 Reportes (3 tabs)
1. **Listado de Usuarios** — tabla completa con roles y estados
2. **Listado de Clientes** — tabla con estados y fechas
3. **Total ventas por cliente** — con barra de participación y gran total

---

## 🎨 Sistema de diseño

### Inspiración visual
Inspirado en el dashboard **Donezo** — sidebar blanco, topbar limpio, cards con borde izquierdo de color, tipografía **Sora** para títulos + **DM Sans** para cuerpo.

| Token | Valor |
|---|---|
| Primary | `#1a5c3a` |
| Accent | `#22c55e` |
| Font Títulos | Sora (800) |
| Font Cuerpo | DM Sans |
| Font Mono | DM Mono |

---

## 🔌 Pasar a APIs reales

Todos los servicios están en `src/services/adminService.js`.  
Cada función tiene un comentario indicando el endpoint real. Ejemplo:

```js
// GET /clientes/listar
export async function getClientes() {
  const res = await fetch('http://tu-backend/clientes/listar')
  const data = await res.json()
  return { ok: true, data }
}
```

---

## 🔗 Integración con el frontend POS (cajero)

Los dos frontends comparten:
- La misma base de clientes y productos
- El mismo formato de datos (cédulas, NITs, consecutivos)

Para producción ambos frontends pueden ser sirvidos por el mismo servidor Vite/build o de forma independiente.
