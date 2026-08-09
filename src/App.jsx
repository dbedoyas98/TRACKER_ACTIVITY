import React, { useState, useEffect, useMemo, useCallback } from "react";
import { resolver } from "./comidas.js";
import { RECETAS } from "./data/recetas.js";
import { EJERCICIOS } from "./data/ejercicios.js";

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
  --disp:'Chakra Petch', system-ui, sans-serif;
  --body:'Archivo', system-ui, sans-serif;
  --mono:'IBM Plex Mono', ui-monospace, monospace;
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

/* paneles con esquina cortada */
.pane { position:relative; background:var(--panel); border:1px solid var(--line);
  clip-path:polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
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
.box { width:19px; height:19px; flex:none; margin-top:2px; border:1.5px solid var(--dimmer); display:grid; place-items:center;
  clip-path:polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%); transition:all .15s; }
.chk[data-on="1"] .box { background:var(--pc); border-color:var(--pc); box-shadow:0 0 12px var(--pc); }
.box svg { width:11px; height:11px; opacity:0; }
.chk[data-on="1"] .box svg { opacity:1; }
.chk-txt { font-size:14px; line-height:1.42; }
.chk[data-on="1"] .chk-txt { color:var(--dim); }
.chk-sub { display:block; font-size:12.5px; color:var(--dim); margin-top:4px; line-height:1.5; }
.tag { font-family:var(--mono); font-size:9.5px; letter-spacing:.14em; color:var(--pc); border:1px solid var(--pc); padding:1px 5px; margin-right:7px; opacity:.85; }

/* agua */
.water { display:flex; align-items:center; gap:10px; margin-top:14px; }
.wbtn { width:40px; height:40px; background:var(--panel2); border:1px solid var(--line); font-family:var(--mono); font-size:17px;
  clip-path:polygon(0 6px, 6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%); }
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
.pill { font-family:var(--mono); font-size:10.5px; letter-spacing:.14em; text-transform:uppercase; padding:8px 13px;
  border:1px solid var(--line); background:var(--panel2); color:var(--dim);
  clip-path:polygon(0 5px, 5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%); }
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
.btn { display:block; width:100%; text-align:center; padding:13px; background:var(--panel2); border:1px solid var(--line);
  font-family:var(--mono); font-size:11px; letter-spacing:.2em; text-transform:uppercase; margin-top:10px;
  clip-path:polygon(0 7px, 7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%); }
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
   DATOS DEL PLAN
   ========================================================================== */

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const DIAS_C = ["L", "M", "M", "J", "V", "S", "D"];

const DETOX = [
  "En ayunas: 1 vaso de agua + 1 tallo de apio licuado en agua (sin limón ni nada más).",
  "En ayunas: batido verde — 1 o 2 tallos de apio + sábila + espinaca (lavada con vinagre blanco) + 1/3 de zucchini sin cáscara. Sin fruta.",
  "En ayunas: 100 g de papaya (o 1 taza licuada) con sábila cristal o piña. Opcional: 5 g de chía o linaza molida.",
  "En ayunas: 100 g de papaya (o 1 taza licuada) con sábila cristal o piña. Opcional: 5 g de chía o linaza molida.",
];

const NUTRI = [
  [
    ["4 huevos + C, o 3 huevos + C + ½ G", "P + ensalada + C", "½ fruta + 1 scoop de proteína", "P + C + ensalada"],
    ["3 huevos + porción de C + ½ fruta", "P + C + ensalada", "1 scoop + ½ C o galletas tipo tosh de 100–140 cals", "P + C + ½ G + ensalada"],
    ["3 huevos + C + ½ fruta", "P + ½ G + ensalada", "30 g avena o galletas hasta 150 cals + ½ fruta + ½ scoop", "Libre"],
    ["3 huevos + C + ½ fruta", "½ de granos + ½ de arroz (o un C completo) + ensalada + P", "½ G + 130 g yogurt griego", "P + C + ensalada"],
    ["3 huevos + C + ½ G", "P + C + ensalada", "½ fruta + 140 g yogurt griego", "P + C + ensalada. Si comes fuera: 1 papa cocida"],
    ["2 huevos + 2 claras + C + ½ fruta", "P + C + ensalada", "Gelatina light + 120 g yogurt griego + ½ C o galletas hasta 150 cals", "P + ensalada + C"],
    ["3 huevos + C + ½ fruta", "P y medio + ensalada + ½ C", "½ fruta + C de 120 cals + 1 scoop", "P + C + ensalada"],
  ],
  [
    ["3 huevos + C + ½ fruta", "P + ensalada + C", "½ C o galletas hasta 120 cals, o 30 g avena + 1 scoop", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "1 scoop + ½ C o ½ fruta", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "Algo hasta 150 cals + ½ scoop", "P + ½ G + ½ C + ensalada. Si entrenas más de 90 min: C completo y quitas el ½ G"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "2 rodajas de pan o 40 g avena o galletas hasta 150 cals + 1 scoop", "P + ensalada + C"],
    ["C + 3 huevos + ½ fruta", "P + C + ensalada", "½ G + scoop, o 150 g yogurt griego", "P + C + ensalada"],
    ["2 huevos + C + ½ fruta", "P + C + ensalada", "Helado de proteína (tipo freezen) o 1 scoop + ½ fruta congelada", "P + C"],
    ["Ayuno 14 h, luego 3 huevos + arroz o C", "P + C + ensalada", "Galletas de 90–150 cals tipo tosh + 130 g yogurt griego, o 1 scoop", "P + C hasta 130 cals + ½ G"],
  ],
  [
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "½ C + ½ scoop + ½ G", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "½ C (avena o galletas hasta 150 cals) + 1 scoop", "P + C + ensalada"],
    ["3 huevos + C + ½ G", "P + C + ensalada", "½ G + ½ scoop + 1 banano", "P + ensalada + ½ C, o C hasta 180 cals"],
    ["2 huevos + 2 claras + C + ½ G", "P + ensalada + C", "½ fruta + 1 scoop, o 150 g yogurt griego", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + ensalada + ½ C", "1 scoop + ½ fruta + C de 100 cals", "P + ensalada + C. Si comes fuera, usa 2 C del recetario"],
    ["C + 3 huevos + ½ fruta", "P + C + ensalada", "1 scoop", "Libre, pero entrena al menos 1 h. Si mañana es la salida larga, pasa el libre al domingo y hoy: P + C + ensalada"],
    ["2 huevos + C + ½ fruta", "P y medio + ½ C", "Grasa + ½ scoop", "P + C hasta 180 cals + ensalada"],
  ],
  [
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "½ fruta + C hasta 100 cals + ½ scoop", "P + ½ C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "C hasta 130 cals o avena + 100 g fresa + 1 scoop", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + ensalada + ½ C", "Sándwich con 50 g pollo o 1 scoop + galletas hasta 150 cals", "P + ½ C + ½ G"],
    ["3 huevos + C + ½ G", "P + C + ensalada", "½ fruta + 20 g avena + ½ scoop", "P + C + ensalada"],
    ["3 huevos + C + ½ G", "P + C + ensalada", "½ fruta + 20 g avena + ½ scoop", "P + C + ensalada"],
    ["3 huevos + C + ½ fruta", "P + C + ensalada", "½ fruta + 1 scoop, o ½ P", "P + ½ G (si comes salmón no sumas el ½ G) + C + ensalada"],
    ["2 huevos + 2 claras + C + ½ fruta", "P + C + ensalada", "Gelatina light opcional + 200 g fresa o ½ fruta + 120 g yogurt griego o 1 scoop", "P + C + ensalada"],
  ],
];

