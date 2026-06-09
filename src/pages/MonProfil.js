import React, { useState, useRef } from "react";
import { useApp } from "../data/AppContext";
import Etoiles from "../components/Etoiles";
import Badges from "../components/Badges";
import { GrilleDispos } from "../components/Disponibilites";
import villes from "../data/villes";

const COMPETENCES_SUGGESTIONS = [
  "Bricolage", "Plomberie", "Électricité", "Peinture", "Jardinage",
  "Cours de maths", "Cours d'anglais", "Informatique", "Cuisine", "Pâtisserie",
  "Coach sportif", "Yoga", "Guitare", "Piano", "Photo", "Couture", "Traduction"
];

export default function MonProfil() {
  const { monProfil, sauvegarderMonProfil, avis, noteMoyenne, mesAides, urgences, profils } = useApp();
  const [mode, setMode] = useState(monProfil ? "voir" : "editer");
  const [form, setForm] = useState({
    prenom: monProfil?.prenom || "",
    age: monProfil?.age || "",
    ville: monProfil?.ville || "Paris",
    bio: monProfil?.bio || "",
    tarif: monProfil?.tarif || "Gratuit",
    troc: monProfil?.troc || "",
    disponible: monProfil?.disponible ?? true,
    competences: monProfil?.competences || [],
    photoProfil: monProfil?.photoProfil || "",
    photos: monProfil?.photos || [],
    dispos: monProfil?.dispos || {},
  });
  const [competenceTexte, setCompetenceTexte] = useState("");
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const fileRef = useRef();
  const photosRef = useRef();

  const maj = (c, v) => setForm(f => ({ ...f, [c]: v }));

  const lirePhoto = (file) => new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });

  const onPhotoProfil = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    maj("photoProfil", await lirePhoto(f));
  };

  const onPhotosSupp = async (e) => {
    const files = [...e.target.files];
    const b64s = await Promise.all(files.map(lirePhoto));
    maj("photos", [...form.photos, ...b64s].slice(0, 5));
  };

  const ajouterCompetence = (c) => {
    const clean = (c || competenceTexte).trim();
    if (clean && !form.competences.includes(clean)) maj("competences", [...form.competences, clean]);
    setCompetenceTexte("");
  };

  const sauvegarder = () => {
    if (!form.prenom.trim() || !form.age) { setErreur("Prénom et âge requis."); return; }
    if (form.competences.length === 0) { setErreur("Ajoutez au moins une compétence."); return; }
    sauvegarderMonProfil({ ...form, age: Number(form.age) });
    setSucces(true);
    setErreur("");
    setTimeout(() => { setSucces(false); setMode("voir"); }, 1200);
  };

  const listeAvis = monProfil ? (avis[monProfil.id] || []) : [];
  const note = monProfil ? noteMoyenne(monProfil.id) : 0;
  const aides = mesAides();
  const urgencesAidees = urgences.filter(u => aides.urgences.includes(u.id));

  // VUE
  if (mode === "voir" && monProfil) return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", margin: 0 }}>Mon profil</h1>
        <button className="sbc-btn btn px-4 py-2" onClick={() => setMode("editer")}>Modifier</button>
      </div>

      {/* Carte profil principale */}
      <div className="sbc-filtres p-0 overflow-hidden mb-4">
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", minHeight: 200 }}>
          <div style={{ background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            {monProfil.photoProfil ? (
              <img src={monProfil.photoProfil} alt="" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff" }} />
            ) : (
              <div style={{ width: 130, height: 130, borderRadius: "50%", background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "#fff", border: "4px solid rgba(255,255,255,.5)", fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                {monProfil.prenom[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{monProfil.prenom}, {monProfil.age} ans</h2>
              <span style={{
                background: monProfil.disponible ? "#e8f5e9" : "#fafafa",
                color: monProfil.disponible ? "#2e7d32" : "#aaa",
                border: `1.5px solid ${monProfil.disponible ? "#a5d6a7" : "#ddd"}`,
                borderRadius: 20, padding: "2px 10px", fontSize: ".75rem", fontWeight: 700
              }}>
                {monProfil.disponible ? "Disponible" : "Indisponible"}
              </span>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: ".88rem", margin: "2px 0 8px" }}>
              {monProfil.ville} · {monProfil.tarif}
            </p>
            <div style={{ marginBottom: 8 }}><Badges profilId={monProfil.id} /></div>
            {note > 0 && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <Etoiles note={note} />
                <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>{note}/5 · {listeAvis.length} avis</span>
              </div>
            )}
            <p style={{ fontSize: ".9rem", color: "var(--text)", margin: "8px 0 10px" }}>{monProfil.bio}</p>
            <div>{monProfil.competences.map((c, i) => <span key={i} className="sbc-badge me-1 mb-1">{c}</span>)}</div>
          </div>
        </div>
      </div>

      {/* Section Troc */}
      {monProfil.troc && (
        <div style={{ background: "var(--bg-card)", border: "1.5px solid #8b5cf633", borderLeft: "4px solid #8b5cf6", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", margin: 0, color: "#8b5cf6" }}>
              Échange de services
            </h5>
          </div>
          <p style={{ fontSize: ".9rem", margin: 0 }}>{monProfil.troc}</p>
        </div>
      )}

      {/* Disponibilités */}
      {monProfil.dispos && Object.keys(monProfil.dispos).length > 0 && (
        <div className="sbc-filtres p-3 mb-4">
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: 12 }}>Disponibilités</h5>
          <GrilleDispos dispos={monProfil.dispos} lecture />
        </div>
      )}

      {/* Stats rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Avis", value: listeAvis.length },
          { label: "Note", value: note > 0 ? `${note}/5` : "—" },
          { label: "Compétences", value: monProfil.competences.length },
          { label: "Personnes aidées", value: aides.urgences.length + aides.cours.length },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem" }}>{s.value}</div>
            <div style={{ color: "var(--text-muted)", fontSize: ".75rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Historique des aides */}
      {urgencesAidees.length > 0 && (
        <div>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>Mes contributions</h5>
          {urgencesAidees.map(u => (
            <div key={u.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderLeft: "3px solid #22c55e", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: ".9rem" }}>{u.titre}</div>
              <div style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>Catégorie : {u.categorie} · {u.ville}</div>
            </div>
          ))}
        </div>
      )}

      {/* Avis */}
      {listeAvis.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>Avis reçus</h5>
          {listeAvis.slice().reverse().slice(0, 3).map(a => (
            <div key={a.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ fontSize: ".9rem" }}>{a.auteur}</strong>
                <Etoiles note={a.note} />
              </div>
              <p style={{ margin: "6px 0 2px", fontSize: ".88rem" }}>{a.commentaire}</p>
              <small style={{ color: "var(--text-muted)" }}>{new Date(a.date).toLocaleDateString("fr-FR")}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ÉDITION
  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", margin: 0 }}>
            {monProfil ? "Modifier mon profil" : "Créer mon profil"}
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0" }}>Votre vitrine pour la communauté.</p>
        </div>
        {monProfil && <button className="sbc-btn-outline btn px-4 py-2" onClick={() => setMode("voir")}>Annuler</button>}
      </div>

      {erreur && <div style={{ background: "#fff0f0", border: "1.5px solid #ffd3d3", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "var(--rose)", fontSize: ".9rem" }}>{erreur}</div>}
      {succes && <div style={{ background: "#e8f5e9", border: "1.5px solid #a5d6a7", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#2e7d32", fontSize: ".9rem" }}>Profil sauvegardé.</div>}

      <div className="sbc-filtres p-4">
        {/* Photo */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }} onClick={() => fileRef.current.click()}>
            {form.photoProfil ? (
              <img src={form.photoProfil} alt="" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--border)" }} />
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--gradient-soft)", border: "3px dashed rgba(255,71,87,.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span style={{ fontSize: ".65rem", color: "var(--rose)", fontWeight: 600 }}>PHOTO</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 0, right: 0, background: "var(--gradient)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", border: "2px solid #fff" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPhotoProfil} />
          <p style={{ color: "var(--text-muted)", fontSize: ".78rem", marginTop: 8 }}>Cliquez pour ajouter votre photo</p>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>PRÉNOM</label>
            <input className="form-control" value={form.prenom} onChange={e => maj("prenom", e.target.value)} placeholder="Ex : Sophie" />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>ÂGE</label>
            <input type="number" min="16" max="99" className="form-control" value={form.age} onChange={e => maj("age", e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>TARIF</label>
            <input className="form-control" value={form.tarif} onChange={e => maj("tarif", e.target.value)} placeholder="Ex : 15€/h" />
          </div>
          <div className="col-md-8">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>VILLE</label>
            <select className="form-select" value={form.ville} onChange={e => maj("ville", e.target.value)}>
              {villes.map(v => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <div style={{ background: "var(--bg)", borderRadius: 12, padding: "10px 16px", width: "100%", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: ".85rem", fontWeight: 600, color: form.disponible ? "#2e7d32" : "var(--text-muted)" }}>
                {form.disponible ? "Disponible" : "Indisponible"}
              </span>
              <div onClick={() => maj("disponible", !form.disponible)}
                style={{ marginLeft: "auto", width: 40, height: 22, borderRadius: 11, background: form.disponible ? "var(--gradient)" : "#ddd", cursor: "pointer", position: "relative", transition: "background .2s" }}>
                <div style={{ position: "absolute", top: 3, left: form.disponible ? 20 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
              </div>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>BIO</label>
            <textarea className="form-control" rows="3" value={form.bio} onChange={e => maj("bio", e.target.value)} placeholder="Présentez-vous en quelques mots..." />
          </div>

          {/* Troc */}
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>ÉCHANGE / TROC (facultatif)</label>
            <input className="form-control" value={form.troc} onChange={e => maj("troc", e.target.value)} placeholder="Ex : 1h de cours d'anglais contre 1h de bricolage" />
            <p style={{ color: "var(--text-muted)", fontSize: ".75rem", marginTop: 4 }}>Si vous préférez troquer un service contre un autre.</p>
          </div>

          {/* Compétences */}
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>COMPÉTENCES</label>
            <div className="input-group mb-2">
              <input className="form-control" placeholder="Taper ou choisir ci-dessous..." value={competenceTexte}
                onChange={e => setCompetenceTexte(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); ajouterCompetence(); } }} />
              <button type="button" className="sbc-btn btn px-3" onClick={() => ajouterCompetence()}>Ajouter</button>
            </div>
            <div className="mb-2" style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COMPETENCES_SUGGESTIONS.filter(c => !form.competences.includes(c)).map(c => (
                <span key={c} onClick={() => ajouterCompetence(c)} style={{ background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 20, padding: "3px 10px", fontSize: ".78rem", cursor: "pointer", color: "var(--text-muted)" }}>+ {c}</span>
              ))}
            </div>
            <div>
              {form.competences.map((c, i) => (
                <span key={i} className="sbc-badge me-1 mb-1" style={{ cursor: "pointer" }} onClick={() => maj("competences", form.competences.filter(x => x !== c))}>
                  {c} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Disponibilités */}
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>MES DISPONIBILITÉS HEBDOMADAIRES</label>
            <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16 }}>
              <GrilleDispos dispos={form.dispos} onChange={d => maj("dispos", d)} />
              <p style={{ color: "var(--text-muted)", fontSize: ".75rem", marginTop: 8, marginBottom: 0 }}>Cliquez sur les cases où vous êtes disponible.</p>
            </div>
          </div>

          {/* Photos */}
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".8rem", fontWeight: 600, color: "var(--text-muted)" }}>PHOTOS SUPPLÉMENTAIRES (max 5)</label>
            <input ref={photosRef} type="file" accept="image/*" multiple className="form-control" onChange={onPhotosSupp} />
            <div className="d-flex flex-wrap gap-2 mt-2">
              {form.photos.map((p, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img src={p} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, border: "2px solid var(--border)" }} />
                  <button onClick={() => maj("photos", form.photos.filter((_, j) => j !== i))}
                    style={{ position: "absolute", top: -6, right: -6, background: "var(--rose)", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: ".6rem", cursor: "pointer" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="sbc-btn btn btn-lg mt-4 w-100 py-3" onClick={sauvegarder}>
          {monProfil ? "Sauvegarder les modifications" : "Publier mon profil"}
        </button>
      </div>
    </div>
  );
}
