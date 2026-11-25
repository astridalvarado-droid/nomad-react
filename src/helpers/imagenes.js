// Ayudas para mostrar las fotos de los destinos.

// Si una imagen no carga, la ocultamos y se ve el degradado de fondo
export const ocultarImagen = (e) => {
  e.currentTarget.style.display = "none";
};

// Degradado de respaldo de cada destino (clases .dest-media--* de styles.css)
const FONDOS = {
  "parque-tayrona": "tayrona",
  "cano-cristales": "cano",
  "valle-de-cocora": "cocora",
  "ciudad-perdida": "perdida",
  "chapada-diamantina": "chapada",
  pantanal: "pantanal",
  "foz-do-iguacu": "iguazu",
  "canaima-y-salto-angel": "canaima",
  "los-roques": "roques",
  "monte-roraima": "roraima",
};

export const claseFondo = (destinoId) => (FONDOS[destinoId] ? `dest-media--${FONDOS[destinoId]}` : "");

// Une la foto del catálogo (public/img) con las que subió el administrador.
// Devuelve [{ id, src, alt, catalogo }]: la primera es la portada.
export function imagenesDe(destino, subidas = []) {
  const deCatalogo = destino.img ? [{ id: "catalogo", src: destino.img, alt: destino.nombre, catalogo: true }] : [];
  const delPanel = subidas.map((foto, i) => ({
    id: foto.id,
    src: foto.dataUrl,
    alt: `${destino.nombre}, foto ${deCatalogo.length + i + 1}`,
    catalogo: false,
  }));
  return [...deCatalogo, ...delPanel];
}
