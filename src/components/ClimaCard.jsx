import { Link } from "../router.jsx";
import { describirClima } from "../helpers/codigosClima.js";
import { conUnidad, diaCorto, entero, grados, lluviaSemana, milimetros } from "../helpers/formatear.js";
import IconoClima from "./IconoClima.jsx";

// Componente reutilizable: tarjeta con el clima de un destino.
// Recibe UN objeto del arreglo que salió de convertir el JSON de la API.
export default function ClimaCard({ lugar: l }) {
  const { texto } = describirClima(l.actual.codigo, l.actual.esDia);

  return (
    <Link className="dest-card clima-card" to={`/destinos/${l.id}`}>
      <div className="dest-body">
        <div className="dest-top">
          <h3>{l.nombre}</h3>
          <span className="dest-loc">{l.ubicacion}</span>
        </div>

        <div className="clima-ahora">
          <IconoClima codigo={l.actual.codigo} esDia={l.actual.esDia} tamano={36} />
          <span className="clima-temp">{conUnidad(l.actual.temp, l.unidades.temp)}</span>
          <span className="clima-texto">{texto}</span>
        </div>

        <p className="clima-meta">
          sensación {grados(l.actual.sensacion)} · humedad {entero(l.actual.humedad)}
          {l.unidades.humedad} · viento {entero(l.actual.viento)} {l.unidades.viento}
        </p>
        <p className="dest-feature">☂ Lluvia en 7 días: {milimetros(lluviaSemana(l))}</p>

        <ol className="clima-semana" aria-label="Pronóstico de 7 días">
          {l.pronostico.map((dia, i) => (
            <li key={dia.fecha} title={describirClima(dia.codigo).texto}>
              <span>{i === 0 ? "hoy" : diaCorto(dia.fecha)}</span>
              <IconoClima codigo={dia.codigo} tamano={18} />
              <span className="clima-max">{grados(dia.max)}</span>
              <span>{grados(dia.min)}</span>
            </li>
          ))}
        </ol>
      </div>
    </Link>
  );
}
