# PROMPT — Optimización total de "Fundamento"

> Pégalo completo en Claude Code, en la raíz del repo de la app.
> Está escrito para que el agente trabaje en fases y no toque nada fuera de alcance.

---

## 0. Rol y encargo

Actúa como el equipo de producto completo de una app de rendimiento personal: **director de diseño** (viene de un estudio que hace apps de deporte con identidad propia), **ingeniero frontend senior** (PWA, offline-first, React) y **fisiólogo del ejercicio / nutricionista deportivo** que sabe traducir ciencia en interfaz.

Tu encargo: llevar **Fundamento** de "app personal que funciona" a **producto de referencia** — al nivel de las mejores del mercado en nutrición, entrenamiento y mente, sin perder que es una herramienta de una sola persona, no un SaaS.

**Regla que gobierna todo el trabajo:** cada cosa que agregues tiene que ganarse la pantalla. Si una métrica no cambia una decisión del día siguiente, no va. Si una animación no comunica algo, se corta.

---

## 1. Contexto: qué es Fundamento hoy

App PWA personal que organiza un ciclo de 28 días en cinco pilares:

| Pilar | Cubre |
|---|---|
| **Mesa** | Plan alimentario mensual (notación P/C/G/F entregada por nutricionista externa) |
| **Ruta** | Ciclismo — salidas, volumen, intensidad |
| **Taller** | Gimnasio — fuerza, 3 sesiones/semana |
| **Oficio** | Trabajo y estudio (certificaciones, 50–60 min/día entre semana) |
| **Mente** | Hábitos de cabeza: sueño, lectura, foco, descompresión |

**Estado técnico actual**
- React 18, bundle único compilado con esbuild.
- PWA instalable: service worker, manifest, iconos.
- Capa `store` al inicio de `src/App.jsx` que conmuta entre `window.storage` (dentro de Claude) y `localStorage` (app instalada). **Esta abstracción se conserva y se refuerza — no la elimines.**
- Pestañas: Hoy / Plan / Mente / Datos / Ajustes.
- Dirección visual v2: "computador de ruta nocturno" — azul profundo, acentos neón, esquinas cortadas, Chakra Petch + IBM Plex Mono.
- Gráficas existentes: anillos del día, perfil de etapa 28 días con línea de meta 80 %, radar de 5 frentes, barras de carga semanal, tendencias de medidas.
- Reparto semanal confirmado: **3 gimnasio + 3 bici + domingo suave**.

**Antes de escribir código:** lee el repo completo, mapea el estado actual (componentes, esquema de datos en `fundamento:v1`, dónde vive cada cálculo) y escribe un `AUDITORIA.md` de máximo 2 páginas con: qué está bien y se conserva, qué está frágil, qué hay que reescribir. No empieces la fase 1 sin eso.

---

## 2. Referencias de mercado: qué robar exactamente

No copies interfaces. Extrae el **principio** detrás de cada una y aplícalo al mundo de Fundamento.

### Nike Training Club / Nike Run Club
- **Tipografía como estructura.** Titulares enormes, condensados, en mayúsculas, que ocupan la pantalla sin adornos alrededor. El número es el héroe; la etiqueta es diminuta.
- **Una acción primaria por pantalla**, gigante, imposible de no ver.
- **Celebración post-sesión**: la pantalla de cierre de entreno es un momento diseñado, no un toast.
- Lo que se toma: jerarquía tipográfica brutal en Hoy y en el cierre del día.

### adidas Training / Runtastic
- **Progresión visible dentro del plan**: siempre sabes en qué semana estás y qué falta.
- **Bloques de sesión legibles a un metro de distancia** (para leer con el celular en el suelo, entre series).
- Lo que se toma: modo "en sesión" con tipografía grande y contraste alto para el gimnasio.

### TrainingPeaks
- **El modelo de carga es el producto.** CTL / ATL / TSB (fitness, fatiga, forma) graficados en el tiempo, con proyección hacia adelante.
- **Código de color semántico**, no decorativo: verde/amarillo/rojo significan algo fisiológico concreto.
- **Planeado vs. ejecutado** siempre lado a lado.
- Lo que se toma: el motor de carga y el contraste plan/real en todo el sistema (también en comida y estudio).

### Strava
- **La actividad tiene narrativa**: mapa, perfil de elevación, segmentos, esfuerzo relativo.
- **Comparación contra tu propio pasado**, no contra otros (usa el eje de "esto vs. tus últimas 6 semanas").
- **Densidad de datos elegante**: mucha información sin sensación de tablero de control.
- Lo que se toma: la vista de detalle de sesión y las comparaciones contra el histórico propio.

