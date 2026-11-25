// Validaciones del formulario de contacto (Actividad 6), separadas de la vista para poder
// probarlas en tests/contacto.test.js. Son funciones puras: reciben datos y devuelven errores.

export const VALORES_INICIALES = { nombre: "", email: "", paquete: "", viajeros: "", mensaje: "" };
export const MAX_MENSAJE = 300;

// Devuelve el texto del error de un campo, o "" si está bien
export function validarCampo(nombre, valor) {
  const v = String(valor ?? "").trim();

  switch (nombre) {
    case "nombre":
      if (!v) return "El nombre es obligatorio.";
      if (v.length < 3) return "Escribe al menos 3 caracteres.";
      if (!/^[\p{L}' -]+$/u.test(v)) return "Usa solo letras y espacios.";
      return "";

    case "email":
      if (!v) return "El correo es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Ingresa un correo válido (ej: nombre@correo.com).";
      return "";

    case "paquete":
      return v ? "" : "Selecciona un paquete de interés.";

    case "viajeros": {
      if (!v) return "Indica cuántos viajeros son.";
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1 || n > 20) return "Debe ser un número entero entre 1 y 20.";
      return "";
    }

    case "mensaje":
      if (!v) return "Cuéntanos qué necesitas.";
      if (v.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
      if (v.length > MAX_MENSAJE) return `Máximo ${MAX_MENSAJE} caracteres.`;
      return "";

    default:
      return "";
  }
}

// Valida todos los campos y devuelve { campo: "mensaje" } solo con los que fallan
export function validarTodo(datos) {
  const errores = {};
  for (const nombre of Object.keys(VALORES_INICIALES)) {
    const mensaje = validarCampo(nombre, datos[nombre]);
    if (mensaje) errores[nombre] = mensaje;
  }
  return errores;
}
