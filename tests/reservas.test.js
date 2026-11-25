import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { paquetes } from "../src/data/catalogo.js";
import { crearReserva, fechaLocalIso, ordenarPaquetes, primeraFechaReservable, validarReserva } from "../src/helpers/reservas.js";

// "Hoy" fijo para que las pruebas den lo mismo cualquier día: 24 nov 2026, 9 p. m.
const HOY = new Date(2026, 10, 24, 21, 0);

describe("Reservas: fechas", () => {
  it("usa la fecha local y no la UTC", () => {
    assert.equal(fechaLocalIso(HOY), "2026-11-24");
    assert.equal(primeraFechaReservable(HOY), "2026-11-25");
  });

  it("pasa bien de fin de mes y de año", () => {
    assert.equal(primeraFechaReservable(new Date(2026, 11, 31)), "2027-01-01");
  });
});

describe("Reservas: validarReserva", () => {
  it("acepta una reserva válida", () => {
    assert.deepEqual(validarReserva({ fecha: "2026-12-10", viajeros: "4" }, HOY), {});
  });

  it("no permite salidas hoy, en el pasado o sin fecha", () => {
    assert.match(validarReserva({ fecha: "2026-11-24", viajeros: "2" }, HOY).fecha, /a partir de mañana/);
    assert.match(validarReserva({ fecha: "2025-01-01", viajeros: "2" }, HOY).fecha, /a partir de mañana/);
    assert.equal(validarReserva({ fecha: "", viajeros: "2" }, HOY).fecha, "Elige la fecha de salida.");
  });

  it("limita los viajeros a enteros entre 1 y 10", () => {
    for (const viajeros of ["0", "11", "2.5", "-1", "abc"]) {
      assert.ok(validarReserva({ fecha: "2026-12-10", viajeros }, HOY).viajeros, `debería fallar con ${viajeros}`);
    }
    assert.equal(validarReserva({ fecha: "2026-12-10", viajeros: "" }, HOY).viajeros, "Indica cuántos viajan.");
    assert.equal(validarReserva({ fecha: "2026-12-10", viajeros: "10" }, HOY).viajeros, undefined);
  });

  it("limita la nota a 200 caracteres", () => {
    assert.ok(validarReserva({ fecha: "2026-12-10", viajeros: "1", nota: "a".repeat(201) }, HOY).nota);
  });
});

describe("Reservas: crearReserva y ordenarPaquetes", () => {
  it("calcula el total y empieza como pendiente", () => {
    const paquete = paquetes.find((p) => p.id === "costa-salvaje"); // USD 450
    const r = crearReserva({ paquete, usuario: "viajero", fecha: "2026-12-10", viajeros: "3", nota: "  sin gluten  " }, HOY);
    assert.equal(r.total, 1350);
    assert.equal(r.viajeros, 3);
    assert.equal(r.estado, "pendiente");
    assert.equal(r.nota, "sin gluten");
    assert.equal(r.paqueteNombre, "Costa Salvaje");
    assert.ok(r.id);
  });

  it("ordena por precio y duración sin cambiar la lista original", () => {
    const original = paquetes.map((p) => p.id);
    const baratos = ordenarPaquetes(paquetes, "precio-asc").map((p) => p.precio);
    assert.deepEqual(baratos, [...baratos].sort((a, b) => a - b));
    assert.equal(ordenarPaquetes(paquetes, "precio-desc")[0].precio, 1200);
    assert.equal(ordenarPaquetes(paquetes, "duracion")[0].duracion, 3);
    assert.deepEqual(paquetes.map((p) => p.id), original);
  });
});
