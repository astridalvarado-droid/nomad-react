import { Link } from "../router.jsx";
import { CLAVES } from "../services/almacen.js";
import { claseFondo, imagenesDe, ocultarImagen } from "../helpers/imagenes.js";
import useColeccion from "../hooks/useColeccion.js";

// Componente reutilizable: tarjeta de destino (vista Destinos).
// La portada es la foto del catálogo o, si no hay, la primera que subió el administrador.
export default function DestinoCard({ destino: d }) {
  const { items: subidas } = useColeccion(CLAVES.galeria(d.id));
  const portada = imagenesDe(d, subidas)[0];

  return (
    <Link className="dest-card" to={`/destinos/${d.id}`}>
      <div className={`dest-media ${claseFondo(d.id)}`}>
        {portada && <img src={portada.src} alt={portada.alt} loading="lazy" onError={ocultarImagen} />}
        <span className="dest-tag">{d.tipo}</span>
      </div>
      <div className="dest-body">
        <div className="dest-top">
          <h3>{d.nombre}</h3>
          <span className="dest-loc">{d.ubicacion}</span>
        </div>
        <p>{d.descripcion}</p>
        <p className="dest-feature">★ {d.destacado}</p>
      </div>
    </Link>
  );
}
