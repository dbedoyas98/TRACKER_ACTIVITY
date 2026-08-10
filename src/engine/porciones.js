/* ==========================================================================
   Resumen de porciones del día. No inventa calorías ni macros por 100 g que no
   vengan del plan real de la nutricionista — solo cuenta porciones P/C/G/F ya
   resueltas por src/comidas.js, en gramos cuando el alimento los tiene.
   ========================================================================== */

export function resumenPorciones(resueltos) {
  const conteo = { P: 0, C: 0, G: 0, F: 0 };
  const gramos = { P: 0, C: 0, G: 0, F: 0 };
  resueltos.forEach((r) => {
    r.partes.forEach((parte) => {
      if (parte.tipo !== "porcion") return;
      conteo[parte.cat] += parte.factor;
      const opcion = parte.opciones[0];
      if (opcion && typeof opcion.gramos === "number") gramos[parte.cat] += opcion.gramos;
    });
  });
  return { conteo, gramos };
}
