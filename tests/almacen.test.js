import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { prepararNavegador } from "./navegador-simulado.js";
import { CLAVES, borrar, bytesUsados, guardar, leer, suscribir } from "../src/services/almacen.js";

describe("Persistencia: services/almacen.js", () => {
  let eventos;
  beforeEach(() => {
    ({ eventos } = prepararNavegador());
  });

  it("guarda y lee objetos como JSON en localStorage", () => {
    assert.equal(guardar("nomad:prueba", { a: 1, lista: [1, 2] }), true);
    assert.equal(window.localStorage.getItem("nomad:prueba"), '{"a":1,"lista":[1,2]}');
    assert.deepEqual(leer("nomad:prueba"), { a: 1, lista: [1, 2] });
  });

  it("separa localStorage de sessionStorage", () => {
    guardar(CLAVES.sesion, { usuario: "admin" }, "session");
    assert.equal(leer(CLAVES.sesion, null, "local"), null);
    assert.deepEqual(leer(CLAVES.sesion, null, "session"), { usuario: "admin" });
  });

  it("devuelve el valor inicial si no existe o si el JSON está dañado", () => {
    assert.deepEqual(leer("nomad:no-existe", []), []);
    window.localStorage.setItem("nomad:dañado", "{esto no es json");
    assert.equal(leer("nomad:dañado", "inicial"), "inicial");
  });

  it("borrar quita la clave", () => {
    guardar("nomad:x", 5);
    borrar("nomad:x");
    assert.equal(window.localStorage.getItem("nomad:x"), null);
  });

  it("avisa a los suscriptores en cada cambio y deja de avisar al cancelar", () => {
    let avisos = 0;
    const cancelar = suscribir(() => avisos++);
    guardar("nomad:a", 1);
    borrar("nomad:a");
    cancelar();
    guardar("nomad:a", 2);
    assert.equal(avisos, 2);
    assert.equal(eventos.length, 3);
    assert.equal(eventos[0].detail.clave, "nomad:a");
  });

  it("si el almacenamiento está lleno devuelve false y no lanza error", () => {
    prepararNavegador({ limite: 40 });
    assert.equal(guardar("nomad:foto", "x".repeat(100)), false);
    assert.equal(leer("nomad:foto"), null);
  });

  it("calcula el espacio usado solo con las claves del proyecto", () => {
    guardar("nomad:a", "hola"); // clave 7 + valor '"hola"' 6 = 13 caracteres → 26 bytes
    window.localStorage.setItem("otra-app", "no cuenta");
    assert.equal(bytesUsados(), 26);
  });

  it("arma las claves dinámicas", () => {
    assert.equal(CLAVES.galeria("pantanal"), "nomad:galeria:pantanal");
    assert.equal(CLAVES.avatar("laura"), "nomad:avatar:laura");
  });
});
