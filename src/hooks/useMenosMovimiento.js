import { useSyncExternalStore } from "react";

// true si el usuario pidió en su sistema operativo "reducir movimiento".
// Se usa para no pasar las diapositivas del carrusel solas.
const consulta = () => window.matchMedia("(prefers-reduced-motion: reduce)");

function suscribir(alCambiar) {
  const mq = consulta();
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

export default function useMenosMovimiento() {
  return useSyncExternalStore(suscribir, () => consulta().matches);
}
