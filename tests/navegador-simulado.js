// Simula lo mínimo del navegador (window, localStorage, sessionStorage) para probar
// los módulos de almacenamiento con Node, sin abrir un navegador.

export class AlmacenSimulado {
  constructor(limiteCaracteres = Infinity) {
    this.datos = new Map();
    this.limite = limiteCaracteres;
  }
  get length() {
    return this.datos.size;
  }
  key(i) {
    return [...this.datos.keys()][i] ?? null;
  }
  getItem(clave) {
    return this.datos.has(clave) ? this.datos.get(clave) : null;
  }
  setItem(clave, valor) {
    const texto = String(valor);
    const usado = [...this.datos.entries()].reduce((t, [k, v]) => (k === clave ? t : t + k.length + v.length), 0);
    if (usado + clave.length + texto.length > this.limite) {
      const error = new Error("Se superó la cuota de almacenamiento");
      error.name = "QuotaExceededError";
      throw error;
    }
    this.datos.set(clave, texto);
  }
  removeItem(clave) {
    this.datos.delete(clave);
  }
  clear() {
    this.datos.clear();
  }
}

// Crea un `window` nuevo con almacenes vacíos y devuelve los eventos que se lanzan
export function prepararNavegador({ limite } = {}) {
  const eventos = [];
  const oyentes = new Map();
  globalThis.window = {
    localStorage: new AlmacenSimulado(limite),
    sessionStorage: new AlmacenSimulado(limite),
    dispatchEvent(evento) {
      eventos.push(evento);
      (oyentes.get(evento.type) ?? []).forEach((fn) => fn(evento));
    },
    addEventListener(tipo, fn) {
      oyentes.set(tipo, [...(oyentes.get(tipo) ?? []), fn]);
    },
    removeEventListener(tipo, fn) {
      oyentes.set(tipo, (oyentes.get(tipo) ?? []).filter((f) => f !== fn));
    },
  };
  return { eventos };
}
