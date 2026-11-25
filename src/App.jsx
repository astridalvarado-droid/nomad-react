import { useEffect } from "react";
import { useRuta } from "./router.jsx";
import { destinos } from "./data/catalogo.js";
import { ROLES } from "./helpers/auth.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import Inicio from "./views/Inicio.jsx";
import Destinos from "./views/Destinos.jsx";
import DetalleDestino from "./views/DetalleDestino.jsx";
import Paquetes from "./views/Paquetes.jsx";
import Clima from "./views/Clima.jsx";
import Nosotros from "./views/Nosotros.jsx";
import Contacto from "./views/Contacto.jsx";
import Login from "./views/Login.jsx";
import MiCuenta from "./views/MiCuenta.jsx";
import Admin from "./views/Admin.jsx";
import NotFound from "./views/NotFound.jsx";

/* Tabla de rutas: URL → vista. `roles` indica quién puede entrar (sin roles = pública). */
const RUTAS = {
  "/": { Vista: Inicio },
  "/destinos": { Vista: Destinos },
  "/paquetes": { Vista: Paquetes },
  "/clima": { Vista: Clima },
  "/nosotros": { Vista: Nosotros },
  "/contacto": { Vista: Contacto },
  "/login": { Vista: Login },
  "/mi-cuenta": { Vista: MiCuenta, roles: [ROLES.USUARIO, ROLES.ADMIN] },
  "/admin": { Vista: Admin, roles: [ROLES.ADMIN] },
};

function resolver(ruta) {
  const encontrada = RUTAS[ruta];
  if (encontrada) return { elemento: <encontrada.Vista />, roles: encontrada.roles };

  // ruta dinámica: /destinos/:id
  const m = ruta.match(/^\/destinos\/([\w-]+)$/);
  const destino = m && destinos.find((d) => d.id === m[1]);
  if (destino) return { elemento: <DetalleDestino destino={destino} /> };

  return { elemento: <NotFound /> }; // cualquier otra ruta: 404
}

export default function App() {
  const ruta = useRuta();
  const { elemento, roles } = resolver(ruta);

  // al cambiar de vista volvemos arriba (sin animación, para que no se vea el desplazamiento)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [ruta]);

  return (
    <>
      <Navbar ruta={ruta} />
      {/* key={ruta}: cada vista se monta de nuevo y repite la animación de entrada */}
      <main className="vista" key={ruta}>
        <RutaProtegida roles={roles} ruta={ruta}>
          {elemento}
        </RutaProtegida>
      </main>
      <Footer />
    </>
  );
}
