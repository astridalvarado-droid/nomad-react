// Persistencia en el navegador: guarda y lee datos JSON en localStorage o sessionStorage.
//   - localStorage: los datos quedan aunque se cierre el navegador.
//   - sessionStorage: los datos duran solo mientras la pestaña esté abierta.
// Cada vez que algo cambia se lanza un evento, así todos los componentes que usan esa
// clave (hook useAlmacenamiento) se vuelven a pintar con el dato nuevo.

const EVENTO = "nomad:almacen";

// Todas las claves del proyecto en un solo lugar (empiezan por "nomad:")
export const CLAVES = {
  sesion: "nomad:sesion",
  volverA: "nomad:volver-a",
  reservas: "nomad:reservas",
  mensajes: "nomad:mensajes",
  filtrosDestinos: "nomad:filtros-destinos",
  galeria: (destinoId) => `nomad:galeria:${destinoId}`,
  avatar: (usuario) => `nomad:avatar:${usuario}`,
  pestana: (nombre) => `nomad:pestana:${nombre}`,
};

function obtenerAlmacen(tipo) {
  try {
    return tipo === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null; // el navegador bloquea el almacenamiento (por ejemplo, cookies desactivadas)
  }
}

// Texto tal cual está guardado (o null si no existe)
export function leerCrudo(clave, tipo = "local") {
  try {
    return obtenerAlmacen(tipo)?.getItem(clave) ?? null;
  } catch {
    return null;
  }
}

// Convierte el texto guardado en un valor de JavaScript. Si está dañado, devuelve el valor inicial.
export function parsear(crudo, valorInicial) {
  if (crudo === null) return valorInicial;
  try {
    return JSON.parse(crudo);
  } catch {
    return valorInicial;
  }
}

export function leer(clave, valorInicial = null, tipo = "local") {
  return parsear(leerCrudo(clave, tipo), valorInicial);
}

// Guarda un valor. Con null o undefined borra la clave.
// Devuelve true si se guardó y false si el almacenamiento está lleno o bloqueado.
export function guardar(clave, valor, tipo = "local") {
  const almacen = obtenerAlmacen(tipo);
  if (!almacen) return false;

  try {
    if (valor === null || valor === undefined) almacen.removeItem(clave);
    else almacen.setItem(clave, JSON.stringify(valor));
  } catch {
    return false; // QuotaExceededError: ya no cabe más información
  }

  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { clave, tipo } }));
  return true;
}

export const borrar = (clave, tipo = "local") => guardar(clave, null, tipo);

// Ejecuta `alCambiar` cuando cambia cualquier dato, en esta pestaña o en otra del mismo sitio.
// Devuelve la función para cancelar la suscripción.
export function suscribir(alCambiar) {
  window.addEventListener(EVENTO, alCambiar);
  window.addEventListener("storage", alCambiar);
  return () => {
    window.removeEventListener(EVENTO, alCambiar);
    window.removeEventListener("storage", alCambiar);
  };
}

// Espacio que ocupan los datos del proyecto en localStorage (cada carácter ocupa 2 bytes)
export function bytesUsados(tipo = "local") {
  const almacen = obtenerAlmacen(tipo);
  if (!almacen) return 0;

  let total = 0;
  for (let i = 0; i < almacen.length; i++) {
    const clave = almacen.key(i);
    if (clave?.startsWith("nomad:")) total += (clave.length + (almacen.getItem(clave)?.length ?? 0)) * 2;
  }
  return total;
}