const GYM = {
  A: { nombre: "Gimnasio A · cadena posterior y piernas", ej: [
    ["Sentadilla goblet o barra", "8–10 reps"],
    ["Peso muerto rumano", "8–10 reps"],
    ["Zancada caminando o prensa", "10 por pierna"],
    ["Puente de glúteo con carga", "12 reps"],
    ["Elevación de talones de pie", "15 reps"],
    ["Plancha frontal + bird-dog", "40 s / 10 por lado"]] },
  B: { nombre: "Gimnasio B · torso, tirón y empuje", ej: [
    ["Press banca o con mancuernas", "8–10 reps"],
    ["Remo con barra o en máquina", "10 reps"],
    ["Press militar sentado", "10 reps"],
    ["Jalón al pecho o dominada asistida", "10 reps"],
    ["Face pull o pájaro", "15 reps"],
    ["Pallof press + curl/extensión", "12 por lado"]] },
  C: { nombre: "Gimnasio C · circuito metabólico", ej: [
    ["Thruster con mancuernas", "12 reps"],
    ["Remo renegado", "8 por lado"],
    ["Swing con kettlebell", "15 reps"],
    ["Step-up al cajón", "10 por pierna"],
    ["Escaladores", "30 s"],
    ["Descanso entre vueltas", "90 s"]] },
};

const SERIES = [
  { s: "3 series", rpe: "RPE 6 · deja 4 reps en el tanque", v: "3 vueltas" },
  { s: "4 series", rpe: "RPE 7 · deja 3 reps en el tanque", v: "4 vueltas" },
  { s: "4 series", rpe: "RPE 8 · deja 2 reps en el tanque", v: "4 vueltas" },
  { s: "3 series", rpe: "RPE 6 · descarga, sube técnica no peso", v: "3 vueltas" },
];

const BICI = [
  { z2: ["Rodaje Z2 · 60 min", "Cadencia 85–95 rpm. Debes poder hablar frases completas todo el rato.", 60],
    int: ["Series · 4 × 4 min fuerte", "20 min calentamiento, 4 × 4 min a ritmo que solo aguantas 4 min, 3 min suave entre series, 10 min soltar.", 80],
    larga: ["Salida larga · 2 h Z2", "Ritmo conversado de principio a fin. Come cada 40 min aunque no tengas hambre.", 120] },
  { z2: ["Rodaje Z2 · 75 min", "Incluye 3 × 8 min con cadencia baja (60–65 rpm) en subida suave, sentado.", 75],
    int: ["Series · 5 × 4 min fuerte", "20 min calentamiento, 5 × 4 min, 3 min suave entre series, 10 min soltar.", 85],
    larga: ["Salida larga · 2 h 30 Z2", "Última media hora un poco más firme si te sientes bien.", 150] },
  { z2: ["Rodaje Z2 · 90 min", "Terreno ondulado. Sin picos: si la subida te dispara, baja el ritmo.", 90],
    int: ["Series · 4 × 6 min fuerte", "20 min calentamiento, 4 × 6 min sostenidos, 4 min suave entre series, 10 min soltar.", 95],
    larga: ["Salida larga · 3 h con 3 × 10 min tempo", "Las series de tempo van entre la hora 1 y la hora 2, no al final.", 180] },
  { z2: ["Rodaje Z2 · 60 min", "Suave de verdad. Esta semana el cuerpo absorbe el trabajo de las tres anteriores.", 60],
    int: ["Test · 20 min a máximo sostenible", "25 min calentamiento con 3 aceleraciones de 1 min, 20 min a tope constante, 15 min soltar. Anota potencia o velocidad media.", 60],
    larga: ["Salida larga · 1 h 45 suave", "Sin series. Disfrutar y cerrar el bloque entero.", 105] },
];

