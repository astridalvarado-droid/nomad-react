import { useState } from "react";
import { Link, navegar } from "../router.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { NOMBRE_ROL } from "../helpers/auth.js";
import Dropdown from "./ui/Dropdown.jsx";
import Avatar from "./Avatar.jsx";

const LINKS = [
  ["/", "inicio"],
  ["/destinos", "destinos"],
  ["/paquetes", "paquetes"],
  ["/clima", "clima"],
  ["/nosotros", "nosotros"],
  ["/contacto", "contacto"],
];

// Navbar con links y menú de cuenta. El menú móvil se abre/cierra con un estado (useState).
// Con sesión iniciada aparece un Dropdown con las opciones según el rol.
export default function Navbar({ ruta }) {
  const [abierto, setAbierto] = useState(false);
  const { sesion, esAdmin, cerrarSesion } = useAuth();
  const toast = useToast();

  const salir = () => {
    navegar("/"); // primero salimos de la vista actual, que puede ser privada
    cerrarSesion();
    toast.info("Cerraste sesión. ¡Vuelve pronto!");
  };

  const opcionesCuenta = sesion
    ? [
        {
          tipo: "encabezado",
          contenido: (
            <>
              <strong>{sesion.nombre}</strong>
              <span>{NOMBRE_ROL[sesion.rol]}</span>
            </>
          ),
        },
        { id: "cuenta", etiqueta: "Mi cuenta", to: "/mi-cuenta" },
        ...(esAdmin ? [{ id: "admin", etiqueta: "Panel de administración", to: "/admin" }] : []),
        { tipo: "separador" },
        { id: "salir", etiqueta: "Cerrar sesión", onSelect: salir, peligro: true },
      ]
    : [];

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Principal">
        <Link to="/" className="nav-mark">NÖMAD</Link>

        <ul className={`nav-links${abierto ? " open" : ""}`}>
          {LINKS.map(([to, texto]) => {
            const activo = ruta === to || (to !== "/" && ruta.startsWith(to));
            return (
              <li key={to}>
                <Link to={to} className={activo ? "active" : ""} onClick={() => setAbierto(false)}>
                  {texto}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-cuenta">
          {sesion ? (
            <Dropdown
              etiqueta="Opciones de la cuenta"
              alinear="derecha"
              claseBoton="nav-usuario"
              items={opcionesCuenta}
              boton={
                <>
                  <Avatar usuario={sesion.usuario} nombre={sesion.nombre} />
                  <span className="nav-usuario-nombre">{sesion.nombre.split(" ")[0]}</span>
                </>
              }
            />
          ) : (
            <Link to="/login" className={`nav-ingresar${ruta === "/login" ? " active" : ""}`}>
              ingresar
            </Link>
          )}
          <button
            className="nav-toggle"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
            onClick={() => setAbierto(!abierto)}
          >
            {abierto ? "×" : "☰"}
          </button>
        </div>
      </nav>
    </header>
  );
}