### Complementos puntuales
- **Whoop / Oura** — un solo número de disposición diaria (readiness) con desglose expandible al tocar.
- **Eight Sleep / Rise** — sueño tratado como palanca de rendimiento, no como dato suelto.
- **Headspace / Waking Up** — el módulo de mente con ritmo pausado y tipografía respirada, deliberadamente distinto en textura al resto de la app.
- **MacroFactor** — el mejor registro de comida del mercado: fricción mínima, tendencias sobre datos crudos, ajuste adaptativo.

---

## 3. Dirección de diseño

**Mantén la base "computador de ruta nocturno"** — Chakra Petch + IBM Plex Mono, azul profundo, esquinas cortadas. Esa decisión ya está tomada y es correcta. Lo que hay que hacer es **subirle el nivel de ejecución**, no cambiarla.

### Sistema de tokens (formalízalo en `src/tokens.js` o variables CSS, una sola fuente de verdad)

- **Color.** 4–6 hex nombrados, con roles explícitos: fondo, superficie elevada, texto primario, texto secundario, acento, y una escala semántica separada (`load-low` / `load-optimal` / `load-high` / `load-danger`). El acento neón se usa **con hambre**: un elemento por pantalla, máximo dos.
- **Tipografía.** Escala modular declarada (mínimo 6 pasos), con pesos y tracking definidos por rol: display, título de sección, cuerpo, etiqueta, dato numérico tabular. Los números **siempre** en mono con `font-variant-numeric: tabular-nums` para que no bailen al actualizarse.
- **Espaciado.** Escala de 4 px, sin excepciones improvisadas.
- **Radio y bordes.** El corte de esquina es la firma geométrica: usa una sola función/mixin y aplícala consistente, nunca a ojo.
- **Elevación.** Sin sombras difusas genéricas: usa borde de 1 px con luz + cambio de superficie. Es más coherente con la estética de instrumento.

### Movimiento
- Transiciones de 150–250 ms, curva propia declarada como token.
- **La animación comunica estado, no adorna**: el anillo que se completa, el número que cuenta hacia arriba al registrar, la barra de carga que se reacomoda.
- Un solo momento orquestado en toda la app: el **cierre del día**. Ahí sí gastas presupuesto de animación.
- `prefers-reduced-motion` respetado en todo, sin excepción.

### Elemento firma
Diseña **una** cosa por la que se recuerde la app. Candidato fuerte: el **perfil de etapa de 28 días** convertido en el objeto central — un perfil de altimetría de ciclismo donde cada día es un tramo, la altura es la carga total del día y el color es la adherencia. Se lee como una etapa de montaña. Si encuentras algo mejor, propónlo y justifícalo antes de construirlo.

### Piso de calidad (no negociable)
Responsive real hasta 360 px de ancho · foco de teclado visible · contraste AA mínimo en texto · targets táctiles de 44 px · funciona con la pantalla al 50 % de brillo bajo sol · legible con guantes de ciclismo.

---

## 4. Módulos: qué construir

### 4.1 Hoy — la pantalla que se abre 6 veces al día

Debe responder en **menos de 3 segundos** de lectura: qué toca hoy, cómo voy, qué es lo siguiente.

- **Encabezado de disposición**: un número 0–100 (disposición del día) calculado con sueño, carga de los últimos 7 días, adherencia reciente y check subjetivo de energía. Tocarlo despliega el desglose con las 3–4 variables que más lo movieron. Nunca muestres el número sin poder explicarlo.
- **Anillos concéntricos** de los 5 pilares (ya existen — refínalos: grosor, animación de llenado, estado vacío que invita a registrar).
- **Siguiente acción**: una sola tarjeta grande con lo próximo del día (comida, sesión, bloque de estudio) y su acción primaria.
- **Racha con memoria corta**: la racha no se rompe por un día; usa una ventana de adherencia de 7 días. Rompe el hábito de castigar, que es lo que hace que la gente abandone.
- **Cierre del día**: ritual de 20 segundos — confirmar pilares, una línea de nota, y el momento de celebración diseñado.

### 4.2 Mesa — nutrición y plan alimentario

Aquí está el mayor salto de valor. Hoy la notación P/C/G/F es cruda; conviértela en comida real.

