// Gestión de imágenes: validación (funciones puras, probadas en tests/archivos.test.js)
// y compresión en el navegador antes de guardarlas en localStorage.

export const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp"];
export const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
export const MIN_LADO = 200; // píxeles

// 1536 → "1,5 KB"; 2621440 → "2,5 MB"
export function formatearBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  const formato = (n) => n.toLocaleString("es-CO", { maximumFractionDigits: 1 });
  return kb < 1024 ? `${formato(kb)} KB` : `${formato(kb / 1024)} MB`;
}

// Revisa tipo y peso del archivo elegido. Devuelve el mensaje de error o "" si está bien.
export function validarArchivoImagen(archivo, { tipos = TIPOS_IMAGEN, maxBytes = MAX_BYTES } = {}) {
  if (!archivo) return "Selecciona una imagen.";
  if (!tipos.includes(archivo.type)) return "Formato no permitido. Usa una imagen JPG, PNG o WEBP.";
  if (archivo.size === 0) return "El archivo está vacío.";
  if (archivo.size > maxBytes) {
    return `La imagen pesa ${formatearBytes(archivo.size)} y el máximo es ${formatearBytes(maxBytes)}.`;
  }
  return "";
}

// Revisa las medidas reales de la imagen (se conocen cuando el navegador la abre)
export function validarDimensiones(ancho, alto, minimo = MIN_LADO) {
  if (ancho < minimo || alto < minimo) {
    return `La imagen mide ${ancho} × ${alto} px y debe tener al menos ${minimo} px por lado.`;
  }
  return "";
}

// Medidas finales sin deformar: el lado más largo queda en `maxLado` como máximo
export function calcularMedidas(ancho, alto, maxLado) {
  const escala = Math.min(1, maxLado / Math.max(ancho, alto));
  return { ancho: Math.round(ancho * escala), alto: Math.round(alto * escala) };
}

// Peso aproximado del archivo que representa un dataURL en base64
export function bytesDeDataUrl(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round((base64.length * 3) / 4);
}

// Abre la imagen, la reduce (y la recorta en cuadrado si se pide) y la convierte en JPEG.
// Así una foto de 4 MB queda en unos 200 KB y caben varias en localStorage.
export async function comprimirImagen(archivo, { maxLado = 1400, calidad = 0.82, cuadrado = false } = {}) {
  const url = URL.createObjectURL(archivo);
  try {
    const img = new Image();
    img.src = url;
    await img.decode(); // falla si el archivo no es una imagen válida (por ejemplo, está dañado)

    const anchoOriginal = img.naturalWidth;
    const altoOriginal = img.naturalHeight;

    // recorte: en modo cuadrado se toma el centro de la imagen
    const ladoCorto = Math.min(anchoOriginal, altoOriginal);
    const recorte = cuadrado
      ? { x: (anchoOriginal - ladoCorto) / 2, y: (altoOriginal - ladoCorto) / 2, ancho: ladoCorto, alto: ladoCorto }
      : { x: 0, y: 0, ancho: anchoOriginal, alto: altoOriginal };

    const { ancho, alto } = calcularMedidas(recorte.ancho, recorte.alto, maxLado);
    const lienzo = document.createElement("canvas");
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext("2d");
    ctx.fillStyle = "#141414"; // fondo para las partes transparentes de un PNG
    ctx.fillRect(0, 0, ancho, alto);
    ctx.drawImage(img, recorte.x, recorte.y, recorte.ancho, recorte.alto, 0, 0, ancho, alto);

    const dataUrl = lienzo.toDataURL("image/jpeg", calidad);
    return { dataUrl, ancho, alto, anchoOriginal, altoOriginal, bytes: bytesDeDataUrl(dataUrl) };
  } finally {
    URL.revokeObjectURL(url);
  }
}
