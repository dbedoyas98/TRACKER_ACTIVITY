import { describe, it, expect } from "vitest";
import { mediaMovil, bandaRuido } from "./tendencia.js";

describe("mediaMovil", () => {
  it("con un solo valor, la media es el valor mismo", () => {
    expect(mediaMovil([70])).toEqual([70]);
  });
  it("suaviza el ruido de un valor suelto", () => {
    const serie = [70, 70, 70, 70, 70, 70, 90]; // un salto de un día
    const mm = mediaMovil(serie, 7);
    expect(mm[mm.length - 1]).toBeLessThan(90);
    expect(mm[mm.length - 1]).toBeGreaterThan(70);
  });
  it("con valores constantes, la media móvil es constante", () => {
    const serie = new Array(10).fill(80);
    expect(mediaMovil(serie).every((v) => v === 80)).toBe(true);
  });
});

describe("bandaRuido", () => {
  it("con valores constantes, la banda es cero", () => {
    const serie = new Array(10).fill(80);
    const banda = bandaRuido(serie);
    banda.forEach((b) => {
      expect(b.min).toBeCloseTo(80);
      expect(b.max).toBeCloseTo(80);
    });
  });
  it("con ruido real, min y max se separan de la media", () => {
    const serie = [70, 72, 69, 73, 68, 71, 74, 69, 72, 70];
    const banda = bandaRuido(serie);
    const ultimo = banda[banda.length - 1];
    expect(ultimo.max).toBeGreaterThan(ultimo.media);
    expect(ultimo.min).toBeLessThan(ultimo.media);
  });
});
