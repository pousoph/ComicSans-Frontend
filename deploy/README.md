# Despliegue — ComicSans Frontend (Docker + Nginx)

Dos SPAs (`tienda-pos` y `tienda-admin`) empaquetadas cada una en su imagen
`nginx:alpine` con el `dist/` horneado. Un **edge nginx** actúa como
balanceador y reverse proxy único expuesto en `:80`.

---

## Arquitectura

```
Internet :80
      │
      ▼
 ┌─────────┐
 │  edge   │  nginx router (único con puerto publicado)
 └────┬────┘
      │
  red: comic-sans-backend_tienda-net  (external)
      │
      ├──► tienda-pos     ×N   (SPA en /)
      ├──► tienda-admin   ×N   (SPA en /admin/)
      └──► api-gateway    ×N   (backend, /api/ → proxy)
```

El edge enruta:
- `/api/*`    → `api-gateway` (backend compose)
- `/admin/*`  → `tienda-admin`
- `/*`        → `tienda-pos` (catch-all)

El balanceo entre réplicas es DNS round-robin de Docker.

---

## Pre-requisito

La red `comic-sans-backend_tienda-net` debe existir. Se crea al levantar el
backend:

```bash
cd ../comic-sans-backend
docker compose up -d --build
```

---

## Levantar el frontend

```bash
cd ComicSans-Frontend
docker compose up -d --build

curl http://localhost/healthz
curl -I http://localhost/            # POS
curl -I http://localhost/admin/      # Admin
curl -I http://localhost/api/health  # Proxy al gateway
```

---

## Escalar réplicas

```bash
docker compose up -d --scale tienda-pos=3 --scale tienda-admin=2
```

## Reconstruir tras cambios de código

```bash
docker compose up -d --build tienda-pos
```

---

## Bajar

```bash
docker compose down
```

(La red `tienda-net` la administra el backend; `down` aquí no la borra.)
