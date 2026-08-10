/* ==========================================================================
   Correlación exploratoria — Pearson simple. Con n pequeño (28 días como
   mucho) esto NUNCA es significancia estadística: se etiqueta como
   observación, nunca como causalidad.
   ========================================================================== */

export function pearson(xs, ys) {
  const pares = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x != null && y != null && !Number.isNaN(x) && !Number.isNaN(y));
  const n = pares.length;
  if (n < 3) return { r: null, n };
  const mx = pares.reduce((a, [x]) => a + x, 0) / n;
  const my = pares.reduce((a, [, y]) => a + y, 0) / n;
  let num = 0, dx2 = 0, dy2 = 0;
  pares.forEach(([x, y]) => {
    const dx = x - mx, dy = y - my;
    num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
  });
  const den = Math.sqrt(dx2 * dy2);
  return { r: den > 0 ? Math.round((num / den) * 100) / 100 : 0, n };
}

/* Frase honesta a partir de un coeficiente — nunca afirma causalidad,
   nunca esconde que el tamaño de muestra es chico. */
export function frasePearson(nombreX, nombreY, resultado) {
  if (resultado.r == null) return `Todavía no hay suficientes días con ${nombreX} y ${nombreY} registrados juntos para observar algo (mínimo 3, hoy hay ${resultado.n}).`;
  const fuerza = Math.abs(resultado.r) >= 0.5 ? "una relación" : Math.abs(resultado.r) >= 0.25 ? "una relación leve" : "poca relación";
  const sentido = resultado.r >= 0 ? "más" : "menos";
  return `Con ${resultado.n} días registrados, se observa ${fuerza} entre ${nombreX} y ${nombreY} (r = ${resultado.r}): a ${sentido} ${nombreX}, ${sentido === "más" ? "más" : "menos"} ${nombreY} en esos mismos días. Es una observación exploratoria, no causalidad.`;
}
