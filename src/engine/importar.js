/* ==========================================================================
   Importación de .gpx / .tcx — parseo en cliente con DOMParser, sin
   dependencias nuevas. .fit (binario, formato propietario Garmin) queda
   fuera: parsearlo a mano es alto riesgo, y traer una librería para eso
   solo se justifica si de verdad hace falta — se documenta, no se calla.
   ========================================================================== */

export function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180, la2 = b.lat * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function resumenDePuntos(puntos) {
  if (!puntos.length) return null;
  const conTiempo = puntos.filter((p) => p.tiempo);
  const duracionMin = conTiempo.length >= 2
    ? Math.round((conTiempo[conTiempo.length - 1].tiempo - conTiempo[0].tiempo) / 60000)
    : null;

  let distanciaKm = 0;
  const tienenDistanciaExplicita = puntos.some((p) => p.distanciaAcum != null);
  if (tienenDistanciaExplicita) {
    const ultima = [...puntos].reverse().find((p) => p.distanciaAcum != null);
    distanciaKm = ultima ? ultima.distanciaAcum / 1000 : 0;
  } else {
    for (let i = 1; i < puntos.length; i++) {
      if (puntos[i].lat != null && puntos[i - 1].lat != null) distanciaKm += haversineKm(puntos[i - 1], puntos[i]);
    }
  }

  let elevacionGanadaM = 0;
  for (let i = 1; i < puntos.length; i++) {
    if (puntos[i].ele != null && puntos[i - 1].ele != null) {
      const d = puntos[i].ele - puntos[i - 1].ele;
      if (d > 0) elevacionGanadaM += d;
    }
  }

  const fcs = puntos.map((p) => p.hr).filter((v) => v != null);
  const fcMedia = fcs.length ? Math.round(fcs.reduce((a, b) => a + b, 0) / fcs.length) : null;
  const fcMax = fcs.length ? Math.max(...fcs) : null;

  return {
    duracionMin,
    distanciaKm: Math.round(distanciaKm * 100) / 100,
    elevacionGanadaM: Math.round(elevacionGanadaM),
    fcMedia,
    fcMax,
    puntos: puntos.length,
  };
}

function num(v) { const n = parseFloat(v); return Number.isNaN(n) ? null : n; }

function parseGPX(doc) {
  const puntos = [...doc.getElementsByTagName("trkpt")].map((pt) => {
    const ele = pt.getElementsByTagName("ele")[0];
    const time = pt.getElementsByTagName("time")[0];
    const hrNode = pt.getElementsByTagName("hr")[0]; // gpxtpx:hr — getElementsByTagName ignora el prefijo del namespace
    return {
      lat: num(pt.getAttribute("lat")),
      lon: num(pt.getAttribute("lon")),
      ele: ele ? num(ele.textContent) : null,
      tiempo: time ? new Date(time.textContent) : null,
      hr: hrNode ? num(hrNode.textContent) : null,
      distanciaAcum: null,
    };
  });
  return resumenDePuntos(puntos);
}

function parseTCX(doc) {
  const puntos = [...doc.getElementsByTagName("Trackpoint")].map((pt) => {
    const time = pt.getElementsByTagName("Time")[0];
    const alt = pt.getElementsByTagName("AltitudeMeters")[0];
    const dist = pt.getElementsByTagName("DistanceMeters")[0];
    const hr = pt.getElementsByTagName("Value")[0]; // dentro de HeartRateBpm
    const pos = pt.getElementsByTagName("Position")[0];
    const lat = pos ? pos.getElementsByTagName("LatitudeDegrees")[0] : null;
    const lon = pos ? pos.getElementsByTagName("LongitudeDegrees")[0] : null;
    return {
      lat: lat ? num(lat.textContent) : null,
      lon: lon ? num(lon.textContent) : null,
      ele: alt ? num(alt.textContent) : null,
      tiempo: time ? new Date(time.textContent) : null,
      hr: hr ? num(hr.textContent) : null,
      distanciaAcum: dist ? num(dist.textContent) : null,
    };
  });
  return resumenDePuntos(puntos);
}

/* texto: contenido crudo del archivo (string). Devuelve el resumen o null si el
   formato no se reconoce (por ejemplo, un .fit binario). */
export function importarActividad(texto) {
  let doc;
  try {
    doc = new DOMParser().parseFromString(texto, "application/xml");
  } catch (e) {
    return null;
  }
  if (doc.getElementsByTagName("parsererror").length) return null;
  if (doc.getElementsByTagName("trkpt").length) return parseGPX(doc);
  if (doc.getElementsByTagName("Trackpoint").length) return parseTCX(doc);
  return null;
}
