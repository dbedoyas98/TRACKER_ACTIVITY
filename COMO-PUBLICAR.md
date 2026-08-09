# Fundamento · cómo publicarla

Este paquete es la app completa, ya compilada. No necesita servidor, base de datos ni
llaves. Son archivos estáticos: donde los subas, funciona.

Tus datos se guardan en el navegador del dispositivo donde la uses (`localStorage`).
Eso significa que **no se sincronizan solos entre el celular y el computador**. Usa uno
como principal — el celular — y respalda desde Ajustes cuando quieras.

---

## Opción 1 · GitHub Pages (la misma ruta de HardFlex)

1. Crea un repositorio nuevo, público, llamado `fundamento`.
2. Sube **el contenido** de esta carpeta a la raíz del repo: `index.html`, `app.js`,
   `sw.js`, `manifest.webmanifest` y los tres `.png`. No subas `src/`, `node_modules/`
   ni los `package*.json`: son solo para recompilar.
3. Settings → Pages → Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.
4. En un par de minutos queda en `https://TUUSUARIO.github.io/fundamento/`.

## Opción 2 · Netlify Drop (sin repositorio, 30 segundos)

1. Entra a `app.netlify.com/drop`.
2. Arrastra la carpeta con estos archivos.
3. Te devuelve una URL al instante. Con cuenta gratis le pones nombre fijo.

## Opción 3 · Vercel

`npm i -g vercel` y luego `vercel` dentro de la carpeta. Acepta los valores por defecto.

---

## Instalarla en el teléfono

- **Android / Chrome:** abre la URL → menú de tres puntos → *Instalar aplicación*.
- **iPhone / Safari:** abre la URL → botón compartir → *Agregar a inicio*.

Queda con icono propio, sin barra de navegador, y abre sin señal gracias al service worker.

## Cuando quieras cambiar algo

El código fuente está en `src/App.jsx`. Para recompilar:

```
npm install
npx esbuild src/main.jsx --bundle --minify --format=iife --loader:.jsx=jsx \
  --define:process.env.NODE_ENV='"production"' --outfile=app.js
```

Después de publicar cambios, sube el número de `CACHE` en `sw.js` (por ejemplo a
`fundamento-v3`). Si no lo haces, el teléfono te sigue mostrando la versión vieja.

## Si algún día quieres sincronizar entre dispositivos

Ahí sí necesitas backend. Lo más corto es Supabase o Firebase: una tabla con tu usuario
y un campo JSON, y cambiar la capa `store` que está al inicio de `src/App.jsx` por
lecturas y escrituras contra esa tabla. El resto de la app no se toca — todo el estado
pasa por ahí.
