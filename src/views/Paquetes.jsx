import { useState } from "react";
import { paquetes } from "../data/catalogo.js";
import { ORDENES, formatearUsd, ordenarPaquetes } from "../helpers/reservas.js";
import useTitulo from "../hooks/useTitulo.js";
import SectionHead from "../components/SectionHead.jsx";
import PaqueteCard from "../components/PaqueteCard.jsx";
import ModalReserva from "../components/ModalReserva.jsx";
import Dropdown from "../components/ui/Dropdown.jsx";

export default function Paquetes() {
  useTitulo("Paquetes");

  // Estados de la calculadora
  const [paqueteId, setPaqueteId] = useState(paquetes[0].id);
  const [viajeros, setViajeros] = useState("2");

  // Orden de la lista y paquete que se está reservando (abre el modal)
  const [orden, setOrden] = useState("recomendados");
  const [aReservar, setAReservar] = useState(null);

  const paquete = paquetes.find((p) => p.id === paqueteId);
  const cantidad = Math.max(1, parseInt(viajeros, 10) || 1);
  const total = paquete.precio * cantidad;
  const lista = ordenarPaquetes(paquetes, orden);

  const opcionesOrden = Object.entries(ORDENES).map(([id, etiqueta]) => ({
    id,
    etiqueta,
    activo: id === orden,
    onSelect: () => setOrden(id),
  }));

  return (
    <section className="section section--alt">
      <SectionHead titulo="Paquetes" texto="Elige una ruta, reserva tu cupo o calcula el total de tu grupo." />

      <div className="controls">
        <p className="controls-total">{paquetes.length} paquetes</p>
        <Dropdown
          etiqueta="Ordenar paquetes"
          alinear="derecha"
          items={opcionesOrden}
          boton={
            <>
              <span className="dropdown-prefijo">Ordenar:</span> {ORDENES[orden]}
            </>
          }
        />
      </div>

      <div className="card-grid">
        {lista.map((p) => (
          <PaqueteCard key={p.id} paquete={p} onReservar={setAReservar} />
        ))}
      </div>

      <div className="calculator">
        <h3>Calculadora de viaje</h3>
        <div className="calc-row">
          <div className="calc-field">
            <label htmlFor="calcPackage">Paquete</label>
            <select id="calcPackage" value={paqueteId} onChange={(e) => setPaqueteId(e.target.value)}>
              {paquetes.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <div className="calc-field calc-field--narrow">
            <label htmlFor="calcTravelers">Viajeros</label>
            <input
              type="number"
              id="calcTravelers"
              min="1"
              max="20"
              value={viajeros}
              onChange={(e) => setViajeros(e.target.value)}
            />
          </div>
        </div>
        <div className="calc-result">
          <span className="calc-result-label">Total estimado</span>
          <span className="calc-result-value">{formatearUsd(total)}</span>
        </div>
      </div>

      <ModalReserva paquete={aReservar} onCerrar={() => setAReservar(null)} />
    </section>
  );
}
