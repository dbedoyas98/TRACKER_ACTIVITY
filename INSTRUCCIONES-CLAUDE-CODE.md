# Fundamento · brief de trabajo para Claude Code

Este documento es la especificación completa de tres cambios sobre una app que ya
existe y funciona. Léelo entero antes de tocar código.

---

## 0. Contexto del proyecto

**Qué es:** app personal de seguimiento de un bloque de 28 días, organizada en cinco
frentes — Mesa (alimentación), Ruta (entrenamiento), Taller (estudio para la
certificación AI-103), Oficio (trabajo) y Mente (trabajo con saboteadores).

**Stack actual, deliberadamente mínimo:**

- React 18, un solo componente grande en `src/App.jsx` (~1.400 líneas), sin router,
  sin librería de estado, sin librería de gráficas — todas las visualizaciones son SVG
  escrito a mano.
- CSS en una constante `CSS` inyectada con `<style>`. Variables CSS para los tokens.
- Build con **esbuild** a un bundle IIFE único: `app.js`.
- PWA: `index.html`, `manifest.webmanifest`, `sw.js` con precache, iconos PNG.
- Persistencia: objeto `store` al inicio de `src/App.jsx`, que usa `window.storage`
  cuando corre dentro de Claude y `localStorage` cuando corre como app instalada.
  **Toda** lectura y escritura de estado pasa por ahí. No lo rompas.

**Comando de build:**

```
npm install
npx esbuild src/main.jsx --bundle --minify --format=iife --loader:.jsx=jsx \
  --define:process.env.NODE_ENV='"production"' --outfile=app.js
```

**Estructura del estado persistido** (clave `fundamento:v1`):

```js
{
  inicio: "2026-08-10",        // lunes de arranque del bloque de 28 días
  meta: 3.5,                    // litros de agua al día
  dias: {                       // registro por fecha ISO
    "2026-08-10": {
      done: { m0:true, r0:true, ... },   // ids de tarea marcados
      agua: 2.25, sueno: "7.5", energia: "Alta",
      mit: "...", nota: "...",
      capturas: [{ sab, que, dijo, sabio, h }]
    }
  },
  medidas: [{ fecha, peso, cintura, cadera, brazoRel, brazoCon, muslo, cuello, pantorrilla }]
}
```

**Constantes de datos ya existentes en `src/App.jsx`:** `NUTRI` (4 semanas × 7 días ×
4 comidas, en notación abreviada), `DETOX`, `GYM`, `SERIES`, `BICI`, `entrenoDe()`,
`ESTUDIO`, `SABOTEADORES`, `FOCO_MENTE`, `PORCIONES`, `SNACKS`, `PRE_ENTRENO`,
`MEDIDAS`, `PILARES`, `tareasDe()`.

### Reglas que aplican a todo el trabajo

1. **No agregues dependencias de runtime.** Nada de Tailwind, MUI, recharts, date-fns,
   zustand. Si necesitas una utilidad, escríbela. El bundle debe seguir bajo ~400 KB.
2. **Migración obligatoria de datos.** Si cambias la forma del estado, sube la clave a
   `fundamento:v2` y escribe una función `migrar(v1)` que convierta lo viejo sin
   pérdida. El usuario ya tiene historial: perderlo es un fallo crítico.
3. **Todo el texto de interfaz va en español**, registro conversacional, frases cortas,
   sentence case. Nada de "¡Genial!" ni signos de admiración decorativos. Los botones
   dicen lo que hacen: "Guardar chequeo", no "Enviar".
4. **Respeta el sistema visual.** Tokens en `:root` de la constante `CSS`:
   `--mesa #FFB020`, `--ruta #22E0D6`, `--taller #4D8DFF`, `--oficio #A77BFF`,
   `--mente #FF5C8A`, fondo `#050B12`, línea `#16324A`, texto `#DCEBF7`,
   tenue `#6E90AB`. Tipografías: Chakra Petch (títulos), IBM Plex Mono (datos),
   Archivo (cuerpo). Paneles con esquina cortada vía `clip-path`, clase `.pane`.
   Cualquier control nuevo reusa `.pane`, `.pill`, `.fld`, `.btn`, `.chk`, `.lbl`.
