import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";
import villes from "../data/villes";

function CreerProfil() {
  const { ajouterProfil } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ prenom: "", age: "", ville: "Paris", bio: "" });
  const [competences, setCompetences] = useState([]);
  const [competenceTexte, setCompetenceTexte] = useState("");
  const [photos, setPhotos] = useState([]);
  const [erreur, setErreur] = useState("");

  const maj = (champ, valeur) => setForm((f) => ({ ...f, [champ]: valeur }));

  const ajouterCompetence = () => {
    const c = competenceTexte.trim();
    if (c && !competences.includes(c)) setCompetences([...competences, c]);
    setCompetenceTexte("");
  };

  const ajouterPhotos = (e) => {
    const fichiers = [...e.target.files];
    fichiers.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((p) => [...p, reader.result]);
      reader.readAsDataURL(f);
    });
  };

  const soumettre = (e) => {
    e.preventDefault();
    if (!form.prenom || !form.age || competences.length === 0) {
      setErreur("Renseignez au moins un prénom, un âge et une compétence.");
      return;
    }
    const id = ajouterProfil({
      prenom: form.prenom, age: Number(form.age), ville: form.ville,
      bio: form.bio, competences,
      photos: photos.length ? photos : [`https://via.placeholder.com/600x800?text=${form.prenom}`]
    });
    navigate(`/profil/${id}`);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 680 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", marginBottom: 4 }}>
        Créer mon profil
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
        Partagez vos compétences avec les gens autour de vous.
      </p>

      {erreur && (
        <div style={{
          background: "#fff0f0", border: "1.5px solid #ffd3d3", borderRadius: 12,
          padding: "12px 16px", marginBottom: 20, color: "var(--rose)", fontSize: ".9rem"
        }}>
          {erreur}
        </div>
      )}

      <div className="sbc-filtres p-4">
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>PRÉNOM</label>
            <input className="form-control" value={form.prenom} onChange={(e) => maj("prenom", e.target.value)} placeholder="Ex : Sophie" />
          </div>
          <div className="col-md-4">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>ÂGE</label>
            <input type="number" min="16" max="99" className="form-control" value={form.age} onChange={(e) => maj("age", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>VILLE</label>
            <select className="form-select" value={form.ville} onChange={(e) => maj("ville", e.target.value)}>
              {villes.map((v) => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>COMPÉTENCES</label>
            <div className="input-group">
              <input className="form-control" placeholder="Ex : Cours de maths, Guitare…"
                value={competenceTexte}
                onChange={(e) => setCompetenceTexte(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); ajouterCompetence(); } }} />
              <button type="button" className="sbc-btn btn px-3" onClick={ajouterCompetence}>Ajouter</button>
            </div>
            <div className="mt-2">
              {competences.map((c, i) => (
                <span key={i} className="sbc-badge me-1 mb-1" style={{ cursor: "pointer" }}
                  onClick={() => setCompetences(competences.filter((x) => x !== c))}>
                  {c} ✕
                </span>
              ))}
            </div>
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>BIO</label>
            <textarea className="form-control" rows="3" value={form.bio}
              placeholder="Décrivez-vous en quelques mots…"
              onChange={(e) => maj("bio", e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text-muted)" }}>PHOTOS</label>
            <input type="file" accept="image/*" multiple className="form-control" onChange={ajouterPhotos} />
            <div className="d-flex flex-wrap gap-2 mt-2">
              {photos.map((p, i) => (
                <img key={i} src={p} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }} />
              ))}
            </div>
          </div>
        </div>
        <button type="button" className="sbc-btn btn btn-lg mt-4 w-100 py-3" onClick={soumettre}>
          Publier mon profil
        </button>
      </div>
    </div>
  );
}

export default CreerProfil;
