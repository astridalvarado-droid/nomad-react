import useAlmacenamiento from "../hooks/useAlmacenamiento.js";
import { CLAVES } from "../services/almacen.js";
import { iniciales } from "../helpers/auth.js";

// Foto de perfil del usuario (guardada en localStorage) o sus iniciales si no tiene foto
export default function Avatar({ usuario, nombre, tamano = "normal" }) {
  const [foto] = useAlmacenamiento(CLAVES.avatar(usuario), null);

  return (
    <span className={`avatar avatar--${tamano}`} aria-hidden="true">
      {foto ? <img src={foto} alt="" /> : iniciales(nombre)}
    </span>
  );
}
