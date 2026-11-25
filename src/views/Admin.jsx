import { CLAVES } from "../services/almacen.js";
import useTitulo from "../hooks/useTitulo.js";
import useColeccion from "../hooks/useColeccion.js";
import SectionHead from "../components/SectionHead.jsx";
import Tabs from "../components/ui/Tabs.jsx";
import ResumenAdmin from "../components/admin/ResumenAdmin.jsx";
import GaleriaAdmin from "../components/admin/GaleriaAdmin.jsx";
import ReservasAdmin from "../components/admin/ReservasAdmin.jsx";
import MensajesAdmin from "../components/admin/MensajesAdmin.jsx";

// Vista privada solo para el rol administrador
export default function Admin() {
  useTitulo("Panel de administración");
  const reservas = useColeccion(CLAVES.reservas);
  const mensajes = useColeccion(CLAVES.mensajes);

  return (
    <section className="section">
      <SectionHead titulo="Panel de administración" texto="Fotos de los destinos, reservas de los usuarios y mensajes de contacto." />
      <Tabs
        memoria="admin"
        etiqueta="Secciones del panel"
        pestanas={[
          { id: "resumen", etiqueta: "Resumen", contenido: <ResumenAdmin reservas={reservas.items} mensajes={mensajes.items} /> },
          { id: "galeria", etiqueta: "Galería", contenido: <GaleriaAdmin /> },
          { id: "reservas", etiqueta: "Reservas", contador: reservas.items.length, contenido: <ReservasAdmin coleccion={reservas} /> },
          { id: "mensajes", etiqueta: "Mensajes", contador: mensajes.items.length, contenido: <MensajesAdmin coleccion={mensajes} /> },
        ]}
      />
    </section>
  );
}
