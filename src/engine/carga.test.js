import { describe, it, expect } from "vitest";
import { cargaSesion, serieCarga, acwr, monotonia, semaforoCarga } from "./carga.js";

describe("cargaSesion", () => {
  it("descanso no aporta carga", () => {
    expect(cargaSesion("descanso", 0)).toBe(0);
  });
  it("una sesión más intensa pesa más que una más larga pero suave, a igual minutos", () => {
    const dura = cargaSesion("biciSeries", 60);
    const suave = cargaSesion("biciZ2", 60);
    expect(dura).toBeGreaterThan(suave);
  });
  it("crece con la duración", () => {
    expect(cargaSesion("gymA", 90)).toBeGreaterThan(cargaSesion("gymA", 45));
  });
});

describe("serieCarga", () => {
  it("con carga constante, ctl y atl convergen al mismo valor", () => {
    const dias = new Array(60).fill(50);
    const serie = serieCarga(dias);
    const ultimo = serie[serie.length - 1];
    expect(Math.abs(ultimo.ctl - ultimo.atl)).toBeLessThan(1);
    expect(Math.abs(ultimo.ctl - 50)).toBeLessThan(2);
  });
  it("serie vacía no rompe", () => {
    expect(serieCarga([])).toEqual([]);
  });
  it("un pico reciente sube atl más rápido que ctl (tsb cae)", () => {
    const dias = new Array(30).fill(20).concat(new Array(5).fill(150));
    const serie = serieCarga(dias);
    const ultimo = serie[serie.length - 1];
    expect(ultimo.tsb).toBeLessThan(0);
  });
});

describe("acwr y monotonía", () => {
  it("acwr es 1 cuando la carga reciente es igual a la crónica", () => {
    const dias = new Array(30).fill(40);
    expect(acwr(dias, 29)).toBeCloseTo(1, 1);
  });
  it("acwr sube por encima de 1.5 con un salto agudo de carga", () => {
    const dias = new Array(28).fill(20).concat(new Array(7).fill(80));
    expect(acwr(dias, dias.length - 1)).toBeGreaterThan(1.5);
  });
  it("monotonía alta cuando la semana es toda igual", () => {
    const semanaPareja = new Array(20).fill(50);
    const semanaVariada = new Array(20).fill(0).map((_, i) => (i % 2 ? 20 : 80));
    expect(monotonia(semanaPareja, 19)).toBeGreaterThan(monotonia(semanaVariada, 19));
  });
});

describe("semaforoCarga — caso simulado de sobrecarga", () => {
  it("pasa a 'danger' tras un salto agudo:crónico > 1.5", () => {
    // 4 semanas de carga estable (sesiones normales), y de golpe una semana muy dura.
    const base = new Array(28).fill(35);
    const sobrecarga = base.concat([120, 130, 125, 110, 115, 120, 105]);
    const idx = sobrecarga.length - 1;
    expect(acwr(sobrecarga, idx)).toBeGreaterThan(1.5);
    expect(semaforoCarga(sobrecarga, idx)).toBe("danger");
  });
  it("se mantiene 'optimal' con progresión sostenible", () => {
    // semana realista: gymA, biciZ2, gymB, biciSeries, gymC, biciLarga, movilidad
    // (la plantilla por defecto de la app), sube gradualmente semana a semana.
    const patronSemana = [55, 25, 55, 109, 53, 77, 4];
    const dias = [];
    // progresión multiplicativa (no aditiva): mantiene la proporción duro/suave de
    // la semana, que es la que de verdad importa para la monotonía.
    for (let semana = 0; semana < 6; semana++) {
      patronSemana.forEach((v) => dias.push(Math.round(v * (1 + semana * 0.05))));
    }
    expect(semaforoCarga(dias, dias.length - 1)).toBe("optimal");
  });
  it("sin datos, no revienta y devuelve 'optimal'", () => {
    expect(semaforoCarga([], 0)).toBe("optimal");
  });
});
