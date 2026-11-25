import { formatearUsd } from "../helpers/reservas.js";

// Componente reutilizable: tarjeta de paquete (Paquetes y detalle de destino).
// Si recibe onReservar, muestra el botón "Reservar".
export default function PaqueteCard({ paquete: p, onReservar }) {
  return (
    <article className="pkg-card">
      <div className="pkg-body">
        <div className="pkg-top">
          <h3>{p.nombre}</h3>
          <span className="pkg-cat">{p.categoria}</span>
        </div>
        <p className="pkg-meta">{p.destino} · {p.duracion} días</p>
        <p className="pkg-desc">{p.descripcion}</p>
        <div className="pkg-price-row">
          <span className="pkg-price">{formatearUsd(p.precio)}</span>
          <span className="pkg-price-unit">por persona</span>
        </div>
        {onReservar && (
          <button type="button" className="btn btn-ghost btn-sm pkg-reservar" onClick={() => onReservar(p)}>
            Reservar
          </button>
        )}
      </div>
    </article>
  );
}
