/* ==========================================================================
   Motor de carga: score de estímulo por sesión, curvas de fitness/fatiga/forma
   (modelo Coggan: CTL 42 días, ATL 7 días, TSB = CTL - ATL) y relación
   agudo:crónico (ACWR, Gabbett) para el semáforo. Son dos metodologías
   distintas de la ciencia del entrenamiento — no se mezclan sus ventanas.
   ========================================================================== */

/* Factor de intensidad por tipo de sesión — proxy hasta que exista registro real
   de series/reps/peso (fase 4). 1.0 = referencia (fuerza estándar). Carga = minutos
   × intensidad², para que una sesión corta muy dura pese tanto como una larga suave. */
export const INTENSIDAD = {
  gymA: 1.0, gymB: 1.0, gymC: 1.15,
  biciZ2: 0.65, biciSeries: 1.35, biciLarga: 0.8,
  movilidad: 0.25, descanso: 0,
};

export function cargaSesion(clave, minutos) {
  const factor = INTENSIDAD[clave] ?? 0;
  return Math.round(minutos * factor * factor);
}

function ema(serie, n) {
  const alpha = 1 / n;
  const out = [];
  let prev = 0;
  serie.forEach((v, i) => {
    prev = i === 0 ? v : prev + (v - prev) * alpha;
    out.push(prev);
  });
  return out;
}

/* Devuelve, para cada día de la serie de cargas diarias, {ctl, atl, tsb}. */
export function serieCarga(cargasDiarias) {
  if (!cargasDiarias.length) return [];
  const ctl = ema(cargasDiarias, 42);
  const atl = ema(cargasDiarias, 7);
  return cargasDiarias.map((_, i) => ({
    ctl: Math.round(ctl[i] * 10) / 10,
    atl: Math.round(atl[i] * 10) / 10,
    tsb: Math.round((ctl[i] - atl[i]) * 10) / 10,
  }));
}

function media(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function desviacion(arr) { const m = media(arr); return Math.sqrt(media(arr.map((v) => (v - m) ** 2))); }

/* Acute:Chronic Workload Ratio — ventana de 7 días sobre ventana de 28, distinta de
   CTL/ATL de arriba. > 1.5 es el umbral de riesgo citado en la literatura (Gabbett). */
export function acwr(cargasDiarias, idx) {
  const aguda = media(cargasDiarias.slice(Math.max(0, idx - 6), idx + 1));
  const cronica = media(cargasDiarias.slice(Math.max(0, idx - 27), idx + 1));
  if (cronica > 0) return aguda / cronica;
  return aguda > 0 ? Infinity : 0;
}

/* Monotonía (Foster): media/desviación de la carga semanal. Alta = semana muy pareja,
   sin días duros/suaves — señal de sobreentrenamiento aunque el volumen total sea bajo. */
export function monotonia(cargasDiarias, idx) {
  const semana = cargasDiarias.slice(Math.max(0, idx - 6), idx + 1);
  const sd = desviacion(semana);
  // sd = 0 con carga > 0 es el caso de MÁXIMA monotonía (semana perfectamente pareja),
  // no el de mínima — devolver 0 ahí invertiría el semáforo.
  if (sd > 0) return media(semana) / sd;
  return media(semana) > 0 ? Infinity : 0;
}

/* "danger": salto agudo:crónico > 1.5. "high": semana muy monótona (>2). "optimal": resto. */
export function semaforoCarga(cargasDiarias, idx) {
  if (!cargasDiarias.length) return "optimal";
  if (acwr(cargasDiarias, idx) > 1.5) return "danger";
  if (monotonia(cargasDiarias, idx) > 2) return "high";
  return "optimal";
}
