import { describe, it, expect } from "vitest";
import { haversineKm, resumenDePuntos } from "./importar.js";

describe("haversineKm", () => {
  it("distancia cero entre el mismo punto", () => {
    expect(haversineKm({ lat: 4.6, lon: -74.1 }, { lat: 4.6, lon: -74.1 })).toBe(0);
  });
  it("aproxima bien una distancia conocida (Bogotá-Medellín ~240 km en línea recta)", () => {
    const bogota = { lat: 4.7110, lon: -74.0721 };
    const medellin = { lat: 6.2442, lon: -75.5812 };
    const km = haversineKm(bogota, medellin);
    expect(km).toBeGreaterThan(200);
    expect(km).toBeLessThan(260);
  });
});

describe("resumenDePuntos", () => {
  it("sin puntos, devuelve null", () => {
    expect(resumenDePuntos([])).toBeNull();
  });
  it("calcula duración desde el primer y último tiempo", () => {
    const puntos = [
      { lat: 4.6, lon: -74.1, ele: 100, tiempo: new Date("2026-01-01T08:00:00Z"), hr: null, distanciaAcum: null },
      { lat: 4.61, lon: -74.1, ele: 110, tiempo: new Date("2026-01-01T09:00:00Z"), hr: null, distanciaAcum: null },
    ];
    expect(resumenDePuntos(puntos).duracionMin).toBe(60);
  });
  it("usa distancia explícita (TCX) si viene en los puntos, sin recalcular con haversine", () => {
    const puntos = [
      { lat: 0, lon: 0, ele: null, tiempo: null, hr: null, distanciaAcum: 0 },
      { lat: 0, lon: 0, ele: null, tiempo: null, hr: null, distanciaAcum: 15000 },
    ];
    expect(resumenDePuntos(puntos).distanciaKm).toBe(15);
  });
  it("solo suma elevación ganada, no la perdida", () => {
    const puntos = [
      { lat: 0, lon: 0, ele: 100, tiempo: null, hr: null, distanciaAcum: null },
      { lat: 0, lon: 0, ele: 150, tiempo: null, hr: null, distanciaAcum: null }, // +50
      { lat: 0, lon: 0, ele: 80, tiempo: null, hr: null, distanciaAcum: null },  // -70, no cuenta
      { lat: 0, lon: 0, ele: 120, tiempo: null, hr: null, distanciaAcum: null }, // +40
    ];
    expect(resumenDePuntos(puntos).elevacionGanadaM).toBe(90);
  });
  it("calcula fc media y máxima solo con los puntos que traen hr", () => {
    const puntos = [
      { lat: 0, lon: 0, ele: null, tiempo: null, hr: 120, distanciaAcum: null },
      { lat: 0, lon: 0, ele: null, tiempo: null, hr: null, distanciaAcum: null },
      { lat: 0, lon: 0, ele: null, tiempo: null, hr: 160, distanciaAcum: null },
    ];
    const r = resumenDePuntos(puntos);
    expect(r.fcMedia).toBe(140);
    expect(r.fcMax).toBe(160);
  });
  it("sin datos de frecuencia cardiaca, fcMedia y fcMax son null", () => {
    const puntos = [{ lat: 0, lon: 0, ele: null, tiempo: null, hr: null, distanciaAcum: null }];
    const r = resumenDePuntos(puntos);
    expect(r.fcMedia).toBeNull();
    expect(r.fcMax).toBeNull();
  });
});