/* Días de entrenamiento configurables: plantilla semanal + overrides puntuales.
   La progresión (reps, RPE, minutos) sigue viniendo del índice de semana. */
const SESIONES_VALIDAS = ["gymA", "gymB", "gymC", "biciZ2", "biciSeries", "biciLarga", "movilidad", "descanso"];
const SESION_LABEL = {
  gymA: "Gimnasio A", gymB: "Gimnasio B", gymC: "Gimnasio C",
  biciZ2: "Bici Z2", biciSeries: "Bici series", biciLarga: "Salida larga",
  movilidad: "Movilidad", descanso: "Descanso",
};
const DEFAULT_ENTRENO = {
  plantilla: ["gymA", "biciZ2", "gymB", "biciSeries", "gymC", "biciLarga", "movilidad"],
  overrides: {},
  ejerciciosPersonalizados: {},
};

/* Sustituye ejercicios de una sesión de gym por otros del banco (src/data/ejercicios.js),
   manteniendo el esquema de series/reps original — eso lo define la semana, no el ejercicio. */
function aplicarPersonalizados(base, mapa) {
  if (!mapa) return base;
  return base.map((ej, i) => {
    const idCustom = mapa[i];
    if (!idCustom) return ej;
    const custom = EJERCICIOS.find((e) => e.id === idCustom);
    return custom ? [custom.nombre, ej[1]] : ej;
  });
}

const SESIONES = {
  gymA: (semIdx, cfg) => ({ tipo: "gym", titulo: GYM.A.nombre, sub: SERIES[semIdx].s + " · " + SERIES[semIdx].rpe, lista: aplicarPersonalizados(GYM.A.ej, cfg && cfg.ejerciciosPersonalizados && cfg.ejerciciosPersonalizados.gymA), min: 55 }),
  gymB: (semIdx, cfg) => ({ tipo: "gym", titulo: GYM.B.nombre, sub: SERIES[semIdx].s + " · " + SERIES[semIdx].rpe, lista: aplicarPersonalizados(GYM.B.ej, cfg && cfg.ejerciciosPersonalizados && cfg.ejerciciosPersonalizados.gymB), min: 55 }),
  gymC: (semIdx, cfg) => ({ tipo: "gym", titulo: GYM.C.nombre, sub: SERIES[semIdx].v + " · descanso corto, respiración controlada", lista: aplicarPersonalizados(GYM.C.ej, cfg && cfg.ejerciciosPersonalizados && cfg.ejerciciosPersonalizados.gymC), min: 40 }),
  biciZ2: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.z2[0], sub: b.z2[1], lista: [], min: b.z2[2] }; },
  biciSeries: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.int[0], sub: b.int[1], lista: [], min: b.int[2] }; },
  biciLarga: (semIdx) => { const b = BICI[semIdx]; return { tipo: "bici", titulo: b.larga[0], sub: b.larga[1], lista: [], min: b.larga[2] }; },
  movilidad: () => ({ tipo: "libre", titulo: "Descanso activo · movilidad y caminata", sub: "20 min de movilidad de cadera y espalda alta + 40 min de caminata. Nada de intensidad.", lista: [], min: 60 }),
  descanso: () => ({ tipo: "descanso", titulo: "Descanso completo", sub: "Sin sesión estructurada. El cuerpo absorbe la carga de los días duros — camina suave si te provoca.", lista: [], min: 0 }),
};

