import { useSyncExternalStore } from "react";

/* ROUTER POR HASH (#/ruta)
   - useRuta(): devuelve la ruta actual y se actualiza cuando cambia el hash.
   - Link: enlace interno; al hacer clic cambia el hash y React vuelve a pintar.
   - navegar(): cambia de vista desde el código (después de iniciar sesión, por ejemplo). */

const EVENTO = "nomad:ruta";

const leerRuta = () => window.location.hash.slice(1) || "/";

function suscribir(alCambiar) {
  window.addEventListener("hashchange", alCambiar);
  window.addEventListener(EVENTO, alCambiar);
  return () => {
    window.removeEventListener("hashchange", alCambiar);
    window.removeEventListener(EVENTO, alCambiar);
  };
}

export function useRuta() {
  return useSyncExternalStore(suscribir, leerRuta);
}

// reemplazar: true no deja la ruta actual en el historial (el botón "atrás" no vuelve a ella)
export function navegar(ruta, { reemplazar = false } = {}) {
  if (reemplazar) window.location.replace(`#${ruta}`);
  else window.location.hash = ruta;
  // el evento "hashchange" llega un instante después; avisamos ya para que React pinte de inmediato
  window.dispatchEvent(new Event(EVENTO));
}

export function Link({ to, children, ...resto }) {
  return (
    <a href={`#${to}`} {...resto}>
      {children}
    </a>
  );
}