5. **Piso de calidad:** responsive hasta 360 px de ancho, foco de teclado visible,
   `prefers-reduced-motion` respetado, `aria-*` en controles interactivos.
6. **Si `src/App.jsx` pasa de ~2.000 líneas, divídelo** en `src/data/` (constantes),
   `src/charts/` (SVG), `src/views/` (pestañas) y `src/App.jsx` (estado y layout).
   No antes: no quiero una refactorización que no pedí.
7. **Después de cada tarea:** compila, verifica que no hay errores en consola, y
   confirma a mano que el estado sobrevive a recargar la página.

---

## Tarea 1 · Perfil de alimentación con gramos y recetas del día

### Problema que resuelve

Hoy la app muestra la estructura de la nutricionista en notación abreviada:
`"3 huevos + C + ½ fruta"`. El usuario tiene que traducir mentalmente qué es "C", cuál
de sus alimentos usar y cuántos gramos van. Quiero que la app lo resuelva.

### 1.1 Modelo de datos nuevo

Agrega al estado persistido:

```js
perfil: {
  favoritos: { P: ["Pollo crudo", "Atún en agua"], C: [...], G: [...], F: [...] },
  excluidos: ["Yuca cruda"],
  banda: { desayuno: "0-300", almuerzo: "300-700", media: "0-300", cena: "300-700" },
  pesar: "crudo",          // "crudo" | "cocido"
  rotacion: true,          // evita repetir la misma proteína dos días seguidos
  porcionesExtra: []       // alimentos que el usuario agregue a mano
}
```

### 1.2 Extender la tabla de porciones

`PORCIONES` hoy es `[nombre, categoría, banda0-300, banda300-700]` y solo trae el peso
en crudo. La tabla original del plan tiene además la columna "porción pesada ya hecha".
Cambia la estructura a:

```js
["Arroz blanco crudo", "C", { crudo: 50, cocido: 106 }, { crudo: 75, cocido: 158 }]
```

Los valores en cocido para los alimentos que ya los tienen están en el PDF del plan del
usuario. Para los que no tengan dato, deja `cocido: null` y que la interfaz muestre solo
el crudo con la nota de que ese no tiene equivalencia cocida.

### 1.3 Resolver la notación a comida concreta

Escribe un módulo `src/comidas.js` que exporte `resolver(textoPlan, contexto)`.

Gramática de tokens a reconocer dentro del texto de `NUTRI` (respeta mayúsculas y
minúsculas, y las variantes con espacio):

| Token en el plan | Significa |
|---|---|
| `P` | una porción de proteína |
| `P y medio` | 1,5 porciones de proteína |
| `½ P` / `medio P` | media porción |
| `C` | una porción de carbohidrato |
| `½ C` / `medio C` | media porción |
| `G` / `½ G` | grasa, porción o media |
| `fruta` / `½ fruta` / `media de fruta` | fruta, porción o media |
| `3 huevos`, `2 claras`, `1 scoop`, `130 g yogurt griego` | literales, se dejan igual |
| `ensalada` | literal, se deja igual |

Todo lo que no sea token se pasa tal cual — hay días con instrucciones en prosa
("Si entrenas más de 90 min: C completo y quitas el ½ G") que **no** se deben mutilar.

`resolver` devuelve una estructura, no un string:

```js
{
  original: "3 huevos + C + ½ fruta",
  partes: [
    { tipo: "literal", texto: "3 huevos" },
    { tipo: "porcion", cat: "C", factor: 1,   opciones: [{ alimento, gramos, unidad }] },
    { tipo: "porcion", cat: "F", factor: 0.5, opciones: [...] }
  ]
}
```

Reglas de las opciones:

