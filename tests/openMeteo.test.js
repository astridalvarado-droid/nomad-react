import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { construirUrl, mapearPronostico, pedirPronostico } from "../src/services/openMeteo.js";

const DESTINO = { id: "los-roques", nombre: "Los Roques", tipo: "Playa", ubicacion: "Venezuela", lat: 11.85, lon: -66.75, zona: "America/Caracas" };

// Respuesta con la estructura que documenta Open-Meteo (valores de ejemplo)
const respuesta = (temp) => ({
  elevation: 2,
  current_units: { temperature_2m: "°C", wind_speed_10m: "km/h", relative_humidity_2m: "%" },
  current: { temperature_2m: temp, apparent_temperature: temp - 2, relative_humidity_2m: 80, wind_speed_10m: 18, weather_code: 0, is_day: 1 },
  daily_units: { precipitation_sum: "mm" },
  daily: { time: ["2026-11-24", "2026-11-25"], weather_code: [0, 61], temperature_2m_max: [31, 30], temperature_2m_min: [27, 26], precipitation_sum: [0, 4.2] },
});

const fetchOriginal = globalThis.fetch;
const simularFetch = (cuerpo, status = 200) => {
  globalThis.fetch = async () => ({ ok: status < 400, status, json: async () => cuerpo });
};

describe("API Open-Meteo: conversión del JSON", () => {
  afterEach(() => {
    globalThis.fetch = fetchOriginal;
  });

  it("convierte los arreglos paralelos de daily en un arreglo de objetos", () => {
    const dias = mapearPronostico(respuesta(30).daily);
    assert.equal(dias.length, 2);
    assert.deepEqual(dias[1], { fecha: "2026-11-25", codigo: 61, max: 30, min: 26, lluviaMm: 4.2, probLluvia: null, uvMax: null });
  });

  it("arma la URL con todas las coordenadas separadas por coma", () => {
    const url = new URL(construirUrl([DESTINO, { ...DESTINO, lat: 1, lon: 2 }]));
    assert.equal(url.searchParams.get("latitude"), "11.85,1");
    assert.equal(url.searchParams.get("forecast_days"), "7");
  });

  it("con un solo destino la API responde un objeto y se normaliza a un arreglo", async () => {
    simularFetch(respuesta(30));
    const { lugares, diagnostico } = await pedirPronostico([DESTINO]);
    assert.equal(diagnostico.formato, "objeto");
    assert.equal(lugares.length, 1);
    assert.equal(lugares[0].actual.temp, 30);
    assert.equal(lugares[0].actual.esDia, true);
  });

  it("con varios destinos la API responde un arreglo", async () => {
    simularFetch([respuesta(30), respuesta(15)]);
    const { lugares } = await pedirPronostico([DESTINO, { ...DESTINO, id: "otro" }]);
    assert.deepEqual(lugares.map((l) => l.actual.temp), [30, 15]);
  });

  it("muestra el motivo cuando la API rechaza la consulta", async () => {
    simularFetch({ error: true, reason: "Variable desconocida" }, 400);
    await assert.rejects(pedirPronostico([DESTINO]), /HTTP 400\): Variable desconocida/);
  });
});
