import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";
import Etoiles from "../components/Etoiles";
import Badges from "../components/Badges";
import { GrilleDispos, PickerCreneau } from "../components/Disponibilites";
import { PointEnLigne, TexteActivite } from "../components/StatutEnLigne";

export default function DetailProfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profils, avis, ajouterAvis, noteMoyenne, envoyerMessage, toggleFavori, estFavori, nombreAides } = useApp();
  const profil = profils.find(p => String(p.id) === String(id));

  const [photoIndex, setPhotoIndex] = useState(0);
  const [note, setNote] = useState(0);
  const [auteur, setAuteur] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [msgEnvoye, setMsgEnvoye] = useState(false);
  const [copieOk, setCopieOk] = useState(false);

  if (!profil) return (
    <div className="container py-5 text-center">
      <p style={{ color: "var(--text-muted)" }}>Profil introuvable.</p>
      <button className="sbc-btn btn px-4 py-2" onClick={() => navigate("/")}>Retour</button>
    </div>
  );

  const photos = [];
  if (profil.photoProfil) photos.push(profil.photoProfil);
  if (profil.photos?.length) photos.push(...profil.photos);
  if (photos.length === 0) photos.push("https://via.placeholder.com/600x800");

  const listeAvis = avis[profil.id] || [];
  const isFav = estFavori(profil.id);
  const nbAides = nombreAides(profil.id);

  const envoyer = (e) => {
    e.preventDefault();
    if (note === 0 || !commentaire.trim()) return;
    ajouterAvis(profil.id, { auteur: auteur.trim() || "Anonyme", note, commentaire: commentaire.trim() });
    setNote(0); setAuteur(""); setCommentaire("");
  };

  const contacter = () => {
    envoyerMessage(profil.id, `Bonjour ${profil.prenom}, je suis intéressé(e) par vos compétences : ${profil.competences.join(", ")}.`);
    setMsgEnvoye(true);
    setTimeout(() => navigate(`/messages/${profil.id}`), 600);
  };

  const proposerRdv = ({ jour, creneau }) => {
    envoyerMessage(profil.id, `Bonjour ${profil.prenom}, seriez-vous disponible ${jour.toLowerCase()} ${creneau.toLowerCase()} ?`);
    setMsgEnvoye(true);
    setTimeout(() => navigate(`/messages/${profil.id}`), 600);
  };

  const partager = async () => {
    const url = window.location.href;
    const texte = `Regarde le profil de ${profil.prenom} sur SOS Bandar : ${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${profil.prenom} sur SOS Bandar`, text: texte, url }); }
      catch { /* annulé */ }
    } else {
      navigator.clipboard.writeText(url);
      setCopieOk(true);
      setTimeout(() => setCopieOk(false), 2000);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <button className="btn btn-link px-0 mb-3" style={{ color: "var(--rose)", fontWeight: 600, textDecoration: "none" }} onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <div className="row g-4">
        {/* Photos */}
        <div className="col-md-5">
          <div style={{ position: "relative" }}>
            <div className="detail-photo" style={{ backgroundImage: `url(${photos[photoIndex]})` }} />
            <button onClick={() => toggleFavori(profil.id)}
              style={{
                position: "absolute", top: 12, right: 12,
                background: isFav ? "var(--rose)" : "rgba(0,0,0,.35)",
                border: "none", borderRadius: "50%", width: 42, height: 42,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", backdropFilter: "blur(4px)", color: "#fff",
              }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
          {photos.length > 1 && (
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {photos.map((p, i) => (
                <img key={i} src={p} alt="" onClick={() => setPhotoIndex(i)}
                  style={{ width: 58, height: 58, objectFit: "cover", borderRadius: 10, cursor: "pointer",
                    outline: i === photoIndex ? "3px solid var(--rose)" : "2px solid transparent" }} />
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="col-md-7">
          <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
            <div className="d-flex align-items-center gap-2">
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", margin: 0 }}>
                {profil.prenom}, {profil.age}
              </h1>
              <div className="avatar-wrapper" style={{ marginLeft: 4 }}>
                <PointEnLigne profilId={profil.id} taille={12} />
              </div>
            </div>
            {profil.disponible !== undefined && (
              <span style={{
                background: profil.disponible ? "rgba(34,197,94,.1)" : "#f5f5f5",
                color: profil.disponible ? "#2e7d32" : "#aaa",
                border: `1.5px solid ${profil.disponible ? "#a5d6a7" : "#ddd"}`,
                borderRadius: 20, padding: "4px 12px", fontSize: ".8rem", fontWeight: 700, flexShrink: 0, marginTop: 6,
              }}>
                {profil.disponible ? "Disponible" : "Indisponible"}
              </span>
            )}
          </div>

          <p style={{ color: "var(--text-muted)", marginBottom: 4, fontSize: ".88rem" }}>
            {profil.ville} {profil.tarif && <span style={{ marginLeft: 12 }}>· {profil.tarif}</span>}
          </p>
          <p style={{ fontSize: ".82rem", marginBottom: 12 }}><TexteActivite profilId={profil.id} /></p>

          <div style={{ marginBottom: 12 }}><Badges profilId={profil.id} /></div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <Etoiles note={noteMoyenne(profil.id)} taille="1.3rem" />
            <span style={{ color: "var(--text-muted)", fontSize: ".9rem" }}>
              {noteMoyenne(profil.id)}/5 · {listeAvis.length} avis
            </span>
            {nbAides > 0 && (
              <span style={{ color: "var(--text-muted)", fontSize: ".85rem", marginLeft: 8 }}>
                · {nbAides} personne{nbAides > 1 ? "s" : ""} aidée{nbAides > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="mb-3">
            {profil.competences.map((c, i) => <span key={i} className="sbc-badge me-1 mb-1">{c}</span>)}
          </div>

          {profil.bio && <p style={{ fontSize: ".95rem", lineHeight: 1.6, color: "var(--text)", marginBottom: 16 }}>{profil.bio}</p>}

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn-dm" onClick={contacter} disabled={msgEnvoye} style={{ opacity: msgEnvoye ? .7 : 1 }}>
              {msgEnvoye ? "Message envoyé" : `Contacter ${profil.prenom}`}
            </button>
            <button className="sbc-btn-outline btn px-4 py-2" onClick={() => toggleFavori(profil.id)} style={{ fontSize: ".9rem" }}>
              {isFav ? "Retirer des favoris" : "Sauvegarder"}
            </button>
            <button onClick={partager} style={{ background: "var(--bg)", border: "1.5px solid var(--border)", borderRadius: 12, padding: "8px 14px", fontSize: ".9rem", fontWeight: 600, cursor: "pointer", color: "var(--text)" }}>
              {copieOk ? "Lien copié" : "Partager"}
            </button>
          </div>
        </div>
      </div>

      {/* Section Troc */}
      {profil.troc && (
        <div style={{ background: "var(--bg-card)", border: "1.5px solid #8b5cf633", borderLeft: "4px solid #8b5cf6", borderRadius: 14, padding: "16px 20px", marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem", margin: 0, color: "#8b5cf6" }}>
              Propose un échange
            </h5>
          </div>
          <p style={{ fontSize: ".9rem", margin: 0 }}>{profil.troc}</p>
        </div>
      )}

      {/* Disponibilités */}
      {profil.dispos && Object.keys(profil.dispos).length > 0 && (
        <div className="sbc-filtres p-3 mt-3">
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: 12 }}>Disponibilités</h5>
          <GrilleDispos dispos={profil.dispos} lecture />
          <h6 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: ".85rem", marginTop: 16, marginBottom: 8 }}>Proposer un créneau</h6>
          <PickerCreneau dispos={profil.dispos} onSelect={proposerRdv} />
        </div>
      )}

      <hr style={{ margin: "32px 0", borderColor: "var(--border)" }} />

      <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 20 }}>Avis & commentaires</h3>

      <div className="sbc-filtres p-3 mb-4">
        <label style={{ fontSize: ".85rem", fontWeight: 600, display: "block", marginBottom: 8 }}>Votre note</label>
        <Etoiles note={note} editable onChange={setNote} taille="1.6rem" />
        <div className="mt-3 d-flex flex-column gap-2">
          <input className="form-control" placeholder="Votre nom (facultatif)" value={auteur} onChange={e => setAuteur(e.target.value)} />
          <textarea className="form-control" rows="2" placeholder="Votre commentaire" value={commentaire} onChange={e => setCommentaire(e.target.value)} />
          <button className="sbc-btn btn align-self-start px-4 py-2" onClick={envoyer}>Publier l'avis</button>
        </div>
      </div>

      {listeAvis.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Aucun avis pour l'instant. Soyez le premier.</p>
      ) : (
        listeAvis.slice().reverse().map(a => (
          <div key={a.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
            <div className="d-flex justify-content-between align-items-center">
              <strong style={{ fontSize: ".9rem" }}>{a.auteur}</strong>
              <Etoiles note={a.note} />
            </div>
            <p style={{ margin: "6px 0 4px", fontSize: ".9rem" }}>{a.commentaire}</p>
            <small style={{ color: "var(--text-muted)" }}>{new Date(a.date).toLocaleDateString("fr-FR")}</small>
          </div>
        ))
      )}
    </div>
  );
}