- Se toman de `perfil.favoritos[cat]`; si está vacío, de todos los de esa categoría.
- Nunca incluir nada de `perfil.excluidos`.
- Gramos = valor de la banda configurada para esa comida × `factor`, redondeado al entero.
- Si `perfil.pesar === "cocido"` y hay valor cocido, se muestra ese y se etiqueta
  "cocido"; si no hay, cae a crudo y lo etiqueta.
- Máximo 3 opciones por porción, elegidas de forma **determinista** a partir de la fecha
  (hash simple de `fecha + cat`). No uses `Math.random()`: no quiero que la lista cambie
  cada vez que se re-renderiza el componente.
- Con `perfil.rotacion` activo, excluye la proteína que aparezca en el día anterior.

### 1.4 Interfaz

**En Hoy → Mesa:** cada comida deja de ser una línea de texto y pasa a ser expandible.
Cerrada muestra la notación original. Abierta muestra las opciones resueltas con sus
gramos, y el usuario puede tocar una para fijarla como "lo que voy a comer". Lo elegido
se guarda en `dias[fecha].elegido = { desayuno: {...}, almuerzo: {...} }`. Marcar la
comida como cumplida sigue funcionando igual que hoy — esto es información adicional,
no un paso obligatorio más.

**Nueva pestaña "Perfil"** (la nav pasa de 5 a 6 elementos; verifica que siga cómoda en
360 px — si no cabe, mueve Ajustes dentro de Perfil):

- Selector de favoritos por categoría, con búsqueda, sobre la lista de `PORCIONES`.
- Lista de excluidos.
- Banda de calorías por comida, con una línea que explique qué significa: la banda alta
  es para los días con más entreno.
- Crudo vs. cocido.
- Interruptor de rotación.
- Botón para agregar un alimento propio con sus gramos por banda.

### 1.5 Recetario

Crea `src/data/recetas.js` con las recetas del recetario de la nutricionista. Cada una:

```js
{
  id: "nuggets-sin-harina",
  nombre: "Nuggets de pollo sin harinas",
  slots: ["almuerzo", "cena"],       // dónde encaja
  cubre: ["P"],                       // qué porciones resuelve
  usa: ["Pollo crudo", "Huevo entero"],   // nombres tal cual salen en PORCIONES
  tiempo: 25,                         // minutos
  ingredientes: ["..."],
  pasos: ["..."]
}
```

Recetas a incluir (están todas en el recetario que el usuario tiene): muffins de
chocolate y zapallo, fritata de pollo con papa o maduro, pancakes de aguacate, torta de
zapallo y zanahoria, chips de papa o maduro, croquetas de pollo apanadas, hamburguesa
de salmón y brócoli, huevos rellenos, champiñones portobello rellenos, pancakes de
zapallo, nuggets de pollo sin harinas, flan de claras, pan de atún, leche de almendras
casera, harina de avena, harina de almendras. Y las siete opciones rápidas que ya están
en la constante `SNACKS`.

**En Hoy → Mesa, al final:** bloque "Qué puedes cocinar hoy" con 2 o 3 recetas
sugeridas. Criterio de selección, en orden:

1. Que el `slot` coincida con alguna comida del día.
2. Que `cubre` incluya una categoría que el día pide.
3. Que no use nada de `perfil.excluidos`.
4. Que no se haya sugerido en los últimos 3 días (guarda `sugeridas` por fecha).
5. Desempate determinista por hash de la fecha.

Cada receta se abre en detalle con ingredientes y pasos. Los ingredientes que
correspondan a una porción del plan deben mostrar los gramos del usuario, no los del
recetario genérico.

### Criterios de aceptación · tarea 1

- [ ] Un día cualquiera muestra, para cada comida, alimentos concretos con gramos.
- [ ] Las opciones no cambian al re-renderizar ni al cambiar de pestaña y volver.
- [ ] Un alimento excluido no aparece jamás, en ninguna comida ni receta.
- [ ] La prosa condicional de los días complejos se conserva íntegra.
- [ ] El historial previo del usuario sigue intacto tras la migración.

---

## Tarea 2 · Días de entrenamiento configurables

### Problema que resuelve

