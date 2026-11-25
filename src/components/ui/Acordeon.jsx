import { useId, useState } from "react";

// Acordeón reutilizable.
//   items:    [{ id, titulo, meta?, contenido }]
//   multiple: si es false, al abrir un elemento se cierra el que estaba abierto.
// El panel se despliega con una transición de altura (ver .acordeon-panel en styles.css).
export default function Acordeon({ items, multiple = false }) {
  const base = useId();
  const [abiertos, setAbiertos] = useState(() => new Set());

  const alternar = (id) =>
    setAbiertos((previos) => {
      const siguientes = new Set(multiple ? previos : []);
      if (previos.has(id)) siguientes.delete(id);
      else siguientes.add(id);
      return siguientes;
    });

  return (
    <div className="acordeon">
      {items.map((item) => {
        const abierto = abiertos.has(item.id);
        const idBoton = `${base}-boton-${item.id}`;
        const idPanel = `${base}-panel-${item.id}`;

        return (
          <div key={item.id} className={`acordeon-item${abierto ? " abierto" : ""}`}>
            <h3 className="acordeon-titulo">
              <button type="button" id={idBoton} aria-expanded={abierto} aria-controls={idPanel} onClick={() => alternar(item.id)}>
                <span className="acordeon-texto">{item.titulo}</span>
                {item.meta && <span className="acordeon-meta">{item.meta}</span>}
                <span className="acordeon-icono" aria-hidden="true" />
              </button>
            </h3>
            {/* inert: mientras está cerrado, su contenido no recibe foco ni clics */}
            <div className="acordeon-panel" id={idPanel} role="region" aria-labelledby={idBoton} inert={!abierto}>
              <div className="acordeon-contenido">{item.contenido}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