function entrenoDe(sem, dia, config, fechaISO) {
  const cfg = config || DEFAULT_ENTRENO;
  const clave = (fechaISO && cfg.overrides && cfg.overrides[fechaISO]) || cfg.plantilla[dia];
  const gen = SESIONES[clave] || SESIONES.descanso;
  return { ...gen(sem - 1, cfg), clave };
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

const ESTUDIO = [
  { foco: "Planear y gestionar una solución de Azure AI", peso: "25–30 % del examen",
    ses: [
      "Recursos de Azure AI y proyectos de Microsoft Foundry: qué se crea, dónde vive y cómo se conecta.",
      "Autenticación, claves, identidad administrada y RBAC sobre recursos de AI.",
      "Contenedores, regiones, cuotas y modelo de costos: cuándo cada opción.",
      "IA responsable: content safety, filtros, evaluación de riesgos y decisiones de diseño.",
      "Monitoreo, diagnóstico, trazas y alertas de una solución en producción."],
    lab: "Levanta un proyecto de Foundry desde cero con identidad administrada, sin una sola clave en el código." },
  { foco: "IA generativa y agentes · parte 1", peso: "30–35 % del examen, el dominio más pesado",
    ses: [
      "Despliegue de modelos: tipos de deployment, versiones, throughput y elección por escenario.",
      "Prompt engineering aplicado: system prompts, few-shot, control de formato y salida estructurada.",
      "Function calling y tool use: definición de herramientas, manejo de argumentos y errores.",
      "Construcción de un agente: instrucciones, herramientas, memoria y estado de conversación.",
      "Repaso activo: 25 preguntas del dominio y revisión de las falladas."],
    lab: "Un agente con dos herramientas: búsqueda + una función propia contra una API." },
  { foco: "IA generativa y agentes · parte 2 · grounding y evaluación", peso: "cierra el dominio de mayor peso",
    ses: [
      "RAG en Azure AI Search: índices, vectores, híbrido, semantic ranker y chunking.",
      "Grounding: fuentes de datos, citas y control de alucinaciones.",
      "Evaluación: relevancia, groundedness, seguridad y latencia. Cómo se mide cada una.",
      "Observabilidad de agentes: trazas, uso de tokens, eventos de seguridad.",
      "Simulacro corto de 30 preguntas mezclando dominios 1 y 2."],
    lab: "Añádele RAG a tu agente y córrele una evaluación con métricas reales." },
  { foco: "Visión, texto, extracción de información y cierre", peso: "10–15 % cada uno, más simulacros",
    ses: [
      "Computer vision: análisis de imagen, OCR, modelos personalizados y escenarios multimodales.",
      "Análisis de texto: entidades, sentimiento, PII, traducción y voz.",
      "Extracción de información: Document Intelligence y Content Understanding sobre PDFs y formularios.",
      "Simulacro completo cronometrado (120 min) y clasificación de errores por dominio.",
      "Segundo simulacro y repaso solo de los dominios flojos. Agendar el examen."],
    lab: "Un pipeline que convierte PDFs en salida estructurada, monitoreado de punta a punta." },
];

const SABOTEADORES = {
  evitador: { n: "El Evitador",
    suena: "«Mañana con la cabeza fresca», «primero reviso otra cosa», «no es tan urgente».",
    cuesta: "El conflicto, la conversación incómoda, la tarea que puede salir mal. Postergas lo difícil y llenas el día con lo fácil.",
    antidoto: "Nombra la tarea concreta que estás esquivando y hazla 10 minutos, sin prometerte terminarla.",
    micro: "Al abrir el día: escribe la tarea que menos quieres hacer y ponla de primera." },
  hipervigilante: { n: "El Hipervigilante",
    suena: "«¿Y si falla el despliegue?», «algo se me está pasando», «esto va a explotar en producción».",
    cuesta: "Vives escaneando amenazas. Gastas energía en riesgos que nunca pasan y llegas cansado a los que sí.",
    antidoto: "Separa el dato del pronóstico: ¿qué sé que es cierto ahora mismo? ¿qué estoy imaginando?",
    micro: "Cuando la alarma suba: nómbrala en voz baja, respira 3 veces largo, y decide una sola acción verificable." },
  triunfador: { n: "El Hiper-triunfador",
    suena: "«Solo valgo si entrego», «esto no es suficiente», «descansar es perder tiempo».",
    cuesta: "Atas tu valor al resultado. Nunca hay meta cumplida, solo la siguiente. Y el cuerpo paga la cuenta.",
    antidoto: "Mide el proceso, no el resultado: ¿hice lo que dije que iba a hacer hoy? Eso ya es un día ganado.",
    micro: "Al cerrar el día: escribe una cosa que hiciste bien que nadie va a aplaudir." },
};

const FOCO_MENTE = [
  { t: "Semana 1 · desarmar al Evitador", d: "Todos los días atacas primero lo que quieres esquivar. Solo 10 minutos, y anotas qué pasó de verdad al hacerlo." },
  { t: "Semana 2 · bajarle el volumen al Hipervigilante", d: "Cada vez que la alarma suba, la nombras y la separas: dato vs. pronóstico. Una acción verificable, no cinco." },
  { t: "Semana 3 · soltar al Hiper-triunfador", d: "Esta semana el marcador es la adherencia, no el resultado. Cierra cada día escribiendo un logro invisible." },
  { t: "Semana 4 · integrar", d: "Ya los conoces a los tres. Cuando aparezca uno, lo nombras y respondes desde el Sabio: ¿qué haría alguien que ya resolvió esto?" },
];

/* Tabla de porciones del plan: [nombre, categoría, banda 0–300 cals, banda 300–700 cals].
   Cada banda es { crudo, cocido }. cocido:null cuando el plan no trae equivalencia cocida
   (frutas y grasas no la traen; algunos alimentos se pesan siempre en crudo). Valores no
   numéricos (huevos, pan, arepa, tortilla) se muestran tal cual, sin escalar por porción. */
const PORCIONES = [
  ["Avena (medir siempre en crudo)", "C", { crudo: 51, cocido: null }, { crudo: 77, cocido: null }],
  ["Arroz blanco crudo", "C", { crudo: 50, cocido: 106 }, { crudo: 75, cocido: 158 }],
  ["Maduro crudo", "C", { crudo: 107, cocido: 92 }, { crudo: 159, cocido: 144 }],
  ["Papa cruda", "C", { crudo: 212, cocido: 197 }, { crudo: 315, cocido: 300 }],
  ["Papa amarilla cruda", "C", { crudo: 147, cocido: 132 }, { crudo: 218, cocido: 203 }],
  ["Pasta cruda", "C", { crudo: 49, cocido: 103 }, { crudo: 73, cocido: 153 }],
  ["Lentejas crudas", "C", { crudo: 23, cocido: 69 }, { crudo: 34, cocido: 102 }],
  ["Frijoles crudos", "C", { crudo: 29, cocido: 86 }, { crudo: 42, cocido: 127 }],
  ["Garbanzo crudo", "C", { crudo: 28, cocido: 85 }, { crudo: 42, cocido: 126 }],
  ["Quinoa", "C", { crudo: 50, cocido: 104 }, { crudo: 74, cocido: 155 }],
  ["Batata", "C", { crudo: 165, cocido: 347 }, { crudo: 246, cocido: 516 }],
  ["Yuca cruda", "C", { crudo: 90, cocido: 75 }, { crudo: 134, cocido: 119 }],
  ["Arveja cruda", "C", { crudo: 39, cocido: 118 }, { crudo: 59, cocido: 176 }],
  ["Plátano maduro", "C", { crudo: 89, cocido: 74 }, { crudo: 133, cocido: 118 }],
  ["Plátano verde crudo", "C", { crudo: 107, cocido: 107 }, { crudo: 159, cocido: 159 }],
  ["Maíz pira", "C", { crudo: 77, cocido: 163 }, { crudo: 115, cocido: 242 }],
  ["Blanquillo", "C", { crudo: 33, cocido: 98 }, { crudo: 48, cocido: 145 }],
  ["Frijol negro crudo", "C", { crudo: 27, cocido: 82 }, { crudo: 41, cocido: 122 }],
  ["Pan (rodajas 50–90 cals)", "C", { crudo: "2 de 100 cals o 3 de 70 cals", cocido: null }, { crudo: "2½ de 100 cals o 3 de 70 cals", cocido: null }],
  ["Arepa blanca", "C", { crudo: "1 de 150 a 200 cals", cocido: null }, { crudo: "1½ de 150 cals", cocido: null }],
  ["Tortilla de 90–100 cals", "C", { crudo: "2", cocido: null }, { crudo: "2", cocido: null }],

  ["Pollo crudo", "P", { crudo: 163, cocido: 148 }, { crudo: 204, cocido: 189 }],
  ["Cerdo crudo", "P", { crudo: 172, cocido: 157 }, { crudo: 215, cocido: 200 }],
  ["Res cruda", "P", { crudo: 148, cocido: 133 }, { crudo: 185, cocido: 170 }],
  ["Salmón crudo", "P", { crudo: 164, cocido: 149 }, { crudo: 205, cocido: 190 }],
  ["Atún en agua", "P", { crudo: 158, cocido: 143 }, { crudo: 197, cocido: 182 }],
  ["Tilapia", "P", { crudo: 161, cocido: 146 }, { crudo: 202, cocido: 187 }],
  ["Corvina", "P", { crudo: 118, cocido: 103 }, { crudo: 147, cocido: 132 }],
  ["Trucha", "P", { crudo: 231, cocido: 216 }, { crudo: 289, cocido: 274 }],
  ["Róbalo", "P", { crudo: 189, cocido: 174 }, { crudo: 281, cocido: 266 }],
  ["Camarones", "P", { crudo: 131, cocido: 116 }, { crudo: 164, cocido: 149 }],
  ["Pechuga de pavo", "P", { crudo: 156, cocido: 141 }, { crudo: 232, cocido: 217 }],
  ["Pavo crudo", "P", { crudo: 162, cocido: 147 }, { crudo: 203, cocido: 188 }],
  ["Muslo sin hueso", "P", { crudo: 141, cocido: 126 }, { crudo: 176, cocido: 161 }],
  ["Pulpo", "P", { crudo: 243, cocido: 228 }, { crudo: 304, cocido: 289 }],
  ["Calamares", "P", { crudo: 233, cocido: 218 }, { crudo: 291, cocido: 276 }],
  ["Tofu", "P", { crudo: 106, cocido: 91 }, { crudo: 157, cocido: 142 }],
  ["Sierra", "P", { crudo: 181, cocido: null }, { crudo: 227, cocido: null }],
  ["Huevo entero", "P", { crudo: "3 huevos (máx. 4)", cocido: null }, { crudo: "3 huevos (máx. 4)", cocido: null }],
  ["Mezcla de claras y huevo", "P", { crudo: "2 huevos + 2 a 3 claras", cocido: null }, { crudo: "2 huevos + 2 a 3 claras", cocido: null }],

  ["Aguacate", "G", { crudo: 85, cocido: null }, { crudo: 116, cocido: null }],
  ["Maní", "G", { crudo: 37, cocido: null }, { crudo: 50, cocido: null }],
  ["Almendras o mantequilla de almendras", "G", { crudo: 18, cocido: null }, { crudo: 25, cocido: null }],
  ["Mantequilla de maní", "G", { crudo: 30, cocido: null }, { crudo: 42, cocido: null }],
  ["Aceite de oliva (g o ml)", "G", { crudo: 20, cocido: null }, { crudo: 27, cocido: null }],
  ["Aceite de coco", "G", { crudo: 20, cocido: null }, { crudo: 27, cocido: null }],
  ["Coco", "G", { crudo: 50, cocido: null }, { crudo: 50, cocido: null }],
  ["Semillas de chía", "G", { crudo: 19, cocido: null }, { crudo: 26, cocido: null }],
  ["Semillas de ajonjolí", "G", { crudo: 22, cocido: null }, { crudo: 31, cocido: null }],
  ["Pistachos", "G", { crudo: 49, cocido: null }, { crudo: 67, cocido: null }],
  ["Nuez del Brasil", "G", { crudo: 27, cocido: null }, { crudo: 38, cocido: null }],
  ["Marañón", "G", { crudo: 38, cocido: null }, { crudo: 52, cocido: null }],
  ["Queso finesse (rodaja baja en grasa)", "G", { crudo: 4, cocido: null }, { crudo: 6, cocido: null }],
  ["Cuajada Colanta", "G", { crudo: 64, cocido: null }, { crudo: 87, cocido: null }],
  ["Chocolate Lok al 58%", "G", { crudo: 47, cocido: null }, { crudo: 64, cocido: null }],
  ["Queso parmesano Alpina", "G", { crudo: 51, cocido: null }, { crudo: 70, cocido: null }],
  ["Queso paipa", "G", { crudo: 64, cocido: null }, { crudo: 87, cocido: null }],
  ["Tocineta Zenú (falta info nutricional del producto)", "G", { crudo: 43, cocido: null }, { crudo: 59, cocido: null }],
  ["Queso fetta (falta info nutricional del producto)", "G", { crudo: 84, cocido: null }, { crudo: 115, cocido: null }],

  ["Banano", "F", { crudo: 150, cocido: null }, { crudo: 223, cocido: null }],
  ["Fresas", "F", { crudo: 223, cocido: null }, { crudo: 331, cocido: null }],
  ["Piña", "F", { crudo: 271, cocido: null }, { crudo: 403, cocido: null }],
  ["Papaya", "F", { crudo: 174, cocido: null }, { crudo: 259, cocido: null }],
  ["Kiwi", "F", { crudo: 307, cocido: null }, { crudo: 457, cocido: null }],
  ["Manzana roja", "F", { crudo: 177, cocido: null }, { crudo: 263, cocido: null }],
  ["Manzana verde", "F", { crudo: 338, cocido: null }, { crudo: 502, cocido: null }],
  ["Mango", "F", { crudo: 228, cocido: null }, { crudo: 339, cocido: null }],
  ["Uvas", "F", { crudo: 189, cocido: null }, { crudo: 281, cocido: null }],
  ["Chontaduro", "F", { crudo: 82, cocido: null }, { crudo: 122, cocido: null }],
  ["Pera", "F", { crudo: 114, cocido: null }, { crudo: 170, cocido: null }],
  ["Mandarina", "F", { crudo: 186, cocido: null }, { crudo: 276, cocido: null }],
  ["Durazno", "F", { crudo: 171, cocido: null }, { crudo: 254, cocido: null }],
  ["Sandía", "F", { crudo: 228, cocido: null }, { crudo: 339, cocido: null }],
  ["Melón", "F", { crudo: 276, cocido: null }, { crudo: 410, cocido: null }],
  ["Arándanos", "F", { crudo: 223, cocido: null }, { crudo: 331, cocido: null }],
  ["Ciruela", "F", { crudo: 147, cocido: null }, { crudo: 219, cocido: null }],
  ["Granadilla", "F", { crudo: 146, cocido: null }, { crudo: 217, cocido: null }],
  ["Carambolo", "F", { crudo: 255, cocido: null }, { crudo: 380, cocido: null }],
  ["Guayaba", "F", { crudo: 120, cocido: null }, { crudo: 178, cocido: null }],
  ["Melocotón fresco (no enlatado)", "F", { crudo: 166, cocido: null }, { crudo: 247, cocido: null }],
  ["Pitahaya", "F", { crudo: 130, cocido: null }, { crudo: 193, cocido: null }],
  ["Naranja", "F", { crudo: 128, cocido: null }, { crudo: 191, cocido: null }],
];

const SNACKS = [
  ["Pocillo de avena", "4 cucharadas (35 g) + 2 g de linaza."],
  ["Mug de chocolate", "1 clara + 1 cda de chía (7 g) o linaza molida + 1 cda de chocolyne + stevia + canela + 1 cdta de avena. Micro 1 min 30 s."],
  ["Yogurt griego", "1 finesse completo o 120 g de griego + 2 cdas de avena + 1 cda de chía."],
  ["Batido", "10 fresas (120 g) o ½ banano (70 g) + 1 cda de linaza + 1 puñado de maní (15 g) + 2 cdas de avena + agua + hielo + canela."],
  ["Dulce proteico", "3–4 claras + ½ banano (70 g) + 2 cdtas de chocolyne + linaza + canela, a la sartén a fuego bajo."],
  ["Salado rápido", "1 lata de atún pequeña en agua con tomate, cebolla y limón."],
  ["Post evento", "1 mano y media de pollo (140 g en crudo) + 1 puñado de maní (15 g)."],
];

const PRE_ENTRENO = [
  "Gym o bici de más de 1 h: 30 g de avena + ½ scoop + 50 g de banano.",
  "Bici de 1 h 30 o más: 100 g de arroz + 2 huevos, o 2 rodajas de pan de 100 cals + 2 huevos + 15 g de miel.",
  "Durante la salida larga: agua siempre, bocadillo grande cada 40 min, 1 scoop de bebida con carbohidrato por hora.",
  "Creatina: 1 scoop post entreno, en agua o con el batido verde.",
  "El batido verde nunca va antes del entreno: siempre después, antes del desayuno.",
];

const MEDIDAS = [
  ["peso", "Peso", "kg"], ["cintura", "Cintura", "cm"], ["cadera", "Cadera", "cm"],
  ["brazoRel", "Brazo relajado", "cm"], ["brazoCon", "Brazo contraído", "cm"],
  ["muslo", "Muslo", "cm"], ["cuello", "Cuello", "cm"], ["pantorrilla", "Pantorrilla", "cm"],
];

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

const KEY = "fundamento:v3";
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
const iso = (d) => d.toISOString().slice(0, 10);
const hoyISO = () => iso(new Date());
function parseISO(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function diffDias(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function lunesDeEstaSemana() { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); }

const PILARES = [
  { k: "mesa", n: "Mesa", c: "#FFB020", d: "Lo que comes" },
  { k: "ruta", n: "Ruta", c: "#22E0D6", d: "Lo que mueves" },
  { k: "taller", n: "Taller", c: "#4D8DFF", d: "Lo que aprendes" },
  { k: "oficio", n: "Oficio", c: "#A77BFF", d: "Lo que entregas" },
  { k: "mente", n: "Mente", c: "#FF5C8A", d: "Lo que te dices" },
];

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
  const min = Math.min(...ys), max = Math.max(...ys), span = max - min || 1;
  const pts = vals.map((v, i) => [
    pad + (i / (vals.length - 1)) * (W - pad * 2),
    H - pad - ((v[campo] - min) / span) * (H - pad * 2),
  ]);
  const linea = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const delta = Math.round((ys[ys.length - 1] - ys[0]) * 10) / 10;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="charthead">
        <b>{campo === "peso" ? "Peso" : MEDIDAS.find((m) => m[0] === campo)[1]}</b>
        <span style={{ color: delta <= 0 ? color : "#FFB020", fontSize: 15 }}>
          {ys[ys.length - 1]} {unidad} · {delta > 0 ? "+" : ""}{delta}
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
        <path d={linea + ` L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`} fill={color} opacity=".07" />
        <path d={linea} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
      </svg>
      <div className="axis"><span>{vals[0].fecha}</span><span>{vals[vals.length - 1].fecha}</span></div>
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

const PARTES_EJERCICIO = [...new Set(EJERCICIOS.map((e) => e.parte))].sort((a, b) => a.localeCompare(b, "es"));
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
  const [cambiandoEjercicio, setCambiandoEjercicio] = useState(null);
  const [buscaEjercicio, setBuscaEjercicio] = useState("");
  const [partePersonalizar, setPartePersonalizar] = useState("todas");
  const [buscaBanco, setBuscaBanco] = useState("");
  const [partePersonalizarBanco, setPartePersonalizarBanco] = useState("todas");
  const [ejercicioAbierto, setEjercicioAbierto] = useState(null);
  const [cap, setCap] = useState({ sab: "evitador", que: "", dijo: "", sabio: "" });
  const [chk, setChk] = useState({});
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let vivo = true;
    (async () => {
      let cargado = null;
      try {
        const r3 = await store.get(KEY);
        if (r3 && r3.value) cargado = JSON.parse(r3.value);
        else {
          const r2 = await store.get(KEY_V2);
          if (r2 && r2.value) cargado = migrarV2aV3(JSON.parse(r2.value));
          else {
            const r1 = await store.get(KEY_V1);
            if (r1 && r1.value) cargado = migrarV2aV3(migrarV1aV2(JSON.parse(r1.value)));
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

  const perfilCfg = (state && state.perfil) || DEFAULT_PERFIL;
  const porcionesTotal = useMemo(
    () => PORCIONES.concat((perfilCfg.porcionesExtra || []).map((a) => [a.nombre, a.cat, { crudo: a.gramos0, cocido: null }, { crudo: a.gramos3, cocido: null }])),
    [perfilCfg.porcionesExtra]
  );

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

  function setEntreno(campos) {
    if (!state) return;
    guardar({ ...state, entreno: { ...entrenoCfg, ...campos } });
  }
  const setPlantillaDia = (i, val) => {
    const plantilla = [...entrenoCfg.plantilla]; plantilla[i] = val;
    setEntreno({ plantilla });
  };
  const setOverrideHoy = (val) => {
    const overrides = { ...(entrenoCfg.overrides || {}) };
    if (val) overrides[fecha] = val; else delete overrides[fecha];
    setEntreno({ overrides });
  };
  const setEjercicioPersonalizado = (claveSesion, indice, idEjercicio) => {
    const actual = (entrenoCfg.ejerciciosPersonalizados && entrenoCfg.ejerciciosPersonalizados[claveSesion]) || {};
    const siguiente = { ...actual, [indice]: idEjercicio || undefined };
    setEntreno({ ejerciciosPersonalizados: { ...(entrenoCfg.ejerciciosPersonalizados || {}), [claveSesion]: siguiente } });
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
                            <div className="wfill" style={{ width: Math.min(100, ((dd.agua || 0) / state.meta) * 100) + "%" }} />
                            <div className="wlabel">{(dd.agua || 0).toFixed(2)} / {state.meta} L</div>
                          </div>
                          <button className="wbtn" onClick={() => agua(0.25)} aria-label="Sumar 250 ml">+</button>
                        </div>

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
                        {plan.entreno.lista.map((e, i) => (
                          <React.Fragment key={i}>
                            <div className="li"><em>{String(i + 1).padStart(2, "0")}</em>
                              <span style={{ flex: 1 }}>{e[0]} — <span style={{ color: "var(--dim)" }}>{e[1]}</span></span>
                              {plan.entreno.tipo === "gym" && (
                                <button className="pill" onClick={() => { setCambiandoEjercicio(cambiandoEjercicio === i ? null : i); setBuscaEjercicio(""); setPartePersonalizar("todas"); }}>
                                  Cambiar
                                </button>
                              )}
                            </div>
                            {cambiandoEjercicio === i && (
                              <div style={{ marginBottom: 10 }}>
                                <input className="fld" placeholder="Buscar ejercicio" value={buscaEjercicio} onChange={(ev) => setBuscaEjercicio(ev.target.value)} />
                                <div className="pills" style={{ marginTop: 6 }}>
                                  <button className="pill" data-on={partePersonalizar === "todas" ? 1 : 0} onClick={() => setPartePersonalizar("todas")}>Todas</button>
                                  {PARTES_EJERCICIO.map((p3) => (
                                    <button key={p3} className="pill" data-on={partePersonalizar === p3 ? 1 : 0} onClick={() => setPartePersonalizar(p3)}>{p3}</button>
                                  ))}
                                </div>
                                <div style={{ maxHeight: 230, overflowY: "auto", marginTop: 6 }}>
                                  {EJERCICIOS.filter((ej) =>
                                    (partePersonalizar === "todas" || ej.parte === partePersonalizar) &&
                                    ej.nombre.toLowerCase().includes(buscaEjercicio.toLowerCase())
                                  ).slice(0, 25).map((ej) => (
                                    <button key={ej.id} className="pill" style={{ display: "block", width: "100%", textAlign: "left", marginTop: 4 }}
                                      onClick={() => { setEjercicioPersonalizado(plan.entreno.clave, i, ej.id); setCambiandoEjercicio(null); }}>
                                      {ej.nombre} <span style={{ color: "var(--dim)" }}>· {ej.parte} · {ej.equipo}</span>
                                    </button>
                                  ))}
                                </div>
                                <button className="btn" onClick={() => { setEjercicioPersonalizado(plan.entreno.clave, i, null); setCambiandoEjercicio(null); }}>Volver al ejercicio original</button>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                        <span className="lbl">Cambiar solo hoy</span>
                        <select className="fld" aria-label="Cambiar el entreno solo de hoy" value={(entrenoCfg.overrides || {})[fecha] || ""} onChange={(e) => setOverrideHoy(e.target.value)}>
                          <option value="">Usar la plantilla ({SESION_LABEL[entrenoCfg.plantilla[dia]]})</option>
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
            return (
              <div className="hcell" key={i} data-today={i === idxDia ? 1 : 0} title={iso(d)}
                style={{ background: v > 0 ? `rgba(34,224,214,${0.06 + v * 0.34})` : "transparent",
                  boxShadow: v >= 0.8 ? "0 0 10px rgba(34,224,214,.3) inset" : "none" }}>
                {d.getDate()}
              </div>
            );
          })}
        </div>
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
        <p>Sus gramos por banda se usan igual que los del plan.</p>
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
        <p>Qué sesión toca cada día de la semana. La progresión (reps, RPE, minutos) sigue viniendo de la semana del bloque en la que estés.</p>
        {DIAS.map((dn, i) => (
          <div key={dn} style={{ marginTop: 10 }}>
            <span className="lbl">{dn}</span>
            <select className="fld" aria-label={"Sesión del " + dn} value={entrenoCfg.plantilla[i]} onChange={(e) => setPlantillaDia(i, e.target.value)}>
              {SESIONES_VALIDAS.map((k) => <option key={k} value={k}>{SESION_LABEL[k]}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <div className="charthead"><b>Carga en vivo · minutos por día</b>
            <span>{DIAS.reduce((a, _, i) => a + entrenoDe(sem, i, entrenoCfg, fechaDeSemDia(state.inicio, sem, i)).min, 0)} min</span></div>
          <Carga sem={sem} hoyDia={dia} config={entrenoCfg} inicio={state.inicio} />
        </div>
        {avisosEntreno(entrenoCfg.plantilla).map((a, i) => <div className="note" key={i}>{a}</div>)}
      </div>

      <div className="pane block">
        <h4>Banco de ejercicios</h4>
        <p>Para cambiar un ejercicio dentro de una sesión de gym, ve a Hoy → Ruta y toca "Cambiar" junto al ejercicio. Aquí puedes explorar el banco completo.</p>
        <input className="fld" placeholder="Buscar ejercicio" value={buscaBanco} onChange={(e) => setBuscaBanco(e.target.value)} />
        <div className="pills" style={{ marginTop: 8 }}>
          <button className="pill" data-on={partePersonalizarBanco === "todas" ? 1 : 0} onClick={() => setPartePersonalizarBanco("todas")}>Todas</button>
          {PARTES_EJERCICIO.map((p3) => (
            <button key={p3} className="pill" data-on={partePersonalizarBanco === p3 ? 1 : 0} onClick={() => setPartePersonalizarBanco(p3)}>{p3}</button>
          ))}
        </div>
        {EJERCICIOS.filter((ej) =>
          (partePersonalizarBanco === "todas" || ej.parte === partePersonalizarBanco) &&
          ej.nombre.toLowerCase().includes(buscaBanco.toLowerCase())
        ).slice(0, 40).map((ej) => (
          <div key={ej.id} style={{ marginTop: 8 }}>
            <button style={{ display: "block", width: "100%", textAlign: "left" }}
              onClick={() => setEjercicioAbierto(ejercicioAbierto === ej.id ? null : ej.id)} aria-expanded={ejercicioAbierto === ej.id}>
              <span className="chk-txt">{ej.nombre}<span className="chk-sub">{ej.parte} · {ej.equipo} · {ej.objetivo}</span></span>
            </button>
            {ejercicioAbierto === ej.id && ej.pasos.map((p3, i) => (
              <div className="li" key={i}><em>{String(i + 1).padStart(2, "0")}</em><span>{p3}</span></div>
            ))}
          </div>
        ))}
        <div className="note">Ejercicios e instrucciones de exercises-dataset (github.com/hasaneyldrm/exercises-dataset), licencia MIT, atribución Gym Visual.</div>
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
