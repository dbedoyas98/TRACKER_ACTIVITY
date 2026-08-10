/* ==========================================================================
   Disposición diaria (readiness): un número 0-100, siempre explicable —
   devuelve los factores que lo movieron, nunca solo el número.
   ========================================================================== */

const ENERGIA_VALOR = { Alta: 100, Media: 60, Baja: 20 };

export function disposicionDiaria({ horasSueno, energia, tsb, adherencia7d }) {
  const factores = [];

  const sueno = horasSueno == null ? null : Math.max(0, Math.min(100, ((horasSueno - 4) / 4) * 100));
  factores.push({ nombre: "Sueño", valor: sueno == null ? 50 : Math.round(sueno), peso: 0.3, medido: sueno != null });

  const forma = tsb == null ? null : Math.max(0, Math.min(100, ((tsb + 30) / 50) * 100));
  factores.push({ nombre: "Forma (carga reciente)", valor: forma == null ? 50 : Math.round(forma), peso: 0.35, medido: forma != null });

  const energiaVal = ENERGIA_VALOR[energia];
  factores.push({ nombre: "Energía percibida", valor: energiaVal ?? 50, peso: 0.2, medido: energiaVal != null });

  const adh = adherencia7d == null ? null : Math.round(Math.max(0, Math.min(1, adherencia7d)) * 100);
  factores.push({ nombre: "Adherencia últimos 7 días", valor: adh ?? 50, peso: 0.15, medido: adh != null });

  const valor = Math.round(factores.reduce((a, f) => a + f.valor * f.peso, 0));
  return { valor: Math.max(0, Math.min(100, valor)), factores };
}
