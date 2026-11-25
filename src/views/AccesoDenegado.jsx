import { Link } from "../router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { NOMBRE_ROL } from "../helpers/auth.js";
import useTitulo from "../hooks/useTitulo.js";

// Página 403: hay sesión, pero el rol no tiene permiso para ver la vista
export default function AccesoDenegado() {
  useTitulo("Acceso restringido");
  const { sesion } = useAuth();

  return (
    <section className="section not-found">
      <p className="hero-coords">ERROR 403</p>
      <h1>Zona restringida</h1>
      <p className="hero-sub">
        Esta sección es solo para administradores. Entraste como <strong>{sesion?.nombre}</strong> (
        {NOMBRE_ROL[sesion?.rol]?.toLowerCase()}).
      </p>
      <div className="hero-actions">
        <Link to="/mi-cuenta" className="btn btn-primary">Ir a mi cuenta</Link>
        <Link to="/" className="btn btn-ghost">Volver al inicio</Link>
      </div>
    </section>
  );
}
