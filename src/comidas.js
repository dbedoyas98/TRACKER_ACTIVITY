/* ==========================================================================
   Resuelve la notación abreviada del plan ("3 huevos + C + ½ fruta") a
   alimentos concretos con gramos, según el perfil del usuario.
   ========================================================================== */

function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

const TOKENS = [
  { re: /^P y medio$/, cat: "P", factor: 1.5 },
  { re: /^(½\s?P|medio P)$/, cat: "P", factor: 0.5 },
  { re: /^P$/, cat: "P", factor: 1 },
  { re: /^(½\s?C|medio C)$/, cat: "C", factor: 0.5 },
  { re: /^C$/, cat: "C", factor: 1 },
  { re: /^(½\s?G|medio G)$/, cat: "G", factor: 0.5 },
  { re: /^G$/, cat: "G", factor: 1 },
  { re: /^(½\s?fruta|media de fruta)$/, cat: "F", factor: 0.5 },
  { re: /^fruta$/, cat: "F", factor: 1 },
];

// Determinista: mismo candidatos+seed siempre da el mismo resultado, sin Math.random().
function elegirOpciones(candidatos, seed, max) {
  const orden = [...candidatos].sort((a, b) => a[0].localeCompare(b[0], "es"));
  if (orden.length <= max) return orden;
  const start = hashStr(seed) % orden.length;
  const out = [];
  for (let i = 0; i < max; i++) out.push(orden[(start + i) % orden.length]);
  return out;
}

function valorBanda(fila, bandaIdx, pesar) {
  const banda = fila[2 + bandaIdx];
  if (pesar === "cocido" && banda.cocido != null) return { valor: banda.cocido, peso: "cocido" };
  return { valor: banda.crudo, peso: banda.crudo != null && typeof banda.crudo === "number" ? "crudo" : null };
}

function resolverPorcion(cat, factor, contexto) {
  const { fecha, comida, perfil, porciones } = contexto;
  const bandaTxt = (perfil.banda && perfil.banda[comida]) || "0-300";
  const bandaIdx = bandaTxt.startsWith("300") ? 1 : 0;
  const excluidos = new Set(perfil.excluidos || []);
  ((contexto.evitar && contexto.evitar[cat]) || []).forEach((n) => excluidos.add(n));

  let candidatos = porciones.filter((f) => f[1] === cat && !excluidos.has(f[0]));
  const favoritos = (perfil.favoritos && perfil.favoritos[cat]) || [];
  const favFiltrados = candidatos.filter((f) => favoritos.includes(f[0]));
  if (favFiltrados.length) candidatos = favFiltrados;

  const elegidos = elegirOpciones(candidatos, fecha + cat, 3);
  const opciones = elegidos.map((fila) => {
    const { valor, peso } = valorBanda(fila, bandaIdx, perfil.pesar);
    if (typeof valor === "number") {
      return { alimento: fila[0], gramos: Math.round(valor * factor), unidad: "g", peso };
    }
    return { alimento: fila[0], gramos: null, unidad: valor, peso: null };
  });
  return { tipo: "porcion", cat, factor, opciones };
}

export function resolver(textoPlan, contexto) {
  const partes = textoPlan.split(" + ").map((seg) => {
    const trimmed = seg.trim();
    for (const t of TOKENS) {
      if (t.re.test(trimmed)) return resolverPorcion(t.cat, t.factor, contexto);
    }
    return { tipo: "literal", texto: trimmed };
  });
  return { original: textoPlan, partes };
}
