import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { evaluarAcceso } from "../helpers/auth.js";
import { CLAVES, guardar } from "../services/almacen.js";
import { navegar } from "../router.jsx";
import AccesoDenegado from "../views/AccesoDenegado.jsx";

// Protección de vistas según el rol.
//   - Sin sesión: guarda a dónde quería ir y lo manda al login.
//   - Con sesión pero sin permiso: muestra la página 403.
export default function RutaProtegida({ roles, ruta, children }) {
  const { sesion } = useAuth();
  const acceso = evaluarAcceso(sesion, roles);

  useEffect(() => {
    if (acceso !== "login") return;
    guardar(CLAVES.volverA, ruta, "session"); // después del login vuelve aquí
    navegar("/login", { reemplazar: true });
  }, [acceso, ruta]);

  if (acceso === "login") return null;
  if (acceso === "denegado") return <AccesoDenegado />;
  return children;
}
