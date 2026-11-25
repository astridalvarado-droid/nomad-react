import { useEffect, useRef, useState } from "react";
import useMenosMovimiento from "../../hooks/useMenosMovimiento.js";

// Carrusel reutilizable.
//   diapositivas: [{ id, contenido }]
//   intervalo:    milisegundos entre diapositivas (pasa solo; se pausa con el mouse encima o con el foco dentro)
// Controles: flechas, puntos, botón pausar, teclas ← → y deslizar con el dedo en el celular.
export default function Carrusel({ diapositivas, etiqueta, intervalo = 6000, clase = "" }) {
  const [actual, setActual] = useState(0);
  const [encima, setEncima] = useState(false); // mouse o foco dentro del carrusel
  const [detenido, setDetenido] = useState(false); // el usuario pulsó "pausar"
  const menosMovimiento = useMenosMovimiento();
  const inicioToque = useRef(null);

  const total = diapositivas.length;
  const indice = Math.min(actual, total - 1); // por si se eliminó una diapositiva
  const corriendo = total > 1 && !menosMovimiento && !detenido && !encima;

  const ir = (i) => setActual((i + total) % total);

  // avance automático: un temporizador por diapositiva
  useEffect(() => {
    if (!corriendo) return;
    const temporizador = setTimeout(() => setActual((a) => (a + 1) % total), intervalo);
    return () => clearTimeout(temporizador);
  }, [corriendo, indice, total, intervalo]);

  if (total === 0) return null;

  const alTeclear = (e) => {
    if (e.key === "ArrowRight") ir(indice + 1);
    if (e.key === "ArrowLeft") ir(indice - 1);
  };

  // deslizar con el dedo: más de 50 px a un lado cambia de diapositiva
  const alSoltar = (e) => {
    if (inicioToque.current === null) return;
    const distancia = e.clientX - inicioToque.current;
    inicioToque.current = null;
    if (Math.abs(distancia) > 50) ir(distancia < 0 ? indice + 1 : indice - 1);
  };

  return (
    <section
      className={`carrusel ${clase}`.trim()}
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      onKeyDown={alTeclear}
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEncima(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setEncima(false)}
    >
      <div
        className="carrusel-ventana"
        onPointerDown={(e) => e.pointerType !== "mouse" && (inicioToque.current = e.clientX)}
        onPointerUp={alSoltar}
        onPointerCancel={() => (inicioToque.current = null)}
      >
        <div className="carrusel-pista" style={{ transform: `translateX(-${indice * 100}%)` }}>
          {diapositivas.map((d, i) => (
            <div
              key={d.id}
              className={`carrusel-diapositiva${i === indice ? " actual" : ""}`}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={i !== indice}
              inert={i !== indice}
            >
              {d.contenido}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="carrusel-controles">
          <button type="button" className="carrusel-flecha" aria-label="Diapositiva anterior" onClick={() => ir(indice - 1)}>
            ←
          </button>
          <div className="carrusel-puntos">
            {diapositivas.map((d, i) => (
              <button
                key={d.id}
                type="button"
                className={`carrusel-punto${i === indice ? " actual" : ""}`}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                aria-current={i === indice}
                onClick={() => ir(i)}
              />
            ))}
          </div>
          <button type="button" className="carrusel-flecha" aria-label="Diapositiva siguiente" onClick={() => ir(indice + 1)}>
            →
          </button>
          {!menosMovimiento && (
            <button type="button" className="carrusel-pausa" onClick={() => setDetenido((d) => !d)}>
              {detenido ? "reanudar" : "pausar"}
            </button>
          )}
        </div>
      )}

      {/* barra de progreso: arranca de cero en cada diapositiva (key) y desaparece en pausa */}
      {corriendo && (
        <span key={indice} className="carrusel-progreso" style={{ animationDuration: `${intervalo}ms` }} aria-hidden="true" />
      )}
    </section>
  );
}
