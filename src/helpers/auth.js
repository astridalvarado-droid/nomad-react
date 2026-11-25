// Autenticación y control de acceso: funciones puras (sin React), probadas en tests/auth.test.js.

export const ROLES = { ADMIN: "admin", USUARIO: "usuario" };

export const NOMBRE_ROL = { admin: "Administrador", usuario: "Usuario" };

// Datos que se pueden mostrar de un usuario (nunca la contraseña)
const datosPublicos = (u) => ({ usuario: u.usuario, nombre: u.nombre, rol: u.rol });

// Busca el usuario (sin importar mayúsculas ni espacios) y compara la contraseña exacta.
// Devuelve los datos públicos del usuario o null si las credenciales no son correctas.
export function validarCredenciales(lista, usuario, clave) {
  const nombre = String(usuario ?? "").trim().toLowerCase();
  const encontrado = lista.find((u) => u.usuario === nombre);
  if (!encontrado || encontrado.clave !== clave) return null;
  return datosPublicos(encontrado);
}

// Reconstruye la sesión guardada con los datos OFICIALES de la lista de usuarios.
// El rol nunca se toma del navegador: si alguien edita el localStorage para ponerse
// rol "admin", aquí se vuelve a leer el rol real del usuario.
export function reconstruirSesion(lista, guardada) {
  if (!guardada?.usuario) return null;
  const encontrado = lista.find((u) => u.usuario === guardada.usuario);
  if (!encontrado) return null;
  return { ...datosPublicos(encontrado), inicio: guardada.inicio, recordar: Boolean(guardada.recordar) };
}

// Decide qué pasa al entrar a una ruta:
//   "permitido" → se muestra la vista
//   "login"     → hace falta iniciar sesión
//   "denegado"  → hay sesión, pero el rol no tiene permiso (403)
export function evaluarAcceso(sesion, rolesPermitidos) {
  if (!rolesPermitidos) return "permitido"; // ruta pública
  if (!sesion) return "login";
  return rolesPermitidos.includes(sesion.rol) ? "permitido" : "denegado";
}

// Validación del formulario de login (antes de comparar credenciales)
export function validarFormularioLogin({ usuario, clave }) {
  const errores = {};
  if (!String(usuario ?? "").trim()) errores.usuario = "Escribe tu usuario.";
  if (!clave) errores.clave = "Escribe tu contraseña.";
  return errores;
}

// "Ana Rojas" → "AR" (para el avatar cuando no hay foto)
export function iniciales(nombre = "") {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}
