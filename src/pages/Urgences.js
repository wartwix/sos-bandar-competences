import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";

const CATEGORIES = ["Bricolage", "Plomberie", "Électricité", "Transport", "Médical", "Informatique", "Jardinage", "Autre"];

function tempsEcoule(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} j`;
}

function BadgeStatut({ statut }) {
  const c = statut === "en_cours"
    ? { label: "Aide proposée", bg: "#fff8e1", color: "#f59e0b", border: "rgba(245,158,11,.25)" }
    : { label: "Ouvert", bg: "#fff0f0", color: "var(--rose)", border: "rgba(255,71,87,.25)" };
  return (
    <span style={{ background: c.bg, color: c.color, border: `1.5px solid ${c.border}`,
      borderRadius: 20, padding: "2px 10px", fontSize: ".75rem", fontWeight: 600 }}>{c.label}</span>
  );
}

// Suggestions de profils matchés pour une urgence
function ProfilsMatches({ urgence }) {
  const { profilsPourUrgence, envoyerMessage, estEnLigne } = useApp();
  const navigate = useNavigate();
  const [envoye, setEnvoye] = useState({});

  const matches = profilsPourUrgence(urgence);
  if (matches.length === 0) return null;

  const contacter = (profil) => {
    envoyerMessage(profil.id, `Bonjour ${profil.prenom}, j'ai une urgence "${urgence.titre}" près de chez vous. Pourriez-vous m'aider ?`);
    setEnvoye(prev => ({ ...prev, [profil.id]: true }));
    setTimeout(() => navigate(`/messages/${profil.id}`), 800);
  };

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--border)" }}>
      <div style={{ fontSize: ".78rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: 8, textTransform: "uppercase", letterSpacing: ".5px" }}>
        Profils suggérés ({matches.length})
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {matches.map(p => {
          const photo = p.photoProfil || p.photos?.[0];
          return (
            <div key={p.id} style={{ background: "var(--bg)", borderRadius: 12, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--border)" }}>
              <div style={{ position: "relative" }}>
                {photo ? (
                  <img src={photo} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gradient)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: ".85rem" }}>{p.prenom[0]}</div>
                )}
                {estEnLigne(p.id) && (
                  <span style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: "2px solid var(--bg)" }} />
                )}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".82rem" }}>{p.prenom}</div>
                <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{p.ville} · score {p.score}</div>
              </div>
              {envoye[p.id] ? (
                <span style={{ color: "#22c55e", fontSize: ".78rem", fontWeight: 600, marginLeft: 6 }}>Envoyé</span>
              ) : (
                <button onClick={() => contacter(p)} className="sbc-btn btn" style={{ padding: "3px 10px", fontSize: ".75rem", marginLeft: 6 }}>
                  Contacter
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Urgences() {
  const { urgencesOuvertes, ajouterUrgence, proposerAide, cloturerUrgence, position } = useApp();
  const [form, setForm] = useState({ titre: "", categorie: "Bricolage", distance: 1, description: "" });
  const [showForm, setShowForm] = useState(false);
  const [erreur, setErreur] = useState("");
  const [aideEnvoyee, setAideEnvoyee] = useState({});

  const maj = (c, v) => setForm(f => ({ ...f, [c]: v }));

  const publier = () => {
    if (!form.titre.trim()) { setErreur("Le titre est requis."); return; }
    ajouterUrgence({
      titre: form.titre.trim(),
      categorie: form.categorie,
      distance: Number(form.distance),
      description: form.description.trim(),
      ville: position?.ville || "Paris",
    });
    setForm({ titre: "", categorie: "Bricolage", distance: 1, description: "" });
    setShowForm(false);
    setErreur("");
  };

  const handleAide = (id) => {
    proposerAide(id);
    setAideEnvoyee(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="container py-5" style={{ maxWidth: 780 }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", marginBottom: 4 }}>SOS Urgences</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Demandez ou proposez de l'aide près de chez vous.</p>
        </div>
        <button className="sbc-btn btn px-4 py-2" onClick={() => setShowForm(v => !v)}>
          {showForm ? "Annuler" : "+ Publier une urgence"}
        </button>
      </div>

      {showForm && (
        <div className="sbc-filtres p-4 mb-4">
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 16 }}>Nouvelle demande urgente</h5>
          {erreur && (
            <div style={{ background: "#fff0f0", border: "1.5px solid #ffd3d3", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "var(--rose)", fontSize: ".88rem" }}>{erreur}</div>
          )}
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>TITRE</label>
              <input className="form-control" placeholder="Ex : Fuite d'eau, panne de voiture..." value={form.titre} onChange={e => maj("titre", e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>CATÉGORIE</label>
              <select className="form-select" value={form.categorie} onChange={e => maj("categorie", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>DISTANCE : {form.distance} km</label>
              <input type="range" className="form-range" min="1" max="50" value={form.distance} onChange={e => maj("distance", e.target.value)} style={{ accentColor: "var(--rose)" }} />
            </div>
            <div className="col-12">
              <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>DESCRIPTION (optionnel)</label>
              <textarea className="form-control" rows="2" placeholder="Décrivez la situation..." value={form.description} onChange={e => maj("description", e.target.value)} />
            </div>
          </div>
          <button className="sbc-btn btn px-4 py-2 mt-3" onClick={publier}>Publier maintenant</button>
        </div>
      )}

      {urgencesOuvertes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          <p>Aucune urgence en ce moment.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {urgencesOuvertes.map(u => (
            <div key={u.id} style={{
              background: "var(--bg-card)",
              border: u.statut === "en_cours" ? "1.5px solid rgba(245,158,11,.3)" : "1px solid var(--border)",
              borderLeft: `4px solid ${u.statut === "en_cours" ? "#f59e0b" : "var(--rose)"}`,
              borderRadius: 16, padding: "18px 20px", boxShadow: "var(--shadow-sm)",
            }}>
              <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                <div style={{ flex: 1 }}>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, margin: 0, fontSize: "1rem" }}>{u.titre}</h5>
                    <BadgeStatut statut={u.statut} />
                    {u.categorie && <span className="sbc-badge" style={{ fontSize: ".72rem" }}>{u.categorie}</span>}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: ".83rem", margin: "4px 0 0" }}>
                    {u.ville && `${u.ville} · `}À {u.distance} km · {u.temps || tempsEcoule(u.date)}
                  </p>
                  {u.description && <p style={{ fontSize: ".88rem", color: "var(--text)", marginTop: 8, marginBottom: 0 }}>{u.description}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  {!aideEnvoyee[u.id] ? (
                    <button className="sbc-btn-outline btn px-3 py-1" style={{ fontSize: ".85rem", whiteSpace: "nowrap" }} onClick={() => handleAide(u.id)}>
                      Proposer mon aide
                    </button>
                  ) : <span style={{ fontSize: ".83rem", color: "#f59e0b", fontWeight: 600 }}>Aide proposée</span>}
                  <button onClick={() => cloturerUrgence(u.id)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: ".75rem", cursor: "pointer", padding: 0 }}>Clôturer</button>
                </div>
              </div>
              {/* Matching intelligent : profils suggérés */}
              <ProfilsMatches urgence={u} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
