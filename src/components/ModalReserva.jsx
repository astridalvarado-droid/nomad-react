import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { MAX_NOTA, MAX_VIAJEROS, crearReserva, formatearUsd, primeraFechaReservable, validarReserva } from "../helpers/reservas.js";
import { CLAVES, guardar } from "../services/almacen.js";
import { navegar } from "../router.jsx";
import useColeccion from "../hooks/useColeccion.js";
import Modal from "./ui/Modal.jsx";
import Campo from "./Campo.jsx";

const VACIO = { fecha: "", viajeros: "2", nota: "" };

// Ventana para reservar un paquete. Sin sesión, invita a iniciar sesión.
// La reserva se guarda en localStorage y aparece en "Mi cuenta" y en el panel de administración.
export default function ModalReserva({ paquete, onCerrar }) {
  const { sesion } = useAuth();
  const toast = useToast();
  const reservas = useColeccion(CLAVES.reservas);
  const [datos, setDatos] = useState(VACIO);
  const [errores, setErrores] = useState({});

  const cerrar = () => {
    setDatos(VACIO);
    setErrores({});
    onCerrar();
  };

  const irALogin = () => {
    guardar(CLAVES.volverA, window.location.hash.slice(1) || "/", "session");
    cerrar();
    navegar("/login");
  };

  const cambiar = (e) => {
    const { name, value } = e.target;
    setDatos((d) => ({ ...d, [name]: value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: validarReserva({ ...datos, [name]: value })[name] ?? "" }));
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarReserva(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      e.currentTarget.elements[Object.keys(nuevos)[0]]?.focus();
      return;
    }

    const reserva = crearReserva({ paquete, usuario: sesion.usuario, ...datos });
    if (!reservas.agregar(reserva)) {
      toast.error("No hay espacio en el navegador para guardar la reserva.", "No se pudo reservar");
      return;
    }
    toast.exito(`${paquete.nombre} para ${reserva.viajeros} viajero(s). Puedes verla en Mi cuenta.`, "Reserva enviada");
    cerrar();
  };

  // el total solo se calcula con una cantidad de viajeros válida
  const cantidad = Number(datos.viajeros);
  const cantidadValida = Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= MAX_VIAJEROS;

  return (
    <Modal abierto={Boolean(paquete)} onCerrar={cerrar} titulo={paquete ? `Reservar: ${paquete.nombre}` : ""}>
      {paquete && !sesion && (
        <>
          <p className="modal-texto">Para reservar necesitas iniciar sesión. Así podrás seguir el estado de tu reserva desde tu cuenta.</p>
          <div className="modal-acciones">
            <button type="button" className="btn btn-ghost" onClick={cerrar}>
              Ahora no
            </button>
            <button type="button" className="btn btn-primary" onClick={irALogin} data-autofocus>
              Iniciar sesión
            </button>
          </div>
        </>
      )}

      {paquete && sesion && (
        <form onSubmit={enviar} noValidate>
          <p className="pkg-meta reserva-resumen">
            {paquete.destino} · {paquete.duracion} días · {formatearUsd(paquete.precio)} por persona
          </p>
          <div className="form-grid">
            <Campo id="reserva-fecha" label="Fecha de salida *" error={errores.fecha}>
              <input
                type="date"
                id="reserva-fecha"
                name="fecha"
                min={primeraFechaReservable()}
                value={datos.fecha}
                onChange={cambiar}
                aria-invalid={!!errores.fecha}
                aria-describedby="err-reserva-fecha"
              />
            </Campo>
            <Campo id="reserva-viajeros" label={`Viajeros (máx. ${MAX_VIAJEROS}) *`} error={errores.viajeros}>
              <input
                type="number"
                id="reserva-viajeros"
                name="viajeros"
                min="1"
                max={MAX_VIAJEROS}
                value={datos.viajeros}
                onChange={cambiar}
                aria-invalid={!!errores.viajeros}
                aria-describedby="err-reserva-viajeros"
              />
            </Campo>
            <Campo id="reserva-nota" label="Nota para el equipo (opcional)" error={errores.nota} full>
              <textarea
                id="reserva-nota"
                name="nota"
                rows="3"
                placeholder="Alergias, nivel de experiencia, dudas…"
                value={datos.nota}
                onChange={cambiar}
                aria-invalid={!!errores.nota}
                aria-describedby="err-reserva-nota"
              />
              <span className={`char-count${datos.nota.length > MAX_NOTA ? " is-over" : ""}`}>
                {datos.nota.length}/{MAX_NOTA}
              </span>
            </Campo>
          </div>
          <div className="reserva-total">
            <span>Total estimado</span>
            <strong>{cantidadValida ? formatearUsd(paquete.precio * cantidad) : "—"}</strong>
          </div>
          <div className="modal-acciones">
            <button type="button" className="btn btn-ghost" onClick={cerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Confirmar reserva
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
