const ICONOS = { exito: "✓", error: "!", info: "i" };

// Un aviso de la pila de notificaciones (lo pinta ToastProvider)
export default function Toast({ tipo, titulo, mensaje, onCerrar }) {
  return (
    <div className={`toast toast--${tipo}`} role={tipo === "error" ? "alert" : "status"}>
      <span className="toast-icono" aria-hidden="true">
        {ICONOS[tipo]}
      </span>
      <div className="toast-texto">
        {titulo && <strong>{titulo}</strong>}
        <p>{mensaje}</p>
      </div>
      <button type="button" className="toast-cerrar" aria-label="Cerrar notificación" onClick={onCerrar}>
        ×
      </button>
    </div>
  );
}
