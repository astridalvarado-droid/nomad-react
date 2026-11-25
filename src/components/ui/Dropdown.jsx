import { useEffect, useId, useRef, useState } from "react";
import { navegar } from "../../router.jsx";

// Menú desplegable reutilizable.
//   boton:    contenido visible del botón que abre el menú
//   etiqueta: nombre del menú para lectores de pantalla
//   items:    [{ id, etiqueta, to?, onSelect?, activo?, peligro? }]
//             también { tipo: "encabezado", contenido } y { tipo: "separador" }
//   activo:   si se usa (true/false) el menú funciona como selector y marca la opción elegida.
// Se cierra al elegir, al hacer clic fuera o con Escape. Las flechas ↑ ↓ recorren las opciones.
export default function Dropdown({ boton, etiqueta, items, alinear = "izquierda", claseBoton = "" }) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef(null);
  const botonRef = useRef(null);
  const opcionesRef = useRef([]);
  const idMenu = useId();

  const opciones = items.filter((i) => !i.tipo);
  const esSelector = opciones.some((o) => o.activo !== undefined);

  // clic fuera del menú: se cierra
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e) => {
      if (!raiz.current?.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("pointerdown", alPresionar);
    return () => document.removeEventListener("pointerdown", alPresionar);
  }, [abierto]);

  // al abrir, el foco pasa a la opción elegida (o a la primera)
  useEffect(() => {
    if (!abierto) return;
    const elegida = opciones.findIndex((o) => o.activo);
    opcionesRef.current[Math.max(0, elegida)]?.focus();
  }, [abierto]); // solo al abrir: las opciones no cambian mientras el menú está abierto

  const cerrar = (devolverFoco = true) => {
    setAbierto(false);
    if (devolverFoco) botonRef.current?.focus();
  };

  const elegir = (e, opcion) => {
    e.preventDefault();
    cerrar();
    if (opcion.to) navegar(opcion.to);
    opcion.onSelect?.();
  };

  const alTeclearMenu = (e) => {
    const actual = opcionesRef.current.indexOf(document.activeElement);
    const ultimo = opciones.length - 1;
    const destinos = { ArrowDown: actual >= ultimo ? 0 : actual + 1, ArrowUp: actual <= 0 ? ultimo : actual - 1, Home: 0, End: ultimo };

    if (e.key === "Escape") {
      e.preventDefault();
      cerrar();
    } else if (e.key === "Tab") {
      cerrar(false);
    } else if (e.key in destinos) {
      e.preventDefault();
      opcionesRef.current[destinos[e.key]]?.focus();
    }
  };

  const alTeclearBoton = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAbierto(true);
    }
  };

  let indice = -1; // posición de cada opción (sin contar encabezados ni separadores)

  return (
    <div className={`dropdown${abierto ? " abierto" : ""}`} ref={raiz}>
      <button
        type="button"
        ref={botonRef}
        className={`dropdown-boton ${claseBoton}`.trim()}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((a) => !a)}
        onKeyDown={alTeclearBoton}
      >
        {boton}
        <span className="dropdown-flecha" aria-hidden="true" />
      </button>

      {abierto && (
        <div className={`dropdown-menu dropdown-menu--${alinear}`} role="menu" id={idMenu} aria-label={etiqueta} onKeyDown={alTeclearMenu}>
          {items.map((item, i) => {
            if (item.tipo === "separador") return <div key={`sep-${i}`} className="dropdown-separador" role="separator" />;
            if (item.tipo === "encabezado") {
              return (
                <div key={`enc-${i}`} className="dropdown-encabezado">
                  {item.contenido}
                </div>
              );
            }

            indice += 1;
            const posicion = indice;
            const clases = ["dropdown-item", item.peligro && "peligro", item.activo && "activo"].filter(Boolean).join(" ");
            const comunes = {
              ref: (nodo) => {
                opcionesRef.current[posicion] = nodo;
              },
              role: esSelector ? "menuitemradio" : "menuitem",
              "aria-checked": esSelector ? Boolean(item.activo) : undefined,
              tabIndex: -1,
              className: clases,
              onClick: (e) => elegir(e, item),
            };

            return item.to ? (
              <a key={item.id} href={`#${item.to}`} {...comunes}>
                {item.etiqueta}
              </a>
            ) : (
              <button key={item.id} type="button" {...comunes}>
                {item.etiqueta}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
