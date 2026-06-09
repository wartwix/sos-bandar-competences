import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";

function Card({ icon, label, value, sub, couleur = "var(--rose)" }) {
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: 16, padding: "20px", boxShadow: "var(--shadow-sm)",
      display: "flex", alignItems: "flex-start", gap: 14,
    }}>
      <div style={{
        background: `${couleur}1a`, color: couleur,
        borderRadius: 12, width: 44, height: 44,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1, marginBottom: 2 }}>{value}</div>
        <div style={{ color: "var(--text-muted)", fontSize: ".82rem", fontWeight: 600 }}>{label}</div>
        {sub && <div style={{ color: "var(--text-muted)", fontSize: ".75rem", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

// Mini graphique : barres simples
function Barres({ data, couleur = "var(--rose)" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", background: couleur,
            height: `${(d.value / max) * 100}%`,
            minHeight: d.value > 0 ? 4 : 0,
            borderRadius: "6px 6px 0 0",
            opacity: .85,
            transition: "all .3s",
          }} title={`${d.value}`} />
          <div style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Stats() {
  const navigate = useNavigate();
  const { monProfil, avis, noteMoyenne, conversations, mesAides, profils, favoris, urgences } = useApp();

  if (!monProfil) return (
    <div className="container py-5 text-center" style={{ maxWidth: 500 }}>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>Tableau de bord</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Créez votre profil pour accéder à vos statistiques.</p>
      <button className="sbc-btn btn px-5 py-2" onClick={() => navigate("/mon-profil")}>Créer mon profil</button>
    </div>
  );

  const mesAvis = avis[monProfil.id] || [];
  const note = noteMoyenne(monProfil.id);
  const convs = conversations();
  const totalMessagesEnvoyes = convs.reduce((s, c) => s + c.msgs.filter(m => m.expediteur === "moi").length, 0);
  const totalMessagesRecus = convs.reduce((s, c) => s + c.msgs.filter(m => m.expediteur !== "moi").length, 0);
  const tauxReponse = totalMessagesEnvoyes > 0 ? Math.round((totalMessagesRecus / totalMessagesEnvoyes) * 100) : 0;
  const aides = mesAides();
  const totalAides = aides.urgences.length + aides.cours.length;

  // Évolution note sur les 6 derniers avis
  const evolutionNotes = mesAvis.slice(-6).map((a, i) => ({ label: `#${i+1}`, value: a.note }));

  // Répartition des compétences proposées
  const competencesTrie = (monProfil.competences || []).slice(0, 5).map(c => ({
    label: c.length > 10 ? c.slice(0, 10) + "..." : c,
    value: Math.floor(Math.random() * 20) + 5, // Simulé : nb de vues par compétence
  }));

  return (
    <div className="container py-5" style={{ maxWidth: 1000 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", marginBottom: 4 }}>Tableau de bord</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>Vos statistiques et activité.</p>

      {/* KPIs principaux */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          } label="Note moyenne" value={note > 0 ? `${note}/5` : "—"} sub={`Sur ${mesAvis.length} avis`} couleur="#f59e0b" />
        </div>
        <div className="col-md-3 col-sm-6">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          } label="Conversations" value={convs.length} sub={`${totalMessagesEnvoyes} messages envoyés`} couleur="#3b82f6" />
        </div>
        <div className="col-md-3 col-sm-6">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          } label="Personnes aidées" value={totalAides} sub={`${aides.urgences.length} urgences résolues`} couleur="#22c55e" />
        </div>
        <div className="col-md-3 col-sm-6">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          } label="Taux de réponse" value={`${Math.min(tauxReponse, 100)}%`} sub="Sur tous vos messages" couleur="#8b5cf6" />
        </div>
      </div>

      {/* Graphiques */}
      <div className="row g-3">
        <div className="col-md-7">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
            <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: 16 }}>Évolution de vos notes</h5>
            {evolutionNotes.length > 0 ? (
              <Barres data={evolutionNotes} couleur="#f59e0b" />
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: ".88rem", padding: "24px 0", textAlign: "center" }}>
                Pas encore d'avis reçus.
              </div>
            )}
          </div>
        </div>
        <div className="col-md-5">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px", boxShadow: "var(--shadow-sm)" }}>
            <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: 16 }}>Vues par compétence (7 derniers jours)</h5>
            {competencesTrie.length > 0 ? (
              <Barres data={competencesTrie} couleur="var(--rose)" />
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: ".88rem", padding: "24px 0", textAlign: "center" }}>
                Aucune compétence renseignée.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes infos */}
      <div className="row g-3 mt-1">
        <div className="col-md-4">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          } label="Favoris ajoutés" value={favoris.length} sub="Profils sauvegardés" couleur="#ec4899" />
        </div>
        <div className="col-md-4">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          } label="Urgences actives" value={urgences.filter(u => u.statut !== "cloture").length} sub="Dans la communauté" couleur="#f97316" />
        </div>
        <div className="col-md-4">
          <Card icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          } label="Membres total" value={profils.length} sub="Inscrits sur la plateforme" couleur="#06b6d4" />
        </div>
      </div>

      {/* Liste des avis récents */}
      {mesAvis.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h5 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, marginBottom: 12 }}>Derniers avis reçus</h5>
          {mesAvis.slice().reverse().slice(0, 3).map(a => (
            <div key={a.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", marginBottom: 8 }}>
              <div className="d-flex justify-content-between align-items-center">
                <strong style={{ fontSize: ".9rem" }}>{a.auteur}</strong>
                <span style={{ color: "#f59e0b", fontWeight: 700 }}>{a.note}/5</span>
              </div>
              <p style={{ margin: "6px 0 2px", fontSize: ".88rem" }}>{a.commentaire}</p>
              <small style={{ color: "var(--text-muted)" }}>{new Date(a.date).toLocaleDateString("fr-FR")}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
