// Funciones pequeñas para mostrar los números y fechas de la API en español.

export const grados = (n) => (typeof n === "number" ? `${Math.round(n)}°` : "—");

export const entero = (n) => (typeof n === "number" ? String(Math.round(n)) : "—");

// 21.4 + "°C" → "21°C"
export const conUnidad = (n, unidad) => (typeof n === "number" ? `${Math.round(n)}${unidad}` : "—");

// 3.25 → "3,3 mm"
export const milimetros = (n) =>
  typeof n === "number"
    ? `${n.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mm`
    : "—";

export const metros = (n) =>
  typeof n === "number" ? `${Math.round(n).toLocaleString("es-CO")} m` : "—";

// Suma la lluvia prevista de los 7 días de un destino
export const lluviaSemana = (lugar) =>
  lugar.pronostico.reduce((total, dia) => total + (dia.lluviaMm ?? 0), 0);

// "2026-11-08" → "dom". Se usa el mediodía para evitar saltos por zona horaria.
export function diaCorto(fecha) {
  return new Date(`${fecha}T12:00:00`)
    .toLocaleDateString("es-CO", { weekday: "short" })
    .replace(".", "");
}

// JSON.stringify con 2 espacios, pero los arreglos de números o textos en una sola línea,
// para que el panel de desarrollo no ocupe cientos de líneas.
export function jsonCompacto(valor) {
  return JSON.stringify(valor, null, 2).replace(/\[([^[\]{}]*?)\]/g, (_, interior) =>
    `[${interior.replace(/\s*\n\s*/g, " ").trim()}]`
  );
}
