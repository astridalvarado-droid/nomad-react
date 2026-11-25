import { conUnidad, lluviaSemana } from "../helpers/formatear.js";

// Franja de datos calculada RECORRIENDO el arreglo de objetos (reduce).
// Usa el estilo .stats-strip que ya existía en styles.css.
export default function ResumenClima({ lugares }) {
  const conTemperatura = lugares.filter((l) => typeof l.actual.temp === "number");
  if (conTemperatura.length === 0) return null;

  const masCalido = conTemperatura.reduce((a, b) => (b.actual.temp > a.actual.temp ? b : a));
  const masFrio = conTemperatura.reduce((a, b) => (b.actual.temp < a.actual.temp ? b : a));
  const masLluvioso = lugares.reduce((a, b) => (lluviaSemana(b) > lluviaSemana(a) ? b : a));
  const unidad = masCalido.unidades.temp;

  return (
    <div className="stats-strip clima-resumen">
      <div className="stat">
        <span className="stat-num">{conUnidad(masCalido.actual.temp, unidad)}</span>
        <span className="stat-label">Más cálido ahora: {masCalido.nombre}</span>
      </div>
      <div className="stat">
        <span className="stat-num">{conUnidad(masFrio.actual.temp, unidad)}</span>
        <span className="stat-label">Más frío ahora: {masFrio.nombre}</span>
      </div>
      <div className="stat">
        <span className="stat-num">
          {Math.round(lluviaSemana(masLluvioso))} {masLluvioso.unidades.lluvia}
        </span>
        <span className="stat-label">Más lluvia en 7 días: {masLluvioso.nombre}</span>
      </div>
      <div className="stat">
        <span className="stat-num">{lugares.length}</span>
        <span className="stat-label">Destinos en una sola petición</span>
      </div>
    </div>
  );
}
