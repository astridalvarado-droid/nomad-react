import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { guardar, leerCrudo, parsear, suscribir } from "../services/almacen.js";

// Funciona como useState, pero el valor queda guardado en el navegador.
//   const [valor, setValor] = useAlmacenamiento("nomad:algo", valorInicial, "local" | "session");
// useSyncExternalStore mantiene sincronizados todos los componentes que usan la misma clave:
// si uno la cambia, los demás se vuelven a pintar solos.
// setValor devuelve true si se pudo guardar y false si el almacenamiento está lleno.
export default function useAlmacenamiento(clave, valorInicial, tipo = "local") {
  const inicial = useRef(valorInicial);

  const crudo = useSyncExternalStore(suscribir, () => leerCrudo(clave, tipo));
  const valor = useMemo(() => parsear(crudo, inicial.current), [crudo]);

  const setValor = useCallback(
    (nuevo) => {
      const actual = parsear(leerCrudo(clave, tipo), inicial.current);
      const siguiente = typeof nuevo === "function" ? nuevo(actual) : nuevo;
      return guardar(clave, siguiente, tipo);
    },
    [clave, tipo]
  );

  return [valor, setValor];
}
