import { Link } from "../router.jsx";
import { CLAVES } from "../services/almacen.js";
import { claseFondo, imagenesDe, ocultarImagen } from "../helpers/imagenes.js";
import useColeccion from "../hooks/useColeccion.js";

// Diapositiva del carrusel de Inicio: foto del destino (o su degradado) con la información encima
export default function DiapositivaDestino({ destino: d, posicion, total }) {
  const { items: subidas } = useColeccion(CLAVES.galeria(d.id));
  const portada = imagenesDe(d, subidas)[0];

  return (
    <article className={`diapo ${claseFondo(d.id)}`}>
      {portada && <img className="diapo-img" src={portada.src} alt="" onError={ocultarImagen} />}
      <div className="diapo-info">
        <p className="diapo-numero">
          {String(posicion).padStart(2, "0")} / {String(total).padStart(2, "0")} · {d.tipo}
        </p>
        <h3>{d.nombre}</h3>
        <p className="diapo-lugar">{d.ubicacion}</p>
        <p className="diapo-destacado">★ {d.destacado}</p>
        <Link to={`/destinos/${d.id}`} className="btn btn-primary">Ver destino</Link>
      </div>
    </article>
  );
}
