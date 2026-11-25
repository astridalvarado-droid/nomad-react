import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Toast from "../components/ui/Toast.jsx";

/* Notificaciones Toast: cualquier componente puede mostrar un aviso con
     const toast = useToast();
     toast.exito("Reserva enviada");  toast.error("...");  toast.info("...");
   Cada aviso se cierra solo a los 4,5 segundos o con su botón ×. Se ven máximo 3 a la vez. */

const DURACION_MS = 4500;
const MAX_VISIBLES = 3;
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);
  const temporizadores = useRef(new Map());
  const siguienteId = useRef(1);

  const cerrar = useCallback((id) => {
    clearTimeout(temporizadores.current.get(id));
    temporizadores.current.delete(id);
    setAvisos((lista) => lista.filter((a) => a.id !== id));
  }, []);

  const mostrar = useCallback(
    (tipo, mensaje, titulo) => {
      const id = siguienteId.current++;
      // si ya hay 3 avisos, el más antiguo sale para dejar espacio
      setAvisos((lista) => [...lista, { id, tipo, mensaje, titulo }].slice(-MAX_VISIBLES));
      temporizadores.current.set(id, setTimeout(() => cerrar(id), DURACION_MS));
    },
    [cerrar]
  );

  // al desmontar la app se cancelan los temporizadores pendientes
  useEffect(() => {
    const pendientes = temporizadores.current;
    return () => pendientes.forEach(clearTimeout);
  }, []);

  const api = useMemo(
    () => ({
      exito: (mensaje, titulo) => mostrar("exito", mensaje, titulo),
      error: (mensaje, titulo) => mostrar("error", mensaje, titulo),
      info: (mensaje, titulo) => mostrar("info", mensaje, titulo),
    }),
    [mostrar]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" aria-label="Notificaciones">
        {avisos.map((a) => (
          <Toast key={a.id} {...a} onCerrar={() => cerrar(a.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return contexto;
}
