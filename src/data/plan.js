/* ==========================================================================
   DATOS DEL PLAN
   Contenido tal cual viene de la nutricionista, el temario oficial del examen
   y el trabajo personal del usuario. No se cambia sin que lo pida el usuario.
   ========================================================================== */

export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export const DIAS_C = ["L", "M", "M", "J", "V", "S", "D"];

export const DETOX = [
  "En ayunas: 1 vaso de agua + 1 tallo de apio licuado en agua (sin limón ni nada más).",
  "En ayunas: batido verde — 1 o 2 tallos de apio + sábila + espinaca (lavada con vinagre blanco) + 1/3 de zucchini sin cáscara. Sin fruta.",
  "En ayunas: 100 g de papaya (o 1 taza licuada) con sábila cristal o piña. Opcional: 5 g de chía o linaza molida.",
  "En ayunas: 100 g de papaya (o 1 taza licuada) con sábila cristal o piña. Opcional: 5 g de chía o linaza molida.",
];

export const NUTRI = [
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

export const GYM = {
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

export const SERIES = [
  { s: "3 series", rpe: "RPE 6 · deja 4 reps en el tanque", v: "3 vueltas" },
  { s: "4 series", rpe: "RPE 7 · deja 3 reps en el tanque", v: "4 vueltas" },
  { s: "4 series", rpe: "RPE 8 · deja 2 reps en el tanque", v: "4 vueltas" },
  { s: "3 series", rpe: "RPE 6 · descarga, sube técnica no peso", v: "3 vueltas" },
];

export const BICI = [
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
export const ESTUDIO = [
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

export const SABOTEADORES = {
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

export const FOCO_MENTE = [
  { t: "Semana 1 · desarmar al Evitador", d: "Todos los días atacas primero lo que quieres esquivar. Solo 10 minutos, y anotas qué pasó de verdad al hacerlo." },
  { t: "Semana 2 · bajarle el volumen al Hipervigilante", d: "Cada vez que la alarma suba, la nombras y la separas: dato vs. pronóstico. Una acción verificable, no cinco." },
  { t: "Semana 3 · soltar al Hiper-triunfador", d: "Esta semana el marcador es la adherencia, no el resultado. Cierra cada día escribiendo un logro invisible." },
  { t: "Semana 4 · integrar", d: "Ya los conoces a los tres. Cuando aparezca uno, lo nombras y respondes desde el Sabio: ¿qué haría alguien que ya resolvió esto?" },
];

/* Tabla de porciones del plan: [nombre, categoría, banda 0–300 cals, banda 300–700 cals].
   Cada banda es { crudo, cocido }. cocido:null cuando el plan no trae equivalencia cocida
   (frutas y grasas no la traen; algunos alimentos se pesan siempre en crudo). Valores no
   numéricos (huevos, pan, arepa, tortilla) se muestran tal cual, sin escalar por porción. */
export const PORCIONES = [
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

export const SNACKS = [
  ["Pocillo de avena", "4 cucharadas (35 g) + 2 g de linaza."],
  ["Mug de chocolate", "1 clara + 1 cda de chía (7 g) o linaza molida + 1 cda de chocolyne + stevia + canela + 1 cdta de avena. Micro 1 min 30 s."],
  ["Yogurt griego", "1 finesse completo o 120 g de griego + 2 cdas de avena + 1 cda de chía."],
  ["Batido", "10 fresas (120 g) o ½ banano (70 g) + 1 cda de linaza + 1 puñado de maní (15 g) + 2 cdas de avena + agua + hielo + canela."],
  ["Dulce proteico", "3–4 claras + ½ banano (70 g) + 2 cdtas de chocolyne + linaza + canela, a la sartén a fuego bajo."],
  ["Salado rápido", "1 lata de atún pequeña en agua con tomate, cebolla y limón."],
  ["Post evento", "1 mano y media de pollo (140 g en crudo) + 1 puñado de maní (15 g)."],
];

export const PRE_ENTRENO = [
  "Gym o bici de más de 1 h: 30 g de avena + ½ scoop + 50 g de banano.",
  "Bici de 1 h 30 o más: 100 g de arroz + 2 huevos, o 2 rodajas de pan de 100 cals + 2 huevos + 15 g de miel.",
  "Durante la salida larga: agua siempre, bocadillo grande cada 40 min, 1 scoop de bebida con carbohidrato por hora.",
  "Creatina: 1 scoop post entreno, en agua o con el batido verde.",
  "El batido verde nunca va antes del entreno: siempre después, antes del desayuno.",
];

export const MEDIDAS = [
  ["peso", "Peso", "kg"], ["cintura", "Cintura", "cm"], ["cadera", "Cadera", "cm"],
  ["brazoRel", "Brazo relajado", "cm"], ["brazoCon", "Brazo contraído", "cm"],
  ["muslo", "Muslo", "cm"], ["cuello", "Cuello", "cm"], ["pantorrilla", "Pantorrilla", "cm"],
];
export const PILARES = [
  { k: "mesa", n: "Mesa", c: "#FFB020", d: "Lo que comes" },
  { k: "ruta", n: "Ruta", c: "#22E0D6", d: "Lo que mueves" },
  { k: "taller", n: "Taller", c: "#4D8DFF", d: "Lo que aprendes" },
  { k: "oficio", n: "Oficio", c: "#A77BFF", d: "Lo que entregas" },
  { k: "mente", n: "Mente", c: "#FF5C8A", d: "Lo que te dices" },
];
