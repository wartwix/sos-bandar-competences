import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";
import Etoiles from "../components/Etoiles";

export default function Favoris() {
  const { profils, favoris, toggleFavori, noteMoyenne, avis, envoyerMessage } = useApp();
  const navigate = useNavigate();

  const profilsFavoris = profils.filter(p => favoris.includes(String(p.id)));

  if (profilsFavoris.length === 0) return (
    <div className="container py-5" style={{ maxWidth: 600, textAlign: "center" }}>
      <div style={{ fontSize: "4rem", marginBottom: 16, opacity: .3 }}>♥</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Aucun favori</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Ajoutez des profils à vos favoris depuis la page Découvrir ou les fiches profil.</p>
      <button className="sbc-btn btn px-5 py-2" onClick={() => navigate("/")}>Explorer les profils</button>
    </div>
  );

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", marginBottom: 4 }}>Mes favoris</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>{profilsFavoris.length} profil{profilsFavoris.length > 1 ? "s" : ""} sauvegardé{profilsFavoris.length > 1 ? "s" : ""}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {profilsFavoris.map(p => {
          const note = noteMoyenne(p.id);
          const nbAvis = (avis[p.id] || []).length;
          const photo = p.photoProfil || p.photos?.[0];
          return (
            <div key={p.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden", display: "flex", boxShadow: "var(--shadow-sm)" }}>
              {/* Photo */}
              <div
                style={{ width: 100, flexShrink: 0, background: photo ? `url(${photo}) center/cover` : "var(--gradient)", cursor: "pointer" }}
                onClick={() => navigate(`/profil/${p.id}`)}
              >
                {!photo && <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem" }}>{p.prenom[0]}</div>}
              </div>
              {/* Infos */}
              <div style={{ flex: 1, padding: "16px 18px" }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, margin: "0 0 2px", fontSize: "1rem" }}>{p.prenom}, {p.age} ans</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: ".82rem", margin: 0 }}>
                      {p.ville} · {p.tarif || "Non précisé"}
                      {p.disponible !== undefined && (
                        <span style={{ marginLeft: 8, color: p.disponible ? "#2e7d32" : "#aaa", fontWeight: 600 }}>
                          {p.disponible ? "● Dispo" : "○ Indispo"}
                        </span>
                      )}
                    </p>
                  </div>
                  <button onClick={() => toggleFavori(p.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem" }} title="Retirer des favoris">♥</button>
                </div>
                {note > 0 && (
                  <div className="d-flex align-items-center gap-1 my-1">
                    <Etoiles note={note} taille="1rem" />
                    <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>{note}/5 ({nbAvis} avis)</span>
                  </div>
                )}
                <div className="my-2">{p.competences?.slice(0, 3).map((c, i) => <span key={i} className="sbc-badge me-1">{c}</span>)}</div>
                <div className="d-flex gap-2 mt-2">
                  <button className="sbc-btn btn px-3 py-1" style={{ fontSize: ".82rem" }} onClick={() => navigate(`/messages/${p.id}`)}>Message</button>
                  <button className="sbc-btn-outline btn px-3 py-1" style={{ fontSize: ".82rem" }} onClick={() => navigate(`/profil/${p.id}`)}>Voir profil</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
