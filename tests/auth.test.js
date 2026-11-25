import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { usuarios } from "../src/data/usuarios.js";
import { evaluarAcceso, iniciales, reconstruirSesion, validarCredenciales, validarFormularioLogin } from "../src/helpers/auth.js";

describe("Autenticación: validarCredenciales", () => {
  it("acepta un usuario y contraseña correctos y no devuelve la contraseña", () => {
    const resultado = validarCredenciales(usuarios, "admin", "Admin123");
    assert.deepEqual(resultado, { usuario: "admin", nombre: "Ana Rojas", rol: "admin" });
    assert.equal("clave" in resultado, false);
  });

  it("ignora mayúsculas y espacios en el nombre de usuario", () => {
    assert.equal(validarCredenciales(usuarios, "  Viajero ", "Viajero123")?.rol, "usuario");
  });

  it("rechaza una contraseña incorrecta (distingue mayúsculas)", () => {
    assert.equal(validarCredenciales(usuarios, "admin", "admin123"), null);
  });

  it("rechaza un usuario que no existe o campos vacíos", () => {
    assert.equal(validarCredenciales(usuarios, "pirata", "Admin123"), null);
    assert.equal(validarCredenciales(usuarios, "", ""), null);
    assert.equal(validarCredenciales(usuarios, undefined, undefined), null);
  });
});

describe("Autenticación: reconstruirSesion", () => {
  it("toma el rol de la lista oficial aunque el navegador diga otra cosa", () => {
    const manipulada = { usuario: "viajero", rol: "admin", inicio: "2026-11-24T10:00:00.000Z" };
    const sesion = reconstruirSesion(usuarios, manipulada);
    assert.equal(sesion.rol, "usuario");
    assert.equal(sesion.nombre, "Carlos Muñoz");
  });

  it("descarta sesiones de usuarios que no existen o vacías", () => {
    assert.equal(reconstruirSesion(usuarios, { usuario: "intruso" }), null);
    assert.equal(reconstruirSesion(usuarios, null), null);
  });
});

describe("Control de acceso: evaluarAcceso", () => {
  const admin = { usuario: "admin", rol: "admin" };
  const viajero = { usuario: "viajero", rol: "usuario" };

  it("las rutas públicas siempre se permiten", () => {
    assert.equal(evaluarAcceso(null, undefined), "permitido");
    assert.equal(evaluarAcceso(viajero, undefined), "permitido");
  });

  it("sin sesión, una ruta privada pide login", () => {
    assert.equal(evaluarAcceso(null, ["usuario", "admin"]), "login");
  });

  it("el usuario entra a Mi cuenta pero no al panel de administración", () => {
    assert.equal(evaluarAcceso(viajero, ["usuario", "admin"]), "permitido");
    assert.equal(evaluarAcceso(viajero, ["admin"]), "denegado");
  });

  it("el administrador entra a todo", () => {
    assert.equal(evaluarAcceso(admin, ["usuario", "admin"]), "permitido");
    assert.equal(evaluarAcceso(admin, ["admin"]), "permitido");
  });
});

describe("Login: validación del formulario e iniciales", () => {
  it("pide usuario y contraseña", () => {
    assert.deepEqual(validarFormularioLogin({ usuario: " ", clave: "" }), {
      usuario: "Escribe tu usuario.",
      clave: "Escribe tu contraseña.",
    });
    assert.deepEqual(validarFormularioLogin({ usuario: "admin", clave: "x" }), {});
  });

  it("arma las iniciales del avatar", () => {
    assert.equal(iniciales("Ana Rojas"), "AR");
    assert.equal(iniciales("laura"), "L");
    assert.equal(iniciales(""), "");
  });
});
