import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../data/AppContext";
import { PointEnLigne, TexteActivite } from "../components/StatutEnLigne";
import Reactions from "../components/Reactions";

function Avatar({ profil, size = 48 }) {
  if (!profil) return <div className="conv-avatar-placeholder" style={{ width: size, height: size, fontSize: size * .38 }}>?</div>;
  const photo = profil.photoProfil || profil.photos?.[0];
  if (photo) return <img className="conv-avatar" src={photo} alt={profil.prenom} style={{ width: size, height: size }} />;
  return (
    <div className="conv-avatar-placeholder" style={{ width: size, height: size, fontSize: size * .38 }}>
      {profil.prenom[0].toUpperCase()}
    </div>
  );
}

function AvatarAvecStatut({ profil, size = 48 }) {
  return (
    <div className="avatar-wrapper" style={{ width: size, height: size, flexShrink: 0 }}>
      <Avatar profil={profil} size={size} />
      {profil && <PointEnLigne profilId={profil.id} taille={Math.max(10, size * 0.22)} />}
    </div>
  );
}

function formatHeure(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function TicksStatut({ statut }) {
  if (!statut) return null;
  if (statut === "envoye") return (
    <span style={{ marginLeft: 5, color: "#aaa" }} title="Envoyé">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    </span>
  );
  if (statut === "livre") return (
    <span style={{ marginLeft: 5, color: "#aaa" }} title="Livré">
      <svg width="14" height="10" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 6 5 10 11 2" /><polyline points="7 10 13 2" />
      </svg>
    </span>
  );
  if (statut === "lu") return (
    <span style={{ marginLeft: 5, color: "#34b7f1" }} title="Lu">
      <svg width="14" height="10" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 6 5 10 11 2" /><polyline points="7 10 13 2" />
      </svg>
    </span>
  );
  return null;
}

export default function Messages() {
  const { profilId } = useParams();
  const navigate = useNavigate();
  const { conversations, messagesConv, envoyerMessage, marquerLus, MOI_ID, profils, ecritDans, sauvegarderBrouillon, recupererBrouillon, brouillons } = useApp();

  const [texte, setTexte] = useState("");
  const [recherche, setRecherche] = useState("");
  const [convActive, setConvActive] = useState(profilId || null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const convs = conversations();
  const msgs = convActive ? messagesConv(convActive) : [];
  const profilActif = convActive ? profils.find((p) => String(p.id) === String(convActive)) : null;

  // Filtrer les conversations selon la recherche
  const convsFiltrees = useMemo(() => {
    if (!recherche.trim()) return convs;
    const r = recherche.toLowerCase();
    return convs.filter(({ profil, msgs }) =>
      profil?.prenom?.toLowerCase().includes(r) ||
      msgs.some(m => m.texte.toLowerCase().includes(r))
    );
  }, [convs, recherche]);

  useEffect(() => {
    if (profilId) {
      setConvActive(profilId);
      // Charger le brouillon
      setTexte(recupererBrouillon(profilId));
    }
  }, [profilId]);

  // Sauvegarder le brouillon à chaque changement
  useEffect(() => {
    if (convActive) sauvegarderBrouillon(convActive, texte);
  }, [texte, convActive]);

  useEffect(() => {
    if (convActive) marquerLus(convActive);
  }, [convActive, msgs.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length, ecritDans]);

  const envoyer = () => {
    if (!texte.trim() || !convActive) return;
    envoyerMessage(convActive, texte);
    setTexte("");
    inputRef.current?.focus();
  };

  const changerConv = (autreId) => {
    setConvActive(autreId);
    setTexte(recupererBrouillon(autreId));
    navigate(`/messages/${autreId}`, { replace: true });
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); }
  };

  return (
    <div className="messages-layout">
      {/* Sidebar */}
      <aside className="convs-sidebar">
        <div className="convs-header">
          <h2>Messages</h2>
          <span style={{ fontSize: ".8rem", color: "var(--text-muted)" }}>
            {convs.length} conversation{convs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Recherche */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <input
              className="form-control form-control-sm"
              style={{ paddingLeft: 32, borderRadius: 20, fontSize: ".85rem" }}
              placeholder="Rechercher..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="convs-list">
          {convsFiltrees.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: ".85rem" }}>
              {recherche ? "Aucun résultat." : "Aucune conversation pour l'instant. Contactez un profil pour démarrer."}
            </div>
          )}
          {convsFiltrees.map(({ cid, autreId, profil, dernier, nonLus }) => {
            const brouillon = brouillons[String(autreId)];
            return (
              <div
                key={cid}
                className={`conv-item ${String(convActive) === String(autreId) ? "active" : ""}`}
                onClick={() => changerConv(autreId)}
              >
                <AvatarAvecStatut profil={profil} size={48} />
                <div className="conv-info">
                  <div className="conv-name">{profil?.prenom ?? "Utilisateur"}</div>
                  <div className="conv-preview">
                    {brouillon ? (
                      <span className="brouillon-badge">Brouillon : {brouillon.slice(0, 30)}{brouillon.length > 30 ? "..." : ""}</span>
                    ) : (
                      <>{dernier.expediteur === MOI_ID ? "Vous : " : ""}{dernier.texte}</>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <span style={{ fontSize: ".7rem", color: "var(--text-muted)" }}>{formatHeure(dernier.date)}</span>
                  {nonLus > 0 && <div className="conv-unread" />}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Zone de chat */}
      {convActive && profilActif ? (
        <div className="chat-zone">
          <div className="chat-header">
            <button onClick={() => navigate(`/profil/${profilActif.id}`)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <AvatarAvecStatut profil={profilActif} size={40} />
            </button>
            <div className="chat-header-info">
              <h3>{profilActif.prenom}, {profilActif.age} ans</h3>
              <span><TexteActivite profilId={profilActif.id} /></span>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button className="sbc-btn-outline" style={{ padding: "6px 14px", fontSize: ".85rem" }} onClick={() => navigate(`/profil/${profilActif.id}`)}>
                Voir profil
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {msgs.length === 0 && (
              <div className="chat-empty">
                <span style={{ fontSize: ".9rem" }}>Démarrez la conversation avec {profilActif.prenom}.</span>
              </div>
            )}
            {msgs.map((msg) => {
              const isMe = msg.expediteur === MOI_ID;
              return (
                <div key={msg.id} className={`msg-row ${isMe ? "me" : "them"}`} style={{ position: "relative" }}>
                  {!isMe && <Avatar profil={profilActif} size={28} />}
                  <div style={{ position: "relative", maxWidth: "68%" }}>
                    <div className="msg-bubble" style={{ maxWidth: "100%" }}>{msg.texte}</div>
                    <Reactions msgId={msg.id} isMe={isMe} />
                  </div>
                  <span className="msg-time">
                    {formatHeure(msg.date)}
                    {isMe && <TicksStatut statut={msg.statut} />}
                  </span>
                </div>
              );
            })}

            {/* Indicateur "en train d'écrire" */}
            {ecritDans === String(convActive) && (
              <div className="ecrit-indicateur">
                <span>{profilActif.prenom} écrit</span>
                <div className="ecrit-dot" /><div className="ecrit-dot" /><div className="ecrit-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-zone">
            <textarea
              ref={inputRef}
              className="chat-input"
              rows={1}
              placeholder={`Message à ${profilActif.prenom}...`}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button className="chat-send-btn" onClick={envoyer} title="Envoyer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="no-conv-selected">
          <h3>Vos messages</h3>
          <p style={{ fontSize: ".9rem", maxWidth: 260, textAlign: "center" }}>
            Sélectionnez une conversation ou contactez un profil depuis la page Découvrir.
          </p>
        </div>
      )}
    </div>
  );
}
