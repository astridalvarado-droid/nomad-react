import useAlmacenamiento from "./useAlmacenamiento.js";

// Lista de objetos con `id` guardada en localStorage (reservas, mensajes, fotos de la galería...).
// Cada función devuelve true si se guardó y false si el almacenamiento está lleno.
export default function useColeccion(clave) {
  const [items, setItems] = useAlmacenamiento(clave, []);

  return {
    items,
    agregar: (item) => setItems((lista) => [item, ...lista]),
    actualizar: (id, cambios) => setItems((lista) => lista.map((x) => (x.id === id ? { ...x, ...cambios } : x))),
    eliminar: (id) => setItems((lista) => lista.filter((x) => x.id !== id)),
  };
}
