import React, { useState, useEffect, useMemo, useCallback } from "react";
import { resolver } from "./comidas.js";
import { RECETAS } from "./data/recetas.js";
import {
  DIAS, DIAS_C, DETOX, NUTRI, GYM, SERIES, BICI,
  ESTUDIO, SABOTEADORES, FOCO_MENTE, PORCIONES, SNACKS, PRE_ENTRENO, MEDIDAS, PILARES,
} from "./data/plan.js";
import { bandaRuido } from "./engine/tendencia.js";
import { cargaSesion } from "./engine/carga.js";
import { importarActividad } from "./engine/importar.js";
import ModoSesion from "./views/ModoSesion.jsx";

/* ==========================================================================
   FUNDAMENTO · v2
   Sistema personal de 28 días — Mesa · Ruta · Taller · Oficio · Mente
   Dirección visual: computador de ruta nocturno. Datos que brillan sobre
   fondo azul profundo, esquinas cortadas, tipografía técnica.
   ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Archivo:wght@400;500;600&display=swap');

.fd * { box-sizing:border-box; }
.fd {
  --bg:#050B12; --deep:#030710;
  --panel:rgba(13,26,42,.72); --panel2:rgba(20,38,58,.6);
  --line:#16324A; --grid:#0E2033;
  --text:#DCEBF7; --dim:#6E90AB; --dimmer:#3E5B75;
  --mesa:#FFB020; --ruta:#22E0D6; --taller:#4D8DFF; --oficio:#A77BFF; --mente:#FF5C8A;
  --accent:var(--ruta);
  /* escala semántica de carga (motor de entreno) — separada de los colores de pilar */
  --load-low:#4D8DFF; --load-optimal:#22E0D6; --load-high:#FFB020; --load-danger:#FF5C8A;
  --disp:'Chakra Petch', system-ui, sans-serif;
  --body:'Archivo', system-ui, sans-serif;
  --mono:'IBM Plex Mono', ui-monospace, monospace;
  /* escala tipográfica: un tamaño fijo por rol */
  --fs-display:34px; --fs-h1:28px; --fs-h2:16px; --fs-body:14px; --fs-label:10.5px; --fs-data:12.5px;
  /* espaciado: pasos de 4px */
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px; --sp-5:24px; --sp-6:32px; --sp-7:48px;
  /* movimiento */
  --dur-fast:150ms; --dur-base:220ms; --ease:cubic-bezier(.2,.7,.3,1);
  background:
    radial-gradient(900px 500px at 50% -10%, rgba(34,224,214,.10), transparent 60%),
    radial-gradient(700px 400px at 100% 20%, rgba(167,123,255,.07), transparent 60%),
    var(--bg);
  background-attachment:fixed;
  color:var(--text); font-family:var(--body); min-height:100vh;
  -webkit-font-smoothing:antialiased; padding-bottom:92px;
}
.fd button { font-family:inherit; color:inherit; cursor:pointer; border:none; background:none; }
.fd :focus-visible { outline:1.5px solid var(--ruta); outline-offset:3px; }
.wrap { max-width:780px; margin:0 auto; padding:0 15px; }

/* corte de esquina: una sola fórmula, cada selector solo declara --cut-size */
.pane, .box, .wbtn, .pill, .btn {
  clip-path:polygon(0 var(--cut-size), var(--cut-size) 0, 100% 0,
    100% calc(100% - var(--cut-size)), calc(100% - var(--cut-size)) 100%, 0 100%);
}
.num { font-variant-numeric:tabular-nums; }

/* paneles con esquina cortada */
.pane { --cut-size:10px; position:relative; background:var(--panel); border:1px solid var(--line);
  backdrop-filter:blur(8px); }
.pane::after { content:''; position:absolute; right:0; bottom:0; width:11px; height:11px;
  background:linear-gradient(135deg, transparent 50%, var(--line) 50%); }

/* cabecera */
.top { padding:24px 0 8px; }
.eyebrow { font-family:var(--mono); font-size:10.5px; letter-spacing:.28em; text-transform:uppercase; color:var(--ruta); }
.eyebrow::before { content:'▸ '; color:var(--dimmer); }
.h1 { font-family:var(--disp); font-weight:700; font-size:31px; line-height:1.05; letter-spacing:.01em; margin:9px 0 0; text-transform:uppercase; }
.h1 small { display:block; font-family:var(--mono); font-size:11.5px; letter-spacing:.12em; color:var(--dim); margin-top:9px; font-weight:400; text-transform:none; }
.h3 { font-family:var(--mono); font-size:10px; letter-spacing:.26em; text-transform:uppercase; color:var(--dim);
  margin:26px 0 10px; display:flex; align-items:center; gap:10px; }
.h3::after { content:''; flex:1; height:1px; background:linear-gradient(90deg, var(--line), transparent); }

/* HUD principal */
.hud { display:grid; grid-template-columns:186px 1fr; gap:14px; padding:16px; margin-top:14px; align-items:center; }
@media (max-width:520px){ .hud { grid-template-columns:1fr; justify-items:center; } .hud-side { width:100%; } }
.hud-legend { display:flex; flex-direction:column; gap:9px; width:100%; }
.hl { display:flex; align-items:center; gap:9px; font-family:var(--mono); font-size:11px; letter-spacing:.1em; }
.hl u { text-decoration:none; width:22px; height:3px; border-radius:2px; background:var(--hc); box-shadow:0 0 8px var(--hc); flex:none; }
.hl b { flex:1; font-weight:500; color:var(--dim); text-transform:uppercase; }
.hl i { font-style:normal; color:var(--text); }

/* tarjetas de pilar */
.pillars { display:flex; flex-direction:column; gap:9px; }
.pcard { position:relative; }
.pcard .pane { overflow:hidden; }
.phead { display:flex; align-items:center; gap:12px; width:100%; padding:14px 14px 14px 16px; text-align:left; position:relative; }
.phead::before { content:''; position:absolute; left:0; top:10px; bottom:10px; width:2px; background:var(--pc); box-shadow:0 0 10px var(--pc); }
.ptitle { flex:1; min-width:0; }
.ptitle b { font-family:var(--disp); font-weight:600; font-size:15px; letter-spacing:.06em; text-transform:uppercase; display:block; }
.ptitle i { font-style:normal; font-size:12.5px; color:var(--dim); display:block; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pmeter { width:40px; flex:none; text-align:right; }
.pmeter b { font-family:var(--mono); font-size:12px; color:var(--dim); display:block; }
.pmeter u { display:block; height:2px; margin-top:5px; background:var(--grid); text-decoration:none; }
.pmeter u span { display:block; height:100%; background:var(--pc); box-shadow:0 0 6px var(--pc); transition:width .35s; }
.pbody { padding:2px 14px 14px; border-top:1px solid var(--line); }

/* checks */
.chk { display:flex; gap:11px; align-items:flex-start; width:100%; text-align:left; padding:10px 0;
  border-bottom:1px solid rgba(22,50,74,.6); }
.chk:last-child { border-bottom:none; }
.box { --cut-size:5px; width:19px; height:19px; flex:none; margin-top:2px; border:1.5px solid var(--dimmer); display:grid; place-items:center;
  transition:all .15s; }
.chk[data-on="1"] .box { background:var(--pc); border-color:var(--pc); box-shadow:0 0 12px var(--pc); }
.box svg { width:11px; height:11px; opacity:0; }
.chk[data-on="1"] .box svg { opacity:1; }
.chk-txt { font-size:14px; line-height:1.42; }
.chk[data-on="1"] .chk-txt { color:var(--dim); }
.chk-sub { display:block; font-size:12.5px; color:var(--dim); margin-top:4px; line-height:1.5; }
.tag { font-family:var(--mono); font-size:9.5px; letter-spacing:.14em; color:var(--pc); border:1px solid var(--pc); padding:1px 5px; margin-right:7px; opacity:.85; }

/* agua */
.water { display:flex; align-items:center; gap:10px; margin-top:14px; }
.wbtn { --cut-size:6px; width:40px; height:40px; background:var(--panel2); border:1px solid var(--line); font-family:var(--mono); font-size:17px; }
.wtrack { flex:1; height:40px; background:var(--panel2); border:1px solid var(--line); position:relative; overflow:hidden; }
.wfill { position:absolute; inset:0 auto 0 0; background:linear-gradient(90deg, rgba(255,176,32,.10), rgba(255,176,32,.34)); border-right:1px solid var(--mesa); box-shadow:0 0 14px rgba(255,176,32,.4); transition:width .35s; }
.wlabel { position:absolute; inset:0; display:grid; place-items:center; font-family:var(--mono); font-size:13px; letter-spacing:.1em; }

/* inputs */
.fld { width:100%; background:var(--panel2); border:1px solid var(--line); color:var(--text); font-family:var(--mono);
  font-size:13.5px; padding:11px 12px; margin-top:7px; }
.fld::placeholder { color:var(--dimmer); }
textarea.fld { resize:vertical; min-height:74px; font-family:var(--body); line-height:1.55; }
.lbl { display:block; font-family:var(--mono); font-size:9.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); margin-top:14px; }
.row { display:flex; gap:9px; }

/* pills */
.pills { display:flex; gap:6px; flex-wrap:wrap; }
.pill { --cut-size:5px; font-family:var(--mono); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; padding:8px 13px;
  border:1px solid var(--line); background:var(--panel2); color:var(--dim); }
.pill[data-on="1"] { border-color:var(--ruta); color:var(--ruta); box-shadow:0 0 14px rgba(34,224,214,.18) inset; }

/* bloques */
.block { padding:15px; margin-bottom:9px; }
.block h4 { font-family:var(--disp); font-weight:600; font-size:14.5px; letter-spacing:.05em; text-transform:uppercase; margin:0 0 9px; }
.block p { font-size:13.5px; line-height:1.6; color:var(--dim); margin:0 0 9px; }
.block p:last-child { margin-bottom:0; }
.block p b { color:var(--text); font-weight:600; }
.li { display:flex; gap:10px; font-size:13.5px; line-height:1.55; padding:6px 0; }
.li em { font-family:var(--mono); font-style:normal; font-size:10px; color:var(--ruta); flex:none; width:24px; padding-top:3px; opacity:.7; }
.meal { display:grid; grid-template-columns:62px 1fr; gap:10px; padding:10px 0; border-bottom:1px solid rgba(22,50,74,.6); font-size:13.5px; line-height:1.5; }
.meal:last-child { border-bottom:none; }
.meal b { font-family:var(--mono); font-size:9.5px; letter-spacing:.16em; color:var(--dimmer); font-weight:500; padding-top:3px; }

/* tabla */
.tbl { width:100%; border-collapse:collapse; font-size:12.5px; }
.tbl th { font-family:var(--mono); font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--dim);
  text-align:right; font-weight:500; padding:7px 4px; border-bottom:1px solid var(--line); }
.tbl th:first-child { text-align:left; }
.tbl td { padding:8px 4px; border-bottom:1px solid rgba(22,50,74,.5); text-align:right; font-family:var(--mono); }
.tbl td:first-child { text-align:left; font-family:var(--body); }

/* stats */
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:9px; }
.stat { padding:15px; }
.stat b { font-family:var(--disp); font-weight:700; font-size:30px; line-height:1; display:block; color:var(--ruta); text-shadow:0 0 22px rgba(34,224,214,.45); }
.stat span { display:block; font-family:var(--mono); font-size:9.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); margin-top:9px; }

/* heat */
.heat { display:grid; grid-template-columns:repeat(7,1fr); gap:5px; }
.hcell { aspect-ratio:1; border:1px solid var(--line); display:grid; place-items:center;
  font-family:var(--mono); font-size:10px; color:var(--dimmer); }
