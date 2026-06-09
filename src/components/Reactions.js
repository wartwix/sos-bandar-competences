import React, { useState } from "react";
import { useApp, MOI_ID } from "../data/AppContext";

const REACTIONS_DISPO = [
  { type: "coeur", char: "♥", couleur: "#ec4899" },
  { type: "pouce", char: "+",  couleur: "#3b82f6" },
  { type: "rire",  char: "ha", couleur: "#f59e0b" },
  { type: "wow",   char: "!",  couleur: "#8b5cf6" },
];

export default function Reactions({ msgId, isMe }) {
  const { reactions, toggleReaction } = useApp();
  const [open, setOpen] = useState(false);
  const mes = reactions[String(msgId)] || [];

  // Agrège par type
  const counts = {};
  mes.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
  const aFait = (type) => mes.some(r => r.type === type && r.par === MOI_ID);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Réactions existantes */}
      {Object.keys(counts).length > 0 && (
        <div style={{
          position: "absolute",
          bottom: -10,
          [isMe ? "left" : "right"]: 8,
          background: "var(--bg-card)",
          border: "1.5px solid var(--border)",
          borderRadius: 12,
          padding: "2px 6px",
          fontSize: ".7rem",
          display: "flex",
          gap: 4,
          boxShadow: "var(--shadow-sm)",
        }}>
          {Object.entries(counts).map(([type, n]) => {
            const r = REACTIONS_DISPO.find(x => x.type === type);
            if (!r) return null;
            return (
              <span key={type} style={{ color: aFait(type) ? r.couleur : "var(--text)", fontWeight: aFait(type) ? 700 : 500 }}>
                <span>{r.char}</span>{n > 1 && <span style={{ marginLeft: 2 }}>{n}</span>}
              </span>
            );
          })}
        </div>
      )}

      {/* Bouton ajouter réaction */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: "transparent", border: "none", color: "var(--text-muted)",
          fontSize: ".85rem", cursor: "pointer", padding: "2px 4px", opacity: .5,
        }}
        title="Réagir"
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = .5}
      >
        ...
      </button>

      {/* Picker */}
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
          <div style={{
            position: "absolute",
            top: -38,
            [isMe ? "right" : "left"]: 0,
            background: "var(--bg-card)",
            border: "1.5px solid var(--border)",
            borderRadius: 20,
            padding: "4px 8px",
            display: "flex",
            gap: 6,
            boxShadow: "var(--shadow-md)",
            zIndex: 101,
          }}>
            {REACTIONS_DISPO.map(r => (
              <button
                key={r.type}
                onClick={() => { toggleReaction(msgId, r.type); setOpen(false); }}
                style={{
                  background: aFait(r.type) ? `${r.couleur}22` : "transparent",
                  border: "none", borderRadius: "50%",
                  width: 28, height: 28, cursor: "pointer",
                  color: r.couleur, fontWeight: 700, fontSize: ".82rem",
                  transition: "background .15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${r.couleur}33`}
                onMouseLeave={e => e.currentTarget.style.background = aFait(r.type) ? `${r.couleur}22` : "transparent"}
              >
                {r.char}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
