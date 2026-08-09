# Plan de diseño — Fase 0

Formaliza en variables CSS (una sola fuente de verdad, en la constante `CSS` de
`src/App.jsx`, sección `:root`/`.fd`). No hay preprocesador ni build step de CSS —
el "mixin" del corte de esquina se resuelve con una clase utilitaria única
(`.cut`) parametrizada por variable, no repitiendo `clip-path` por selector.

## Color

Roles explícitos, no nombres de color:

| Token | Valor | Rol |
|---|---|---|
| `--bg` | `#050B12` | Fondo base |
| `--surface` | `rgba(13,26,42,.72)` | Superficie elevada (paneles) — ya existía como `--panel` |
| `--surface-2` | `rgba(20,38,58,.6)` | Superficie elevada, un nivel más (inputs, tracks) |
| `--line` | `#16324A` | Borde de 1 px — el sistema de elevación es borde + cambio de superficie, sin sombras difusas |
| `--text` | `#DCEBF7` | Texto primario |
| `--text-dim` | `#6E90AB` | Texto secundario |
| `--text-dimmer` | `#3E5B75` | Texto terciario / deshabilitado |
| `--accent` | `#22E0D6` (ruta) | Acento neón — un elemento por pantalla, máximo dos |

Escala semántica de carga (nueva, para el motor de la fase 2), separada de los colores
de pilar:

| Token | Valor | Significado |
|---|---|---|
| `--load-low` | `#4D8DFF` | Forma fresca / carga baja |
| `--load-optimal` | `#22E0D6` | Zona productiva |
| `--load-high` | `#FFB020` | Monotonía alta / acercándose al límite |
| `--load-danger` | `#FF5C8A` | Salto agudo:crónico > 1.5 o fatiga sin descarga |

Colores de pilar (`--mesa`, `--ruta`, `--taller` — antes `--taller` no existía como tal,
hoy Ruta cubre bici+gym; al dividir en fase 4 se necesita un color propio para Taller/
gimnasio, distinto de Ruta/bici) `--oficio`, `--mente` se conservan tal cual — ya
cumplen "4-6 hex nombrados con rol".

## Tipografía

Escala modular declarada (base 14px, ratio 1.2), rol fijo por paso:

| Token | Tamaño | Rol | Familia |
|---|---|---|---|
| `--fs-display` | 34px | Número héroe (disposición, anillos) | Chakra Petch 700 |
| `--fs-h1` | 28px | Título de pantalla | Chakra Petch 700 |
| `--fs-h2` | 16px | Título de sección/pilar | Chakra Petch 600 |
| `--fs-body` | 14px | Cuerpo | Archivo 400/500 |
| `--fs-label` | 10.5px | Etiqueta, mono, tracking amplio | IBM Plex Mono 500 |
| `--fs-data` | 12.5px | Dato numérico en tabla/lista | IBM Plex Mono 500, `tabular-nums` |

Regla dura: todo número que se actualiza en vivo (contadores, gramos, minutos, streaks)
lleva `font-variant-numeric: tabular-nums` — se declara una clase `.num` y se aplica,
no se repite la propiedad suelta.

## Espaciado

Escala de 4px sin excepciones: `--sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px;
--sp-5:24px; --sp-6:32px; --sp-7:48px;`. Los valores sueltos que hoy existen en la app
(`9px`, `14px`, `15px`, `18px`...) se normalizan al paso más cercano de la escala
durante la fase 1, sin cambiar la sensación visual de forma perceptible.

## Radio / corte de esquina

Una sola clase utilitaria en vez del `clip-path` repetido por selector:

```css
.cut { --cut: var(--cut-size, 10px);
  clip-path: polygon(0 var(--cut), var(--cut) 0, 100% 0,
    100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%); }
```

`--cut-size` se ajusta por componente (`--cut-size:10px` en `.pane`, `5px` en `.chk .box`,
`6px`/`7px` en pills/botones), y cada selector solo declara `--cut-size` en vez de
repetir el polígono completo.

## Elevación

Ya coincide con lo que pide el prompt: borde de 1px (`--line`) + cambio de superficie
(`--surface`/`--surface-2`), sin `box-shadow` difuso. Se mantiene, solo se documenta
como regla explícita en vez de convención implícita.

## Movimiento

| Token | Valor |
|---|---|
| `--dur-fast` | 150ms |
| `--dur-base` | 220ms |
| `--ease` | `cubic-bezier(.2,.7,.3,1)` — salida rápida, llegada suave |

`prefers-reduced-motion` ya está respetado globalmente (`.fd * { transition:none
!important; animation:none !important; }`) — se conserva y se extiende a cualquier
animación nueva (cierre del día, conteo de números).

## Elemento firma

Se acepta la propuesta del prompt: el perfil de etapa de 28 días se rediseña para que
la **altura** de cada tramo sea la carga del día (del motor de la fase 2, no minutos
crudos) y el **color** sea la adherencia — se lee como una etapa de montaña. Reemplaza
a `PerfilEtapa` en fase 5, una vez el motor de carga exista (fase 2) — antes no hay con
qué calcular la altura.

## Piso de calidad — verificación, no solo declaración

360px de ancho, foco visible, contraste AA, targets de 44px: se agregan como checklist
manual al final de cada fase (no hay herramienta de contraste automatizada en este
proyecto — se verifica a ojo con los hex reales contra `--bg`/`--surface`).
