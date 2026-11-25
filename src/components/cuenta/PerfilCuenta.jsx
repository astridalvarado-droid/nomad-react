import { useToast } from "../../context/ToastContext.jsx";
import { NOMBRE_ROL } from "../../helpers/auth.js";
import { CLAVES } from "../../services/almacen.js";
import useAlmacenamiento from "../../hooks/useAlmacenamiento.js";
import Avatar from "../Avatar.jsx";
import CargaImagen from "../ui/CargaImagen.jsx";

// Pestaña "Perfil" de Mi cuenta: datos de la sesión y foto de perfil
export default function PerfilCuenta({ sesion }) {
  const toast = useToast();
  const [foto, setFoto] = useAlmacenamiento(CLAVES.avatar(sesion.usuario), null);

  const guardarFoto = (imagen) => {
    const guardada = setFoto(imagen.dataUrl);
    if (guardada) toast.exito("Ya se ve en el menú de tu cuenta.", "Foto de perfil actualizada");
    else toast.error("El almacenamiento del navegador está lleno.", "No se pudo guardar la foto");
    return guardada;
  };

  const quitarFoto = () => {
    setFoto(null);
    toast.info("Quitaste tu foto de perfil.");
  };

  return (
    <div className="perfil">
      <div className="perfil-foto">
        <Avatar usuario={sesion.usuario} nombre={sesion.nombre} tamano="grande" />
        {foto && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={quitarFoto}>
            Quitar foto
          </button>
        )}
      </div>

      <div className="perfil-detalle">
        <dl className="datos-lista">
          <div>
            <dt>Nombre</dt>
            <dd>{sesion.nombre}</dd>
          </div>
          <div>
            <dt>Usuario</dt>
            <dd>{sesion.usuario}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{NOMBRE_ROL[sesion.rol]}</dd>
          </div>
          <div>
            <dt>Sesión iniciada</dt>
            <dd>{sesion.inicio ? new Date(sesion.inicio).toLocaleString("es-CO") : "—"}</dd>
          </div>
          <div>
            <dt>Sesión guardada en</dt>
            <dd>{sesion.recordar ? "localStorage: sigue abierta al cerrar el navegador" : "sessionStorage: se cierra al cerrar la pestaña"}</dd>
          </div>
        </dl>

        <h3 className="subtitulo">{foto ? "Cambiar foto de perfil" : "Agregar foto de perfil"}</h3>
        <CargaImagen cuadrado maxLado={320} textoGuardar="Usar como foto de perfil" onGuardar={guardarFoto} />
      </div>
    </div>
  );
}
