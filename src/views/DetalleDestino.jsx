import { useState } from "react";
import { paquetes } from "../data/catalogo.js";
import { Link } from "../router.jsx";
import { CLAVES } from "../services/almacen.js";
import { claseFondo, imagenesDe, ocultarImagen } from "../helpers/imagenes.js";
import useTitulo from "../hooks/useTitulo.js";
import useColeccion from "../hooks/useColeccion.js";
import Carrusel from "../components/ui/Carrusel.jsx";
import PaqueteCard from "../components/PaqueteCard.jsx";
import ModalReserva from "../components/ModalReserva.jsx";
import ClimaDestino from "../components/ClimaDestino.jsx";

// Vista DINÁMICA: el contenido depende del :id de la URL (#/destinos/parque-tayrona)
export default function DetalleDestino({ destino: d }) {
  useTitulo(d.nombre);
  const { items: subidas } = useColeccion(CLAVES.galeria(d.id));
  const [aReservar, setAReservar] = useState(null);

  const fotos = imagenesDe(d, subidas);
  const relacionados = paquetes.filter((p) => d.nombre.split(" y ").some((k) => p.destino.includes(k)));

  return (
    <section className="section detail">
      <Link to="/destinos" className="back-link">← volver a destinos</Link>

      {/* Galería: foto del catálogo + fotos subidas desde el panel de administración */}
      <div className="detalle-galeria">
        {fotos.length > 0 ? (
          <Carrusel
            etiqueta={`Fotos de ${d.nombre}`}
            clase="carrusel--galeria"
            intervalo={5000}
            diapositivas={fotos.map((f) => ({
              id: f.id,
              contenido: <img className="galeria-foto" src={f.src} alt={f.alt} onError={ocultarImagen} />,
            }))}
          />
        ) : (
          <div className={`dest-media detail-media ${claseFondo(d.id)}`} />
        )}
        <span className="dest-tag">{d.tipo}</span>
      </div>

      <h1>{d.nombre}</h1>
      <p className="dest-loc">{d.ubicacion}</p>
      <p className="detail-text">{d.descripcion}</p>
      <p className="dest-feature">★ {d.destacado}</p>

      <ClimaDestino destino={d} />

      <h2 className="detail-sub">Paquetes que incluyen este destino</h2>
      <div className="card-grid">
        {relacionados.length > 0 ? (
          relacionados.map((p) => <PaqueteCard key={p.id} paquete={p} onReservar={setAReservar} />)
        ) : (
          <p className="no-results">Aún no hay paquetes para este destino.</p>
        )}
      </div>

      <ModalReserva paquete={aReservar} onCerrar={() => setAReservar(null)} />
    </section>
  );
}
