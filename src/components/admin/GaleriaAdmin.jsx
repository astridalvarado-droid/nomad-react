import { useState } from "react";
import { destinos } from "../../data/catalogo.js";
import { useToast } from "../../context/ToastContext.jsx";
import { imagenesDe } from "../../helpers/imagenes.js";
import { CLAVES } from "../../services/almacen.js";
import useColeccion from "../../hooks/useColeccion.js";
import Campo from "../Campo.jsx";
import CargaImagen from "../ui/CargaImagen.jsx";
import ModalConfirmar from "../ui/ModalConfirmar.jsx";

// Pestaña "Galería": subir y eliminar fotos de cada destino.
// Las fotos aparecen en el carrusel del detalle del destino y como portada si no tiene foto de catálogo.
export default function GaleriaAdmin() {
  const toast = useToast();
  const [destinoId, setDestinoId] = useState(destinos[0].id);
  const [aEliminar, setAEliminar] = useState(null);

  const destino = destinos.find((d) => d.id === destinoId);
  const galeria = useColeccion(CLAVES.galeria(destinoId));
  const fotos = imagenesDe(destino, galeria.items);

  const guardarFoto = (imagen) => {
    const guardada = galeria.agregar({
      id: `${Date.now()}`,
      dataUrl: imagen.dataUrl,
      nombre: imagen.nombre,
      subida: new Date().toISOString(),
    });
    if (guardada) toast.exito(`Se agregó a la galería de ${destino.nombre}.`, "Foto guardada");
    else toast.error("El almacenamiento del navegador está lleno. Elimina alguna foto e inténtalo de nuevo.", "No se pudo guardar");
    return guardada;
  };

  const eliminar = () => {
    galeria.eliminar(aEliminar.id);
    toast.info(`Se eliminó una foto de ${destino.nombre}.`);
    setAEliminar(null);
  };

  return (
    <div className="galeria-admin">
      <div className="galeria-admin-subir">
        <Campo id="galeria-destino" label="Destino">
          <select id="galeria-destino" value={destinoId} onChange={(e) => setDestinoId(e.target.value)}>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </Campo>
        {/* key: al cambiar de destino se descarta la vista previa pendiente */}
        <CargaImagen key={destinoId} onGuardar={guardarFoto} textoGuardar={`Agregar a ${destino.nombre}`} />
      </div>

      <div>
        <h3 className="subtitulo">
          Fotos de {destino.nombre} ({fotos.length})
        </h3>
        {fotos.length === 0 ? (
          <p className="no-results">Este destino aún no tiene fotos. La que subas será su portada.</p>
        ) : (
          <ul className="galeria-grid">
            {fotos.map((f, i) => (
              <li key={f.id}>
                <img src={f.src} alt={f.alt} loading="lazy" />
                <div className="galeria-pie">
                  <span>{i === 0 ? "Portada" : `Foto ${i + 1}`}</span>
                  {f.catalogo ? (
                    <span className="galeria-fija">del catálogo</span>
                  ) : (
                    <button type="button" className="boton-texto peligro" onClick={() => setAEliminar(f)}>
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ModalConfirmar
        abierto={Boolean(aEliminar)}
        titulo="Eliminar foto"
        mensaje={`La foto se quitará de la galería de ${destino.nombre}. Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        peligro
        onConfirmar={eliminar}
        onCerrar={() => setAEliminar(null)}
      />
    </div>
  );
}
