import { destinos } from "../../data/catalogo.js";
import { usuarios } from "../../data/usuarios.js";
import { NOMBRE_ROL } from "../../helpers/auth.js";
import { formatearBytes } from "../../helpers/archivos.js";
import { CLAVES, bytesUsados, leer } from "../../services/almacen.js";

const LIMITE_APROX = 5 * 1024 * 1024; // los navegadores dan unos 5 MB de localStorage por sitio

// Pestaña "Resumen" del panel: cifras generales, usuarios y espacio usado en el navegador
export default function ResumenAdmin({ reservas, mensajes }) {
  const pendientes = reservas.filter((r) => r.estado === "pendiente").length;
  const fotos = destinos.reduce((total, d) => total + leer(CLAVES.galeria(d.id), []).length, 0);
  const usado = bytesUsados();
  const porcentaje = Math.min(100, Math.round((usado / LIMITE_APROX) * 100));

  return (
    <div className="resumen">
      <div className="stats-strip resumen-cifras">
        <div className="stat">
          <span className="stat-num">{reservas.length}</span>
          <span className="stat-label">Reservas registradas</span>
        </div>
        <div className="stat">
          <span className="stat-num">{pendientes}</span>
          <span className="stat-label">Reservas pendientes</span>
        </div>
        <div className="stat">
          <span className="stat-num">{mensajes.length}</span>
          <span className="stat-label">Mensajes de contacto</span>
        </div>
        <div className="stat">
          <span className="stat-num">{fotos}</span>
          <span className="stat-label">Fotos subidas</span>
        </div>
      </div>

      <div className="resumen-grid">
        <div>
          <h3 className="subtitulo">Usuarios del sistema</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th scope="col">Usuario</th>
                <th scope="col">Nombre</th>
                <th scope="col">Rol</th>
                <th scope="col">Reservas</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuario}>
                  <td data-etiqueta="Usuario"><code>{u.usuario}</code></td>
                  <td data-etiqueta="Nombre">{u.nombre}</td>
                  <td data-etiqueta="Rol"><span className={`rol rol--${u.rol}`}>{NOMBRE_ROL[u.rol]}</span></td>
                  <td data-etiqueta="Reservas">{reservas.filter((r) => r.usuario === u.usuario).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="subtitulo">Espacio en el navegador</h3>
          <p className="resumen-texto">
            Los datos de NÖMAD (sesión, reservas, mensajes y fotos) ocupan <strong>{formatearBytes(usado)}</strong> de
            unos {formatearBytes(LIMITE_APROX)} disponibles en localStorage.
          </p>
          <div className="medidor" role="meter" aria-label="Espacio usado en localStorage" aria-valuemin={0} aria-valuemax={100} aria-valuenow={porcentaje}>
            <span style={{ width: `${Math.max(porcentaje, 1)}%` }} />
          </div>
          <p className="resumen-texto resumen-texto--tenue">{porcentaje}% usado</p>
        </div>
      </div>
    </div>
  );
}
