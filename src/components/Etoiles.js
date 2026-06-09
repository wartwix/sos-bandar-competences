import React, { useState } from "react";

// note : valeur courante. editable : true => permet de cliquer pour noter.
function Etoiles({ note = 0, editable = false, onChange, taille = "1.2rem" }) {
  const [survol, setSurvol] = useState(0);
  const valeurAffichee = survol || note;

  return (
    <span className="etoiles" aria-label={`Note ${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          role={editable ? "button" : undefined}
          style={{ cursor: editable ? "pointer" : "default", fontSize: taille, color: i <= valeurAffichee ? "#ffc107" : "#d0d0d0" }}
          onClick={() => editable && onChange && onChange(i)}
          onMouseEnter={() => editable && setSurvol(i)}
          onMouseLeave={() => editable && setSurvol(0)}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default Etoiles;