- **Resolvedor de notación → alimentos.** Motor que traduce la notación de la nutricionista a porciones concretas en gramos, contra una base de alimentos local (crea `src/data/alimentos.json`, ~150–250 ítems relevantes al contexto colombiano: arepa, panela, aguacate, frijol, plátano, huevo criollo, arroz, pollo, atún, avena, yogur griego, etc.) con macros por 100 g.
- **Recetario generado por día**: 2–3 opciones por comida que cumplen los mismos macros, con tiempo de preparación e ingredientes. Rotación automática para que no se repita lo mismo 4 días seguidos.
- **Registro de fricción cero**: marcar "comí lo planeado" es un toque. Desviarse abre el editor. El camino feliz es un tap.
- **Timing nutricional ligado al entreno**: la app sabe si hoy es bici, gimnasio o suave, y ajusta la sugerencia de carbohidratos alrededor de la sesión. Esto es lo que separa una app de nutrición de una lista de comidas.
- **Hidratación** con meta ajustada por carga y calor del día.
- **Lista de mercado semanal** derivada del plan de los próximos 7 días, agrupada por sección del supermercado. Exportable como texto para WhatsApp.
- **Tendencias sobre datos crudos**: nunca muestres el peso de hoy solo; muestra la media móvil de 7 días con la banda de ruido. El peso diario miente y desmotiva.

### 4.3 Ruta + Taller — entrenamiento

- **Motor de carga.** Implementa un score de carga por sesión (para bici: duración × factor de intensidad²; para gimnasio: tonelaje × RPE normalizado). De ahí deriva:
  - **Fitness** (media exponencial 42 días), **fatiga** (7 días), **forma** (fitness − fatiga).
  - Gráfica de las tres curvas en el tiempo con proyección de los próximos 7 días según lo planeado.
  - Semáforo de carga: verde (progresión sostenible), amarillo (monotonía alta), rojo (salto agudo/crónico > 1.5).
- **Plantillas de semana configurables** con overrides por día: el reparto 3 gym / 3 bici / domingo suave es la plantilla base, pero editable sin tocar código.
- **Modo en sesión** (gimnasio): tipografía enorme, ejercicio actual, series/reps/peso, temporizador de descanso, avance al siguiente con un gesto. Pensado para usarse con el teléfono en el suelo.
- **Progresión de fuerza automática**: registra series y sugiere el peso de la próxima sesión según la regla de progresión configurada (doble progresión por defecto). Marca PRs.
- **Zonas** de frecuencia cardiaca y potencia (si hay datos) con distribución de tiempo en zona por semana.
- **Detalle de sesión estilo Strava**: resumen narrativo, esfuerzo relativo, comparación contra tus últimas 6 sesiones equivalentes.
- **Importación**: soporte para archivo `.fit` / `.gpx` / `.tcx` arrastrado a la app, parseado en cliente. Sin integraciones de API por ahora — un archivo arrastrado resuelve el 90 %.

### 4.4 Mente

Deliberadamente más lento y respirado que el resto. Otra textura: más espacio en blanco (bueno, en negro), menos números, tipografía más grande y suelta.

- **Chequeo de dos toques**: energía y ánimo en escala de 5, sin más.
- **Bloques de foco** con temporizador (trabajo profundo / estudio), vinculados a Oficio.
- **Registro de sueño**: horas y calidad percibida, alimentando la disposición diaria.
- **Una línea al día**: un campo de texto libre, sin prompts motivacionales. La revisión mensual muestra las 28 líneas juntas — ese es el valor.
- **Sin gamificación falsa.** Ni insignias ni frases de calendario motivacional. La app tiene el registro suficiente como para respetar la inteligencia de quien la usa.

### 4.5 Datos — la vista de revisión

- **Chequeo corporal** (peso, medidas) con tendencias y banda de ruido.
- **Perfil de etapa de 28 días** como elemento firma.
- **Radar de 5 frentes** — refinado, con comparación contra el ciclo anterior superpuesta.
- **Adherencia por pilar** a lo largo del ciclo, para ver cuál se cae primero.
- **Correlaciones honestas**: con n pequeño, muéstralas como observaciones ("las semanas con más de 7 h de sueño promedio tuviste 14 % más adherencia") y **etiquétalas como exploratorias**, nunca como causalidad. No inventes significancia estadística.
- **Cierre de ciclo**: al día 28, una pantalla de revisión que resume el ciclo y arranca el siguiente arrastrando lo que funcionó.

---

## 5. Arquitectura y técnica

