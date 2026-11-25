// Servicio: todo lo que tiene que ver con la API pública Open-Meteo (gratis, sin API key).
// Documentación: https://open-meteo.com/en/docs
//
// Este archivo hace tres cosas:
//   1. Arma la URL de la petición.
//   2. Pide el JSON con fetch y controla los errores.
//   3. Convierte el JSON recibido en un ARREGLO DE OBJETOS que los componentes pueden pintar.

const URL_PRONOSTICO = "https://api.open-meteo.com/v1/forecast";

// Variables que le pedimos a la API
const VARIABLES_ACTUALES = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "wind_speed_10m",
  "weather_code",
  "is_day",
];
const VARIABLES_DIARIAS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
  "uv_index_max",
];

/* ---------- 1. URL ----------
   Con VARIAS coordenadas separadas por coma, la API responde con un ARREGLO
   (un objeto por lugar). Con UNA sola coordenada responde con un solo OBJETO. */
export function construirUrl(lugares) {
  const parametros = new URLSearchParams({
    latitude: lugares.map((l) => l.lat).join(","),
    longitude: lugares.map((l) => l.lon).join(","),
    timezone: lugares.map((l) => l.zona ?? "GMT").join(","),
    current: VARIABLES_ACTUALES.join(","),
    daily: VARIABLES_DIARIAS.join(","),
    forecast_days: "7",
  });
  return `${URL_PRONOSTICO}?${parametros}`;
}

/* ---------- 2. Petición con fetch ---------- */
async function pedirJson(url, signal) {
  const inicio = performance.now();

  let respuesta;
  try {
    respuesta = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("No hay conexión con Open-Meteo. Revisa tu internet e inténtalo de nuevo.");
  }

  let json = null;
  try {
    json = await respuesta.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    // el cuerpo no era JSON: se avisa más abajo
  }

  if (!respuesta.ok) {
    // Open-Meteo responde { error: true, reason: "..." } cuando un parámetro está mal escrito
    const motivo = json?.reason ?? "sin detalle";
    throw new Error(`Open-Meteo rechazó la consulta (HTTP ${respuesta.status}): ${motivo}.`);
  }
  if (!json) throw new Error("Open-Meteo no devolvió un JSON válido.");

  return { json, status: respuesta.status, ms: Math.round(performance.now() - inicio) };
}

/* ---------- 3. Conversión JSON → arreglo de objetos ---------- */

// `daily` llega como un objeto de ARREGLOS PARALELOS:
//   { time: [d0, d1, ...], temperature_2m_max: [t0, t1, ...], ... }
// Se recorre `time` y, con el mismo índice i, se arma un objeto por día.
export function mapearPronostico(daily = {}) {
  const fechas = daily.time ?? [];
  return fechas.map((fecha, i) => ({
    fecha,
    codigo: daily.weather_code?.[i] ?? null,
    max: daily.temperature_2m_max?.[i] ?? null,
    min: daily.temperature_2m_min?.[i] ?? null,
    lluviaMm: daily.precipitation_sum?.[i] ?? null,
    probLluvia: daily.precipitation_probability_max?.[i] ?? null,
    uvMax: daily.uv_index_max?.[i] ?? null,
  }));
}

// Une los datos propios del destino (data/catalogo.js) con lo que respondió la API.
export function mapearUbicacion(destino, json) {
  const actual = json.current ?? {};
  const unidadesActual = json.current_units ?? {};
  const unidadesDiarias = json.daily_units ?? {};

  return {
    id: destino.id,
    nombre: destino.nombre,
    tipo: destino.tipo,
    ubicacion: destino.ubicacion,
    elevacion: json.elevation ?? null,
    actual: {
      hora: actual.time ?? null,
      temp: actual.temperature_2m ?? null,
      sensacion: actual.apparent_temperature ?? null,
      humedad: actual.relative_humidity_2m ?? null,
      viento: actual.wind_speed_10m ?? null,
      codigo: actual.weather_code ?? null,
      esDia: actual.is_day === 1,
    },
    unidades: {
      temp: unidadesActual.temperature_2m ?? "°C",
      viento: unidadesActual.wind_speed_10m ?? "km/h",
      humedad: unidadesActual.relative_humidity_2m ?? "%",
      lluvia: unidadesDiarias.precipitation_sum ?? "mm",
    },
    pronostico: mapearPronostico(json.daily),
  };
}

// Pide el pronóstico de uno o varios destinos y devuelve SIEMPRE un arreglo de objetos
// (si la API respondió un solo objeto, se mete en un arreglo de un elemento).
export async function pedirPronostico(destinos, signal) {
  const url = construirUrl(destinos);
  const { json, status, ms } = await pedirJson(url, signal);

  const lista = Array.isArray(json) ? json : [json];
  if (lista.length !== destinos.length) {
    throw new Error("Open-Meteo devolvió una cantidad inesperada de lugares.");
  }

  return {
    lugares: lista.map((item, i) => mapearUbicacion(destinos[i], item)),
    // Evidencia para el panel de desarrollo
    diagnostico: { url, status, ms, formato: Array.isArray(json) ? "arreglo" : "objeto", crudo: json },
  };
}
