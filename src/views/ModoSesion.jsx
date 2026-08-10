import React, { useState, useEffect, useRef } from "react";
import { sugerirProgresion, esPR } from "../engine/progresion.js";

/* Modo en sesión: pensado para usarse con el teléfono en el suelo entre series.
   Tipografía enorme, un ejercicio a la vez, temporizador de descanso, avance
   al siguiente ejercicio con un toque. */

function Temporizador({ segundosIniciales = 90 }) {
  const [segundos, setSegundos] = useState(segundosIniciales);
  const [corriendo, setCorriendo] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!corriendo) return;
    ref.current = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(ref.current);
  }, [corriendo]);

  useEffect(() => { if (segundos === 0) setCorriendo(false); }, [segundos]);

  const mm = String(Math.floor(segundos / 60)).padStart(2, "0");
  const ss = String(segundos % 60).padStart(2, "0");

  return (
    <div className="pane block" style={{ textAlign: "center" }}>
      <span className="lbl">Descanso</span>
      <div className="num" style={{ fontFamily: "var(--disp)", fontSize: "var(--fs-display)", fontWeight: 700, margin: "6px 0", color: segundos === 0 ? "var(--load-danger)" : "var(--text)" }}>
        {mm}:{ss}
      </div>
      <div className="pills" style={{ justifyContent: "center" }}>
        <button className="pill" onClick={() => setSegundos((s) => Math.max(0, s - 15))}>−15 s</button>
        <button className="pill" data-on={corriendo ? 1 : 0} onClick={() => setCorriendo((c) => !c)}>{corriendo ? "Pausar" : "Iniciar"}</button>
        <button className="pill" onClick={() => setSegundos((s) => s + 15)}>+15 s</button>
        <button className="pill" onClick={() => { setCorriendo(false); setSegundos(segundosIniciales); }}>Reiniciar</button>
      </div>
    </div>
  );
}

export default function ModoSesion({ ejercicios, registroPrevio, seriesHoy, onRegistrarSerie, onSalir }) {
  const [idx, setIdx] = useState(0);
  const [peso, setPeso] = useState("");
  const [reps, setReps] = useState("");
  const [ultimoPR, setUltimoPR] = useState(false);

  const ejercicio = ejercicios[idx];
  const nombre = ejercicio[0];
  const detalle = ejercicio[1];
  const seriesRegistradas = (seriesHoy[nombre] && seriesHoy[nombre].series) || [];
  const historial = registroPrevio[nombre] || [];
  const ultimaSesion = historial[historial.length - 1];
  const sugerencia = sugerirProgresion(ultimaSesion);

  function registrar() {
    const p = parseFloat(peso), r = parseInt(reps, 10);
    if (Number.isNaN(p) || Number.isNaN(r)) return;
    const nuevaSerie = { peso: p, reps: r };
    const pr = esPR(historial, { series: [...seriesRegistradas, nuevaSerie] });
    setUltimoPR(pr);
    onRegistrarSerie(nombre, nuevaSerie);
    setReps("");
  }

  return (
    <div className="pane block">
      <div className="charthead">
        <b>Ejercicio {idx + 1} de {ejercicios.length}</b>
        <button onClick={onSalir} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--dim)" }}>Salir</button>
      </div>
      <div style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: "var(--fs-display)", lineHeight: 1.05, textTransform: "uppercase", marginTop: 8 }}>
        {nombre}
      </div>
      <p style={{ color: "var(--dim)", fontSize: 15, marginTop: 6 }}>{detalle}</p>

      <div className="note" style={{ marginTop: 10 }}>{sugerencia.motivo}</div>

      {ultimoPR && <div className="cap" style={{ borderColor: "var(--load-optimal)" }}><b style={{ color: "var(--load-optimal)" }}>Récord personal</b>Esa serie supera tu mejor marca registrada de este ejercicio.</div>}

      <div className="row" style={{ marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          <span className="lbl">Peso (kg)</span>
          <input className="fld num" inputMode="decimal" style={{ fontSize: 22, textAlign: "center" }}
            value={peso} placeholder={sugerencia.peso != null ? String(sugerencia.peso) : "0"} onChange={(e) => setPeso(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <span className="lbl">Repeticiones</span>
          <input className="fld num" inputMode="numeric" style={{ fontSize: 22, textAlign: "center" }}
            value={reps} placeholder={sugerencia.reps != null ? String(sugerencia.reps) : "0"} onChange={(e) => setReps(e.target.value)} />
        </div>
      </div>
      <button className="btn solid" onClick={registrar}>Registrar serie</button>

      {seriesRegistradas.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <span className="lbl">Series de hoy</span>
          {seriesRegistradas.map((s, i) => (
            <div className="li" key={i}><em>{String(i + 1).padStart(2, "0")}</em><span className="num">{s.peso} kg × {s.reps} reps</span></div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 14 }}><Temporizador /></div>

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn" disabled={idx === 0} onClick={() => setIdx((i) => Math.max(0, i - 1))}>Anterior</button>
        <button className="btn solid" disabled={idx === ejercicios.length - 1} onClick={() => setIdx((i) => Math.min(ejercicios.length - 1, i + 1))}>Siguiente ejercicio</button>
      </div>
    </div>
  );
}
