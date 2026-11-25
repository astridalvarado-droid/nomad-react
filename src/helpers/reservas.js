// Reservas de paquetes: funciones puras, probadas en tests/reservas.test.js.

export const MAX_VIAJEROS = 10; // grupos reducidos (ver vista Nosotros)
export const MAX_NOTA = 200;

export const ESTADOS = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
};

// Fecha local en formato "AAAA-MM-DD" (sin usar toISOString, que pasa a hora UTC
// y en Colombia después de las 7 p. m. daría el día siguiente)
export function fechaLocalIso(fecha = new Date()) {
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

// Primer día que se puede reservar: mañana
export function primeraFechaReservable(hoy = new Date()) {
  const manana = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  return fechaLocalIso(manana);
}

// Devuelve { campo: "mensaje" } solo con los campos que fallan
export function validarReserva({ fecha, viajeros, nota = "" }, hoy = new Date()) {
  const errores = {};

  if (!fecha) errores.fecha = "Elige la fecha de salida.";
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.fecha = "La fecha no es válida.";
  else if (fecha < primeraFechaReservable(hoy)) errores.fecha = "La salida debe ser a partir de mañana.";

  const n = Number(viajeros);
  if (viajeros === "" || viajeros === undefined) errores.viajeros = "Indica cuántos viajan.";
  else if (!Number.isInteger(n) || n < 1 || n > MAX_VIAJEROS) {
    errores.viajeros = `Debe ser un número entero entre 1 y ${MAX_VIAJEROS}.`;
  }

  if (nota.length > MAX_NOTA) errores.nota = `Máximo ${MAX_NOTA} caracteres.`;

  return errores;
}

const nuevoId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function crearReserva({ paquete, usuario, fecha, viajeros, nota = "" }, ahora = new Date()) {
  const cantidad = Number(viajeros);
  return {
    id: nuevoId(),
    paqueteId: paquete.id,
    paqueteNombre: paquete.nombre,
    usuario,
    fecha,
    viajeros: cantidad,
    total: paquete.precio * cantidad,
    nota: nota.trim(),
    estado: "pendiente",
    creada: ahora.toISOString(),
  };
}

// Orden de la lista de paquetes (devuelve una copia, no cambia el arreglo original)
export const ORDENES = {
  recomendados: "Recomendados",
  "precio-asc": "Precio: menor a mayor",
  "precio-desc": "Precio: mayor a menor",
  duracion: "Duración: más corta primero",
};

export function ordenarPaquetes(lista, criterio) {
  const copia = [...lista];
  if (criterio === "precio-asc") return copia.sort((a, b) => a.precio - b.precio);
  if (criterio === "precio-desc") return copia.sort((a, b) => b.precio - a.precio);
  if (criterio === "duracion") return copia.sort((a, b) => a.duracion - b.duracion);
  return copia;
}

export const formatearUsd = (n) => `USD $${n.toLocaleString("en-US")}`;

// "2026-12-05" → "5 dic 2026"
export function formatearFecha(iso) {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}
