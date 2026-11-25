import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MAX_BYTES, bytesDeDataUrl, calcularMedidas, formatearBytes, validarArchivoImagen, validarDimensiones } from "../src/helpers/archivos.js";

// Un "archivo" de prueba: solo importan su tipo y su tamaño
const archivo = (type, size) => ({ name: "foto", type, size });

describe("Gestión de archivos: validarArchivoImagen", () => {
  it("acepta JPG, PNG y WEBP dentro del peso permitido", () => {
    assert.equal(validarArchivoImagen(archivo("image/jpeg", 300_000)), "");
    assert.equal(validarArchivoImagen(archivo("image/png", 1_000)), "");
    assert.equal(validarArchivoImagen(archivo("image/webp", MAX_BYTES)), "");
  });

  it("rechaza otros formatos (GIF, PDF, texto)", () => {
    for (const tipo of ["image/gif", "application/pdf", "text/plain", ""]) {
      assert.match(validarArchivoImagen(archivo(tipo, 1000)), /Formato no permitido/);
    }
  });

  it("rechaza archivos vacíos o más pesados que 5 MB", () => {
    assert.equal(validarArchivoImagen(archivo("image/jpeg", 0)), "El archivo está vacío.");
    assert.equal(validarArchivoImagen(archivo("image/jpeg", MAX_BYTES + 1)), "La imagen pesa 5 MB y el máximo es 5 MB.");
    assert.match(validarArchivoImagen(archivo("image/jpeg", 8 * 1024 * 1024)), /pesa 8 MB/);
  });

  it("pide elegir un archivo si no hay ninguno", () => {
    assert.equal(validarArchivoImagen(null), "Selecciona una imagen.");
  });
});

describe("Gestión de archivos: medidas y peso", () => {
  it("valida el tamaño mínimo de 200 px por lado", () => {
    assert.equal(validarDimensiones(800, 600), "");
    assert.match(validarDimensiones(150, 600), /150 × 600 px/);
  });

  it("reduce sin deformar y nunca agranda", () => {
    assert.deepEqual(calcularMedidas(4000, 3000, 1400), { ancho: 1400, alto: 1050 });
    assert.deepEqual(calcularMedidas(1000, 2000, 1400), { ancho: 700, alto: 1400 });
    assert.deepEqual(calcularMedidas(800, 600, 1400), { ancho: 800, alto: 600 });
  });

  it("formatea pesos en B, KB y MB", () => {
    assert.equal(formatearBytes(512), "512 B");
    assert.equal(formatearBytes(1536), "1,5 KB");
    assert.equal(formatearBytes(2.5 * 1024 * 1024), "2,5 MB");
  });

  it("calcula el peso de un dataURL en base64", () => {
    // "aG9sYQ==" es "hola" en base64 (4 bytes reales; la fórmula da 6 por el relleno ==)
    assert.equal(bytesDeDataUrl("data:image/jpeg;base64,aG9sYQ=="), 6);
  });
});
