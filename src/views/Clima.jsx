import { useState } from "react";
import { destinos } from "../data/catalogo.js";
import useClima from "../hooks/useClima.js";
import useTitulo from "../hooks/useTitulo.js";
import SectionHead from "../components/SectionHead.jsx";
import ClimaCard from "../components/ClimaCard.jsx";
import ResumenClima from "../components/ResumenClima.jsx";
import EstadoApi from "../components/EstadoApi.jsx";
import CreditoApi from "../components/CreditoApi.jsx";
import PanelApi from "../components/PanelApi.jsx";

/* ============================================================
   Consumo de API pública: clima de los destinos (Open-Meteo)
   ============================================================ */
export default function Clima() {
  useTitulo("Clima");

  // 1. Se consume la API: `lugares` es el ARREGLO DE OBJETOS que salió del JSON
  const { lugares, estado, error, diagnostico, reintentar } = useClima(destinos);

  // 2. Estados de los filtros (igual que en la vista Destinos)
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const tipos = ["todos", ...new Set(destinos.map((d) => d.tipo))];
  const texto = busqueda.trim().toLowerCase();
  const visibles = lugares.filter(
    (l) => (filtro === "todos" || l.tipo === filtro) && l.nombre.toLowerCase().includes(texto)
  );

  return (
    <section className="section">
      <SectionHead
        titulo="Clima en los destinos"
        texto="Temperatura actual y pronóstico de 7 días de cada destino, consultados en vivo a Open-Meteo."
      />

      <EstadoApi estado={estado} error={error} onReintentar={reintentar} />

      {estado === "listo" && (
        <>
          <ResumenClima lugares={lugares} />

          <div className="controls">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar destino por nombre…"
              autoComplete="off"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="filter-group">
              {tipos.map((t) => (
                <button
                  key={t}
                  className={`filter-btn${filtro === t ? " active" : ""}`}
                  onClick={() => setFiltro(t)}
                >
                  {t.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {visibles.length === 0 && (
            <p className="no-results">No encontramos destinos con esos filtros.</p>
          )}
          <div className="card-grid">
            {visibles.map((l) => (
              <ClimaCard key={l.id} lugar={l} />
            ))}
          </div>
        </>
      )}

      <CreditoApi />
      <PanelApi estado={estado} diagnostico={diagnostico} lugares={lugares} onReintentar={reintentar} />
    </section>
  );
}
