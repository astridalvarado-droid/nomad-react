// Open-Meteo entrega el clima como un número (código WMO) en `weather_code`.
// Aquí cada código se traduce a un texto en español y al nombre de un ícono.
const TABLA = {
  0: ["Despejado", "sol"],
  1: ["Casi despejado", "sol"],
  2: ["Parcialmente nublado", "parcial"],
  3: ["Nublado", "nube"],
  45: ["Niebla", "niebla"],
  48: ["Niebla con escarcha", "niebla"],
  51: ["Llovizna ligera", "lluvia"],
  53: ["Llovizna moderada", "lluvia"],
  55: ["Llovizna densa", "lluvia"],
  56: ["Llovizna helada ligera", "lluvia"],
  57: ["Llovizna helada densa", "lluvia"],
  61: ["Lluvia ligera", "lluvia"],
  63: ["Lluvia moderada", "lluvia"],
  65: ["Lluvia fuerte", "lluvia"],
  66: ["Lluvia helada ligera", "lluvia"],
  67: ["Lluvia helada fuerte", "lluvia"],
  71: ["Nevada ligera", "nieve"],
  73: ["Nevada moderada", "nieve"],
  75: ["Nevada fuerte", "nieve"],
  77: ["Granos de nieve", "nieve"],
  80: ["Chubascos ligeros", "lluvia"],
  81: ["Chubascos moderados", "lluvia"],
  82: ["Chubascos violentos", "lluvia"],
  85: ["Chubascos de nieve ligeros", "nieve"],
  86: ["Chubascos de nieve fuertes", "nieve"],
  95: ["Tormenta eléctrica", "tormenta"],
  96: ["Tormenta con granizo ligero", "tormenta"],
  99: ["Tormenta con granizo fuerte", "tormenta"],
};

export function describirClima(codigo, esDia = true) {
  const [texto, icono] = TABLA[codigo] ?? ["Sin dato", "nube"];
  // De noche el sol se dibuja como luna y el "parcial" como nube
  if (!esDia && icono === "sol") return { texto, icono: "luna" };
  if (!esDia && icono === "parcial") return { texto, icono: "nube" };
  return { texto, icono };
}