`entrenoDe(sem, dia)` tiene el reparto quemado: lunes gym A, martes Z2, miércoles gym B,
jueves series, viernes gym C, sábado salida larga, domingo movilidad. Si el usuario
quiere montar el jueves y hacer gym el sábado, hoy no puede.

### 2.1 Modelo

```js
entreno: {
  plantilla: ["gymA","biciZ2","gymB","biciSeries","gymC","biciLarga","movilidad"],
  overrides: { "2026-08-14": "descanso" },   // cambios puntuales de un día
}
```

Sesiones válidas: `gymA`, `gymB`, `gymC`, `biciZ2`, `biciSeries`, `biciLarga`,
`movilidad`, `descanso`.

Refactoriza `entrenoDe(sem, dia)` a `entrenoDe(sem, dia, config, fechaISO)`:
resuelve primero `overrides[fecha]`, luego `plantilla[dia]`, y devuelve el mismo objeto
de siempre (`{ tipo, titulo, sub, lista, min }`) leyendo de `GYM`, `SERIES` y `BICI`
según la semana. La progresión por semana no cambia: sigue viniendo del índice de semana.

### 2.2 Interfaz

En la pestaña Perfil (o Ajustes), sección "Semana de entrenamiento": siete filas, una
por día, cada una con un selector de sesión. Debajo, la gráfica `Carga` en vivo para que
el usuario vea el efecto de lo que está moviendo.

Desde Hoy, un control discreto para cambiar solo el día actual — eso escribe en
`overrides`, no en la plantilla. Debe quedar claro cuál de las dos cosas está haciendo.

### 2.3 Avisos, no bloqueos

Muestra advertencias en texto tenue, nunca impidas guardar:

- Tres o más días duros seguidos (gym o bici de intensidad, sin `movilidad`/`descanso`).
- Salida larga inmediatamente después del día de series.
- Cero días de descanso o movilidad en la semana.
- Menos de dos sesiones de bici, teniendo en cuenta que el bloque apunta a ciclismo.

### 2.4 Dependencias que hay que desacoplar

Hay lógica que asume el reparto viejo. Búscala toda y hazla depender de la configuración:

- En `tareasDe()`, la tarea `r2` ("Comer antes y durante") está condicionada a
  `dia === 5 || (dia === 3 && sem === 4)`. Debe dispararse cuando la sesión resuelta sea
  `biciLarga`, o cuando `min >= 90`.
- La gráfica `Carga` debe leer la configuración.
- El aviso de pre-entreno en Mesa, igual.
- La cena del miércoles de la semana 2 dice "si entrenas más de 90 min, C completo".
  Esa condición ahora se puede evaluar de verdad contra los minutos del día: muéstrala
  resuelta, e indica cuál de las dos versiones aplica.

### Criterios de aceptación · tarea 2

- [ ] Cambiar la plantilla se refleja en Hoy, en Plan y en las dos gráficas de carga.
- [ ] Un override afecta un solo día y no toca la plantilla.
- [ ] Las advertencias aparecen y desaparecen correctamente, sin bloquear nada.
- [ ] Con el reparto por defecto, la app se comporta exactamente igual que hoy.

---

## Tarea 3 · Publicación en Azure Static Web Apps

El usuario es arquitecto de soluciones en Azure: no necesita explicaciones de qué es un
resource group, sí necesita que el pipeline quede limpio y reproducible.

### 3.1 Reorganizar el build

Hoy el bundle y los assets viven en la raíz. Sepáralos:

- `src/` — fuente.
- `public/` — `index.html`, `manifest.webmanifest`, `sw.js`, iconos.
- `dist/` — salida del build, ignorada en git.

Scripts en `package.json`:

```json
{
  "scripts": {
    "build": "node build.mjs",
    "dev": "node build.mjs --watch",
    "preview": "npx serve dist"
  }
}
```

`build.mjs` limpia `dist/`, copia `public/`, corre esbuild con sourcemap solo en dev, y
**estampa un número de versión en `sw.js`** (reemplaza el literal `fundamento-v2` por
`fundamento-<timestamp>`). Ese es el bug clásico de las PWA: sin esto el usuario se queda
con la versión vieja en el teléfono.

