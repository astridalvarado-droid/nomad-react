import { useEffect, useState } from "react";
import { usuarios } from "../data/usuarios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { NOMBRE_ROL, ROLES, validarFormularioLogin } from "../helpers/auth.js";
import { CLAVES, borrar, leer } from "../services/almacen.js";
import { Link, navegar } from "../router.jsx";
import useTitulo from "../hooks/useTitulo.js";
import Campo from "../components/Campo.jsx";

const DESTINOS_RUTA = { "/mi-cuenta": "a Mi cuenta", "/admin": "al panel de administración" };

// Módulo de login con los usuarios definidos en data/usuarios.js
export default function Login() {
  useTitulo("Ingresar");
  const { sesion, iniciarSesion, cerrarSesion } = useAuth();
  const toast = useToast();

  const [datos, setDatos] = useState({ usuario: "", clave: "", recordar: false });
  const [errores, setErrores] = useState({});
  const [fallo, setFallo] = useState(""); // credenciales incorrectas
  const [intento, setIntento] = useState(0); // reinicia la animación de error
  const [verClave, setVerClave] = useState(false);

  const volverA = leer(CLAVES.volverA, null, "session"); // ruta privada que se quería abrir

  // después de un intento fallido, el cursor vuelve a la contraseña
  useEffect(() => {
    if (intento > 0) document.getElementById("clave")?.focus();
  }, [intento]);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === "checkbox" ? checked : value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: "" }));
    setFallo("");
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarFormularioLogin(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) {
      e.currentTarget.elements[Object.keys(nuevos)[0]]?.focus();
      return;
    }

    const usuario = iniciarSesion(datos.usuario, datos.clave, datos.recordar);
    if (!usuario) {
      setFallo("Usuario o contraseña incorrectos.");
      setIntento((n) => n + 1);
      setDatos((d) => ({ ...d, clave: "" }));
      return;
    }

    borrar(CLAVES.volverA, "session");
    toast.exito(`Entraste como ${NOMBRE_ROL[usuario.rol].toLowerCase()}.`, `Hola, ${usuario.nombre.split(" ")[0]}`);
    navegar(volverA ?? (usuario.rol === ROLES.ADMIN ? "/admin" : "/mi-cuenta"), { reemplazar: true });
  };

  // Rellena el formulario con un usuario de prueba (para la demostración)
  const usarDemo = (u) => {
    setDatos((d) => ({ ...d, usuario: u.usuario, clave: u.clave }));
    setErrores({});
    setFallo("");
  };

  if (sesion) {
    return (
      <section className="section login">
        <div className="login-card login-card--sesion">
          <h1>Ya iniciaste sesión</h1>
          <p>
            Estás conectado como <strong>{sesion.nombre}</strong> ({NOMBRE_ROL[sesion.rol].toLowerCase()}).
          </p>
          <div className="login-acciones">
            <Link to={sesion.rol === ROLES.ADMIN ? "/admin" : "/mi-cuenta"} className="btn btn-primary">
              {sesion.rol === ROLES.ADMIN ? "Ir al panel" : "Ir a mi cuenta"}
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                cerrarSesion();
                toast.info("Cerraste sesión.");
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section login">
      <div className="login-intro">
        <h1>Ingresa a NÖMAD</h1>
        <p>Con tu cuenta puedes reservar paquetes, ver el estado de tus reservas y personalizar tu perfil.</p>
        {volverA && (
          <p className="aviso" role="status">
            Inicia sesión para continuar {DESTINOS_RUTA[volverA] ?? `a ${volverA}`}.
          </p>
        )}
      </div>

      <form key={intento} className={`login-card${fallo ? " sacudir" : ""}`} onSubmit={enviar} noValidate>
        <Campo id="usuario" label="Usuario" error={errores.usuario}>
          <input
            id="usuario"
            name="usuario"
            autoComplete="username"
            value={datos.usuario}
            onChange={cambiar}
            aria-invalid={!!errores.usuario}
            aria-describedby="err-usuario"
          />
        </Campo>

        <Campo id="clave" label="Contraseña" error={errores.clave}>
          <div className="campo-clave">
            <input
              id="clave"
              name="clave"
              type={verClave ? "text" : "password"}
              autoComplete="current-password"
              value={datos.clave}
              onChange={cambiar}
              aria-invalid={!!errores.clave}
              aria-describedby="err-clave"
            />
            <button type="button" className="campo-clave-ver" onClick={() => setVerClave((v) => !v)} aria-pressed={verClave}>
              {verClave ? "ocultar" : "mostrar"}
            </button>
          </div>
        </Campo>

        <label className="casilla">
          <input type="checkbox" name="recordar" checked={datos.recordar} onChange={cambiar} />
          <span>Recordarme en este equipo</span>
        </label>

        {fallo && (
          <p className="login-error" role="alert">
            {fallo}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-submit">
          Ingresar
        </button>
      </form>

      <aside className="demo-usuarios" aria-labelledby="titulo-demo">
        <h2 id="titulo-demo">Usuarios de prueba</h2>
        <ul>
          {usuarios.map((u) => (
            <li key={u.usuario}>
              <span className={`rol rol--${u.rol}`}>{NOMBRE_ROL[u.rol]}</span>
              <code>{u.usuario}</code>
              <code>{u.clave}</code>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => usarDemo(u)}>
                usar
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
