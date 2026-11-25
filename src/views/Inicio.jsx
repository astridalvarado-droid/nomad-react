import { destinos } from "../data/catalogo.js";
import { Link } from "../router.jsx";
import { ocultarImagen } from "../helpers/imagenes.js";
import useTitulo from "../hooks/useTitulo.js";
import SectionHead from "../components/SectionHead.jsx";
import Carrusel from "../components/ui/Carrusel.jsx";
import DiapositivaDestino from "../components/DiapositivaDestino.jsx";

// Destinos que se muestran en el carrusel de Inicio
const DESTACADOS = ["parque-tayrona", "cano-cristales", "ciudad-perdida", "canaima-y-salto-angel", "monte-roraima"];

export default function Inicio() {
  useTitulo("Inicio");

  const seleccion = DESTACADOS.map((id) => destinos.find((d) => d.id === id));
  const diapositivas = seleccion.map((d, i) => ({
    id: d.id,
    contenido: <DiapositivaDestino destino={d} posicion={i + 1} total={seleccion.length} />,
  }));

  return (
    <>
      <section className="hero">
        <img src="img/hero-agencia.jpg" alt="" className="hero-bg-img" onError={ocultarImagen} />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-coords">05°32'N — 73°21'O</p>
          <h1>El mapa termina<br />donde empieza NÖMAD.</h1>
          <p className="hero-sub">
            Expediciones de aventura y naturaleza por Colombia, Brasil y Venezuela. Territorio real,
            guías locales, cero relleno.
          </p>
          <div className="hero-actions">
            <Link to="/destinos" className="btn btn-primary">Ver destinos</Link>
            <Link to="/paquetes" className="btn btn-ghost">Ver paquetes</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHead titulo="Destinos destacados" texto="Cinco puntos del mapa para empezar. Pasa las diapositivas o deja que avancen solas." />
        <Carrusel etiqueta="Destinos destacados" diapositivas={diapositivas} />
        <p className="inicio-mas">
          <Link to="/destinos" className="back-link">ver los {destinos.length} destinos →</Link>
        </p>
      </section>
    </>
  );
}