.hcell[data-today="1"] { border-color:var(--mesa); color:var(--mesa); box-shadow:0 0 12px rgba(255,176,32,.35); }

/* botones */
.btn { --cut-size:7px; display:block; width:100%; text-align:center; padding:13px; background:var(--panel2); border:1px solid var(--line);
  font-family:var(--mono); font-size:11px; letter-spacing:.2em; text-transform:uppercase; margin-top:10px; }
.btn.solid { background:var(--ruta); color:#031014; border-color:var(--ruta); box-shadow:0 0 22px rgba(34,224,214,.25); }
.btn.warn { color:var(--mente); border-color:rgba(255,92,138,.45); }

/* nav */
.nav { position:fixed; left:0; right:0; bottom:0; z-index:20; background:linear-gradient(180deg, rgba(5,11,18,.75), rgba(3,7,16,.97));
  border-top:1px solid var(--line); backdrop-filter:blur(16px); padding:9px 0 max(9px, env(safe-area-inset-bottom)); }
.nav-in { max-width:780px; margin:0 auto; display:grid; grid-template-columns:repeat(5,1fr); }
.nav button { padding:6px 0 4px; display:flex; flex-direction:column; align-items:center; gap:6px; color:var(--dimmer); }
.nav button[data-on="1"] { color:var(--ruta); }
.nav i { width:7px; height:7px; display:block; transform:rotate(45deg); border:1.5px solid currentColor; }
.nav button[data-on="1"] i { background:currentColor; box-shadow:0 0 12px currentColor; }
.nav small { font-family:var(--mono); font-size:9px; letter-spacing:.18em; text-transform:uppercase; }

.note { font-size:12px; color:var(--dimmer); line-height:1.6; margin-top:13px; }
.cap { padding:12px; margin-top:8px; font-size:13px; line-height:1.55; background:var(--panel2); border-left:2px solid var(--mente); }
.cap b { display:block; font-family:var(--mono); font-size:9.5px; letter-spacing:.18em; color:var(--mente); margin-bottom:6px; }
.chartwrap { padding:16px 14px 12px; }
.charthead { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px; }
.charthead b { font-family:var(--mono); font-size:9.5px; letter-spacing:.22em; text-transform:uppercase; color:var(--dim); font-weight:500; }
.charthead span { font-family:var(--disp); font-weight:700; font-size:19px; color:var(--ruta); }
.axis { display:flex; justify-content:space-between; font-family:var(--mono); font-size:9px; letter-spacing:.16em; color:var(--dimmer); margin-top:8px; }
@keyframes pulse { 0%,100% { opacity:.25; r:9 } 50% { opacity:0; r:15 } }
.pulse { animation:pulse 2.4s ease-out infinite; }
@media (prefers-reduced-motion: reduce) { .fd * { transition:none !important; animation:none !important; } }
`;

/* ==========================================================================
   ENTRENAMIENTO — resolución de sesión por día configurable
   ========================================================================== */

/* Días de entrenamiento configurables: cada una de las 4 semanas del bloque tiene su
   propia plantilla (se programa semana a semana, no es un patrón que se repite), más
   overrides puntuales por fecha. La progresión (reps, RPE, minutos) sigue viniendo del
   índice de semana. */
const SESIONES_VALIDAS = ["gymA", "gymB", "gymC", "biciZ2", "biciSeries", "biciLarga", "movilidad", "descanso"];
const SESION_LABEL = {
  gymA: "Gimnasio A", gymB: "Gimnasio B", gymC: "Gimnasio C",
  biciZ2: "Bici Z2", biciSeries: "Bici series", biciLarga: "Salida larga",
  movilidad: "Movilidad", descanso: "Descanso",
};
const PLANTILLA_BASE = ["gymA", "biciZ2", "gymB", "biciSeries", "gymC", "biciLarga", "movilidad"];
const DEFAULT_ENTRENO = {
  semanas: { 1: [...PLANTILLA_BASE], 2: [...PLANTILLA_BASE], 3: [...PLANTILLA_BASE], 4: [...PLANTILLA_BASE] },
  overrides: {},
  planificada: { 1: false, 2: false, 3: false, 4: false },
};

const SESIONES = {
  gymA: (semIdx) => ({ tipo: "gym", titulo: GYM.A.nombre, sub: SERIES[semIdx].s + " · " + SERIES[semIdx].rpe, lista: GYM.A.ej, min: 55 }),
  gymB: (semIdx) => ({ tipo: "gym", titulo: GYM.B.nombre, sub: SERIES[semIdx].s + " · " + SERIES[semIdx].rpe, lista: GYM.B.ej, min: 55 }),
  gymC: (semIdx) => ({ tipo: "gym", titulo: GYM.C.nombre, sub: SERIES[semIdx].v + " · descanso corto, respiración controlada", lista: GYM.C.ej, min: 40 }),
  biciZ2: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.z2[0], sub: b.z2[1], lista: [], min: b.z2[2] }; },
  biciSeries: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.int[0], sub: b.int[1], lista: [], min: b.int[2] }; },
  biciLarga: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.larga[0], sub: b.larga[1], lista: [], min: b.larga[2] }; },
  movilidad: () => ({ tipo: "libre", titulo: "Descanso activo · movilidad y caminata", sub: "20 min de movilidad de cadera y espalda alta + 40 min de caminata. Nada de intensidad.", lista: [], min: 60 }),
  descanso: () => ({ tipo: "descanso", titulo: "Descanso completo", sub: "Sin sesión estructurada. El cuerpo absorbe la carga de los días duros — camina suave si te provoca.", lista: [], min: 0 }),
};

function plantillaDeSemana(cfg, sem) {
  return (cfg.semanas && cfg.semanas[sem]) || PLANTILLA_BASE;
}

function entrenoDe(sem, dia, config, fechaISO) {
  const cfg = config || DEFAULT_ENTRENO;
  const clave = (fechaISO && cfg.overrides && cfg.overrides[fechaISO]) || plantillaDeSemana(cfg, sem)[dia];
  const gen = SESIONES[clave] || SESIONES.descanso;
  return { ...gen(sem - 1), clave };
}

function fechaDeSemDia(inicioISO, sem, dia) {
  const d = parseISO(inicioISO); d.setDate(d.getDate() + (sem - 1) * 7 + dia); return iso(d);
}

/* Avisos, no bloqueos: se calculan sobre la plantilla base, no sobre overrides puntuales. */
const DURAS = new Set(["gymA", "gymB", "gymC", "biciZ2", "biciSeries", "biciLarga"]);
function avisosEntreno(plantilla) {
  const avisos = [];
  let racha = 0, rachaMax = 0;
  plantilla.forEach((k) => { racha = DURAS.has(k) ? racha + 1 : 0; rachaMax = Math.max(rachaMax, racha); });
  if (rachaMax >= 3) avisos.push("Tres o más días duros seguidos, sin descanso ni movilidad entre medio.");
  for (let i = 0; i < plantilla.length - 1; i++) {
    if (plantilla[i] === "biciSeries" && plantilla[i + 1] === "biciLarga")
      avisos.push("La salida larga queda justo después del día de series: el cuerpo llega cargado.");
  }
  if (!plantilla.includes("movilidad") && !plantilla.includes("descanso"))
    avisos.push("Esta semana no tiene ningún día de descanso o movilidad.");
  if (plantilla.filter((k) => k.startsWith("bici")).length < 2)
    avisos.push("Menos de dos sesiones de bici en la semana, y el bloque apunta a ciclismo.");
  return avisos;
}


/* ==========================================================================
   UTILIDADES
   ========================================================================== */

function fmtBanda(banda) {
  if (typeof banda.crudo !== "number") return banda.crudo;
  return banda.cocido != null ? `${banda.crudo} g · ${banda.cocido} g cocido` : `${banda.crudo} g`;
}


/* Capa de almacenamiento: usa window.storage dentro de Claude,
   y localStorage cuando corre como app instalada. */
const store = (typeof window !== 'undefined' && window.storage) ? window.storage : {
  get: async (k) => { const v = localStorage.getItem(k); return v ? { key: k, value: v } : null; },
  set: async (k, v) => { localStorage.setItem(k, v); return { key: k, value: v }; },
};

const KEY = "fundamento:v4";
const KEY_V3 = "fundamento:v3";
const KEY_V2 = "fundamento:v2";
const KEY_V1 = "fundamento:v1";
const DEFAULT_PERFIL = {
  favoritos: { P: [], C: [], G: [], F: [] },
  excluidos: [],
  banda: { desayuno: "0-300", almuerzo: "300-700", media: "0-300", cena: "300-700" },
  pesar: "crudo",
  rotacion: true,
  porcionesExtra: [],
};
function migrarV1aV2(v1) { return { ...v1, entreno: v1.entreno || DEFAULT_ENTRENO }; }
function migrarV2aV3(v2) { return { ...v2, perfil: v2.perfil || DEFAULT_PERFIL }; }
/* v3 traía una sola plantilla para las 4 semanas; v4 permite programar cada semana
   aparte. La plantilla vieja se copia a las 4 semanas para no perder la configuración,
   y se marca como "ya planificada" — el usuario ya la había revisado. */
function migrarV3aV4(v3) {
  const e = v3.entreno;
  let entreno = DEFAULT_ENTRENO;
  if (e && e.plantilla) {
    entreno = {
      semanas: { 1: [...e.plantilla], 2: [...e.plantilla], 3: [...e.plantilla], 4: [...e.plantilla] },
      overrides: e.overrides || {},
      planificada: { 1: true, 2: true, 3: true, 4: true },
    };
  } else if (e && e.semanas) {
    entreno = { semanas: e.semanas, overrides: e.overrides || {}, planificada: e.planificada || { 1: true, 2: true, 3: true, 4: true } };
  }
  return { ...v3, entreno };
}
const iso = (d) => d.toISOString().slice(0, 10);
const hoyISO = () => iso(new Date());
function parseISO(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function diffDias(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function lunesDeEstaSemana() { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); }


/* Timing nutricional: qué recomendación de PRE_ENTRENO (texto real del plan) aplica
   contra la sesión real de hoy — no una lista genérica, la que corresponde. */
function timingHoy(entreno) {
  if (entreno.tipo === "bici" && entreno.min >= 90) return [PRE_ENTRENO[1], PRE_ENTRENO[2]];
  if (entreno.min > 60) return [PRE_ENTRENO[0]];
  return [];
}

function tareasDe(sem, dia, config, fechaISO) {
  const n = NUTRI[sem - 1][dia];
  const e = entrenoDe(sem, dia, config, fechaISO);
  const est = ESTUDIO[sem - 1];
  const foco = FOCO_MENTE[sem - 1];

  const mesa = [
    { id: "m0", t: "Rutina détox en ayunas", s: DETOX[sem - 1] },
    { id: "m1", t: "Desayuno", s: n[0], tag: "07:00" },
    { id: "m2", t: "Almuerzo", s: n[1], tag: "12:30" },
    { id: "m3", t: "Media tarde", s: n[2], tag: "16:00" },
    { id: "m4", t: "Cena", s: n[3], tag: "19:30" },
    { id: "m5", t: "Verduras en al menos dos comidas", s: "Ilimitadas y obligatorias. Acompañan, no rellenan." },
    { id: "m6", t: "Cero licor, cero fritos, cero paquetes", s: "Orinar transparente todo el día es la señal de que vas bien de agua." },
  ];
  // Cena del miércoles de la semana 2: la nota condicional del plan ahora se resuelve contra los minutos reales del día.
  if (sem === 2 && dia === 2) {
    mesa[4] = { ...mesa[4], s: n[3] + (e.min >= 90
      ? " → Hoy entrenas " + e.min + " min (≥90): aplica C completo y sin el ½ G."
      : " → Hoy entrenas " + e.min + " min (<90): aplica la versión con ½ G y ½ C.") };
  }
  const ruta = [
    { id: "r0", t: e.titulo, s: e.sub, tag: e.min + " MIN" },
    { id: "r1", t: "Movilidad 10 minutos", s: "Cadera, tobillo y espalda alta. Antes del gym o al terminar el rodaje." },
  ];
  if (e.clave === "biciLarga" || e.min >= 90) ruta.push({ id: "r2", t: "Comer antes y durante", s: PRE_ENTRENO[1] + " " + PRE_ENTRENO[2] });

  const taller = [
    { id: "t0", t: "Bloque de estudio · 50 minutos", s: dia < 5 ? est.ses[dia] : "Sin sesión nueva: repasa lo que fallaste esta semana o descansa la cabeza." },
    { id: "t1", t: "Registrar una duda o hallazgo", s: "Una línea. Lo que no entendiste hoy es el material de mañana." },
  ];
  if (dia === 5) taller.push({ id: "t2", t: "Laboratorio de la semana", s: est.lab });

  const oficio = [
    { id: "o0", t: "Definir el trabajo más importante del día", s: "Uno solo, escrito antes de las 9:00. Si el día se cae, esto es lo que igual queda hecho." },
    { id: "o1", t: "Dos bloques profundos sin notificaciones", s: "60–90 minutos cada uno. Teams cerrado, teléfono boca abajo." },
    { id: "o2", t: "Cierre del día", s: "Revisar qué quedó abierto, dejar escrito el arranque de mañana y apagar." },
  ];
  const mente = [
    { id: "n0", t: "Tres pausas de 60 segundos", s: "Respiración, contacto de los pies en el piso, o escuchar el sonido más lejano. Cortan el piloto automático." },
    { id: "n1", t: "Captura de saboteador", s: "Cuando aparezca: qué pasó, qué te dijo, y qué respondería alguien que ya resolvió esto." },
    { id: "n2", t: foco.t.split(" · ")[1], s: foco.d },
  ];
  return { mesa, ruta, taller, oficio, mente, entreno: e, estudio: est, foco };
}

/* ==========================================================================
   GRÁFICAS
   ========================================================================== */

function AnillosHUD({ valores, total }) {
  const S = 190, c = S / 2;
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width="190" height="190" role="img" aria-label="Cumplimiento del día por frente">
      <defs>
        <filter id="gl" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {PILARES.map((p, i) => {
        const r = 84 - i * 14;
        const len = 2 * Math.PI * r;
        const v = valores[p.k] || 0;
        return (
          <g key={p.k} transform={`rotate(-90 ${c} ${c})`}>
            <circle cx={c} cy={c} r={r} fill="none" stroke="#0E2033" strokeWidth="7" />
            <circle cx={c} cy={c} r={r} fill="none" stroke={p.c} strokeWidth="7" strokeLinecap="butt"
              strokeDasharray={`${len * v} ${len}`} filter="url(#gl)" opacity={v > 0 ? 1 : 0.15}
              style={{ transition: "stroke-dasharray .5s ease" }} />
          </g>
        );
      })}
      <text x={c} y={c - 2} textAnchor="middle" fill="#DCEBF7" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="34">{Math.round(total * 100)}</text>
      <text x={c} y={c + 16} textAnchor="middle" fill="#6E90AB" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="3">POR CIENTO</text>
    </svg>
  );
}

function PerfilEtapa({ serie, hoyIdx, alto = 120 }) {
  const W = 700, H = alto, base = H - 16, techo = 14;
  const pts = serie.map((v, i) => [(i / 27) * W, base - v * (base - techo)]);
  const linea = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = linea + ` L ${W} ${base} L 0 ${base} Z`;
  const meta = base - 0.8 * (base - techo);
  const hp = pts[Math.max(0, Math.min(hoyIdx, 27))];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: alto }}
      role="img" aria-label="Perfil de cumplimiento de los 28 días">
      <defs>
        <linearGradient id="pf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22E0D6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22E0D6" stopOpacity="0" />
        </linearGradient>
        <filter id="gl2" x="-20%" y="-60%" width="140%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={base - g * (base - techo)} x2={W} y2={base - g * (base - techo)} stroke="#0E2033" strokeWidth="1" />
      ))}
      {[1, 2, 3].map((i) => (
        <line key={i} x1={(i * 7 / 27) * W} y1="4" x2={(i * 7 / 27) * W} y2={base} stroke="#16324A" strokeWidth="1" strokeDasharray="2 5" />
      ))}
      <line x1="0" y1={meta} x2={W} y2={meta} stroke="#FFB020" strokeWidth="1" strokeDasharray="6 5" opacity=".55" />
      <line x1="0" y1={base} x2={W} y2={base} stroke="#16324A" strokeWidth="1" />
      <path d={area} fill="url(#pf)" />
      <path d={linea} fill="none" stroke="#22E0D6" strokeWidth="2" strokeLinejoin="round" filter="url(#gl2)" vectorEffect="non-scaling-stroke" />
      {hoyIdx >= 0 && hoyIdx <= 27 && (
        <g>
          <line x1={hp[0]} y1={techo - 8} x2={hp[0]} y2={base} stroke="#FFB020" strokeWidth="1" opacity=".7" vectorEffect="non-scaling-stroke" />
          <circle className="pulse" cx={hp[0]} cy={hp[1]} r="9" fill="#FFB020" opacity=".25" />
          <circle cx={hp[0]} cy={hp[1]} r="4" fill="#FFB020" stroke="#050B12" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>
      )}
    </svg>
  );
}

function Radar({ valores }) {
  const S = 240, c = S / 2, R = 84;
  const ang = (i) => (-90 + i * 72) * (Math.PI / 180);
  const pt = (i, r) => [c + Math.cos(ang(i)) * r, c + Math.sin(ang(i)) * r];
  const anillo = (f) => PILARES.map((_, i) => pt(i, R * f).join(",")).join(" ");
  const forma = PILARES.map((p, i) => pt(i, R * Math.max(0.04, valores[p.k] || 0)).join(",")).join(" ");
  return (
    <svg viewBox={`0 0 ${S} ${S}`} style={{ display: "block", width: "100%", maxWidth: 300, margin: "0 auto" }}
      role="img" aria-label="Radar de cumplimiento por frente">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={anillo(f)} fill="none" stroke="#0E2033" strokeWidth="1" />
      ))}
      {PILARES.map((p, i) => {
        const [x, y] = pt(i, R);
        return <line key={p.k} x1={c} y1={c} x2={x} y2={y} stroke="#16324A" strokeWidth="1" />;
      })}
      <polygon points={forma} fill="rgba(34,224,214,.14)" stroke="#22E0D6" strokeWidth="1.5" />
      {PILARES.map((p, i) => {
        const [x, y] = pt(i, R * Math.max(0.04, valores[p.k] || 0));
        const [lx, ly] = pt(i, R + 22);
        return (
          <g key={p.k}>
            <circle cx={x} cy={y} r="3.5" fill={p.c} />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill={p.c}
              fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="1.6">{p.n.toUpperCase()}</text>
            <text x={lx} y={ly + 12} textAnchor="middle" dominantBaseline="middle" fill="#6E90AB"
              fontFamily="IBM Plex Mono, monospace" fontSize="9">{Math.round((valores[p.k] || 0) * 100)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

function Carga({ sem, hoyDia, config, inicio }) {
  const dias = DIAS.map((_, i) => entrenoDe(sem, i, config, inicio ? fechaDeSemDia(inicio, sem, i) : undefined));
  const mins = dias.map((d) => d.min);
  const max = Math.max(...mins, 1);
  const W = 700, H = 120, base = H - 4;
  const bw = W / 7 - 14;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 120 }}
      role="img" aria-label="Carga de entrenamiento de la semana en minutos">
      {mins.map((m, i) => {
        const h = (m / max) * (base - 26);
        const x = i * (W / 7) + 7;
        const act = i === hoyDia;
        const tipo = dias[i].tipo;
        const col = tipo === "gym" ? "#A77BFF" : tipo === "bici" ? "#22E0D6" : "#4D8DFF";
        return (
          <g key={i}>
            <rect x={x} y={base - h} width={bw} height={h} fill={col} opacity={act ? 0.95 : 0.35} />
            <rect x={x} y={base - h} width={bw} height="2" fill={col} />
            <text x={x + bw / 2} y={base - h - 8} textAnchor="middle" fill={act ? col : "#6E90AB"}
              fontFamily="IBM Plex Mono, monospace" fontSize="11">{m}</text>
            <text x={x + bw / 2} y={base + 0} textAnchor="middle" fill={act ? "#DCEBF7" : "#3E5B75"}
              fontFamily="IBM Plex Mono, monospace" fontSize="10" letterSpacing="1">{DIAS_C[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Tendencia({ datos, campo, color, unidad }) {
  const vals = datos.filter((d) => d[campo] !== undefined);
  if (vals.length < 2) return null;
  const W = 700, H = 90, pad = 10;
  const ys = vals.map((v) => v[campo]);
  const banda = bandaRuido(ys, 7);
  const mm = banda.map((b) => b.media);
  const min = Math.min(...banda.map((b) => b.min), ...ys), max = Math.max(...banda.map((b) => b.max), ...ys);
  const span = max - min || 1;
  const x = (i) => pad + (i / (vals.length - 1)) * (W - pad * 2);
  const y = (v) => H - pad - ((v - min) / span) * (H - pad * 2);
  const puntos = vals.map((v, i) => [x(i), y(v[campo])]);
  const lineaMM = mm.map((v, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
  const areaBanda = banda.map((b, i) => (i === 0 ? "M" : "L") + x(i).toFixed(1) + " " + y(b.max).toFixed(1)).join(" ")
    + " " + banda.map((b, i) => "L" + x(banda.length - 1 - i).toFixed(1) + " " + y(banda[banda.length - 1 - i].min).toFixed(1)).join(" ") + " Z";
  const ultimaMM = Math.round(mm[mm.length - 1] * 10) / 10;
  const deltaMM = Math.round((mm[mm.length - 1] - mm[0]) * 10) / 10;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="charthead">
        <b>{campo === "peso" ? "Peso" : MEDIDAS.find((m) => m[0] === campo)[1]} · media móvil 7 días</b>
        <span style={{ color: deltaMM <= 0 ? color : "#FFB020", fontSize: 15 }}>
          {ultimaMM} {unidad} · {deltaMM > 0 ? "+" : ""}{deltaMM}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
        <path d={areaBanda} fill={color} opacity=".08" />
        <path d={lineaMM} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {puntos.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill={color} opacity=".4" />)}
      </svg>
      <div className="axis"><span>{vals[0].fecha}</span><span>{vals[vals.length - 1].fecha}</span></div>
      <div className="note">Puntos tenues: dato real de cada registro. Línea y banda: media móvil de 7 días y su ruido — el dato de un día solo no dice nada.</div>
    </div>
  );
}

function Check({ on, onClick, tag, title, sub }) {
  return (
    <button className="chk" data-on={on ? 1 : 0} onClick={onClick} aria-pressed={on}>
      <span className="box"><svg viewBox="0 0 12 12" fill="none">
        <path d="M1.5 6.2 4.4 9 10.5 3" stroke="#050B12" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg></span>
      <span className="chk-txt">{tag ? <span className="tag">{tag}</span> : null}{title}
        {sub ? <span className="chk-sub">{sub}</span> : null}</span>
    </button>
  );
}

const CAT_LABEL = { P: "Proteína", C: "Carbohidrato", G: "Grasa", F: "Fruta" };
const FACTOR_LABEL = { 0.5: "media porción", 1.5: "porción y media" };
const MESA_COMIDA = { m1: "desayuno", m2: "almuerzo", m3: "media", m4: "cena" };
const COMIDAS_KEYS = ["desayuno", "almuerzo", "media", "cena"];

function hashFecha(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

/* Criterio de selección: slot del día, categoría que el día pide, sin excluidos,
   no sugerida en los últimos 3 días, desempate determinista por hash de la fecha. */
function sugerirRecetas(fecha, categoriasDelDia, perfil, diasState) {
  const excluidos = perfil.excluidos || [];
  const candidatas = RECETAS.filter((r) =>
    r.slots.some((s) => COMIDAS_KEYS.includes(s)) &&
    r.cubre.some((c) => categoriasDelDia.has(c)) &&
    !r.usa.some((u) => excluidos.includes(u))
  );
  const recientes = new Set();
  for (let i = 1; i <= 3; i++) {
    const d = parseISO(fecha); d.setDate(d.getDate() - i);
    const reg = diasState[iso(d)];
    ((reg && reg.sugeridas) || []).forEach((id) => recientes.add(id));
  }
  let pool = candidatas.filter((r) => !recientes.has(r.id));
  if (pool.length < 2) pool = candidatas;
  const orden = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  if (orden.length <= 3) return orden;
  const start = hashFecha(fecha) % orden.length;
  const out = [];
  for (let i = 0; i < 3; i++) out.push(orden[(start + i) % orden.length]);
  return out;
}

function ComidaChk({ id, tag, title, on, onToggle, resuelto, abierta, onAbrir, elegido, onElegir }) {
  return (
    <div className="chk" data-on={on ? 1 : 0}>
      <button className="box" aria-pressed={on} aria-label={"Marcar " + title + " como cumplida"} onClick={onToggle}>
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M1.5 6.2 4.4 9 10.5 3" stroke="#050B12" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="chk-txt" style={{ flex: 1 }}>
        <button onClick={onAbrir} aria-expanded={abierta} style={{ display: "block", width: "100%", textAlign: "left" }}>
          {tag ? <span className="tag">{tag}</span> : null}{title}
          <span className="chk-sub">{resuelto.original}</span>
        </button>
        {abierta && (
          <div style={{ marginTop: 10 }}>
            {resuelto.partes.map((parte, i) => parte.tipo === "literal"
              ? (parte.texto ? <div className="li" key={i}><em>·</em><span>{parte.texto}</span></div> : null)
              : (
                <div key={i} style={{ marginTop: 8 }}>
                  <span className="lbl">{CAT_LABEL[parte.cat]}{FACTOR_LABEL[parte.factor] ? " · " + FACTOR_LABEL[parte.factor] : ""}</span>
                  <div className="pills" style={{ marginTop: 6 }}>
                    {parte.opciones.map((op) => (
                      <button key={op.alimento} className="pill"
                        data-on={elegido && elegido[parte.cat] === op.alimento ? 1 : 0}
                        onClick={() => onElegir(parte.cat, op.alimento)}>
                        {op.alimento}{op.gramos != null ? ` · ${op.gramos} g${op.peso ? " " + op.peso : ""}` : ` · ${op.unidad}`}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </span>
    </div>
  );
}

/* ==========================================================================
   APP
   ========================================================================== */

export default function Fundamento() {
  const [tab, setTab] = useState("hoy");
  const [state, setState] = useState(null);
  const [fecha, setFecha] = useState(hoyISO());
  const [abierto, setAbierto] = useState({ mesa: true });
  const [comidaAbierta, setComidaAbierta] = useState({});
  const [semanaVista, setSemanaVista] = useState(1);
  const [filtro, setFiltro] = useState("C");
  const [busca, setBusca] = useState("");
  const [filtroPerfil, setFiltroPerfil] = useState("P");
  const [buscaPerfil, setBuscaPerfil] = useState("");
  const [recetaAbierta, setRecetaAbierta] = useState(null);
  const [alimentoNuevo, setAlimentoNuevo] = useState({ nombre: "", cat: "P", crudo0: "", crudo3: "" });
  const [semanaEditando, setSemanaEditando] = useState(1);
  const [mercadoCopiado, setMercadoCopiado] = useState(false);
  const [modoSesion, setModoSesion] = useState(false);
  const [cap, setCap] = useState({ sab: "evitador", que: "", dijo: "", sabio: "" });
  const [chk, setChk] = useState({});
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let vivo = true;
    (async () => {
      let cargado = null;
      try {
        const r4 = await store.get(KEY);
        if (r4 && r4.value) cargado = JSON.parse(r4.value);
        else {
          const r3 = await store.get(KEY_V3);
          if (r3 && r3.value) cargado = migrarV3aV4(JSON.parse(r3.value));
          else {
            const r2 = await store.get(KEY_V2);
            if (r2 && r2.value) cargado = migrarV3aV4(migrarV2aV3(JSON.parse(r2.value)));
            else {
              const r1 = await store.get(KEY_V1);
              if (r1 && r1.value) cargado = migrarV3aV4(migrarV2aV3(migrarV1aV2(JSON.parse(r1.value))));
            }
          }
        }
      } catch (e) { cargado = null; }
      if (!vivo) return;
      setState({ inicio: lunesDeEstaSemana(), meta: 3.5, dias: {}, medidas: [], entreno: DEFAULT_ENTRENO, perfil: DEFAULT_PERFIL, ...(cargado || {}) });
    })();
    return () => { vivo = false; };
  }, []);

  const guardar = useCallback(async (next) => {
    setState(next);
    try { await store.set(KEY, JSON.stringify(next)); }
    catch (e) { setAviso("No se pudo guardar. Los cambios quedan solo en esta sesión."); }
  }, []);

  const idxDia = state ? diffDias(state.inicio, fecha) : 0;
  const dentro = idxDia >= 0 && idxDia <= 27;
  const sem = dentro ? Math.floor(idxDia / 7) + 1 : 1;
  const dia = dentro ? idxDia % 7 : (parseISO(fecha).getDay() + 6) % 7;

  const entrenoCfg = (state && state.entreno) || DEFAULT_ENTRENO;
  const plan = useMemo(() => tareasDe(sem, dia, entrenoCfg, fecha), [sem, dia, entrenoCfg, fecha]);
  const dd = (state && state.dias[fecha]) || {};
  const hechos = dd.done || {};

  // Meta de agua ajustada por la carga de hoy: hasta +0.75 L en el día más duro del
  // bloque. Es un ajuste declarado, no una prescripción — se muestra el desglose.
  const cargaHoy = plan ? cargaSesion(plan.entreno.clave, plan.entreno.min) : 0;
  const ajusteAgua = Math.round(Math.min(0.75, cargaHoy / 150) * 100) / 100;
  const metaAguaHoy = Math.round(((state ? state.meta : 3.5) + ajusteAgua) * 100) / 100;

  const perfilCfg = (state && state.perfil) || DEFAULT_PERFIL;
  const porcionesTotal = useMemo(
    () => PORCIONES.concat((perfilCfg.porcionesExtra || []).map((a) => [a.nombre, a.cat, { crudo: a.gramos0, cocido: null }, { crudo: a.gramos3, cocido: null }])),
    [perfilCfg.porcionesExtra]
  );

  // Lista de mercado: agrega la opción principal resuelta de cada comida de los
  // próximos 7 días (desde hoy real, no desde el día que estés revisando).
  const listaMercado = useMemo(() => {
    if (!state) return {};
    const idxHoy = diffDias(state.inicio, hoyISO());
    const total = {};
    for (let i = 0; i < 7; i++) {
      const idx = idxHoy + i;
      if (idx < 0 || idx > 27) continue;
      const semD = Math.floor(idx / 7) + 1, diaD = idx % 7;
      const d = parseISO(state.inicio); d.setDate(d.getDate() + idx);
      const fISO = iso(d);
      const nutriDia = NUTRI[semD - 1][diaD];
      COMIDAS_KEYS.forEach((comida, mi) => {
        const r = resolver(nutriDia[mi], { fecha: fISO, comida, perfil: perfilCfg, porciones: porcionesTotal });
        r.partes.forEach((parte) => {
          if (parte.tipo !== "porcion") return;
          const op = parte.opciones[0];
          if (!op || typeof op.gramos !== "number") return;
          const fila = porcionesTotal.find((f) => f[0] === op.alimento);
          const cat = fila ? fila[1] : parte.cat;
          const key = op.alimento;
          if (!total[key]) total[key] = { cat, gramos: 0 };
          total[key].gramos += op.gramos;
        });
      });
    }
    return total;
  }, [state, perfilCfg, porcionesTotal]);

  const valoresHoy = {};
  PILARES.forEach((p) => {
    const it = plan[p.k];
    valoresHoy[p.k] = it.length ? it.filter((t) => hechos[t.id]).length / it.length : 0;
  });
  const totalTareas = PILARES.reduce((a, p) => a + plan[p.k].length, 0);
  const totalHechos = PILARES.reduce((a, p) => a + plan[p.k].filter((t) => hechos[t.id]).length, 0);
  const pct = totalTareas ? totalHechos / totalTareas : 0;

  function setDia(campos) {
    if (!state) return;
    guardar({ ...state, dias: { ...state.dias, [fecha]: { ...dd, ...campos } } });
  }
  const toggle = (id) => setDia({ done: { ...hechos, [id]: !hechos[id] } });
  const agua = (d) => setDia({ agua: Math.max(0, Math.round(((dd.agua || 0) + d) * 100) / 100) });

  const registrarSerie = (nombreEjercicio, serie) => {
    const actual = (dd.entreno && dd.entreno.ejercicios) || {};
    const previas = (actual[nombreEjercicio] && actual[nombreEjercicio].series) || [];
    setDia({
      entreno: {
        clave: plan.entreno.clave,
        ejercicios: { ...actual, [nombreEjercicio]: { series: [...previas, serie] } },
      },
    });
  };

  const [importandoError, setImportandoError] = useState("");
  function importarArchivo(archivo) {
    setImportandoError("");
    archivo.text().then((texto) => {
      const resumen = importarActividad(texto);
      if (!resumen) { setImportandoError("No reconocí el formato. Solo .gpx y .tcx por ahora."); return; }
      setDia({ actividad: resumen });
    }).catch(() => setImportandoError("No pude leer el archivo."));
  }

  // Últimas 6 salidas del mismo tipo de sesión (misma clave), con actividad importada,
  // para la comparación "esto vs. tu histórico" — nunca contra otras personas.
  const comparacionActividad = useMemo(() => {
    if (!state || !dd.actividad) return null;
    const previas = [];
    Object.entries(state.dias).forEach(([f, reg]) => {
      if (f >= fecha || !reg.actividad) return;
      const idx = diffDias(state.inicio, f);
      if (idx < 0 || idx > 27) return;
      const semD = Math.floor(idx / 7) + 1, diaD = idx % 7;
      const e = entrenoDe(semD, diaD, entrenoCfg, f);
      if (e.clave === plan.entreno.clave) previas.push(reg.actividad);
    });
    const ultimas6 = previas.slice(-6);
    if (!ultimas6.length) return null;
    const media = (campo) => {
      const vals = ultimas6.map((a) => a[campo]).filter((v) => v != null);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };
    return { n: ultimas6.length, distanciaKm: media("distanciaKm"), duracionMin: media("duracionMin"), fcMedia: media("fcMedia") };
  }, [state, fecha, dd.actividad, entrenoCfg, plan.entreno.clave]);

  // Historial de series por ejercicio, en días anteriores a hoy, para sugerir progresión.
  const registroPrevio = useMemo(() => {
    if (!state) return {};
    const out = {};
    Object.entries(state.dias).forEach(([f, reg]) => {
      if (f >= fecha || !reg.entreno || !reg.entreno.ejercicios) return;
      Object.entries(reg.entreno.ejercicios).forEach(([nombre, datos]) => {
        if (!out[nombre]) out[nombre] = [];
        out[nombre].push({ fecha: f, series: datos.series });
      });
    });
    Object.values(out).forEach((lista) => lista.sort((a, b) => (a.fecha < b.fecha ? -1 : 1)));
    return out;
  }, [state, fecha]);

  function setEntreno(campos) {
    if (!state) return;
    guardar({ ...state, entreno: { ...entrenoCfg, ...campos } });
  }
  const setPlantillaDia = (semanaN, i, val) => {
    const dias7 = [...plantillaDeSemana(entrenoCfg, semanaN)]; dias7[i] = val;
    setEntreno({
      semanas: { ...entrenoCfg.semanas, [semanaN]: dias7 },
      planificada: { ...entrenoCfg.planificada, [semanaN]: true },
    });
  };
  const confirmarSemana = (semanaN) => {
    setEntreno({ planificada: { ...entrenoCfg.planificada, [semanaN]: true } });
  };
  const copiarSemanaAnterior = (semanaN) => {
    if (semanaN <= 1) return;
    setEntreno({
      semanas: { ...entrenoCfg.semanas, [semanaN]: [...plantillaDeSemana(entrenoCfg, semanaN - 1)] },
      planificada: { ...entrenoCfg.planificada, [semanaN]: true },
    });
  };
  const setOverrideHoy = (val) => {
    const overrides = { ...(entrenoCfg.overrides || {}) };
    if (val) overrides[fecha] = val; else delete overrides[fecha];
    setEntreno({ overrides });
  };

  function setPerfil(campos) {
    if (!state) return;
    guardar({ ...state, perfil: { ...perfilCfg, ...campos } });
  }
  const toggleFavorito = (cat, nombre) => {
    const actuales = perfilCfg.favoritos[cat] || [];
    const siguientes = actuales.includes(nombre) ? actuales.filter((n) => n !== nombre) : [...actuales, nombre];
    setPerfil({ favoritos: { ...perfilCfg.favoritos, [cat]: siguientes } });
  };
  const toggleExcluido = (nombre) => {
    const actuales = perfilCfg.excluidos || [];
    setPerfil({ excluidos: actuales.includes(nombre) ? actuales.filter((n) => n !== nombre) : [...actuales, nombre] });
  };
  const agregarAlimentoExtra = () => {
    const nombre = alimentoNuevo.nombre.trim();
    const g0 = parseFloat(alimentoNuevo.crudo0), g3 = parseFloat(alimentoNuevo.crudo3);
    if (!nombre || Number.isNaN(g0) || Number.isNaN(g3)) return;
    setPerfil({ porcionesExtra: [...(perfilCfg.porcionesExtra || []), { nombre, cat: alimentoNuevo.cat, gramos0: g0, gramos3: g3 }] });
    setAlimentoNuevo({ nombre: "", cat: alimentoNuevo.cat, crudo0: "", crudo3: "" });
  };

  function comidaAyerElegida(comida) {
    if (!state) return null;
    const d = parseISO(fecha); d.setDate(d.getDate() - 1);
    const reg = state.dias[iso(d)];
    return (reg && reg.elegido && reg.elegido[comida]) || null;
  }
  function elegirComida(comida, cat, alimento) {
    const actual = (dd.elegido && dd.elegido[comida]) || {};
    const siguiente = actual[cat] === alimento ? { ...actual, [cat]: undefined } : { ...actual, [cat]: alimento };
    setDia({ elegido: { ...(dd.elegido || {}), [comida]: siguiente } });
  }
  function resolverComida(texto, comida) {
    const ayer = perfilCfg.rotacion ? comidaAyerElegida(comida) : null;
    const evitar = ayer && ayer.P ? { P: [ayer.P] } : undefined;
    return resolver(texto, { fecha, comida, perfil: perfilCfg, porciones: porcionesTotal, evitar });
  }

  const nutriHoy = NUTRI[sem - 1][dia];
  const categoriasDelDia = new Set();
  COMIDAS_KEYS.forEach((c, i) => {
    resolverComida(nutriHoy[i], c).partes.forEach((p) => { if (p.tipo === "porcion") categoriasDelDia.add(p.cat); });
  });
  const sugerenciasHoy = state ? sugerirRecetas(fecha, categoriasDelDia, perfilCfg, state.dias) : [];

  useEffect(() => {
    if (!state || !dentro) return;
    if (state.dias[fecha] && state.dias[fecha].sugeridas) return;
    const ids = sugerenciasHoy.map((r) => r.id);
    if (ids.length) setDia({ sugeridas: ids });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, !!state, dentro]);

  const serie = useMemo(() => {
    if (!state) return new Array(28).fill(0);
    return new Array(28).fill(0).map((_, i) => {
      const d = parseISO(state.inicio); d.setDate(d.getDate() + i);
      const fISO = iso(d);
      const reg = state.dias[fISO];
      if (!reg || !reg.done) return 0;
      const p = tareasDe(Math.floor(i / 7) + 1, i % 7, state.entreno, fISO);
      const tot = PILARES.reduce((a, pi) => a + p[pi.k].length, 0);
      const hh = PILARES.reduce((a, pi) => a + p[pi.k].filter((t) => reg.done[t.id]).length, 0);
      return tot ? hh / tot : 0;
    });
  }, [state]);

  const racha = useMemo(() => {
    let r = 0;
    for (let i = Math.min(idxDia, 27); i >= 0; i--) { if (serie[i] >= 0.8) r++; else break; }
    return r;
  }, [serie, idxDia]);

  const porPilar = useMemo(() => {
    const acc = {}; PILARES.forEach((p) => (acc[p.k] = 0));
    if (!state) return acc;
    const tot = {}; PILARES.forEach((p) => (tot[p.k] = 0));
    for (let i = 0; i <= Math.min(idxDia, 27); i++) {
      const d = parseISO(state.inicio); d.setDate(d.getDate() + i);
      const fISO = iso(d);
      const reg = state.dias[fISO];
      const p = tareasDe(Math.floor(i / 7) + 1, i % 7, state.entreno, fISO);
      PILARES.forEach((pi) => {
        tot[pi.k] += p[pi.k].length;
        if (reg && reg.done) acc[pi.k] += p[pi.k].filter((t) => reg.done[t.id]).length;
      });
    }
    const out = {}; PILARES.forEach((p) => (out[p.k] = tot[p.k] ? acc[p.k] / tot[p.k] : 0));
    return out;
  }, [state, idxDia]);

  if (!state) {
    return (<div className="fd"><style>{CSS}</style><div className="wrap top">
      <div className="eyebrow">Fundamento</div><div className="h1">Cargando bloque…</div></div></div>);
  }

  const fechaLarga = parseISO(fecha).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const medidas = state.medidas || [];

  /* ------------------------------- HOY ------------------------------- */
  const vistaHoy = (
    <div className="wrap">
      <div className="top">
        <div className="eyebrow">{dentro ? `Semana ${sem} · día ${idxDia + 1} / 28` : "Fuera del bloque"}</div>
        <div className="h1">{fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1)}
          <small>{totalHechos} de {totalTareas} cumplidos · racha de {racha} días firmes</small></div>
      </div>

      {dentro && dia === 0 && (!entrenoCfg.planificada || !entrenoCfg.planificada[sem]) && (
        <div className="pane block" style={{ borderColor: "var(--ruta)" }}>
          <h4>Programa la semana {sem}</h4>
          <p>Es lunes: define qué sesión toca cada día antes de arrancar. Por ahora está usando la plantilla por defecto.</p>
          <button className="btn solid" onClick={() => { setSemanaEditando(sem); setTab("perfil"); }}>Programar esta semana</button>
        </div>
      )}

      <div className="pane hud">
        <AnillosHUD valores={valoresHoy} total={pct} />
        <div className="hud-side">
          <div className="hud-legend">
            {PILARES.map((p) => (
              <div className="hl" key={p.k} style={{ "--hc": p.c }}>
                <u /><b>{p.n}</b><i>{Math.round((valoresHoy[p.k] || 0) * 100)}%</i>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pane chartwrap" style={{ marginTop: 9 }}>
        <div className="charthead"><b>Perfil del bloque · 28 días</b><span>{Math.round(serie.slice(0, Math.min(idxDia + 1, 28)).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(idxDia + 1, 28)) * 100)}%</span></div>
        <PerfilEtapa serie={serie} hoyIdx={idxDia} alto={110} />
        <div className="axis"><span>SEM 1</span><span>SEM 2</span><span>SEM 3</span><span>SEM 4</span></div>
      </div>

      <div className="h3">Los cinco frentes</div>
      <div className="pillars">
        {PILARES.map((p) => {
          const items = plan[p.k];
          const n = items.filter((t) => hechos[t.id]).length;
          return (
            <div className="pcard" style={{ "--pc": p.c }} key={p.k}>
              <div className="pane">
                <button className="phead" onClick={() => setAbierto({ ...abierto, [p.k]: !abierto[p.k] })} aria-expanded={!!abierto[p.k]}>
                  <span className="ptitle"><b>{p.n}</b><i>{p.k === "ruta" ? plan.entreno.titulo : p.d}</i></span>
                  <span className="pmeter"><b>{n}/{items.length}</b><u><span style={{ width: (n / items.length) * 100 + "%" }} /></u></span>
                </button>
                {abierto[p.k] && (
                  <div className="pbody">
                    {items.map((t) => {
                      const comida = MESA_COMIDA[t.id];
                      if (!comida) return <Check key={t.id} on={!!hechos[t.id]} onClick={() => toggle(t.id)} tag={t.tag} title={t.t} sub={t.s} />;
                      return (
                        <ComidaChk key={t.id} id={t.id} tag={t.tag} title={t.t} on={!!hechos[t.id]}
                          onToggle={() => toggle(t.id)}
                          resuelto={resolverComida(t.s, comida)}
                          abierta={!!comidaAbierta[t.id]}
                          onAbrir={() => setComidaAbierta({ ...comidaAbierta, [t.id]: !comidaAbierta[t.id] })}
                          elegido={dd.elegido && dd.elegido[comida]}
                          onElegir={(cat, alimento) => elegirComida(comida, cat, alimento)} />
                      );
                    })}

                    {p.k === "mesa" && (
                      <>
                        <div className="water">
                          <button className="wbtn" onClick={() => agua(-0.25)} aria-label="Quitar 250 ml">−</button>
                          <div className="wtrack">
                            <div className="wfill" style={{ width: Math.min(100, ((dd.agua || 0) / metaAguaHoy) * 100) + "%" }} />
                            <div className="wlabel">{(dd.agua || 0).toFixed(2)} / {metaAguaHoy} L</div>
                          </div>
                          <button className="wbtn" onClick={() => agua(0.25)} aria-label="Sumar 250 ml">+</button>
                        </div>
                        {ajusteAgua > 0 && (
                          <div className="note">Meta base {state.meta} L + {ajusteAgua} L por la carga de hoy ({plan.entreno.titulo}).</div>
                        )}

                        {timingHoy(plan.entreno).length > 0 && (
                          <div className="pane block" style={{ marginTop: 12 }}>
                            <h4>Antes y durante el entreno de hoy</h4>
                            {timingHoy(plan.entreno).map((t, i) => <p key={i}>{t}</p>)}
                          </div>
                        )}

                        <span className="lbl" style={{ marginTop: 18 }}>Qué puedes cocinar hoy</span>
                        {sugerenciasHoy.length === 0 && <div className="note">Sin sugerencias para hoy: revisa tus excluidos en Perfil.</div>}
                        {sugerenciasHoy.map((r) => (
                          <div className="pane block" key={r.id} style={{ marginTop: 8 }}>
                            <button style={{ display: "block", width: "100%", textAlign: "left" }}
                              onClick={() => setRecetaAbierta(recetaAbierta === r.id ? null : r.id)}
                              aria-expanded={recetaAbierta === r.id}>
                              <h4 style={{ margin: 0 }}>{r.nombre}</h4>
                              <p style={{ margin: "4px 0 0" }}>{r.tiempo} min</p>
                            </button>
                            {recetaAbierta === r.id && (
                              <div style={{ marginTop: 10 }}>
                                {r.usa.length > 0 && (
                                  <>
                                    <span className="lbl">Tus porciones</span>
                                    <div className="pills" style={{ marginTop: 6 }}>
                                      {r.usa.map((nombre) => {
                                        const fila = porcionesTotal.find((f) => f[0] === nombre);
                                        if (!fila) return null;
                                        const bandaTxt = (perfilCfg.banda && perfilCfg.banda[r.slots[0]]) || "0-300";
                                        const banda = fila[2 + (bandaTxt.startsWith("300") ? 1 : 0)];
                                        return <span key={nombre} className="pill" data-on="1">{nombre} · {fmtBanda(banda)}</span>;
                                      })}
                                    </div>
                                  </>
                                )}
                                <span className="lbl">Ingredientes</span>
                                {r.ingredientes.map((ing, i) => <div className="li" key={i}><em>·</em><span>{ing}</span></div>)}
                                <span className="lbl">Preparación</span>
                                {r.pasos.map((p2, i) => <div className="li" key={i}><em>{String(i + 1).padStart(2, "0")}</em><span>{p2}</span></div>)}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}

                    {p.k === "ruta" && (
                      <>
                        {plan.entreno.tipo === "gym" && modoSesion ? (
                          <ModoSesion
                            ejercicios={plan.entreno.lista}
                            registroPrevio={registroPrevio}
                            seriesHoy={(dd.entreno && dd.entreno.ejercicios) || {}}
                            onRegistrarSerie={registrarSerie}
                            onSalir={() => setModoSesion(false)}
                          />
                        ) : (
                          <>
                            {plan.entreno.lista.map((e, i) => (
                              <div className="li" key={i}><em>{String(i + 1).padStart(2, "0")}</em>
                                <span>{e[0]} — <span style={{ color: "var(--dim)" }}>{e[1]}</span></span></div>
                            ))}
                            {plan.entreno.tipo === "gym" && (
                              <button className="btn solid" onClick={() => setModoSesion(true)}>Empezar modo en sesión</button>
                            )}
                          </>
                        )}
                        <span className="lbl">Cambiar solo hoy</span>
                        <select className="fld" aria-label="Cambiar el entreno solo de hoy" value={(entrenoCfg.overrides || {})[fecha] || ""} onChange={(e) => setOverrideHoy(e.target.value)}>
                          <option value="">Usar la plantilla ({SESION_LABEL[plantillaDeSemana(entrenoCfg, sem)[dia]]})</option>
                          {SESIONES_VALIDAS.map((k) => <option key={k} value={k}>{SESION_LABEL[k]}</option>)}
                        </select>
                        {(entrenoCfg.overrides || {})[fecha] && (
                          <div className="note">Esto cambia solo el {fecha}, no la plantilla semanal.</div>
                        )}
                        <div style={{ marginTop: 10 }}>
                          <div className="charthead"><b>Carga de la semana · minutos</b>
                            <span>{DIAS.reduce((a, _, i) => a + entrenoDe(sem, i, entrenoCfg, fechaDeSemDia(state.inicio, sem, i)).min, 0)} min</span></div>
                          <Carga sem={sem} hoyDia={dia} config={entrenoCfg} inicio={state.inicio} />
                        </div>

                        {plan.entreno.tipo === "bici" && (
                          <div style={{ marginTop: 14 }}>
                            <span className="lbl">Importar salida (.gpx / .tcx)</span>
                            <input className="fld" type="file" accept=".gpx,.tcx"
                              onChange={(e) => { if (e.target.files[0]) importarArchivo(e.target.files[0]); }} />
                            {importandoError && <div className="note" style={{ color: "var(--load-danger)" }}>{importandoError}</div>}
                            {dd.actividad && (
                              <div className="pane block" style={{ marginTop: 8 }}>
                                <h4>Lo que hiciste hoy</h4>
                                <div className="grid2">
                                  <div className="stat"><b className="num">{dd.actividad.distanciaKm}</b><span>km</span></div>
                                  <div className="stat"><b className="num">{dd.actividad.duracionMin ?? "—"}</b><span>minutos</span></div>
                                  {dd.actividad.fcMedia != null && <div className="stat"><b className="num">{dd.actividad.fcMedia}</b><span>fc media</span></div>}
                                  {dd.actividad.elevacionGanadaM > 0 && <div className="stat"><b className="num">{dd.actividad.elevacionGanadaM}</b><span>m de desnivel</span></div>}
                                </div>
                                {comparacionActividad ? (
                                  <p style={{ marginTop: 10 }}>
                                    Contra tus últimas {comparacionActividad.n} salidas de {SESION_LABEL[plan.entreno.clave]}:{" "}
                                    {comparacionActividad.distanciaKm != null && (
                                      dd.actividad.distanciaKm >= comparacionActividad.distanciaKm
                                        ? `${Math.round((dd.actividad.distanciaKm / comparacionActividad.distanciaKm - 1) * 100)}% más distancia`
                                        : `${Math.round((1 - dd.actividad.distanciaKm / comparacionActividad.distanciaKm) * 100)}% menos distancia`
                                    )}
                                    {comparacionActividad.fcMedia != null && dd.actividad.fcMedia != null && (
                                      `, fc media ${dd.actividad.fcMedia >= comparacionActividad.fcMedia ? "más alta" : "más baja"} que tu promedio (${Math.round(comparacionActividad.fcMedia)}).`
                                    )}
                                  </p>
                                ) : (
                                  <p style={{ marginTop: 10 }}>Primera vez que importas una salida de {SESION_LABEL[plan.entreno.clave]} — desde la próxima, la comparo contra tu histórico.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {p.k === "oficio" && (
                      <>
                        <span className="lbl">Lo más importante de hoy</span>
                        <input className="fld" value={dd.mit || ""} placeholder="Una sola cosa, en una línea" onChange={(e) => setDia({ mit: e.target.value })} />
                      </>
                    )}

                    {p.k === "mente" && (
                      <>
                        <span className="lbl">Captura rápida</span>
                        <div className="pills" style={{ marginTop: 8 }}>
                          {Object.keys(SABOTEADORES).map((k) => (
                            <button key={k} className="pill" data-on={cap.sab === k ? 1 : 0} onClick={() => setCap({ ...cap, sab: k })}>{SABOTEADORES[k].n}</button>
                          ))}
                        </div>
                        <input className="fld" placeholder="¿Qué estaba pasando?" value={cap.que} onChange={(e) => setCap({ ...cap, que: e.target.value })} />
                        <input className="fld" placeholder="¿Qué te dijo exactamente?" value={cap.dijo} onChange={(e) => setCap({ ...cap, dijo: e.target.value })} />
                        <input className="fld" placeholder="¿Qué respondería el Sabio?" value={cap.sabio} onChange={(e) => setCap({ ...cap, sabio: e.target.value })} />
                        <button className="btn solid" onClick={() => {
                          if (!cap.que.trim()) return;
                          setDia({ capturas: [...(dd.capturas || []), { ...cap, h: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) }] });
                          setCap({ sab: cap.sab, que: "", dijo: "", sabio: "" });
                        }}>Guardar captura</button>
                        {(dd.capturas || []).map((c, i) => (
                          <div className="cap" key={i}><b>{SABOTEADORES[c.sab].n} · {c.h}</b>{c.que}
                            {c.dijo ? <div style={{ color: "var(--dim)", marginTop: 4 }}>«{c.dijo}»</div> : null}
                            {c.sabio ? <div style={{ marginTop: 4 }}>→ {c.sabio}</div> : null}</div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="h3">Cierre del día</div>
      <div className="pane block">
        <div className="row">
          <div style={{ flex: 1 }}>
            <span className="lbl">Horas de sueño</span>
            <input className="fld" inputMode="decimal" value={dd.sueno || ""} placeholder="7.5" onChange={(e) => setDia({ sueno: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="lbl">Energía</span>
            <div className="pills" style={{ marginTop: 7 }}>
              {["Alta", "Media", "Baja"].map((v) => (
                <button key={v} className="pill" data-on={dd.energia === v ? 1 : 0} onClick={() => setDia({ energia: v })}>{v}</button>
              ))}
            </div>
          </div>
        </div>
        <span className="lbl">Nota del día</span>
        <textarea className="fld" placeholder="Qué funcionó, qué se atravesó, qué ajustas mañana." value={dd.nota || ""} onChange={(e) => setDia({ nota: e.target.value })} />
      </div>

      {sem === 3 && dia === 2 && (
        <div className="pane block" style={{ borderColor: "var(--mesa)" }}>
          <h4>Chequeo de la semana 3</h4>
          <p>Hoy toca enviar medidas y fotos al correo de la nutricionista, igual que en el cuestionario inicial. Regístralas en Datos antes de mandarlas.</p>
        </div>
      )}

      <div className="note">El plan de alimentación viene tal cual de tu nutricionista: aquí solo está organizado por día. Porciones, suplementos y medicamentos los decides con ella.</div>
    </div>
  );

  /* ------------------------------- PLAN ------------------------------ */
  const est = ESTUDIO[semanaVista - 1];
  const listaPorciones = PORCIONES.filter((f) => f[1] === filtro && f[0].toLowerCase().includes(busca.toLowerCase()));

  const vistaPlan = (
    <div className="wrap">
      <div className="top">
        <div className="eyebrow">El bloque completo</div>
        <div className="h1">Plan<small>Arranca el {parseISO(state.inicio).toLocaleDateString("es-CO", { day: "numeric", month: "long" })} · 28 días</small></div>
      </div>
      <div className="pills" style={{ marginTop: 6 }}>
        {[1, 2, 3, 4].map((s) => <button key={s} className="pill" data-on={semanaVista === s ? 1 : 0} onClick={() => setSemanaVista(s)}>Semana {s}</button>)}
      </div>

      <div className="h3">Carga de entrenamiento</div>
      <div className="pane chartwrap">
        <div className="charthead"><b>Semana {semanaVista} · minutos por día</b>
          <span>{DIAS.reduce((a, _, i) => a + entrenoDe(semanaVista, i, entrenoCfg, fechaDeSemDia(state.inicio, semanaVista, i)).min, 0)} min</span></div>
        <Carga sem={semanaVista} hoyDia={semanaVista === sem ? dia : -1} config={entrenoCfg} inicio={state.inicio} />
      </div>

      <div className="h3">Mesa · rutina en ayunas</div>
      <div className="pane block"><p>{DETOX[semanaVista - 1]}</p></div>

      <div className="h3">Mesa · estructura de la semana</div>
      {NUTRI[semanaVista - 1].map((d, i) => (
        <div className="pane block" key={i}>
          <h4>{DIAS[i]}</h4>
          {["Desayuno", "Almuerzo", "Media tarde", "Cena"].map((m, j) => (
            <div className="meal" key={j}><b>{m.toUpperCase()}</b><span>{d[j]}</span></div>
          ))}
        </div>
      ))}

      <div className="h3">Ruta · sesión por sesión</div>
      {DIAS.map((dn, i) => {
        const e = entrenoDe(semanaVista, i, entrenoCfg, fechaDeSemDia(state.inicio, semanaVista, i));
        return (
          <div className="pane block" key={i}>
            <h4>{dn} — {e.titulo}</h4>
            <p>{e.sub}</p>
            {e.lista.map((x, k) => (
              <div className="li" key={k}><em>{String(k + 1).padStart(2, "0")}</em>
                <span>{x[0]} — <span style={{ color: "var(--dim)" }}>{x[1]}</span></span></div>
            ))}
          </div>
        );
      })}
      <div className="pane block">
        <h4>Comer alrededor del entreno</h4>
        {PRE_ENTRENO.map((x, i) => <div className="li" key={i}><em>·</em><span>{x}</span></div>)}
      </div>

      <div className="h3">Taller · AI-103</div>
      <div className="pane block">
        <h4>{est.foco}</h4><p><b>{est.peso}</b></p>
        {est.ses.map((s, i) => <div className="li" key={i}><em>{String(i + 1).padStart(2, "0")}</em><span>{s}</span></div>)}
        <p style={{ marginTop: 12 }}><b>Laboratorio:</b> {est.lab}</p>
      </div>
      <div className="pane block">
        <h4>Lo que hay que saber del examen</h4>
        <p>120 minutos, se aprueba con 700 de 1000, puede traer componentes interactivos tipo laboratorio. Los dos primeros dominios pesan entre 55 % y 65 %: ahí van dos tercios de tus horas.</p>
        <p>Todo gira alrededor de Microsoft Foundry y de Python. El material viejo de AI-102 sirve para bases, pero se queda corto en agentes, evaluación de RAG y controles de seguridad modernos.</p>
      </div>

      <div className="h3">Porciones</div>
      <div className="pills">
        {[["C", "Carbohidratos"], ["P", "Proteínas"], ["G", "Grasas"], ["F", "Frutas"]].map(([k, n]) => (
          <button key={k} className="pill" data-on={filtro === k ? 1 : 0} onClick={() => setFiltro(k)}>{n}</button>
        ))}
      </div>
      <input className="fld" placeholder="Buscar alimento" value={busca} onChange={(e) => setBusca(e.target.value)} />
      <div className="pane block" style={{ marginTop: 9 }}>
        <table className="tbl">
          <thead><tr><th>Alimento</th><th>0–300 cals</th><th>300–700 cals</th></tr></thead>
          <tbody>{listaPorciones.map((f, i) => <tr key={i}><td>{f[0]}</td><td>{fmtBanda(f[2])}</td><td>{fmtBanda(f[3])}</td></tr>)}</tbody>
        </table>
        <div className="note">Primero el peso en crudo; si el alimento tiene equivalencia ya cocida, va después del punto. Configura cuál prefieres pesar en Perfil.</div>
      </div>

      <div className="h3">Medias tardes de emergencia</div>
      {SNACKS.map((s, i) => <div className="pane block" key={i}><h4>{s[0]}</h4><p>{s[1]}</p></div>)}

      <div className="h3">Lista de mercado · próximos 7 días</div>
      <div className="pane block">
        <p>Suma la opción principal de cada comida desde hoy. Si cambias favoritos o excluidos, se recalcula sola.</p>
        {["P", "C", "G", "F"].map((cat) => {
          const items = Object.entries(listaMercado).filter(([, v]) => v.cat === cat);
          if (!items.length) return null;
          return (
            <div key={cat} style={{ marginTop: 10 }}>
              <span className="lbl">{CAT_LABEL[cat]}</span>
              {items.map(([nombre, v]) => (
                <div className="li" key={nombre}><em>·</em><span>{nombre} — {Math.round(v.gramos)} g</span></div>
              ))}
            </div>
          );
        })}
        {Object.keys(listaMercado).length === 0 && <div className="note">Fuera del bloque de 28 días: no hay plan para los próximos 7 días.</div>}
        <button className="btn" onClick={() => {
          const texto = ["P", "C", "G", "F"].map((cat) => {
            const items = Object.entries(listaMercado).filter(([, v]) => v.cat === cat);
            if (!items.length) return "";
            return `${CAT_LABEL[cat]}:\n` + items.map(([n, v]) => `- ${n}: ${Math.round(v.gramos)} g`).join("\n");
          }).filter(Boolean).join("\n\n");
          if (navigator.clipboard) navigator.clipboard.writeText(texto).then(() => setMercadoCopiado(true));
        }}>Copiar para WhatsApp</button>
        {mercadoCopiado && <div className="note">Lista copiada al portapapeles.</div>}
      </div>
    </div>
  );

  /* ------------------------------- MENTE ----------------------------- */
  const todasCapturas = Object.entries(state.dias)
    .flatMap(([k, v]) => (v.capturas || []).map((c) => ({ ...c, d: k })))
    .sort((a, b) => (a.d < b.d ? 1 : -1));
  const conteo = { evitador: 0, hipervigilante: 0, triunfador: 0 };
  todasCapturas.forEach((c) => { conteo[c.sab] = (conteo[c.sab] || 0) + 1; });
  const maxC = Math.max(1, ...Object.values(conteo));

  const vistaMente = (
    <div className="wrap">
      <div className="top">
        <div className="eyebrow">Los tres que te hablan</div>
        <div className="h1">Mente<small>Nombrarlos les quita el volante</small></div>
      </div>

      <div className="pane block" style={{ borderColor: "rgba(255,92,138,.45)" }}>
        <h4>{FOCO_MENTE[sem - 1].t}</h4><p>{FOCO_MENTE[sem - 1].d}</p>
      </div>

      <div className="h3">Quién aparece más</div>
      <div className="pane chartwrap">
        {Object.entries(SABOTEADORES).map(([k, s]) => (
          <div key={k} style={{ margin: "12px 0" }}>
            <div className="charthead" style={{ marginBottom: 6 }}>
              <b>{s.n.replace("El ", "")}</b><span style={{ fontSize: 14, color: "var(--mente)" }}>{conteo[k] || 0}</span>
            </div>
            <div style={{ height: 6, background: "#0E2033" }}>
              <div style={{ height: "100%", width: ((conteo[k] || 0) / maxC) * 100 + "%", background: "#FF5C8A", boxShadow: "0 0 12px #FF5C8A", transition: "width .4s" }} />
            </div>
          </div>
        ))}
        {todasCapturas.length === 0 && <div className="note">Sin capturas todavía. La primera vez que oigas la voz, anótala desde Hoy → Mente.</div>}
      </div>

      <div className="h3">Quién es quién</div>
      {Object.entries(SABOTEADORES).map(([k, s]) => (
        <div className="pane block" key={k}>
          <h4>{s.n}</h4>
          <p><b>Suena así:</b> {s.suena}</p>
          <p><b>Qué te cuesta:</b> {s.cuesta}</p>
          <p><b>Antídoto:</b> {s.antidoto}</p>
          <p><b>Micro-práctica:</b> {s.micro}</p>
        </div>
      ))}

      {todasCapturas.length > 0 && (
        <>
          <div className="h3">Historial</div>
          {todasCapturas.slice(0, 25).map((c, i) => (
            <div className="cap" key={i}><b>{SABOTEADORES[c.sab].n} · {c.d}</b>{c.que}
              {c.dijo ? <div style={{ color: "var(--dim)", marginTop: 4 }}>«{c.dijo}»</div> : null}
              {c.sabio ? <div style={{ marginTop: 4 }}>→ {c.sabio}</div> : null}</div>
          ))}
        </>
      )}
    </div>
  );

  /* ------------------------------- DATOS ----------------------------- */
  const diasReg = serie.filter((v, i) => i <= idxDia && v > 0).length;
  const promedio = serie.slice(0, Math.min(idxDia + 1, 28)).reduce((a, b) => a + b, 0) / Math.max(1, Math.min(idxDia + 1, 28));

  const vistaDatos = (
    <div className="wrap">
      <div className="top">
        <div className="eyebrow">Sin drama, solo el marcador</div>
        <div className="h1">Datos<small>Se mide el proceso, no el resultado</small></div>
      </div>

      <div className="pane chartwrap">
        <div className="charthead"><b>Perfil del bloque</b><span>{Math.round(promedio * 100)}%</span></div>
        <PerfilEtapa serie={serie} hoyIdx={idxDia} alto={130} />
        <div className="axis"><span>SEM 1</span><span>SEM 2</span><span>SEM 3</span><span>SEM 4</span></div>
        <div className="note">La línea ámbar es el 80 %: por encima de ahí el día cuenta como firme.</div>
      </div>

      <div className="grid2" style={{ marginTop: 9 }}>
        <div className="pane stat"><b>{racha}</b><span>Días firmes seguidos</span></div>
        <div className="pane stat"><b>{diasReg}</b><span>Días registrados</span></div>
      </div>

      <div className="h3">Balance por frente</div>
      <div className="pane chartwrap">
        <Radar valores={porPilar} />
        <div className="note">Un pentágono parejo importa más que uno con una punta larga: el frente más corto es el que te va a frenar.</div>
      </div>

      <div className="h3">Los 28 días</div>
      <div className="pane block">
        <div className="heat">
          {serie.map((v, i) => {
            const d = parseISO(state.inicio); d.setDate(d.getDate() + i);
            const fISO = iso(d);
            const irADia = () => { setFecha(fISO); setTab("hoy"); };
            return (
              <div className="hcell" key={i} data-today={i === idxDia ? 1 : 0} title={fISO}
                role="button" tabIndex={0} aria-label={"Ver el " + fISO}
                onClick={irADia} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); irADia(); } }}
                style={{ cursor: "pointer", background: v > 0 ? `rgba(34,224,214,${0.06 + v * 0.34})` : "transparent",
                  boxShadow: v >= 0.8 ? "0 0 10px rgba(34,224,214,.3) inset" : "none" }}>
                {d.getDate()}
              </div>
            );
          })}
        </div>
        <div className="note">Toca un día para ver su detalle en Hoy.</div>
      </div>

      <div className="h3">Chequeo corporal</div>
      <div className="pane block">
        <p>La nutricionista lo pide el miércoles de la semana 3, con fotos. Cada dos semanas es suficiente: el peso de un día suelto no dice nada, la tendencia sí.</p>
        <div className="grid2">
          {MEDIDAS.map(([k, n, u]) => (
            <div key={k}>
              <span className="lbl">{n} ({u})</span>
              <input className="fld" inputMode="decimal" placeholder="—" value={chk[k] || ""} onChange={(e) => setChk({ ...chk, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <button className="btn solid" onClick={() => {
          const vals = {};
          MEDIDAS.forEach(([k]) => { const v = parseFloat(chk[k]); if (!isNaN(v)) vals[k] = v; });
          if (!Object.keys(vals).length) return;
          guardar({ ...state, medidas: [...medidas, { fecha, ...vals }].sort((a, b) => (a.fecha < b.fecha ? -1 : 1)) });
          setChk({});
        }}>Guardar chequeo del {parseISO(fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}</button>
      </div>

      {medidas.length >= 2 && (
        <div className="pane chartwrap">
          <Tendencia datos={medidas} campo="peso" color="#22E0D6" unidad="kg" />
          <Tendencia datos={medidas} campo="cintura" color="#4D8DFF" unidad="cm" />
          <Tendencia datos={medidas} campo="cadera" color="#A77BFF" unidad="cm" />
        </div>
      )}

      {medidas.length > 0 && (
        <div className="pane block">
          <h4>Contra el primer registro</h4>
          <table className="tbl">
            <thead><tr><th>Medida</th><th>Inicio</th><th>Último</th><th>Δ</th></tr></thead>
            <tbody>
              {MEDIDAS.map(([k, n, u]) => {
                const con = medidas.filter((m) => m[k] !== undefined);
                if (!con.length) return null;
                const a = con[0][k], b = con[con.length - 1][k];
                const d = Math.round((b - a) * 10) / 10;
                return (<tr key={k}><td>{n}</td><td>{a} {u}</td><td>{b} {u}</td>
                  <td style={{ color: d === 0 ? "var(--dim)" : d < 0 ? "var(--ruta)" : "var(--mesa)" }}>{d > 0 ? "+" : ""}{d}</td></tr>);
              })}
            </tbody>
          </table>
          <div className="note">Un número que sube no es un fracaso: mándale la tendencia completa a la nutricionista y que ella ajuste.</div>
        </div>
      )}

      <div className="h3">Notas recientes</div>
      {Object.entries(state.dias).filter(([, v]) => v.nota).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 8)
        .map(([k, v]) => <div className="cap" key={k}><b>{k} · energía {v.energia || "sin registrar"}</b>{v.nota}</div>)}
    </div>
  );

  /* ------------------------------ AJUSTES ---------------------------- */
  const listaPorciones2 = porcionesTotal.filter((f) => f[1] === filtroPerfil && f[0].toLowerCase().includes(buscaPerfil.toLowerCase()));

  const vistaPerfil = (
    <div className="wrap">
      <div className="top"><div className="eyebrow">Configuración</div><div className="h1">Perfil</div></div>

      <div className="pane block">
        <h4>Favoritos y excluidos</h4>
        <p>Tocar "favorito" prioriza ese alimento al resolver las comidas. Si no marcas favoritos en una categoría, se eligen entre todos los de esa categoría.</p>
        <div className="pills" style={{ marginTop: 6 }}>
          {[["C", "Carbohidratos"], ["P", "Proteínas"], ["G", "Grasas"], ["F", "Frutas"]].map(([k, n]) => (
            <button key={k} className="pill" data-on={filtroPerfil === k ? 1 : 0} onClick={() => setFiltroPerfil(k)}>{n}</button>
          ))}
        </div>
        <input className="fld" placeholder="Buscar alimento" value={buscaPerfil} onChange={(e) => setBuscaPerfil(e.target.value)} />
        {listaPorciones2.map((f) => {
          const esFav = (perfilCfg.favoritos[filtroPerfil] || []).includes(f[0]);
          const esExc = (perfilCfg.excluidos || []).includes(f[0]);
          return (
            <div key={f[0]} className="row" style={{ marginTop: 8, alignItems: "center" }}>
              <span style={{ flex: 1, fontSize: 13.5 }}>{f[0]}</span>
              <button className="pill" data-on={esFav ? 1 : 0} onClick={() => toggleFavorito(filtroPerfil, f[0])}>Favorito</button>
              <button className="pill" data-on={esExc ? 1 : 0} onClick={() => toggleExcluido(f[0])}>Excluir</button>
            </div>
          );
        })}
        {(perfilCfg.excluidos || []).length > 0 && (
          <>
            <span className="lbl">Excluidos</span>
            <div className="pills" style={{ marginTop: 6 }}>
              {perfilCfg.excluidos.map((n) => (
                <button key={n} className="pill" data-on="1" onClick={() => toggleExcluido(n)}>{n} ×</button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="pane block">
        <h4>Banda de calorías por comida</h4>
        <p>La banda alta (300–700) es para los días con más entreno o más apetito; la baja (0–300), para los más tranquilos.</p>
        {COMIDAS_KEYS.map((c) => (
          <div key={c} style={{ marginTop: 10 }}>
            <span className="lbl">{c.charAt(0).toUpperCase() + c.slice(1)}</span>
            <div className="pills" style={{ marginTop: 6 }}>
              {["0-300", "300-700"].map((b) => (
                <button key={b} className="pill" data-on={perfilCfg.banda[c] === b ? 1 : 0}
                  onClick={() => setPerfil({ banda: { ...perfilCfg.banda, [c]: b } })}>{b}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pane block">
        <h4>Cómo pesas los alimentos</h4>
        <div className="pills" style={{ marginTop: 6 }}>
          {[["crudo", "Crudo"], ["cocido", "Cocido"]].map(([k, n]) => (
            <button key={k} className="pill" data-on={perfilCfg.pesar === k ? 1 : 0} onClick={() => setPerfil({ pesar: k })}>{n}</button>
          ))}
        </div>
        <p style={{ marginTop: 10 }}>Rotación: evita repetir la misma proteína que elegiste el día anterior.</p>
        <button className="pill" data-on={perfilCfg.rotacion ? 1 : 0} onClick={() => setPerfil({ rotacion: !perfilCfg.rotacion })}>
          {perfilCfg.rotacion ? "Rotación activa" : "Rotación apagada"}
        </button>
      </div>

      <div className="pane block">
        <h4>Agregar un alimento propio</h4>
        <p>Sus gramos por banda se usan igual que los del plan. Úsalo para sumar alimentos de tu dieta que no estén en la tabla — no inventamos equivalencias que no vengan de tu nutricionista o de ti.</p>
        <input className="fld" placeholder="Nombre" value={alimentoNuevo.nombre} onChange={(e) => setAlimentoNuevo({ ...alimentoNuevo, nombre: e.target.value })} />
        <div className="pills" style={{ marginTop: 8 }}>
          {["P", "C", "G", "F"].map((k) => (
            <button key={k} className="pill" data-on={alimentoNuevo.cat === k ? 1 : 0} onClick={() => setAlimentoNuevo({ ...alimentoNuevo, cat: k })}>{CAT_LABEL[k]}</button>
          ))}
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <span className="lbl">Gramos banda 0–300</span>
            <input className="fld" inputMode="decimal" value={alimentoNuevo.crudo0} onChange={(e) => setAlimentoNuevo({ ...alimentoNuevo, crudo0: e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="lbl">Gramos banda 300–700</span>
            <input className="fld" inputMode="decimal" value={alimentoNuevo.crudo3} onChange={(e) => setAlimentoNuevo({ ...alimentoNuevo, crudo3: e.target.value })} />
          </div>
        </div>
        <button className="btn solid" onClick={agregarAlimentoExtra}>Agregar alimento</button>
        {(perfilCfg.porcionesExtra || []).length > 0 && (
          <div className="pills" style={{ marginTop: 10 }}>
            {perfilCfg.porcionesExtra.map((a) => (
              <span key={a.nombre} className="pill" data-on="1">{a.nombre} · {a.gramos0}/{a.gramos3} g</span>
            ))}
          </div>
        )}
      </div>

      <div className="pane block">
        <h4>Fecha de arranque</h4>
        <p>El bloque dura 28 días. Cambiarla recalcula qué semana te toca hoy.</p>
        <input className="fld" type="date" value={state.inicio} onChange={(e) => guardar({ ...state, inicio: e.target.value })} />
      </div>

      <div className="pane block">
        <h4>Meta de agua</h4>
        <p>La señal real es orinar transparente durante todo el día.</p>
        <input className="fld" inputMode="decimal" value={state.meta} onChange={(e) => guardar({ ...state, meta: parseFloat(e.target.value) || 3.5 })} />
      </div>

      <div className="pane block">
        <h4>Semana de entrenamiento</h4>
        <p>Cada una de las 4 semanas del bloque tiene su propio plan — puedes variarlo semana a semana (por ejemplo, una semana de descarga). La progresión (reps, RPE, minutos) sigue viniendo de la semana del bloque en la que estés.</p>
        <div className="pills" style={{ marginTop: 6 }}>
          {[1, 2, 3, 4].map((s) => (
            <button key={s} className="pill" data-on={semanaEditando === s ? 1 : 0} onClick={() => setSemanaEditando(s)}>
              Semana {s}{(!entrenoCfg.planificada || !entrenoCfg.planificada[s]) ? " · sin programar" : ""}
            </button>
          ))}
        </div>
        {DIAS.map((dn, i) => (
          <div key={dn} style={{ marginTop: 10 }}>
            <span className="lbl">{dn}</span>
            <select className="fld" aria-label={"Sesión del " + dn + " · semana " + semanaEditando}
              value={plantillaDeSemana(entrenoCfg, semanaEditando)[i]}
              onChange={(e) => setPlantillaDia(semanaEditando, i, e.target.value)}>
              {SESIONES_VALIDAS.map((k) => <option key={k} value={k}>{SESION_LABEL[k]}</option>)}
            </select>
          </div>
        ))}
        {semanaEditando > 1 && (
          <button className="btn" onClick={() => copiarSemanaAnterior(semanaEditando)}>Copiar la semana {semanaEditando - 1}</button>
        )}
        <button className="btn solid" onClick={() => confirmarSemana(semanaEditando)}>
          {entrenoCfg.planificada && entrenoCfg.planificada[semanaEditando] ? "Semana confirmada" : "Confirmar esta semana"}
        </button>
        <div style={{ marginTop: 14 }}>
          <div className="charthead"><b>Carga en vivo · minutos por día</b>
            <span>{DIAS.reduce((a, _, i) => a + entrenoDe(semanaEditando, i, entrenoCfg, fechaDeSemDia(state.inicio, semanaEditando, i)).min, 0)} min</span></div>
          <Carga sem={semanaEditando} hoyDia={semanaEditando === sem ? dia : -1} config={entrenoCfg} inicio={state.inicio} />
        </div>
        {avisosEntreno(plantillaDeSemana(entrenoCfg, semanaEditando)).map((a, i) => <div className="note" key={i}>{a}</div>)}
      </div>

      <div className="pane block">
        <h4>Ver otro día</h4>
        <p>Para completar un día que se te pasó o revisar el que viene.</p>
        <input className="fld" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <button className="btn" onClick={() => setFecha(hoyISO())}>Volver a hoy</button>
      </div>

      <div className="pane block">
        <h4>Tus datos</h4>
        <p>Se guardan en tu cuenta y siguen ahí cada vez que abras la app. Puedes bajarlos cuando quieras.</p>
        <button className="btn" onClick={() => {
          const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = "fundamento-" + hoyISO() + ".json"; a.click();
        }}>Descargar respaldo</button>
        <button className="btn warn" onClick={() => {
          if (confirm("Se borra todo el historial del bloque, incluidos los chequeos. ¿Seguro?"))
            guardar({ inicio: lunesDeEstaSemana(), meta: 3.5, dias: {}, medidas: [], entreno: DEFAULT_ENTRENO, perfil: DEFAULT_PERFIL });
        }}>Borrar todo y empezar de nuevo</button>
      </div>

      <div className="note">Esta app organiza el plan que te entregó tu nutricionista y una propuesta de entrenamiento y estudio. No reemplaza su criterio ni el de un médico: si algo del entreno te genera dolor, o si quieres mover porciones, eso se consulta con ellos.</div>
    </div>
  );

  const vistas = { hoy: vistaHoy, plan: vistaPlan, mente: vistaMente, datos: vistaDatos, perfil: vistaPerfil };

  return (
    <div className="fd">
      <style>{CSS}</style>
      {aviso && <div className="wrap"><div className="note" style={{ color: "var(--mente)" }}>{aviso}</div></div>}
      {vistas[tab]}
      <nav className="nav">
        <div className="nav-in">
          {[["hoy", "Hoy"], ["plan", "Plan"], ["mente", "Mente"], ["datos", "Datos"], ["perfil", "Perfil"]].map(([k, n]) => (
            <button key={k} data-on={tab === k ? 1 : 0} onClick={() => setTab(k)} aria-current={tab === k}>
              <i /><small>{n}</small>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
