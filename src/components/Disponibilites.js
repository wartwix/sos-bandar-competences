import React from "react";

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const JOURS_LONG = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const CRENEAUX = [
  { id: "matin", label: "Matin" },
  { id: "aprem", label: "Après-midi" },
  { id: "soir",  label: "Soir" },
];

// dispos = { "0_matin": true, "1_aprem": true, ... } (0 = lundi)

export function GrilleDispos({ dispos = {}, onChange, lecture = false }) {
  const toggle = (jour, creneau) => {
    if (lecture) return;
    const cle = `${jour}_${creneau}`;
    const next = { ...dispos };
    if (next[cle]) delete next[cle];
    else next[cle] = true;
    onChange(next);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "70px repeat(7, 1fr)", gap: 4, fontSize: ".8rem" }}>
      <div></div>
      {JOURS.map((j, i) => (
        <div key={i} style={{ textAlign: "center", fontWeight: 700, color: "var(--text-muted)", padding: 4 }} title={JOURS_LONG[i]}>{j}</div>
      ))}
      {CRENEAUX.map(cr => (
        <React.Fragment key={cr.id}>
          <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", fontWeight: 600, fontSize: ".75rem" }}>{cr.label}</div>
          {JOURS.map((_, jour) => {
            const cle = `${jour}_${cr.id}`;
            const actif = dispos[cle];
            return (
              <div
                key={cle}
                onClick={() => toggle(jour, cr.id)}
                style={{
                  background: actif ? "var(--gradient)" : "var(--bg)",
                  border: `1.5px solid ${actif ? "transparent" : "var(--border)"}`,
                  borderRadius: 6,
                  height: 32,
                  cursor: lecture ? "default" : "pointer",
                  transition: "background .15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: actif ? "#fff" : "var(--text-muted)",
                  fontSize: ".7rem",
                  fontWeight: 700,
                }}
                title={`${JOURS_LONG[jour]} ${cr.label}`}
              >
                {actif ? "✓" : ""}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

// Sélection d'un créneau pour proposer un rdv
export function PickerCreneau({ dispos = {}, onSelect }) {
  const creneauxDispos = [];
  Object.keys(dispos).forEach(cle => {
    if (dispos[cle]) {
      const [jour, creneau] = cle.split("_");
      creneauxDispos.push({
        cle,
        jour: JOURS_LONG[parseInt(jour)],
        creneau: CRENEAUX.find(c => c.id === creneau)?.label || creneau,
      });
    }
  });

  if (creneauxDispos.length === 0) return (
    <p style={{ color: "var(--text-muted)", fontSize: ".88rem", fontStyle: "italic" }}>
      Aucune disponibilité renseignée.
    </p>
  );

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {creneauxDispos.map(({ cle, jour, creneau }) => (
        <button
          key={cle}
          onClick={() => onSelect({ cle, jour, creneau })}
          className="sbc-btn-outline btn"
          style={{ padding: "5px 12px", fontSize: ".82rem" }}
        >
          {jour} {creneau.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
