# Auditoría — Fundamento (Fase 0)

## Contexto que el prompt de optimización no tenía

El prompt asume como punto de partida `fundamento:v1`: notación de comida sin resolver,
plantilla de entreno fija ("3 gym + 3 bici + domingo suave"), pestañas Hoy/Plan/Mente/
Datos/Ajustes. Esa ya no es la realidad del repo — en esta misma sesión se hicieron 4
tareas previas (hoy fusionadas en `feat/optimizacion-total`, que parte de `feat/azure-swa`)
que adelantan buena parte de lo que este prompt pide en las secciones 4.2 y 4.3. Esta
auditoría parte del estado real del código, no del asumido por el documento.

Estado persistido actual: **`fundamento:v4`**, con cadena de migración v1→v2→v3→v4
probada y funcionando.

## Qué está bien y se conserva

- **Capa `store`** (`src/App.jsx:525`): abstracción `window.storage` / `localStorage`
  intacta desde el origen. Se conserva sin tocar la interfaz.
- **Migraciones versionadas**: patrón `migrarVXaVY` ya existe y ya sobrevivió 3 saltos
  reales sin perder datos. Reutilizable para v4→v5 cuando cambie el esquema en fase 1+.
- **Resolvedor de comida** (`src/comidas.js`): traduce la notación P/C/G/fruta del plan a
  gramos concretos contra `PORCIONES` (85 alimentos reales del plan, crudo/cocido),
  selección determinista por hash de fecha+categoría (sin `Math.random`), favoritos/
  excluidos/rotación. Esto es exactamente lo que pide la sección 4.2 — **no hay que
  rehacerlo**, solo ampliar la tabla de alimentos y sumar timing nutricional.
- **Recetario** (`src/data/recetas.js`): 16 recetas reales (ingredientes y pasos del
  recetario de la nutricionista), sugeridas por día sin repetir en los últimos 3 días.
  Base sólida para la "rotación automática" del prompt.
- **Entreno por semana independiente**: ya no es una plantilla única fija — cada una de
  las 4 semanas del bloque se programa aparte (`entreno.semanas`), con aviso los lunes
  si la semana en curso no está confirmada. Esto es **más flexible** que "plantilla base
  editable" (lo que pide 4.3): no hay que retroceder a una plantilla compartida.
- **Gráficas SVG a mano**: anillos del día, perfil de etapa, radar de 5 frentes, barras
  de carga semanal, tendencias de medidas — cero librerías de gráficas. Confirma que la
  regla de "sin dependencias nuevas pesadas" ya se viene respetando.
- **PWA real**: `build.mjs` reorganizado (`public/`/`src/`/`dist/`), bundle con hash de
  contenido y cache larga, `sw.js` con `CACHE` estampado por build, pipeline de Azure
  Static Web Apps ya escrito (no ejecutado contra la suscripción).

## Qué es frágil

- **Un solo archivo** (`src/App.jsx`, 1722 líneas): estado, cálculos, las 5 vistas y los
  componentes SVG viven juntos. El propio brief original marcó 2000 líneas como el
  umbral para dividir — ya estamos cerca. Dividir por pilar (fase 1) deja de ser opcional.
- **"Carga" hoy es solo minutos**: `Carga()` grafica duración de sesión, no un score de
  estímulo real (nada de duración×intensidad² ni tonelaje×RPE). El motor CTL/ATL/TSB de
  la fase 2 es trabajo nuevo, no una extensión de algo que ya exista.
- **Cero tests**: racha, adherencia, migraciones, y ahora el resolvedor de comida son
  candidatos directos a bugs silenciosos. Coincide con lo que señala la sección 5 del
  prompt — hoy no hay ninguna red de seguridad automatizada, solo verificación manual.
- **Bundle sin medir en gzip**: 236 KB minificados hoy (sin comprimir). El límite del
  prompt es 250 KB **gzip**, que normalmente da bastante más margen real (JS repetitivo
  suele comprimir 70-75 %), pero no está instrumentado — hay que medirlo antes de sumar
  la base de alimentos ampliada y el motor.

## Qué hay que reescribir o construir de cero

- **Sistema de tokens formal**: hoy los colores y tipografías viven como valores sueltos
  dentro del string `CSS`. No hay escala tipográfica declarada, ni tokens de movimiento,
  ni una sola función para el corte de esquina (se repite `clip-path` a mano en cada
  selector). Fase 1.
- **`src/engine/`**: carga, fitness/fatiga/forma, disposición diaria, progresión de
  fuerza. No existe nada reusable hoy — es la pieza central de valor del prompt.
- **Modo en sesión, PRs, zonas FC/potencia, importación `.fit`/`.gpx`/`.tcx`**: no existe
  nada de esto. Fase 4 completa desde cero.
- **Elemento firma**: `PerfilEtapa` ya existe como gráfica pero es una curva de
  adherencia (0-100 %), no de carga+adherencia combinadas (altura=carga del día,
  color=adherencia) como pide el prompt. Necesita rediseño de fondo, no solo de estilo.
- **Cierre del día / cierre de ciclo**: hoy "cerrar el día" es completar checks — no
  existen como momentos diseñados aparte.

## Nota sobre el choque con el brief original

`INSTRUCCIONES-CLAUDE-CODE.md` prohíbe inventar contenido de nutrición o entrenamiento
("viene de fuentes no negociables: la nutricionista..."). Este prompt pide un motor de
carga con umbrales fisiológicos (RPE normalizado, salto agudo:crónico > 1.5, doble
progresión) y una base de alimentos ampliada a contexto colombiano.

Lo trato como **metodología de cálculo y UX** — fórmulas estándar de la industria del
entrenamiento deportivo, no contenido médico personalizado — nunca como sustituto del
plan real: el plan de la nutricionista sigue siendo la fuente de verdad, el motor solo
puntúa carga y adherencia sobre esos datos. Los alimentos nuevos que se agreguen a
`PORCIONES` para ampliar la base se marcan explícitamente como genéricos (no parte del
plan prescrito) y nunca se mezclan con los valores que sí vienen del PDF de la
nutricionista. Si en algún punto esto empieza a sonar a recomendación médica, paro y
pregunto antes de seguir.
