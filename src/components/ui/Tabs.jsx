import { useId, useRef } from "react";
import useAlmacenamiento from "../../hooks/useAlmacenamiento.js";
import { CLAVES } from "../../services/almacen.js";

// Pestañas reutilizables.
//   pestanas: [{ id, etiqueta, contador?, contenido }]
//   memoria:  nombre con el que se recuerda la pestaña activa en sessionStorage
//             (si recargas la página sigues en la misma pestaña).
// Teclado: flechas ← →, Inicio y Fin cambian de pestaña.
export default function Tabs({ pestanas, memoria, etiqueta }) {
  const base = useId();
  const botones = useRef([]);
  const [guardada, setActiva] = useAlmacenamiento(CLAVES.pestana(memoria), pestanas[0].id, "session");
  const activa = pestanas.some((p) => p.id === guardada) ? guardada : pestanas[0].id;

  const alTeclear = (e, indice) => {
    const ultimo = pestanas.length - 1;
    const destinos = { ArrowRight: indice === ultimo ? 0 : indice + 1, ArrowLeft: indice === 0 ? ultimo : indice - 1, Home: 0, End: ultimo };
    if (!(e.key in destinos)) return;
    e.preventDefault();
    const siguiente = destinos[e.key];
    setActiva(pestanas[siguiente].id);
    botones.current[siguiente]?.focus();
  };

  return (
    <div className="tabs">
      <div className="tabs-lista" role="tablist" aria-label={etiqueta}>
        {pestanas.map((p, i) => {
          const seleccionada = p.id === activa;
          return (
            <button
              key={p.id}
              ref={(nodo) => {
                botones.current[i] = nodo;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${p.id}`}
              aria-selected={seleccionada}
              aria-controls={`${base}-panel-${p.id}`}
              tabIndex={seleccionada ? 0 : -1}
              className={`tab${seleccionada ? " activa" : ""}`}
              onClick={() => setActiva(p.id)}
              onKeyDown={(e) => alTeclear(e, i)}
            >
              {p.etiqueta}
              {p.contador !== undefined && <span className="tab-contador">{p.contador}</span>}
            </button>
          );
        })}
      </div>

      {pestanas.map((p) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`${base}-panel-${p.id}`}
          aria-labelledby={`${base}-tab-${p.id}`}
          hidden={p.id !== activa}
          className="tab-panel"
        >
          {p.id === activa && p.contenido}
        </div>
      ))}
    </div>
  );
}
