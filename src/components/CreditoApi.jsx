// Atribución que pide Open-Meteo (licencia CC BY 4.0) cuando se usan sus datos.
export default function CreditoApi() {
  return (
    <p className="clima-credito">
      Datos del clima:{" "}
      <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
        Open-Meteo.com
      </a>{" "}
      · licencia CC BY 4.0
    </p>
  );
}
