import { describe, it, expect } from "vitest";
import { resumenPorciones } from "./porciones.js";

function resuelto(partes) { return { original: "", partes }; }

describe("resumenPorciones", () => {
  it("cuenta porciones por categoría respetando el factor (medias porciones)", () => {
    const resueltos = [
      resuelto([
        { tipo: "porcion", cat: "C", factor: 1, opciones: [{ alimento: "Arroz", gramos: 50, unidad: "g" }] },
        { tipo: "porcion", cat: "F", factor: 0.5, opciones: [{ alimento: "Banano", gramos: 75, unidad: "g" }] },
        { tipo: "literal", texto: "ensalada" },
      ]),
    ];
    const { conteo, gramos } = resumenPorciones(resueltos);
    expect(conteo.C).toBe(1);
    expect(conteo.F).toBe(0.5);
    expect(gramos.C).toBe(50);
    expect(gramos.F).toBe(75);
  });
  it("suma varios días", () => {
    const un = resuelto([{ tipo: "porcion", cat: "P", factor: 1, opciones: [{ alimento: "Pollo", gramos: 150, unidad: "g" }] }]);
    const { conteo, gramos } = resumenPorciones([un, un]);
    expect(conteo.P).toBe(2);
    expect(gramos.P).toBe(300);
  });
  it("alimentos sin gramos (unidades) no suman a gramos pero sí a conteo", () => {
    const un = resuelto([{ tipo: "porcion", cat: "P", factor: 1, opciones: [{ alimento: "Huevo entero", gramos: null, unidad: "3 huevos" }] }]);
    const { conteo, gramos } = resumenPorciones([un]);
    expect(conteo.P).toBe(1);
    expect(gramos.P).toBe(0);
  });
  it("sin resueltos, todo en cero", () => {
    const { conteo, gramos } = resumenPorciones([]);
    expect(conteo).toEqual({ P: 0, C: 0, G: 0, F: 0 });
    expect(gramos).toEqual({ P: 0, C: 0, G: 0, F: 0 });
  });
});
