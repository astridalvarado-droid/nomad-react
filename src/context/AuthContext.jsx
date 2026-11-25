import { createContext, useCallback, useContext, useMemo } from "react";
import { usuarios } from "../data/usuarios.js";
import { ROLES, reconstruirSesion, validarCredenciales } from "../helpers/auth.js";
import { CLAVES, borrar, guardar } from "../services/almacen.js";
import useAlmacenamiento from "../hooks/useAlmacenamiento.js";

/* Contexto de autenticación: comparte la sesión con toda la app.
   - Con "Recordarme" la sesión se guarda en localStorage (sobrevive al cerrar el navegador).
   - Sin "Recordarme" se guarda en sessionStorage (se borra al cerrar la pestaña).
   En el navegador solo se guarda { usuario, inicio, recordar }: ni la contraseña ni el rol. */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [guardadaLocal] = useAlmacenamiento(CLAVES.sesion, null, "local");
  const [guardadaPestana] = useAlmacenamiento(CLAVES.sesion, null, "session");

  const sesion = useMemo(
    () => reconstruirSesion(usuarios, guardadaLocal ?? guardadaPestana),
    [guardadaLocal, guardadaPestana]
  );

  // Devuelve los datos del usuario si las credenciales son correctas, o null si no
  const iniciarSesion = useCallback((usuario, clave, recordar) => {
    const datos = validarCredenciales(usuarios, usuario, clave);
    if (!datos) return null;

    const registro = { usuario: datos.usuario, inicio: new Date().toISOString(), recordar };
    borrar(CLAVES.sesion, recordar ? "session" : "local"); // solo una sesión a la vez
    guardar(CLAVES.sesion, registro, recordar ? "local" : "session");
    return datos;
  }, []);

  const cerrarSesion = useCallback(() => {
    borrar(CLAVES.sesion, "local");
    borrar(CLAVES.sesion, "session");
  }, []);

  const valor = useMemo(
    () => ({ sesion, esAdmin: sesion?.rol === ROLES.ADMIN, iniciarSesion, cerrarSesion }),
    [sesion, iniciarSesion, cerrarSesion]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
