import { useState } from "react";
import { usuarios } from "../../data/usuarios.js";
import { useToast } from "../../context/ToastContext.jsx";
import { ESTADOS, formatearFecha, formatearUsd } from "../../helpers/reservas.js";
import EstadoReserva from "../EstadoReserva.jsx";
import Dropdown from "../ui/Dropdown.jsx";
import ModalConfirmar from "../ui/ModalConfirmar.jsx";

const FILTROS = ["todas", ...Object.keys(ESTADOS)];
const nombreDe = (usuario) => usuarios.find((u) => u.usuario === usuario)?.nombre ?? usuario;

// Pestaña "Reservas": todas las reservas, con filtro por estado y acciones por fila
export default function ReservasAdmin({ coleccion }) {
  const toast = useToast();
  const [filtro, setFiltro] = useState("todas");
  const [aEliminar, setAEliminar] = useState(null);

  const visibles = coleccion.items.filter((r) => filtro === "todas" || r.estado === filtro);

  const cambiarEstado = (reserva, estado) => {
    coleccion.actualizar(reserva.id, { estado });
    toast.exito(`${reserva.paqueteNombre} de ${nombreDe(reserva.usuario)}: ${ESTADOS[estado].toLowerCase()}.`, "Reserva actualizada");
  };

  const eliminar = () => {
    coleccion.eliminar(aEliminar.id);
    toast.info("La reserva se eliminó del registro.");
    setAEliminar(null);
  };

  const acciones = (r) => [
    ...Object.keys(ESTADOS)
      .filter((estado) => estado !== r.estado)
      .map((estado) => ({ id: estado, etiqueta: `Marcar como ${ESTADOS[estado].toLowerCase()}`, onSelect: () => cambiarEstado(r, estado) })),
    { tipo: "separador" },
    { id: "eliminar", etiqueta: "Eliminar del registro", peligro: true, onSelect: () => setAEliminar(r) },
  ];

  if (coleccion.items.length === 0) {
    return <p className="no-results">Todavía no hay reservas. Aparecen aquí cuando un usuario reserva un paquete.</p>;
  }

  return (
    <>
      <div className="filter-group admin-filtros">
        {FILTROS.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-btn${filtro === f ? " active" : ""}`}
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
          >
            {f === "todas" ? "todas" : ESTADOS[f].toLowerCase()}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="no-results">No hay reservas con ese estado.</p>
      ) : (
        <table className="tabla tabla--reservas">
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Paquete</th>
              <th scope="col">Salida</th>
              <th scope="col">Viajeros</th>
              <th scope="col">Total</th>
              <th scope="col">Estado</th>
              <th scope="col"><span className="solo-lector">Acciones</span></th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((r) => (
              <tr key={r.id}>
                <td data-etiqueta="Cliente">
                  <span>
                    {nombreDe(r.usuario)} <code>{r.usuario}</code>
                  </span>
                </td>
                <td data-etiqueta="Paquete">{r.paqueteNombre}</td>
                <td data-etiqueta="Salida">{formatearFecha(r.fecha)}</td>
                <td data-etiqueta="Viajeros">{r.viajeros}</td>
                <td data-etiqueta="Total">{formatearUsd(r.total)}</td>
                <td data-etiqueta="Estado"><EstadoReserva estado={r.estado} /></td>
                <td className="tabla-acciones">
                  <Dropdown etiqueta={`Acciones de la reserva de ${nombreDe(r.usuario)}`} alinear="derecha" claseBoton="btn-sm" items={acciones(r)} boton="Acciones" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ModalConfirmar
        abierto={Boolean(aEliminar)}
        titulo="Eliminar reserva"
        mensaje={aEliminar && `Se borrará la reserva de ${nombreDe(aEliminar.usuario)} (${aEliminar.paqueteNombre}). El usuario dejará de verla en su cuenta.`}
        textoConfirmar="Eliminar"
        peligro
        onConfirmar={eliminar}
        onCerrar={() => setAEliminar(null)}
      />
    </>
  );
}
