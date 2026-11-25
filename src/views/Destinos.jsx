import { destinos } from "../data/catalogo.js";
import { CLAVES } from "../services/almacen.js";
import useTitulo from "../hooks/useTitulo.js";
import useAlmacenamiento from "../hooks/useAlmacenamiento.js";
import SectionHead from "../components/SectionHead.jsx";
import DestinoCard from "../components/DestinoCard.jsx";

const FILTROS_INICIALES = { tipo: "todos", busqueda: "" };

export default function Destinos() {
  useTitulo("Destinos");

  // Filtros guardados en sessionStorage: al volver de un detalle siguen como los dejaste
  const [filtros, setFiltros] = useAlmacenamiento(CLAVES.filtrosDestinos, FILTROS_INICIALES, "session");
  const cambiar = (campo, valor) => setFiltros((f) => ({ ...f, [campo]: valor }));

  const tipos = ["todos", ...new Set(destinos.map((d) => d.tipo))];
  const texto = filtros.busqueda.trim().toLowerCase();
  const visibles = destinos.filter(
    (d) => (filtros.tipo === "todos" || d.tipo === filtros.tipo) && d.nombre.toLowerCase().includes(texto)
  );

  return (
    <section className="section">
      <SectionHead titulo="Destinos" texto="Filtra por tipo de terreno o busca uno en concreto." />
      <div className="controls">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar destino por nombre…"
          aria-label="Buscar destino por nombre"
          autoComplete="off"
          value={filtros.busqueda}
          onChange={(e) => cambiar("busqueda", e.target.value)}
        />
        <div className="filter-group">
          {tipos.map((t) => (
            <button
              key={t}
              type="button"
              className={`filter-btn${filtros.tipo === t ? " active" : ""}`}
              aria-pressed={filtros.tipo === t}
              onClick={() => cambiar("tipo", t)}
            >
              {t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 && <p className="no-results">No encontramos destinos con esos filtros.</p>}
      <div className="card-grid">
        {visibles.map((d) => (
          <DestinoCard key={d.id} destino={d} />
        ))}
      </div>
    </section>
  );
}
