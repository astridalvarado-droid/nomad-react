import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Ventana modal reutilizable.
//   - Se cierra con Escape, con el botón × o haciendo clic fuera de la caja.
//   - Mientras está abierta, la tecla Tab no sale de la ventana y la página de fondo no se desplaza.
//   - Al cerrarse, el foco vuelve al botón que la abrió.
// Un elemento con el atributo data-autofocus recibe el foco al abrir.
export default function Modal({ abierto, onCerrar, titulo, ancho = "normal", children }) {
  const idTitulo = useId();
  const caja = useRef(null);
  const cerrarRef = useRef(onCerrar);

  useEffect(() => {
    cerrarRef.current = onCerrar;
  });

  useEffect(() => {
    if (!abierto) return;

    const anterior = document.activeElement;
    const nodo = caja.current;
    const primero = nodo.querySelector("[data-autofocus]") ?? nodo.querySelector(`.modal-cuerpo :is(${ENFOCABLES})`);
    (primero ?? nodo).focus();
    document.body.classList.add("sin-scroll");

    const alTeclear = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrarRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      // trampa de foco: de la última opción se vuelve a la primera y al revés
      const opciones = [...nodo.querySelectorAll(ENFOCABLES)];
      if (opciones.length === 0) return;
      const inicio = opciones[0];
      const fin = opciones[opciones.length - 1];
      if (e.shiftKey && document.activeElement === inicio) {
        e.preventDefault();
        fin.focus();
      } else if (!e.shiftKey && document.activeElement === fin) {
        e.preventDefault();
        inicio.focus();
      }
    };

    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("keydown", alTeclear);
      document.body.classList.remove("sin-scroll");
      anterior?.focus?.();
    };
  }, [abierto]);

  if (!abierto) return null;

  return createPortal(
    <div className="modal-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div
        className={`modal modal--${ancho}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        ref={caja}
        tabIndex={-1}
      >
        <header className="modal-cabecera">
          <h2 id={idTitulo}>{titulo}</h2>
          <button type="button" className="modal-cerrar" aria-label="Cerrar ventana" onClick={onCerrar}>
            ×
          </button>
        </header>
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>,
    document.body
  );
}
