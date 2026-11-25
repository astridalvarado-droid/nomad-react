import { useCallback, useEffect, useState } from "react";
import { pedirPronostico } from "../services/openMeteo.js";

// Hook que consume la API Open-Meteo cuando el componente se monta (useEffect).
// Devuelve:
//   lugares      → ARREGLO DE OBJETOS ya convertido (lo que pintan los componentes)
//   estado       → "cargando" | "listo" | "error"
//   error        → mensaje para mostrar si algo falló
//   diagnostico  → datos de la petición (URL, código HTTP, JSON crudo) para el panel de desarrollo
//   reintentar   → vuelve a hacer la petición
// OJO: `destinosBase` debe ser siempre la misma referencia (una constante o useMemo),
// porque el efecto se vuelve a ejecutar cuando cambia.
export default function useClima(destinosBase) {
  const [lugares, setLugares] = useState([]);
  const [estado, setEstado] = useState("cargando");
  const [error, setError] = useState("");
  const [diagnostico, setDiagnostico] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    // AbortController cancela la petición si el componente se desmonta
    // (React.StrictMode monta dos veces en desarrollo).
    const controlador = new AbortController();
    setEstado("cargando");
    setError("");

    pedirPronostico(destinosBase, controlador.signal)
      .then(({ lugares: lista, diagnostico: info }) => {
        if (controlador.signal.aborted) return;
        // Evidencia en la consola (F12): el JSON tal cual y el arreglo ya convertido
        console.group("[Open-Meteo] clima de los destinos");
        console.log(`1. JSON recibido (${info.formato}):`, info.crudo);
        console.log("2. Arreglo de objetos:", lista);
        console.groupEnd();
        setLugares(lista);
        setDiagnostico(info);
        setEstado("listo");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("[Open-Meteo]", err);
        setError(err.message);
        setEstado("error");
      });

    return () => controlador.abort();
  }, [destinosBase, intento]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return { lugares, estado, error, diagnostico, reintentar };
}
