/* ==========================================================================
   Media móvil y banda de ruido — el peso de un día suelto no dice nada,
   la tendencia sí. Funciones puras sobre series de medidas reales.
   ========================================================================== */

export function mediaMovil(valores, ventana = 7) {
  return valores.map((_, i) => {
    const desde = Math.max(0, i - ventana + 1);
    const tramo = valores.slice(desde, i + 1);
    return tramo.reduce((a, b) => a + b, 0) / tramo.length;
  });
}

/* Banda de ruido: desviación estándar de los residuos (valor real − media móvil)
   sobre toda la serie, aplicada como ± alrededor de cada punto de la media móvil. */
export function bandaRuido(valores, ventana = 7) {
  const mm = mediaMovil(valores, ventana);
  const residuos = valores.map((v, i) => v - mm[i]);
  const media = residuos.reduce((a, b) => a + b, 0) / (residuos.length || 1);
  const varianza = residuos.reduce((a, r) => a + (r - media) ** 2, 0) / (residuos.length || 1);
  const sd = Math.sqrt(varianza);
  return mm.map((v) => ({ media: v, min: v - sd, max: v + sd }));
}
