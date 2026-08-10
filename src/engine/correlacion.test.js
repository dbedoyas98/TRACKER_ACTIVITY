import { describe, it, expect } from "vitest";
import { pearson, frasePearson } from "./correlacion.js";

describe("pearson", () => {
  it("con menos de 3 pares, no calcula (n insuficiente)", () => {
    expect(pearson([1, 2], [1, 2]).r).toBeNull();
  });
  it("correlación perfecta positiva da r = 1", () => {
    expect(pearson([1, 2, 3, 4], [10, 20, 30, 40]).r).toBe(1);
  });
  it("correlación perfecta negativa da r = -1", () => {
    expect(pearson([1, 2, 3, 4], [40, 30, 20, 10]).r).toBe(-1);
  });
  it("sin relación (varianza en y = 0), da r = 0 en vez de NaN", () => {
    expect(pearson([1, 2, 3], [5, 5, 5]).r).toBe(0);
  });
  it("ignora pares con datos faltantes en vez de romperse", () => {
    const r = pearson([1, 2, null, 4], [10, 20, 30, 40]);
    expect(r.n).toBe(3);
    expect(r.r).not.toBeNull();
  });
});

describe("frasePearson", () => {
  it("nunca afirma causalidad, siempre dice 'exploratoria' y la descarta explícitamente", () => {
    const texto = frasePearson("sueño", "adherencia", { r: 0.6, n: 10 });
    expect(texto).toContain("exploratoria");
    expect(texto.toLowerCase()).toContain("no causalidad");
  });
  it("con n insuficiente, lo dice explícitamente", () => {
    const texto = frasePearson("sueño", "adherencia", { r: null, n: 2 });
    expect(texto).toContain("2");
  });
});
