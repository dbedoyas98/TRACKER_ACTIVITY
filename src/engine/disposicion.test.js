import { describe, it, expect } from "vitest";
import { disposicionDiaria } from "./disposicion.js";

describe("disposicionDiaria", () => {
  it("está entre 0 y 100 siempre", () => {
    const { valor } = disposicionDiaria({ horasSueno: 3, energia: "Baja", tsb: -40, adherencia7d: 0 });
    expect(valor).toBeGreaterThanOrEqual(0);
    expect(valor).toBeLessThanOrEqual(100);
  });
  it("siempre viene con el desglose de factores", () => {
    const { factores } = disposicionDiaria({ horasSueno: 7, energia: "Alta", tsb: 5, adherencia7d: 0.9 });
    expect(factores.length).toBeGreaterThanOrEqual(3);
    factores.forEach((f) => expect(f).toHaveProperty("nombre"));
  });
  it("buen sueño + buena forma + energía alta da disposición alta", () => {
    const { valor } = disposicionDiaria({ horasSueno: 8, energia: "Alta", tsb: 10, adherencia7d: 1 });
    expect(valor).toBeGreaterThan(70);
  });
  it("mal sueño + fatiga + energía baja da disposición baja", () => {
    const { valor } = disposicionDiaria({ horasSueno: 4, energia: "Baja", tsb: -35, adherencia7d: 0.2 });
    expect(valor).toBeLessThan(40);
  });
  it("sin datos no revienta y marca los factores como no medidos", () => {
    const { valor, factores } = disposicionDiaria({});
    expect(valor).toBe(50);
    expect(factores.every((f) => f.medido === false)).toBe(true);
  });
});
