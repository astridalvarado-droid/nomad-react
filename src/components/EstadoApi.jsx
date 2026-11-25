// Estados de la petición mientras no hay datos: "cargando" y "error".
// Cuando el estado es "listo" no pinta nada (la vista muestra los datos).
export default function EstadoApi({ estado, texto = "Consultando Open-Meteo…", error, onReintentar }) {
  if (estado === "cargando") {
    return (
      <p className="no-results" role="status">
        {texto}
      </p>
    );
  }

  if (estado === "error") {
    return (
      <div className="clima-error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn btn-ghost" onClick={onReintentar}>
          Volver a consultar
        </button>
      </div>
    );
  }

  return null;
}
