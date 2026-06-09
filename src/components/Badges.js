import React from "react";
import { useApp } from "../data/AppContext";

export default function Badges({ profilId, taille = "normal" }) {
  const { badgesProfil } = useApp();
  const badges = badgesProfil(profilId);
  if (!badges.length) return null;

  const styles = taille === "compact" ? {
    padding: "2px 8px", fontSize: ".68rem", gap: 4,
  } : {
    padding: "3px 10px", fontSize: ".75rem", gap: 5,
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {badges.map(b => (
        <span key={b.id} title={b.desc} style={{
          background: `${b.couleur}1a`,
          color: b.couleur,
          border: `1.5px solid ${b.couleur}33`,
          borderRadius: 12,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          ...styles,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: b.couleur, display: "inline-block" }} />
          {b.label}
        </span>
      ))}
    </div>
  );
}
