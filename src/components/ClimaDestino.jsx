import { useMemo } from "react";
import useClima from "../hooks/useClima.js";
import { describirClima } from "../helpers/codigosClima.js";
import { conUnidad, diaCorto, entero, grados, metros, milimetros } from "../helpers/formatear.js";
import IconoClima from "./IconoClima.jsx";
import EstadoApi from "./EstadoApi.jsx";
import CreditoApi from "./CreditoApi.jsx";

// Bloque de clima dentro del detalle de un destino (#/destinos/:id).
// Aquí se pide UNA sola coordenada, así que la API responde con un solo OBJETO
// (en la vista Clima responde con un ARREGLO). El servicio lo normaliza igual.
export default function ClimaDestino({ destino }) {
  // useMemo: el hook solo vuelve a pedir datos si cambia el destino
  const base = useMemo(() => [destino], [destino]);
  const { lugares, estado, error, reintentar } = useClima(base);
  const l = lugares[0];

  return (
    <>
      <h2 className="detail-sub">Clima en el destino</h2>
      <EstadoApi
        estado={estado}
        texto={`Consultando el clima de ${destino.nombre}…`}
        error={error}
        onReintentar={reintentar}
      />

      {estado === "listo" && l && (
        <div className="clima-detalle">
          <div className="clima-detalle-ahora">
            <IconoClima codigo={l.actual.codigo} esDia={l.actual.esDia} tamano={48} />
            <div>
              <span className="clima-temp clima-temp--grande">{conUnidad(l.actual.temp, l.unidades.temp)}</span>
              <p className="clima-texto">{describirClima(l.actual.codigo, l.actual.esDia).texto}</p>
            </div>
          </div>

          <dl className="clima-datos">
            <div>
              <dt>Sensación térmica</dt>
              <dd>{conUnidad(l.actual.sensacion, l.unidades.temp)}</dd>
            </div>
            <div>
              <dt>Humedad</dt>
              <dd>{entero(l.actual.humedad)}{l.unidades.humedad}</dd>
            </div>
            <div>
              <dt>Viento</dt>
              <dd>{entero(l.actual.viento)} {l.unidades.viento}</dd>
            </div>
            <div>
              <dt>Altitud</dt>
              <dd>{metros(l.elevacion)}</dd>
            </div>
          </dl>

          <div className="clima-tabla-wrap">
            <table className="clima-tabla">
              <caption>Pronóstico de los próximos 7 días</caption>
              <thead>
                <tr>
                  <th scope="col">Día</th>
                  <th scope="col">Clima</th>
                  <th scope="col">Máx.</th>
                  <th scope="col">Mín.</th>
                  <th scope="col">Lluvia</th>
                  <th scope="col">Prob.</th>
                  <th scope="col">UV</th>
                </tr>
              </thead>
              <tbody>
                {l.pronostico.map((dia, i) => (
                  <tr key={dia.fecha}>
                    <th scope="row">{i === 0 ? "hoy" : `${diaCorto(dia.fecha)} ${dia.fecha.slice(8, 10)}`}</th>
                    <td>
                      <span className="clima-celda-clima">
                        <IconoClima codigo={dia.codigo} tamano={20} />
                        {describirClima(dia.codigo).texto}
                      </span>
                    </td>
                    <td>{grados(dia.max)}</td>
                    <td>{grados(dia.min)}</td>
                    <td>{milimetros(dia.lluviaMm)}</td>
                    <td>{typeof dia.probLluvia === "number" ? `${dia.probLluvia}%` : "—"}</td>
                    <td>{typeof dia.uvMax === "number" ? dia.uvMax.toFixed(1) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreditoApi />
    </>
  );
}
