# NÖMAD — Aplicación web en React

Agencia ficticia de expediciones de aventura por Colombia, Brasil y Venezuela.
Proyecto final del curso, hecho con **React 19 + Vite**. No usa backend: la información se guarda en el
navegador con `localStorage` y `sessionStorage`. El clima de los destinos viene de la API pública
[Open-Meteo](https://open-meteo.com/).

## Ejecutar en tu equipo

Abre una terminal **dentro de la carpeta que contiene `package.json`** y escribe:

```bash
npm install
npm run dev      # abre http://localhost:5173
```

| Comando | Para qué sirve |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm test` | Pruebas automáticas de los módulos (46 pruebas, no necesita instalar nada más) |
| `npm run build` | Versión final optimizada en la carpeta `dist/` |
| `npm run preview` | Abre la versión de `dist/` para revisarla antes de publicar |

Requiere Node.js 18 o superior. No abras `index.html` con Live Server: es un proyecto de Vite.

## Usuarios de prueba

| Rol | Usuario | Contraseña | Puede entrar a |
|---|---|---|---|
| Administrador | `admin` | `Admin123` | Todo, incluido el panel de administración (`#/admin`) |
| Usuario | `viajero` | `Viajero123` | Mi cuenta (`#/mi-cuenta`) y reservas |
| Usuario | `laura` | `Laura123` | Mi cuenta (`#/mi-cuenta`) y reservas |

Están definidos en `src/data/usuarios.js`. La página de login también los muestra con un botón "usar".

## Qué incluye (actividades de la entrega)

| Actividad | Dónde se ve | Archivos principales |
|---|---|---|
| 1. Estructura y navegación | 12 vistas con router por hash, ruta dinámica `#/destinos/:id` y página 404 | `src/App.jsx`, `src/router.jsx`, carpetas de `src/` |
| 2. Diseño y animaciones | Diseño adaptable (celular, tablet, escritorio), transición entre vistas, efectos en tarjetas, carrusel en Inicio y en el detalle de cada destino | `src/styles.css`, `components/ui/Carrusel.jsx` |
| 3. Componentes interactivos | **Modal** (reservar, confirmar), **Tabs** (Mi cuenta y panel), **Acordeón** (preguntas frecuentes y mensajes), **Dropdown** (menú de cuenta, ordenar paquetes, acciones de reservas), **Toast** (avisos) | `src/components/ui/` |
| 4. Gestión de archivos | Foto de perfil y fotos de destinos: elegir o arrastrar, validar formato (JPG, PNG, WEBP), peso (máx. 5 MB) y medidas (mín. 200 px), vista previa y guardado | `components/ui/CargaImagen.jsx`, `helpers/archivos.js` |
| 5. Autenticación | Login con usuarios predefinidos, opción "Recordarme" y cierre de sesión | `views/Login.jsx`, `context/AuthContext.jsx` |
| 6. Control de acceso | Roles administrador y usuario; las vistas privadas mandan al login y el rol sin permiso ve la página 403 | `components/RutaProtegida.jsx`, `helpers/auth.js` |
| 7. Gestión de estados | Sesión, reservas, mensajes, fotos y foto de perfil en `localStorage`; filtros de Destinos, pestaña activa y sesión sin "Recordarme" en `sessionStorage` | `services/almacen.js`, `hooks/useAlmacenamiento.js` |
| 8. Pruebas | `npm test` prueba autenticación, permisos, almacenamiento, validación de imágenes, reservas, formulario de contacto y la conversión del JSON de la API | carpeta `tests/` |
| 9. Despliegue | Configurado para Vercel (ver abajo) | `vercel.json` |

### Recorrido para la demostración

1. Entra a `#/admin` sin sesión: te manda al login y, después de ingresar como `admin`, vuelve al panel.
2. En el panel, pestaña **Galería**: elige "Valle de Cocora" y sube una foto. Prueba también con un GIF o un archivo de más de 5 MB para ver la validación.
3. Ve a **Destinos**: la tarjeta de Valle de Cocora ya usa la foto. En su detalle aparece en el carrusel.
4. Cierra sesión desde el menú de la cuenta e ingresa como `viajero`.
5. En **Paquetes**, ordénalos con el menú "Ordenar" y reserva uno: el modal valida la fecha y los viajeros.
6. En **Mi cuenta** cambia la foto de perfil y revisa la reserva en la pestaña **Mis reservas**.
7. Intenta entrar a `#/admin` como `viajero`: aparece la página 403.
8. Vuelve a ingresar como `admin` y confirma la reserva desde la pestaña **Reservas**; el usuario verá el cambio.

## Publicar: GitHub y Vercel

**1. Subir el código a GitHub** (crea antes un repositorio vacío en github.com):

```bash
git init
git add .
git commit -m "NÖMAD: entrega final"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/nomad-react.git
git push -u origin main
```

**2. Publicar en Vercel:**

1. Entra a [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2. Pulsa **Add New → Project** e importa el repositorio `nomad-react`.
3. Vercel detecta Vite solo (también está indicado en `vercel.json`): comando `npm run build`, carpeta `dist`.
4. Pulsa **Deploy**. Al terminar te da el enlace público, por ejemplo `https://nomad-react.vercel.app`.

Cada vez que hagas `git push`, Vercel publica la nueva versión. Como el router usa `#/ruta`, no hace
falta configurar redirecciones.

## Estructura

```
src/
  main.jsx               punto de entrada: AuthProvider + ToastProvider + App
  App.jsx                tabla de rutas y protección por rol
  router.jsx             router por hash: useRuta, Link y navegar
  styles.css             estilos de todo el sitio
  context/               AuthContext (sesión y roles) y ToastContext (avisos)
  data/                  catálogo de destinos y paquetes, usuarios, preguntas frecuentes
  services/              almacen.js (localStorage/sessionStorage) y openMeteo.js (API del clima)
  hooks/                 useAlmacenamiento, useColeccion, useClima, useTitulo, useMenosMovimiento
  helpers/               funciones puras: auth, archivos, reservas, validaciones, imágenes, formatos
  components/
    ui/                  Modal, ModalConfirmar, Tabs, Acordeon, Dropdown, Toast, Carrusel, CargaImagen
    admin/               pestañas del panel: Resumen, Galería, Reservas, Mensajes
    cuenta/              pestañas de Mi cuenta: Perfil y Mis reservas
    ...                  Navbar, Footer, tarjetas, RutaProtegida, ModalReserva, clima
  views/                 Inicio, Destinos, DetalleDestino, Paquetes, Clima, Nosotros, Contacto,
                         Login, MiCuenta, Admin, AccesoDenegado (403), NotFound (404)
tests/                   pruebas con el ejecutor de pruebas de Node (node --test)
public/                  imágenes y favicon
```

## Notas

- Es un proyecto académico sin servidor: las contraseñas están en el código y se validan en el
  navegador. La sesión guardada solo tiene el nombre de usuario; el rol siempre se vuelve a leer de
  `data/usuarios.js`, así que editar el `localStorage` no da permisos de administrador.
- Las fotos se reducen y se comprimen en el navegador antes de guardarse, porque `localStorage`
  tiene unos 5 MB por sitio. El panel muestra cuánto espacio se está usando.
- Los datos se guardan en el navegador de cada persona: lo que reserves en tu equipo no aparece en
  otro equipo ni en otro navegador.
- Datos del clima: [Open-Meteo.com](https://open-meteo.com/) (licencia CC BY 4.0).
