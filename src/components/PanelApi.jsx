import { jsonCompacto } from "../helpers/formatear.js";

// Panel de desarrollo (mismo estilo que PanelEstado): evidencia visual de la petición
// a la API y de la conversión del JSON a un arreglo de objetos.
export default function PanelApi({ estado, diagnostico, lugares, onReintentar }) {
  // Si la API respondió un arreglo, se muestra solo el primer elemento para no ocupar toda la pantalla
  const crudo = diagnostico ? (Array.isArray(diagnostico.crudo) ? diagnostico.crudo[0] : diagnostico.crudo) : null;

  const peticion = {
    estado,
    codigoHttp: diagnostico ? diagnostico.status : null,
    tiempoMs: diagnostico ? diagnostico.ms : null,
    jsonRecibido: !diagnostico
      ? null
      : diagnostico.formato === "arreglo"
        ? `arreglo de ${diagnostico.crudo.length} objetos`
        : "un solo objeto",
    objetosEnElEstado: lugares.length,
  };

  return (
    <details className="debug-panel clima-panel" id="panelApi">
      <summary>Panel de desarrollo · petición a Open-Meteo y conversión del JSON</summary>

      <p className="clima-url">{diagnostico ? `GET ${diagnostico.url}` : "GET — esperando respuesta —"}</p>

      <div className="debug-grid">
        <div>
          <h4>Petición (fetch + useState)</h4>
          <pre>{JSON.stringify(peticion, null, 2)}</pre>
        </div>
        <div>
          <h4>1. JSON recibido (primer destino)</h4>
          <pre tabIndex={0}>{crudo ? jsonCompacto(crudo) : "— sin datos todavía —"}</pre>
        </div>
        <div>
          <h4>2. Objeto del arreglo que usan los componentes</h4>
          <pre tabIndex={0}>{lugares[0] ? jsonCompacto(lugares[0]) : "— sin datos todavía —"}</pre>
        </div>
      </div>

      <p className="clima-nota">
        Cada posición i de los arreglos de daily se convierte en un objeto de pronostico[i]:
        daily.time[i] pasa a fecha, daily.temperature_2m_max[i] pasa a max, y así con cada variable.
        Los mismos datos salen en la consola (F12).
      </p>
      <button type="button" className="btn btn-ghost" onClick={onReintentar}>
        Volver a consultar la API
      </button>
    </details>
  );
}
