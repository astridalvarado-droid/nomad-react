import { useState } from "react";
import { Link } from "../../router.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatearFecha, formatearUsd } from "../../helpers/reservas.js";
import { CLAVES } from "../../services/almacen.js";
import useColeccion from "../../hooks/useColeccion.js";
import EstadoReserva from "../EstadoReserva.jsx";
import ModalConfirmar from "../ui/ModalConfirmar.jsx";

// Pestaña "Mis reservas": solo las reservas del usuario con sesión iniciada
export default function ReservasCuenta({ usuario }) {
  const toast = useToast();
  const { items, actualizar } = useColeccion(CLAVES.reservas);
  const [aCancelar, setACancelar] = useState(null);

  const mias = items.filter((r) => r.usuario === usuario);

  const cancelar = () => {
    actualizar(aCancelar.id, { estado: "cancelada" });
    toast.info(`Cancelaste ${aCancelar.paqueteNombre}.`, "Reserva cancelada");
    setACancelar(null);
  };

  if (mias.length === 0) {
    return (
      <div className="vacio">
        <p>Aún no tienes reservas. Elige una expedición y reserva tu cupo.</p>
        <Link to="/paquetes" className="btn btn-primary">Ver paquetes</Link>
      </div>
    );
  }

  return (
    <>
      <ul className="reservas-lista">
        {mias.map((r) => (
          <li key={r.id} className="reserva">
            <div className="reserva-cabecera">
              <h3>{r.paqueteNombre}</h3>
              <EstadoReserva estado={r.estado} />
            </div>
            <p className="pkg-meta">
              Salida {formatearFecha(r.fecha)} · {r.viajeros} {r.viajeros === 1 ? "viajero" : "viajeros"} · {formatearUsd(r.total)}
            </p>
            {r.nota && <p className="reserva-nota">Nota: {r.nota}</p>}
            {r.estado !== "cancelada" && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setACancelar(r)}>
                Cancelar reserva
              </button>
            )}
          </li>
        ))}
      </ul>

      <ModalConfirmar
        abierto={Boolean(aCancelar)}
        titulo="Cancelar reserva"
        mensaje={aCancelar && `¿Seguro que quieres cancelar ${aCancelar.paqueteNombre} con salida el ${formatearFecha(aCancelar.fecha)}?`}
        textoConfirmar="Sí, cancelar"
        peligro
        onConfirmar={cancelar}
        onCerrar={() => setACancelar(null)}
      />
    </>
  );
}
