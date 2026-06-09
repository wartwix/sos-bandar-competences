import React from "react";

function APropos() {
  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <h1 className="fw-bold mb-3">A propos de SOS Bandar Competences</h1>
      <p>
        SOS Bandar Competences est une application de mise en relation entre personnes
        souhaitant <strong>echanger ou proposer des competences</strong> : cours particuliers,
        sport, renovation, bricolage, cuisine, musique, langues et bien plus.
      </p>
      <p>
        Le principe s'inspire des applications de rencontre : chaque utilisateur cree un profil
        avec ses photos et une <strong>etiquette de competences</strong>. On parcourt ensuite les
        profils situes <strong>autour de soi</strong>, dans un rayon defini en kilometres, calcule
        a partir de la grande ville la plus proche.
      </p>
      <p>
        Chaque profil peut etre <strong>note (etoiles)</strong> et <strong>commente</strong> par la
        communaute, pour favoriser la confiance et la qualite des echanges.
      </p>
      <h4 className="fw-bold mt-4">Public cible</h4>
      <p>Etudiants, particuliers, voisins et toute personne souhaitant rendre service ou apprendre pres de chez elle.</p>
      <h4 className="fw-bold mt-4">Technologies</h4>
      <p>React, React Router, Bootstrap 5, JavaScript, CSS, et stockage local du navigateur (localStorage).</p>
    </div>
  );
}

export default APropos;
