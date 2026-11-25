// Usuarios definidos previamente en el sistema.
// Es un proyecto académico sin backend: las credenciales viven en el código y se validan
// en el navegador. En una aplicación real se validarían en un servidor y la contraseña
// nunca viajaría al navegador.
// La sesión que se guarda en el navegador NO incluye la contraseña (ver context/AuthContext.jsx).
export const usuarios = [
  { usuario: "admin", clave: "Admin123", nombre: "Ana Rojas", rol: "admin" },
  { usuario: "viajero", clave: "Viajero123", nombre: "Carlos Muñoz", rol: "usuario" },
  { usuario: "laura", clave: "Laura123", nombre: "Laura Gómez", rol: "usuario" },
];
