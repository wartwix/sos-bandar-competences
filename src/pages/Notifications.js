import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../data/AppContext";

const ICONES = { message: "MSG", avis: "NEW", urgence: "SOS", systeme: "•" };

function tempsEcoule(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return new Date(dateStr).toLocaleDateString("fr-FR");
}

export default function Notifications() {
  const { notifs, marquerNotifsLues, notifNonLues } = useApp();
  const navigate = useNavigate();

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", margin: 0 }}>Notifications</h1>
          {notifNonLues > 0 && <p style={{ color: "var(--rose)", fontSize: ".88rem", margin: "4px 0 0", fontWeight: 600 }}>{notifNonLues} non lue{notifNonLues > 1 ? "s" : ""}</p>}
        </div>
        {notifNonLues > 0 && (
          <button className="sbc-btn-outline btn px-4 py-2" style={{ fontSize: ".85rem" }} onClick={marquerNotifsLues}>
            Tout marquer lu
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12, opacity: .3 }}>•</div>
          <p>Aucune notification pour l'instant.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map(n => (
            <div key={n.id}
              onClick={() => {
                marquerNotifsLues();
                if (n.type === "message" && n.profilId) navigate(`/messages/${n.profilId}`);
                else if (n.type === "avis" && n.profilId) navigate(`/profil/${n.profilId}`);
              }}
              style={{
                background: n.lu ? "var(--bg-card)" : "var(--gradient-soft)",
                border: `1px solid ${n.lu ? "var(--border)" : "rgba(255,71,87,.2)"}`,
                borderRadius: 14,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "box-shadow .15s",
              }}
            >
              <div style={{ fontSize: "1.4rem", flexShrink: 0 }}>{ICONES[n.type] || "•"}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: ".9rem", fontWeight: n.lu ? 400 : 600 }}>{n.message}</p>
                <p style={{ margin: 0, fontSize: ".75rem", color: "var(--text-muted)", marginTop: 2 }}>{tempsEcoule(n.date)}</p>
              </div>
              {!n.lu && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--rose)", flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
