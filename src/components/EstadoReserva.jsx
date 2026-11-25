import { ESTADOS } from "../helpers/reservas.js";

// Etiqueta de color con el estado de una reserva
export default function EstadoReserva({ estado }) {
  return <span className={`estado estado--${estado}`}>{ESTADOS[estado] ?? estado}</span>;
}
