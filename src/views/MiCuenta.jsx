import { useAuth } from "../context/AuthContext.jsx";
import { CLAVES } from "../services/almacen.js";
import useTitulo from "../hooks/useTitulo.js";
import useColeccion from "../hooks/useColeccion.js";
import SectionHead from "../components/SectionHead.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import PerfilCuenta from "../components/cuenta/PerfilCuenta.jsx";
import ReservasCuenta from "../components/cuenta/ReservasCuenta.jsx";

// Vista privada (usuario y administrador): perfil y reservas propias
export default function MiCuenta() {
  useTitulo("Mi cuenta");
  const { sesion } = useAuth();
  const { items } = useColeccion(CLAVES.reservas);

  if (!sesion) return null; // RutaProtegida ya redirige al login

  const cantidad = items.filter((r) => r.usuario === sesion.usuario).length;

  return (
    <section className="section">
      <SectionHead titulo="Mi cuenta" texto={`Hola, ${sesion.nombre}. Aquí están tu perfil y tus reservas.`} />
      <Tabs
        memoria="cuenta"
        etiqueta="Secciones de mi cuenta"
        pestanas={[
          { id: "perfil", etiqueta: "Perfil", contenido: <PerfilCuenta sesion={sesion} /> },
          { id: "reservas", etiqueta: "Mis reservas", contador: cantidad, contenido: <ReservasCuenta usuario={sesion.usuario} /> },
        ]}
      />
    </section>
  );
}
