import { useId, useState } from "react";
import { MAX_BYTES, MIN_LADO, comprimirImagen, formatearBytes, validarArchivoImagen, validarDimensiones } from "../../helpers/archivos.js";

// Selección, validación, vista previa y carga de una imagen.
//   1. El usuario elige un archivo (clic o arrastrar y soltar).
//   2. Se valida el tipo y el peso; después se abre la imagen y se validan las medidas.
//   3. Se comprime y se muestra la vista previa con su información.
//   4. Con "Guardar" se entrega la imagen al componente padre: onGuardar({ dataUrl, nombre, ... }).
//      onGuardar devuelve true si se guardó; si devuelve false se mantiene la vista previa.
export default function CargaImagen({ onGuardar, textoGuardar = "Guardar imagen", cuadrado = false, maxLado = 1400 }) {
  const idInput = useId();
  const [vista, setVista] = useState(null);
  const [error, setError] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  async function procesar(archivo) {
    setError("");
    setVista(null);

    const problema = validarArchivoImagen(archivo);
    if (problema) {
      setError(problema);
      return;
    }

    setProcesando(true);
    try {
      const imagen = await comprimirImagen(archivo, { maxLado, cuadrado });
      const medidas = validarDimensiones(imagen.anchoOriginal, imagen.altoOriginal);
      if (medidas) setError(medidas);
      else setVista({ ...imagen, nombre: archivo.name, bytesOriginal: archivo.size });
    } catch {
      setError("No se pudo abrir la imagen. Puede que el archivo esté dañado.");
    } finally {
      setProcesando(false);
    }
  }

  const alElegir = (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (archivo) procesar(archivo);
  };

  const alSoltar = (e) => {
    e.preventDefault();
    setArrastrando(false);
    const archivo = e.dataTransfer.files?.[0];
    if (archivo) procesar(archivo);
  };

  const guardar = () => {
    if (onGuardar({ dataUrl: vista.dataUrl, nombre: vista.nombre, ancho: vista.ancho, alto: vista.alto, bytes: vista.bytes })) {
      setVista(null);
    }
  };

  return (
    <div className="carga">
      {!vista && (
        <label
          htmlFor={idInput}
          className={`carga-zona${arrastrando ? " arrastrando" : ""}${error ? " con-error" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={alSoltar}
        >
          <span className="carga-icono" aria-hidden="true">＋</span>
          <span className="carga-titulo">{procesando ? "Procesando imagen…" : "Arrastra una imagen o haz clic para elegirla"}</span>
          <span className="carga-ayuda">
            JPG, PNG o WEBP · máximo {formatearBytes(MAX_BYTES)} · mínimo {MIN_LADO} px por lado
          </span>
          <input
            id={idInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="carga-input"
            onChange={alElegir}
            disabled={procesando}
            aria-describedby={error ? `${idInput}-error` : undefined}
          />
        </label>
      )}

      {error && (
        <p className="carga-error" id={`${idInput}-error`} role="alert">
          {error}
        </p>
      )}

      {vista && (
        <div className="carga-vista">
          <img src={vista.dataUrl} alt="Vista previa de la imagen elegida" className={cuadrado ? "cuadrada" : ""} />
          <dl className="carga-datos">
            <div>
              <dt>Archivo</dt>
              <dd>{vista.nombre}</dd>
            </div>
            <div>
              <dt>Medidas</dt>
              <dd>
                {vista.anchoOriginal} × {vista.altoOriginal} px → {vista.ancho} × {vista.alto} px
              </dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>
                {formatearBytes(vista.bytesOriginal)} → {formatearBytes(vista.bytes)}
              </dd>
            </div>
          </dl>
          <div className="carga-acciones">
            <button type="button" className="btn btn-primary btn-sm" onClick={guardar}>
              {textoGuardar}
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setVista(null)}>
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