- **Esquema de datos versionado.** Migra de `fundamento:v1` a `fundamento:v2` con función de migración explícita y tests. Nunca pierdas datos del usuario: la migración corre una vez, guarda respaldo de la versión anterior antes de escribir.
- **Capa `store` intacta y reforzada**: misma interfaz, ahora con escritura con debounce, cola de reintentos y detección de cuota llena.
- **Export / import completo en JSON** desde Ajustes. Es la red de seguridad y la ruta de migración a cualquier futuro backend.
- **Offline-first de verdad**: la app funciona sin red al 100 %. El service worker cachea el shell y sirve stale-while-revalidate.
- **Rendimiento**: bundle < 250 KB gzip, primer render con contenido útil < 1.5 s en 3G simulado, sin janks al animar (todo en `transform` y `opacity`).
- **Estructura de código**: parte `App.jsx` en módulos por pilar. La lógica de cálculo (carga, macros, disposición, progresión) va en `src/engine/` con funciones puras y **tests unitarios** — es la parte donde un bug silencioso hace daño real.
- **Sin dependencias nuevas pesadas.** Si necesitas gráficas, evalúa primero SVG a mano (ya lo estás haciendo y se ve mejor). Justifica cualquier librería nueva antes de instalarla.
- **Despliegue**: mantén el objetivo de Azure Static Web Apps con build a `dist/`, `staticwebapp.config.json` y workflow de GitHub Actions.

---

## 6. Redacción de la interfaz

- Español, tono directo, sin signos de exclamación motivacionales.
- Nombra las cosas por lo que la persona hace, no por cómo está construido el sistema.
- Verbos activos y consistentes: el botón que dice "Registrar" produce el mensaje "Registrado".
- **Estados vacíos como invitación**, no como disculpa: "Aún no hay sesiones esta semana. La primera es mañana: 3 series de sentadilla." mejor que "No hay datos disponibles".
- **Errores concretos**: qué pasó y cómo se arregla. Nunca "Algo salió mal".

---

## 7. Plan de fases (entrega y valida cada una antes de seguir)

| Fase | Alcance | Entregable |
|---|---|---|
| **0** | Auditoría del repo, mapa de datos, plan de tokens | `AUDITORIA.md` + `PLAN-DISENO.md` |
| **1** | Sistema de diseño formalizado + refactor de estructura + migración v1→v2 | App idéntica en función, base sólida |
| **2** | Motor de cálculo (`src/engine/`) con tests: carga, disposición, macros, progresión | Tests en verde |
| **3** | Mesa completa: resolvedor de alimentos, recetario, lista de mercado, timing | Módulo funcionando con el plan real |
| **4** | Ruta + Taller: curvas de carga, modo en sesión, progresión, importación de archivos | Módulo funcionando |
| **5** | Hoy rediseñado, Mente, cierre del día, elemento firma | Experiencia completa |
| **6** | Datos, cierre de ciclo, rendimiento, despliegue en Azure SWA | Publicado |

Al final de cada fase: capturas de pantalla, resumen de qué cambió y qué decisiones tomaste que no estaban en el prompt.

---

## 8. Qué NO hacer

- No introduzcas login, cuentas, backend ni sincronización en la nube en este alcance. Es una app de una persona; el JSON exportable es suficiente.
- No agregues redes sociales, ranking, ni comparación con otros.
- No inventes datos de salud ni des recomendaciones médicas. La app organiza un plan hecho por una nutricionista; no lo sustituye ni lo "corrige".
- No metas notificaciones push agresivas ni cuentas regresivas de culpa.
- No conviertas los pilares en un sistema de puntos que se puede optimizar sin hacer el trabajo real.
- No cambies la dirección visual base a un tema claro, ni al gris genérico con acento verde ácido que sale por defecto. La identidad ya existe: profundízala.
- No agregues IA generativa dentro de la app "porque sí". Si propones alguna función con modelo, justifica exactamente qué decisión mejora.

---

## 9. Criterios de aceptación

Considera el trabajo terminado cuando:

1. La app carga en menos de 1.5 s y funciona completa sin red.
2. Los datos del ciclo actual sobrevivieron la migración, verificado con respaldo previo.
3. Cada número en pantalla se puede explicar tocándolo.
4. El plan alimentario se lee como comida real con gramos, no como notación.
5. Las curvas de carga responden correctamente a una semana de datos de prueba (incluye un caso simulado de sobrecarga y verifica que el semáforo pase a rojo).
6. El modo en sesión es legible a un metro de distancia.
7. Toda la interfaz pasa navegación por teclado y `prefers-reduced-motion`.
8. Un mes de uso cabe en menos de 500 KB de almacenamiento.
9. `src/engine/` tiene cobertura de tests en las funciones de cálculo.

---

**Empieza por la fase 0. No escribas código de producto hasta entregar la auditoría y el plan de diseño, y espera mi visto bueno.**
