import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Etoiles from "./Etoiles";
import { useApp } from "../data/AppContext";

export default function CarteProfil({ profil, distance }) {
  const { noteMoyenne, avis, toggleFavori, estFavori } = useApp();
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);
  const isFav = estFavori(profil.id);

  // Photos : photo de profil + photos supplémentaires
  const photos = [];
  if (profil.photoProfil) photos.push(profil.photoProfil);
  if (profil.photos?.length) photos.push(...profil.photos);
  if (photos.length === 0) photos.push(`https://via.placeholder.com/600x800?text=${profil.prenom}`);

  const nbAvis = (avis[profil.id] || []).length;

  const photoSuivante = (e) => { e.stopPropagation(); setPhotoIndex(i => (i + 1) % photos.length); };
  const photoPrec = (e) => { e.stopPropagation(); setPhotoIndex(i => (i - 1 + photos.length) % photos.length); };

  return (
    <div className="carte-profil shadow" onClick={() => navigate(`/profil/${profil.id}`)}>
      <div className="carte-photo" style={{ backgroundImage: `url(${photos[photoIndex]})` }}>
        {/* Indicateurs photos */}
        {photos.length > 1 && (
          <>
            <div className="carte-indicateurs">
              {photos.map((_, i) => <span key={i} className={i === photoIndex ? "actif" : ""} />)}
            </div>
            <button className="nav-photo gauche" onClick={photoPrec}>‹</button>
            <button className="nav-photo droite" onClick={photoSuivante}>›</button>
          </>
        )}

        {/* Bouton favori */}
        <button
          onClick={e => { e.stopPropagation(); toggleFavori(profil.id); }}
          style={{
            position: "absolute", top: 12, right: 12,
            background: isFav ? "var(--rose)" : "rgba(0,0,0,.3)",
            border: "none", borderRadius: "50%", width: 36, height: 36,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", cursor: "pointer", backdropFilter: "blur(4px)",
            transition: "all .2s", color: "#fff",
          }}
          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFav ? "♥" : "♡"}
        </button>

        {/* Badge disponible */}
        {profil.disponible !== undefined && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: profil.disponible ? "rgba(34,197,94,.85)" : "rgba(100,100,100,.7)",
            backdropFilter: "blur(4px)", borderRadius: 20,
            padding: "3px 10px", fontSize: ".72rem", fontWeight: 700, color: "#fff",
          }}>
            {profil.disponible ? "● Disponible" : "○ Indispo"}
          </div>
        )}

        <div className="carte-degrade">
          <h3 className="mb-0" style={{ fontFamily: "'Syne', sans-serif" }}>{profil.prenom}, {profil.age}</h3>
          <div style={{ fontSize: ".82rem", opacity: .9, marginTop: 2 }}>
            {profil.ville}{distance != null && ` · ${distance} km`}
            {profil.tarif && <span style={{ marginLeft: 8 }}>· {profil.tarif}</span>}
          </div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <Etoiles note={noteMoyenne(profil.id)} />
            <span style={{ fontSize: ".75rem", opacity: .8 }}>({nbAvis} avis)</span>
          </div>
        </div>
      </div>
      <div className="carte-corps">
        <div className="mb-2">
          {profil.competences?.slice(0, 4).map((c, i) => <span key={i} className="sbc-badge me-1 mb-1">{c}</span>)}
        </div>
        <p style={{ fontSize: ".85rem", color: "var(--text-muted)", margin: 0 }}>
          {profil.bio?.slice(0, 80)}{profil.bio?.length > 80 ? "…" : ""}
        </p>
      </div>
    </div>
  );
}