### 3.2 `staticwebapp.config.json` en la raíz

Debe cubrir:

- `navigationFallback` a `/index.html`, excluyendo `/*.{js,json,png,webmanifest,ico,map}`.
- `mimeTypes`: `.webmanifest` → `application/manifest+json`.
- Cache: `sw.js` y `index.html` con `Cache-Control: no-cache`; el resto con cache larga.
  El bundle tiene nombre estable, así que si prefieres cache larga en `app.js`, entonces
  hashea el nombre en el build y actualiza las referencias en `index.html` y `sw.js`.
- `globalHeaders` con `X-Content-Type-Options: nosniff` y una CSP que permita
  `fonts.googleapis.com` y `fonts.gstatic.com` — la app carga tipografías de ahí.

### 3.3 Pipeline

Genera `.github/workflows/azure-static-web-apps.yml`:

- Dispara en push a `main` y en pull request.
- Node 20, `npm ci`, `npm run build`.
- Acción `Azure/static-web-apps-deploy@v1` con `app_location: "/"`,
  `output_location: "dist"`, `skip_app_build: true`, `api_location: ""`.
- Token desde `secrets.AZURE_STATIC_WEB_APPS_API_TOKEN`.
- Job de cierre de entorno para PR cerrados.

Deja también la alternativa manual documentada, para publicar sin repositorio:

```
npm i -D @azure/static-web-apps-cli
npx swa deploy ./dist --env production
```

### 3.4 Lo que necesito que me digas, no que hagas

No ejecutes nada contra mi suscripción. Al terminar, escribe en el README los pasos
exactos que me tocan a mí: crear la Static Web App (plan Free basta), obtener el
deployment token, guardarlo como secret, y qué revisar si el despliegue sale verde pero
la app carga en blanco.

### 3.5 Sincronización entre dispositivos — opcional, detrás de bandera

Si el tiempo alcanza, prepara la capa pero **no la actives por defecto**. La app es
offline-first y debe seguir funcionando sin red y sin cuenta.

- Autenticación integrada de Static Web Apps con Entra ID, leyendo `/.auth/me`.
- Una Azure Function en `api/` con `GET /api/estado` y `PUT /api/estado`, que guarde el
  JSON completo en Table Storage o Cosmos DB, particionado por el `userId` que entrega
  la autenticación integrada.
- En el cliente: extender el objeto `store` con un tercer backend `nube`, que escribe
  local primero y sincroniza después, con `updatedAt` y resolución por "gana el más
  reciente". Sin cola de reintentos elaborada — un solo usuario, un dispositivo a la vez.
- Bandera en Perfil: "Sincronizar entre mis dispositivos", apagada de fábrica.

### Criterios de aceptación · tarea 3

- [ ] `npm run build` produce un `dist/` desplegable, sin pasos manuales.
- [ ] Publicar una versión nueva actualiza el teléfono sin desinstalar la app.
- [ ] La app instalada abre en modo avión.
- [ ] El README explica el despliegue completo desde cero.

---

## Cómo quiero que trabajes

1. Una rama por tarea: `feat/perfil-comidas`, `feat/entreno-configurable`,
   `feat/azure-swa`. Commits pequeños y descriptivos, en español.
2. Empieza por la tarea 2: es la más acotada y toca la misma función que la 1 va a
   consumir. Luego la 1, y la 3 de última.
3. Antes de escribir código en cada tarea, dime en tres líneas cómo la vas a abordar y
   qué archivos vas a tocar. Si algo de este brief está ambiguo, pregúntame en vez de
   asumir.
4. Al terminar cada tarea, compila y dame una lista de qué probar a mano.
5. No cambies el plan de alimentación, los ejercicios, el temario de estudio ni los
   textos de los saboteadores. Ese contenido viene de fuentes que no son negociables:
   la nutricionista, el temario oficial del examen y el trabajo personal del usuario.
6. Si encuentras un bug de lo que ya existe, avísame antes de arreglarlo.
