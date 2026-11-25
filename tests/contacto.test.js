import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { VALORES_INICIALES, validarCampo, validarTodo } from "../src/helpers/validacionContacto.js";

const VALIDO = { nombre: "María José", email: "maria@correo.com", paquete: "costa-salvaje", viajeros: "3", mensaje: "Queremos ir en diciembre." };

describe("Formulario de contacto: validaciones", () => {
  it("un formulario completo no tiene errores", () => {
    assert.deepEqual(validarTodo(VALIDO), {});
  });

  it("el formulario vacío marca los cinco campos", () => {
    assert.deepEqual(Object.keys(validarTodo(VALORES_INICIALES)), ["nombre", "email", "paquete", "viajeros", "mensaje"]);
  });

  it("valida el nombre: obligatorio, mínimo 3 letras, sin números", () => {
    assert.equal(validarCampo("nombre", "Jo"), "Escribe al menos 3 caracteres.");
    assert.equal(validarCampo("nombre", "Ana123"), "Usa solo letras y espacios.");
    assert.equal(validarCampo("nombre", "Íñigo O'Neil"), "");
  });

  it("valida el formato del correo", () => {
    assert.match(validarCampo("email", "maria@correo"), /correo válido/);
    assert.equal(validarCampo("email", "maria@correo.co"), "");
  });

  it("valida viajeros entre 1 y 20 y el largo del mensaje", () => {
    assert.match(validarCampo("viajeros", "21"), /entre 1 y 20/);
    assert.equal(validarCampo("mensaje", "corto"), "El mensaje debe tener al menos 10 caracteres.");
    assert.equal(validarCampo("mensaje", "x".repeat(301)), "Máximo 300 caracteres.");
  });
});
