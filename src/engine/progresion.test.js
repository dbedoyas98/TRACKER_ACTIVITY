import { describe, it, expect } from "vitest";
import { sugerirProgresion, esPR, REGLA_DEFECTO } from "./progresion.js";

describe("sugerirProgresion", () => {
  it("sin historial, sugiere arrancar conservador", () => {
    const r = sugerirProgresion(null);
    expect(r.accion).toBe("mantener");
    expect(r.reps).toBe(REGLA_DEFECTO.pisoReps);
  });
  it("si todas las series llegan al techo, sube el peso", () => {
    const ultima = { series: [{ peso: 40, reps: 12 }, { peso: 40, reps: 13 }, { peso: 40, reps: 12 }] };
    const r = sugerirProgresion(ultima);
    expect(r.accion).toBe("subir_peso");
    expect(r.peso).toBeCloseTo(42.5);
  });
  it("si alguna serie no llega al piso, mantiene el peso", () => {
    const ultima = { series: [{ peso: 40, reps: 9 }, { peso: 40, reps: 6 }, { peso: 40, reps: 8 }] };
    const r = sugerirProgresion(ultima);
    expect(r.accion).toBe("mantener");
    expect(r.peso).toBe(40);
  });
  it("si va dentro del rango sin llegar al techo, sugiere sumar reps", () => {
    const ultima = { series: [{ peso: 40, reps: 9 }, { peso: 40, reps: 10 }, { peso: 40, reps: 9 }] };
    const r = sugerirProgresion(ultima);
    expect(r.accion).toBe("subir_reps");
    expect(r.peso).toBe(40);
  });
});

describe("esPR", () => {
  it("una sesión con más peso/reps que el histórico es PR", () => {
    const historial = [{ series: [{ peso: 40, reps: 10 }] }];
    const nueva = { series: [{ peso: 45, reps: 10 }] };
    expect(esPR(historial, nueva)).toBe(true);
  });
  it("una sesión igual o peor que el histórico no es PR", () => {
    const historial = [{ series: [{ peso: 45, reps: 10 }] }];
    const nueva = { series: [{ peso: 40, reps: 10 }] };
    expect(esPR(historial, nueva)).toBe(false);
  });
  it("sin historial previo, cualquier sesión con datos es PR", () => {
    const nueva = { series: [{ peso: 20, reps: 8 }] };
    expect(esPR([], nueva)).toBe(true);
  });
});
