import { useState } from "react";
import { useToast } from "../../context/ToastContext.jsx";
import { formatearUsd } from "../../helpers/reservas.js";
import Acordeon from "../ui/Acordeon.jsx";
import ModalConfirmar from "../ui/ModalConfirmar.jsx";

const fechaCorta = (iso) => new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// Pestaña "Mensajes": solicitudes del formulario de contacto, cada una en un acordeón
export default function MensajesAdmin({ coleccion }) {
  const toast = useToast();
  const [aEliminar, setAEliminar] = useState(null);

  const eliminar = () => {
    coleccion.eliminar(aEliminar.id);
    toast.info(`Se eliminó el mensaje de ${aEliminar.nombre}.`);
    setAEliminar(null);
  };

  if (coleccion.items.length === 0) {
    return <p className="no-results">Todavía no hay mensajes. Llegan desde el formulario de la vista Contacto.</p>;
  }

  const items = coleccion.items.map((m) => ({
    id: m.id,
    titulo: `${m.nombre} · ${m.paquete}`,
    meta: fechaCorta(m.fecha),
    contenido: (
      <div className="mensaje">
        <dl className="datos-lista datos-lista--fila">
          <div>
            <dt>Correo</dt>
            <dd>
              <a href={`mailto:${m.email}`}>{m.email}</a>
            </dd>
          </div>
          <div>
            <dt>Viajeros</dt>
            <dd>{m.viajeros}</dd>
          </div>
          <div>
            <dt>Total estimado</dt>
            <dd>{formatearUsd(m.total)}</dd>
          </div>
        </dl>
        <p className="mensaje-texto">{m.mensaje}</p>
        <button type="button" className="boton-texto peligro" onClick={() => setAEliminar(m)}>
          Eliminar mensaje
        </button>
      </div>
    ),
  }));

  return (
    <>
      <Acordeon items={items} multiple />
      <ModalConfirmar
        abierto={Boolean(aEliminar)}
        titulo="Eliminar mensaje"
        mensaje={aEliminar && `Se borrará el mensaje de ${aEliminar.nombre}. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        peligro
        onConfirmar={eliminar}
        onCerrar={() => setAEliminar(null)}
      />
    </>
  );
}
