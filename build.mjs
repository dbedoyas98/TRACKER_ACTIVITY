import * as esbuild from "esbuild";
import { existsSync, rmSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "fs";
import { createHash } from "crypto";

const DEV = process.argv.includes("--watch");
const OUTDIR = "dist";

function limpiarYCopiarPublic() {
  if (existsSync(OUTDIR)) rmSync(OUTDIR, { recursive: true });
  mkdirSync(OUTDIR);
  cpSync("public", OUTDIR, { recursive: true });
}

/* Hashea el contenido del bundle para poder cachearlo largo, actualiza la referencia
   en index.html, y estampa un CACHE nuevo en sw.js — sin esto el teléfono se queda
   con la versión vieja tras publicar. */
const estampar = {
  name: "estampar",
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length) return;
      const jsFile = result.outputFiles.find((f) => f.path.endsWith(".js"));
      const mapFile = result.outputFiles.find((f) => f.path.endsWith(".map"));

      const hash = createHash("sha1").update(jsFile.contents).digest("hex").slice(0, 10);
      const nombreBundle = `app.${hash}.js`;

      let jsTexto = jsFile.text;
      if (mapFile) {
        jsTexto = jsTexto.replace(/\/\/# sourceMappingURL=.*/, `//# sourceMappingURL=${nombreBundle}.map`);
        writeFileSync(`${OUTDIR}/${nombreBundle}.map`, mapFile.contents);
      }
      writeFileSync(`${OUTDIR}/${nombreBundle}`, jsTexto);

      let html = readFileSync(`${OUTDIR}/index.html`, "utf8");
      html = html.replace(/src="app(\.[0-9a-f]+)?\.js"/, `src="${nombreBundle}"`);
      writeFileSync(`${OUTDIR}/index.html`, html);

      const cacheVersion = `fundamento-${Date.now()}`;
      let sw = readFileSync(`${OUTDIR}/sw.js`, "utf8");
      sw = sw.replace(/"fundamento-[^"]*"/, `"${cacheVersion}"`);
      sw = sw.replace(/"\.\/app(\.[0-9a-f]+)?\.js"/, `"./${nombreBundle}"`);
      writeFileSync(`${OUTDIR}/sw.js`, sw);

      console.log(`[build] dist/${nombreBundle} · sw cache ${cacheVersion}`);
    });
  },
};

limpiarYCopiarPublic();

const ctx = await esbuild.context({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: !DEV,
  sourcemap: DEV,
  format: "iife",
  loader: { ".jsx": "jsx" },
  define: { "process.env.NODE_ENV": JSON.stringify(DEV ? "development" : "production") },
  outdir: OUTDIR,
  entryNames: "app.tmp",
  write: false,
  plugins: [estampar],
});

if (DEV) {
  await ctx.watch();
  console.log("[build] observando cambios en src/ … (los cambios en public/ requieren reiniciar)");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  process.exit(0);
}
