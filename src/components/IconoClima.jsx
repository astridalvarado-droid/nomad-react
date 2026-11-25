// Ícono SVG del clima (sol, luna, nube, lluvia...) según el código WMO que entrega la API.
import { useId } from "react";
import { describirClima } from "../helpers/codigosClima.js";

const NUBE = "M6.5 18.5h10.2a3.8 3.8 0 0 0 .5-7.57 5.6 5.6 0 0 0-10.7 1.4A3.1 3.1 0 0 0 6.5 18.5z";
const SOL_RAYOS = "M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4";

function dibujar(icono, idMascara) {
  switch (icono) {
    case "sol":
      return (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d={SOL_RAYOS} />
        </>
      );
    case "luna":
      return <path d="M20 14.2A8 8 0 0 1 9.8 4a8 8 0 1 0 10.2 10.2z" />;
    case "parcial":
      return (
        <>
          <defs>
            <mask id={idMascara}>
              <rect width="24" height="24" fill="#fff" />
              <path d={NUBE} transform="translate(3.2 3.2) scale(.8)" fill="#000" stroke="#000" strokeWidth="3" />
            </mask>
          </defs>
          <g mask={`url(#${idMascara})`}>
            <circle cx="8.5" cy="8.5" r="3.2" />
            <path d="M8.5 2v1.4M2 8.5h1.4M3.9 3.9l1 1M13.1 3.9l-1 1" />
          </g>
          <path d={NUBE} transform="translate(3.2 3.2) scale(.8)" />
        </>
      );
    case "niebla":
      return (
        <>
          <path d={NUBE} transform="translate(0 -4)" />
          <path d="M4 17.5h16M7 21h10" />
        </>
      );
    case "lluvia":
      return (
        <>
          <path d={NUBE} transform="translate(0 -3)" />
          <path d="M8 17.5l-1 3M12 17.5l-1 3M16 17.5l-1 3" />
        </>
      );
    case "nieve":
      return (
        <>
          <path d={NUBE} transform="translate(0 -3)" />
          <circle cx="8" cy="18.5" r=".9" fill="currentColor" />
          <circle cx="12" cy="20.8" r=".9" fill="currentColor" />
          <circle cx="16" cy="18.5" r=".9" fill="currentColor" />
        </>
      );
    case "tormenta":
      return (
        <>
          <path d={NUBE} transform="translate(0 -3)" />
          <path d="M12.8 15 9.8 19h3.4l-1.6 3" />
        </>
      );
    default: // "nube"
      return <path d={NUBE} />;
  }
}

// Ícono decorativo: el texto del clima se muestra al lado (o como texto para lectores de pantalla).
export default function IconoClima({ codigo, esDia = true, tamano = 28 }) {
  const idMascara = useId();
  const { icono } = describirClima(codigo, esDia);

  return (
    <svg
      className="clima-icono"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {dibujar(icono, idMascara)}
    </svg>
  );
}
