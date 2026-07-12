# Rifas HC

Aplicacion web para administrar rifas, publicar boletos disponibles y gestionar el proceso de compra, pago y sorteo.

## Que incluye

- Landing publica con informacion de la rifa activa.
- Panel de administracion con login.
- Creacion, edicion, activacion y eliminacion de rifas.
- Carga y eliminacion de imagenes de premios.
- Compra y administracion de boletos.
- Registro de ganadores y sorteo de rifas.
- Notificaciones por correo para apartados.

## Tecnologias

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4.
- UI: shadcn/ui, Base UI, Lucide React, Sonner.
- Backend: PHP.
- Base de datos: SQL configurada desde `backend/config/database.php` y esquema de referencia en `backend/database/schema.sql`.

## Estructura del proyecto

- `rifas/`: frontend de la aplicacion.
- `backend/`: API en PHP, configuracion y esquema de base de datos.
- `README.md`: guia principal del proyecto.

## Requisitos

- Node.js 18 o superior.
- npm.
- PHP 8+.
- Servidor web para ejecutar la API PHP.
- Motor de base de datos SQL compatible con la configuracion del backend.

## Instalacion del frontend

1. Entra a la carpeta del frontend:

```bash
cd rifas
```

2. Instala dependencias:

```bash
npm install
```

3. Ejecuta en modo desarrollo:

```bash
npm run dev
```

4. Compila para produccion:

```bash
npm run build
```

5. Previsualiza el build:

```bash
npm run preview
```

## Backend

El backend vive en `backend/` y expone endpoints PHP como:

- `getActiveRaffle.php`
- `getAllRaffles.php`
- `createRaffle.php`
- `updateRaffle.php`
- `removeRaffle.php`
- `login.php`
- `buyTickets.php`
- `getTicketsByRaffle.php`
- `startRaffle.php`
- `getRaffleWinner.php`

## Configuracion importante

### API del frontend

El frontend apunta actualmente a una API fija:

```ts
const API_URL = "https://bycesaroliva.com/api";
```

Ese valor esta en `rifas/src/services/api.ts`. Si vas a correr el proyecto en local, cambia esa URL por la de tu entorno.

### Base de datos

La conexion se configura en `backend/config/database.php`.

```php
$host = "";
$db = "";
$user = "";
$pass = "";
```

Completa esos valores con tus credenciales o adapta el archivo segun el motor de base de datos que uses.

### Acceso de administrador

Las credenciales y el token de admin se definen en `backend/config/auth.php`.

### Notificaciones

El correo destino y el remitente se configuran en `backend/config/notifications.php`.

## Flujo de uso

1. El usuario entra a la pagina publica y ve la rifa activa.
2. Puede revisar premios e informacion general.
3. El administrador inicia sesion desde `/Admin/Login`.
4. Desde el panel puede crear o editar rifas, marcar una rifa como activa, cargar imagenes de premios y administrar boletos.

## Rutas principales

- `/`: pagina publica.
- `/Admin/Login`: login de administrador.
- `/Admin`: panel de administracion.
- `/Admin/Create`: crear rifa.
- `/Admin/:IdRifa`: editar rifa.

## Notas

- El proyecto ya incluye archivos de ejemplo y recursos graficos dentro de `rifas/public/`.
- Si cambias la API o la base de datos, revisa tambien los endpoints PHP para mantener consistencia con el frontend.

