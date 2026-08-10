# Fundamento

App personal de seguimiento de un bloque de 28 días — Mesa (alimentación), Ruta
(entrenamiento), Taller (estudio AI-103), Oficio (trabajo) y Mente (saboteadores).

React 18 sin router ni librería de estado, un componente grande en `src/App.jsx`,
CSS-in-JS, gráficas en SVG a mano. PWA offline-first: los datos viven en
`localStorage` del dispositivo, no hay backend por defecto.

## Estructura

```
src/            fuente (App.jsx, comidas.js, data/)
public/         estáticos: index.html, manifest, sw.js, register-sw.js, íconos
dist/           salida del build (git-ignorado, se regenera)
build.mjs       build con esbuild
staticwebapp.config.json   config de Azure Static Web Apps
.github/workflows/azure-static-web-apps.yml
```

## Desarrollo

```
npm install
npm run dev       # build sin minificar, con sourcemap, observa cambios en src/
npm run build     # build de producción a dist/
npm run preview   # sirve dist/ en local (npx serve)
```

`npm run dev` no observa cambios en `public/` — si tocas `index.html`, `sw.js` u
otro estático, reinicia el comando.

Cada build hashea el contenido de `app.js` (`dist/app.<hash>.js`), actualiza la
referencia en `index.html`, y estampa un `CACHE` nuevo (con timestamp) en
`sw.js`. Sin esto el teléfono se queda con la versión vieja instalada.

## Publicar en GitHub Pages

Es la vía activa hoy. El workflow (`.github/workflows/github-pages.yml`) corre
`npm ci && npm test && npm run build` y publica `dist/` — no se comitea el
build a ninguna rama, lo genera la Action en cada push.

Dispara en push a `feat/optimizacion-total` (no a `main`, a propósito: esa
rama tiene todo el trabajo de esta sesión y `main` se dejó sin tocar). Pasos
que te tocan a ti:

1. Crea el repo vacío en GitHub (sin README/licencia/gitignore — ya los
   tenemos localmente): `github.com/new`.
2. Pásame la URL (`https://github.com/tuusuario/turepo.git`) para que yo
   agregue el remoto y suba las ramas.
3. En el repo → *Settings* → *Pages* → *Build and deployment* → *Source*:
   elige **GitHub Actions** (no "Deploy from a branch" — esa opción serviría
   contenido del repo tal cual, y `dist/` no está comiteado).
4. El primer push a `feat/optimizacion-total` dispara el deploy. La URL queda
   en `https://tuusuario.github.io/turepo/` (o la que muestre el job
   `deploy` al terminar).

Como todas las rutas del build son relativas (`./app.js`, `./sw.js`, etc.),
funciona igual en la raíz de un dominio que en un subdirectorio como
`/turepo/` — no hace falta configurar ningún `base path`.

Para publicar cambios nuevos después: push a `feat/optimizacion-total` y listo,
el workflow reconstruye y redespliega solo.

## Publicar en Azure Static Web Apps

El repo ya trae el workflow (`.github/workflows/azure-static-web-apps.yml`) y la
config (`staticwebapp.config.json`). Lo que falta es crear el recurso y conectar
el token — no lo ejecuté yo, esto te toca a ti:

### 1. Crear la Static Web App (plan Free)

```
az staticwebapp create \
  --name fundamento \
  --resource-group <tu-rg> \
  --location eastus2 \
  --sku Free
```

No la vincules a un repo de GitHub durante la creación (o si el wizard del
portal te obliga, bórrale después el workflow que genera automáticamente):
el repo ya tiene el suyo, y con `skip_app_build: true` Azure no debe intentar
buildear nada por su cuenta.

### 2. Obtener el deployment token

```
az staticwebapp secrets list \
  --name fundamento \
  --query "properties.apiKey" -o tsv
```

Portal equivalente: la SWA → *Overview* → *Manage deployment token*.

### 3. Guardarlo como secret del repo

```
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body "<token>"
```

Portal equivalente: repo → *Settings* → *Secrets and variables* → *Actions* →
*New repository secret*, mismo nombre.

### 4. Publicar

Push a `main` (o abre un PR: el workflow crea un entorno de preview y lo cierra
al mergear/cerrar el PR). El job corre `npm ci && npm run build` y sube `dist/`.

### Si el despliegue queda verde pero la app carga en blanco

- **Consola del navegador primero.** Un 404 en `app.<hash>.js` casi siempre es
  `app_location`/`output_location` mal apuntado, o `staticwebapp.config.json`
  fuera de la raíz del repo (tiene que vivir junto a `package.json`, no en
  `public/` ni `dist/` — Azure lo lee desde `app_location`, que es `"/"`).
- **CSP.** Si la consola marca bloqueos de `Content-Security-Policy`: la CSP
  de `staticwebapp.config.json` solo permite `fonts.googleapis.com` y
  `fonts.gstatic.com`. Si agregas un origen externo nuevo (otra fuente, un
  script de terceros), hay que sumarlo ahí o se bloquea en silencio.
- **Service worker con caché vieja.** DevTools → *Application* → *Service
  Workers*: confirma que el `CACHE` activo coincide con el timestamp del
  build actual. Si no, hard refresh o *Unregister* manual.
- **`navigationFallback` no cubre una extensión nueva.** Si agregas un tipo de
  archivo estático distinto a `.js/.json/.png/.webmanifest/.ico/.map`, súmalo
  a `exclude` en `staticwebapp.config.json` o Azure lo va a redirigir a
  `index.html` en vez de servirlo.

## Publicar sin repositorio (manual)

```
npm i -D @azure/static-web-apps-cli
npm run build
npx swa deploy ./dist --env production --deployment-token <token>
```

## Otras opciones sin Azure ni GitHub Actions

Sirve archivos estáticos puros — cualquier host de sitios estáticos funciona
con el contenido de `dist/` tras `npm run build`:

- **Netlify Drop:** arrastra `dist/` a `app.netlify.com/drop`.
- **Vercel:** `vercel --prod` apuntando a `dist/` como output.

## PWA / offline

La app instalada abre sin red: `sw.js` precachea el shell (`index.html`,
`app.<hash>.js`, `register-sw.js`, manifest, íconos) y responde desde caché
cuando no hay conexión, refrescando en segundo plano cuando sí la hay.

**Android/Chrome:** menú ⋮ → *Instalar aplicación*.
**iPhone/Safari:** compartir → *Agregar a inicio*.

## Datos y sincronización

Todo el estado pasa por el objeto `store` al inicio de `src/App.jsx` y se
guarda en `localStorage`. No hay sincronización entre dispositivos: usa uno
como principal y respalda desde Perfil → *Descargar respaldo* cuando quieras
pasar el historial a otro equipo.
