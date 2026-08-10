/* ==========================================================================
   Progresión de fuerza: doble progresión por defecto. Necesita registro real de
   series (fase 4, modo en sesión) — la función ya queda lista y probada.
   ========================================================================== */

export const REGLA_DEFECTO = { pisoReps: 8, techoReps: 12, incrementoKg: 2.5 };

export function sugerirProgresion(ultimaSesion, regla = REGLA_DEFECTO) {
  if (!ultimaSesion || !ultimaSesion.series || !ultimaSesion.series.length) {
    return { accion: "mantener", peso: null, reps: regla.pisoReps, motivo: "Sin registro previo: arranca conservador y ajusta desde ahí." };
  }
  const { series } = ultimaSesion;
  const pesoActual = series[series.length - 1].peso;
  const todasEnTecho = series.every((s) => s.reps >= regla.techoReps);
  const algunaBajoPiso = series.some((s) => s.reps < regla.pisoReps);

  if (todasEnTecho) {
    return {
      accion: "subir_peso",
      peso: Math.round((pesoActual + regla.incrementoKg) * 10) / 10,
      reps: regla.pisoReps,
      motivo: `Completaste ${regla.techoReps}+ reps en todas las series: sube ${regla.incrementoKg} kg y vuelve a ${regla.pisoReps} reps.`,
    };
  }
  if (algunaBajoPiso) {
    return {
      accion: "mantener",
      peso: pesoActual,
      reps: regla.pisoReps,
      motivo: `No llegaste a ${regla.pisoReps} reps en alguna serie: repite el mismo peso.`,
    };
  }
  return {
    accion: "subir_reps",
    peso: pesoActual,
    reps: null,
    motivo: "Vas dentro del rango: suma una repetición más por serie si puedes.",
  };
}

export function esPR(historial, sesionNueva) {
  if (!sesionNueva || !sesionNueva.series || !sesionNueva.series.length) return false;
  const mejorNueva = Math.max(...sesionNueva.series.map((s) => s.peso * (1 + s.reps / 30)));
  const mejorHistorico = (historial || []).flatMap((h) => h.series || [])
    .reduce((max, s) => Math.max(max, s.peso * (1 + s.reps / 30)), 0);
  return mejorNueva > mejorHistorico;
}
