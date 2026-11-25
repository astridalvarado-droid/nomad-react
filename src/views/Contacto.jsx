import { useState } from "react";
import { paquetes } from "../data/catalogo.js";
import { MAX_MENSAJE, VALORES_INICIALES, validarCampo, validarTodo } from "../helpers/validacionContacto.js";
import { CLAVES } from "../services/almacen.js";
import { useToast } from "../context/ToastContext.jsx";
import useTitulo from "../hooks/useTitulo.js";
import useColeccion from "../hooks/useColeccion.js";
import SectionHead from "../components/SectionHead.jsx";
import Campo from "../components/Campo.jsx";
import PanelEstado from "../components/PanelEstado.jsx";

/* ============================================================
   Formulario de contacto con estados (useState) — Actividad 6
   Las validaciones están en helpers/validacionContacto.js.
   Cada solicitud enviada se guarda en localStorage y el administrador
   la ve en su panel (pestaña Mensajes).
   ============================================================ */

export default function Contacto() {
  useTitulo("Contacto");
  const toast = useToast();
  const mensajes = useColeccion(CLAVES.mensajes);

  /* ---------- 1) ESTADOS con useState() ---------- */
  const [formData, setFormData] = useState(VALORES_INICIALES); // lo que el usuario escribe
  const [errors, setErrors] = useState({});                    // errores de validación por campo
  const [confirmacion, setConfirmacion] = useState(null);      // datos de la solicitud ya enviada
  const [eventos, setEventos] = useState([]);                  // bitácora de eventos (panel de desarrollo)

  // Guarda un evento en la bitácora y lo muestra también en la consola del navegador
  const registrar = (texto) => {
    const hora = new Date().toLocaleTimeString("es-CO", { hour12: false });
    console.log(`[${hora}] ${texto}`);
    setEventos((prev) => [`${hora}  ${texto}`, ...prev].slice(0, 8));
  };

  /* ---------- 2) onChange: se ejecuta en CADA cambio de un campo ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target; // "name" del input = clave dentro de formData

    // actualizamos solo la clave que cambió y conservamos las demás
    setFormData((prev) => ({ ...prev, [name]: value }));

    // si el campo ya mostraba un error, lo revalidamos mientras el usuario corrige
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
    }

    registrar(`onChange → ${name} = "${value}"`);
  };

  // onBlur: al salir de un campo se valida solo ese campo
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validarCampo(name, value) }));
  };

  /* ---------- 3) onSubmit: se ejecuta al enviar el formulario ---------- */
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que el navegador recargue la página

    const nuevosErrores = validarTodo(formData);
    setErrors(nuevosErrores);

    const cantidadErrores = Object.keys(nuevosErrores).length;
    if (cantidadErrores > 0) {
      registrar(`onSubmit → bloqueado: ${cantidadErrores} campo(s) con error`);
      // llevamos el cursor al primer campo con error
      const primerError = Object.keys(nuevosErrores)[0];
      e.currentTarget.elements[primerError]?.focus();
      return;
    }

    // Todo válido: preparamos el mensaje de confirmación personalizado
    const paquete = paquetes.find((p) => p.id === formData.paquete);
    const viajeros = Number(formData.viajeros);
    const solicitud = {
      nombre: formData.nombre.trim(),
      email: formData.email.trim(),
      paquete: paquete.nombre,
      viajeros,
      total: paquete.precio * viajeros,
    };

    // la guardamos en localStorage para que el administrador la vea en su panel
    const guardado = mensajes.agregar({
      ...solicitud,
      id: `${Date.now()}`,
      mensaje: formData.mensaje.trim(),
      fecha: new Date().toISOString(),
    });
    if (guardado) toast.exito("El equipo de NÖMAD la verá en su panel.", "Solicitud enviada");
    else toast.error("No hay espacio en el navegador para guardar tu solicitud.", "No se pudo guardar");

    setConfirmacion(solicitud);
    registrar(`onSubmit → enviado: ${formData.nombre.trim()} · ${paquete.nombre} · ${viajeros} viajero(s)`);

    // y dejamos el formulario limpio
    setFormData(VALORES_INICIALES);
    setErrors({});
  };

  const nuevaSolicitud = () => {
    setConfirmacion(null);
    registrar("Nueva solicitud: formulario reiniciado");
  };

  /* ---------- 4) Vista (JSX) ---------- */
  return (
    <section className="section">
      <SectionHead titulo="Solicitar cotización" texto="Cuéntanos qué expedición te interesa." />

      {confirmacion ? (
        /* Mensaje de confirmación PERSONALIZADO: usa los datos que guardamos en el estado */
        <div className="form-confirmation confirm-card" role="status" id="confirmacion">
          <h3>¡Gracias, {confirmacion.nombre}! Recibimos tu solicitud.</h3>
          <p>
            Estamos preparando la cotización de <strong>{confirmacion.paquete}</strong> para{" "}
            <strong>{confirmacion.viajeros === 1 ? "1 viajero" : `${confirmacion.viajeros} viajeros`}</strong>.
          </p>
          <p>
            Te escribiremos a <strong>{confirmacion.email}</strong> en las próximas 24 horas.
          </p>
          <p className="confirm-total">Total estimado: USD ${confirmacion.total.toLocaleString("en-US")}</p>
          <button type="button" className="btn btn-ghost" onClick={nuevaSolicitud}>
            Hacer otra solicitud
          </button>
        </div>
      ) : (
        <form className="quote-form" id="quoteForm" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <Campo id="nombre" label="Nombre completo *" error={errors.nombre}>
              <input
                type="text"
                id="nombre"
                name="nombre"
                autoComplete="name"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.nombre}
                aria-describedby="err-nombre"
              />
            </Campo>

            <Campo id="email" label="Correo electrónico *" error={errors.email}>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.email}
                aria-describedby="err-email"
              />
            </Campo>

            <Campo id="paquete" label="Paquete de interés *" error={errors.paquete}>
              <select
                id="paquete"
                name="paquete"
                value={formData.paquete}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.paquete}
                aria-describedby="err-paquete"
              >
                <option value="">Selecciona…</option>
                {paquetes.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </Campo>

            <Campo id="viajeros" label="Número de viajeros *" error={errors.viajeros}>
              <input
                type="number"
                id="viajeros"
                name="viajeros"
                min="1"
                max="20"
                value={formData.viajeros}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.viajeros}
                aria-describedby="err-viajeros"
              />
            </Campo>

            <Campo id="mensaje" label="Mensaje *" error={errors.mensaje} full>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="Fechas aproximadas, nivel de experiencia, dudas…"
                value={formData.mensaje}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={!!errors.mensaje}
                aria-describedby="err-mensaje"
              />
              <span className={`char-count${formData.mensaje.length > MAX_MENSAJE ? " is-over" : ""}`}>
                {formData.mensaje.length}/{MAX_MENSAJE}
              </span>
            </Campo>
          </div>

          <button type="submit" className="btn btn-primary btn-submit">Enviar solicitud</button>
        </form>
      )}

      <PanelEstado formData={formData} errors={errors} eventos={eventos} />
    </section>
  );
}
