import React from "react";
import { useApp } from "../data/AppContext";

function tempsRelatif(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

// Petit point vert/gris sur l'avatar
export function PointEnLigne({ profilId, taille = 10 }) {
  const { estEnLigne } = useApp();
  if (!estEnLigne(profilId)) return null;
  return (
    <span style={{
      position: "absolute", bottom: 0, right: 0,
      width: taille, height: taille, borderRadius: "50%",
      background: "#22c55e", border: "2px solid #fff",
      boxShadow: "0 0 0 1px rgba(34,197,94,.3)",
    }} />
  );
}

// Texte "En ligne" ou "Vu il y a X"
export function TexteActivite({ profilId, className }) {
  const { estEnLigne, derniereActivite } = useApp();
  const enLigne = estEnLigne(profilId);
  const ts = derniereActivite(profilId);
  if (enLigne) return <span className={className} style={{ color: "#22c55e", fontWeight: 600 }}>En ligne</span>;
  if (!ts) return <span className={className} style={{ color: "var(--text-muted)" }}>Hors ligne</span>;
  return <span className={className} style={{ color: "var(--text-muted)" }}>Vu {tempsRelatif(ts)}</span>;
}
