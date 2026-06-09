import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { useApp } from "../data/AppContext";
import coordonnees from "../data/geo";

// Correctif pour les icônes par défaut de Leaflet (sinon elles sont cassées dans CRA)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const COULEURS_CAT = {
  "Plomberie": "#3b82f6",
  "Transport": "#f59e0b",
  "Bricolage": "#8b5cf6",
  "Électricité": "#f97316",
  "Médical": "#ec4899",
  "Informatique": "#06b6d4",
  "Jardinage": "#22c55e",
  "Autre": "#6b7280",
};

// Icône personnalisée pour profil (cercle avec initiale)
function iconeProfil(profil) {
  const couleur = profil.disponible ? "#ff4757" : "#999";
  const lettre = profil.prenom[0].toUpperCase();
  const photo = profil.photoProfil || profil.photos?.[0];

  const inner = photo
    ? `<img src="${photo}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;border:2px solid #fff" />`
    : `<div style="width:30px;height:30px;border-radius:50%;background:${couleur};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-family:'Syne',sans-serif;font-size:.85rem;border:2px solid #fff">${lettre}</div>`;

  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:42px;height:42px;border-radius:50%;background:${couleur};opacity:.25;"></div>
      ${inner}
    </div>
  `;

  return L.divIcon({
    html,
    className: "marqueur-profil",
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

// Icône personnalisée pour urgence (carré rouge avec !)
function iconeUrgence(urgence) {
  const couleur = COULEURS_CAT[urgence.categorie] || "#ff4757";
  const html = `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:38px;height:38px;border-radius:8px;background:${couleur};opacity:.25;"></div>
      <div style="width:28px;height:28px;border-radius:6px;background:${couleur};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.1rem;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.25);">!</div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "marqueur-urgence",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// Petit util pour décaler les marqueurs au même endroit
function decalerCoords(lat, lon, id) {
  const seed = parseInt(String(id).replace(/\D/g, "").slice(-4) || "0");
  return {
    lat: lat + ((seed % 7) - 3) * 0.012,
    lon: lon + ((seed % 5) - 2) * 0.018,
  };
}

// Composant pour bouger la carte quand on sélectionne
function VolerVers({ position }) {
  const map = useMap();
  React.useEffect(() => {
    if (position) map.flyTo(position, 11, { duration: 1.2 });
  }, [position, map]);
  return null;
}

export default function Carte() {
  const { profils, urgencesOuvertes, position, envoyerMessage, toggleFavori, estFavori } = useApp();
  const navigate = useNavigate();
  const [filtre, setFiltre] = useState("tout");
  const [centrer, setCentrer] = useState(null);

  // Marqueurs profils
  const marqueursProfils = useMemo(() =>
    profils.map(p => {
      const c = coordonnees[p.ville];
      if (!c) return null;
      const d = decalerCoords(c.lat, c.lon, p.id);
      return { ...p, latlng: [d.lat, d.lon] };
    }).filter(Boolean),
  [profils]);

  // Marqueurs urgences
  const marqueursUrgences = useMemo(() =>
    urgencesOuvertes.map(u => {
      const c = coordonnees[u.ville || "Paris"];
      if (!c) return null;
      const d = decalerCoords(c.lat, c.lon, u.id);
      return { ...u, latlng: [d.lat, d.lon] };
    }).filter(Boolean),
  [urgencesOuvertes]);

  // Centre initial : position user ou Paris
  const centreInitial = position ? [position.lat, position.lon] : [46.6, 2.4];
  const zoomInitial = position ? 9 : 6;

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "12px 24px", background: "var(--bg-card)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", zIndex: 500 }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
          Carte interactive
        </h2>
        <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
          {[
            { key: "tout", label: "Tout" },
            { key: "profils", label: `Profils (${marqueursProfils.length})` },
            { key: "urgences", label: `Urgences (${marqueursUrgences.length})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFiltre(f.key)} style={{
              background: filtre === f.key ? "var(--gradient)" : "var(--bg)",
              color: filtre === f.key ? "#fff" : "var(--text)",
              border: `1.5px solid ${filtre === f.key ? "transparent" : "var(--border)"}`,
              borderRadius: 20, padding: "5px 14px", fontSize: ".82rem", fontWeight: 600, cursor: "pointer",
            }}>{f.label}</button>
          ))}
        </div>
        {position && (
          <button
            onClick={() => setCentrer([position.lat, position.lon])}
            style={{
              marginLeft: "auto", background: "var(--bg)", border: "1.5px solid var(--border)",
              borderRadius: 8, padding: "5px 12px", fontSize: ".82rem", fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            Me recentrer ({position.ville})
          </button>
        )}
      </div>

      {/* Carte */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapContainer
          center={centreInitial}
          zoom={zoomInitial}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Cercle autour de l'utilisateur */}
          {position && (
            <>
              <Circle
                center={[position.lat, position.lon]}
                radius={50000}
                pathOptions={{ color: "#ff4757", fillColor: "#ff4757", fillOpacity: 0.06, weight: 1.5 }}
              />
              <Marker
                position={[position.lat, position.lon]}
                icon={L.divIcon({
                  html: `<div style="position:relative;"><div style="position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;background:#ff4757;opacity:.3;animation:pulse 2s infinite"></div><div style="width:14px;height:14px;border-radius:50%;background:#ff4757;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div></div>`,
                  className: "marqueur-moi",
                  iconSize: [14, 14],
                  iconAnchor: [7, 7],
                })}
              >
                <Popup>
                  <b>Vous êtes ici</b><br />
                  <span style={{ color: "#666" }}>{position.ville}</span>
                </Popup>
              </Marker>
            </>
          )}

          {/* Profils */}
          {filtre !== "urgences" && marqueursProfils.map(p => (
            <Marker key={`p-${p.id}`} position={p.latlng} icon={iconeProfil(p)}>
              <Popup>
                <div style={{ minWidth: 200, fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    {(p.photoProfil || p.photos?.[0]) ? (
                      <img src={p.photoProfil || p.photos[0]} alt="" style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#ff4757", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.2rem" }}>{p.prenom[0]}</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1rem", fontFamily: "'Syne', sans-serif" }}>{p.prenom}, {p.age}</div>
                      <div style={{ fontSize: ".8rem", color: "#888" }}>{p.ville}</div>
                      <div style={{ fontSize: ".75rem", color: p.disponible ? "#2e7d32" : "#aaa", fontWeight: 700 }}>
                        {p.disponible ? "● Disponible" : "○ Indispo"}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {p.competences.slice(0, 3).map((c, i) => (
                      <span key={i} style={{ background: "rgba(255,71,87,.12)", color: "#ff4757", border: "1px solid rgba(255,71,87,.2)", borderRadius: 12, padding: "2px 8px", fontSize: ".72rem", fontWeight: 600, marginRight: 4, display: "inline-block", marginBottom: 4 }}>{c}</span>
                    ))}
                  </div>
                  {p.tarif && <div style={{ fontSize: ".78rem", color: "#666", marginBottom: 8 }}>{p.tarif}</div>}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => navigate(`/profil/${p.id}`)}
                      style={{ flex: 1, background: "linear-gradient(135deg, #ff4757, #ff6b35)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: ".78rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      Voir profil
                    </button>
                    <button
                      onClick={() => navigate(`/messages/${p.id}`)}
                      style={{ background: "#fff", color: "#ff4757", border: "1.5px solid #ff4757", borderRadius: 8, padding: "6px 10px", fontSize: ".78rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      Msg
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Urgences */}
          {filtre !== "profils" && marqueursUrgences.map(u => (
            <Marker key={`u-${u.id}`} position={u.latlng} icon={iconeUrgence(u)}>
              <Popup>
                <div style={{ minWidth: 200, fontFamily: "'DM Sans', sans-serif" }}>
                  <div style={{ background: "linear-gradient(135deg, rgba(255,71,87,.12), rgba(255,107,53,.08))", borderLeft: "4px solid #ff4757", padding: "10px 12px", borderRadius: 8, marginBottom: 8 }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".95rem", marginBottom: 4 }}>{u.titre}</div>
                    {u.categorie && (
                      <span style={{ background: COULEURS_CAT[u.categorie] || "#6b7280", color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: ".7rem", fontWeight: 700 }}>
                        {u.categorie}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: ".82rem", color: "#666", marginBottom: 4 }}>À {u.distance} km</div>
                  <div style={{ fontSize: ".82rem", color: "#666", marginBottom: 8 }}>{u.temps}</div>
                  {u.description && <p style={{ fontSize: ".82rem", margin: "0 0 8px" }}>{u.description}</p>}
                  <button
                    onClick={() => navigate("/urgences")}
                    style={{ width: "100%", background: "linear-gradient(135deg, #ff4757, #ff6b35)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 10px", fontSize: ".8rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    Proposer mon aide
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          <VolerVers position={centrer} />
        </MapContainer>

        {/* Légende flottante */}
        <div style={{ position: "absolute", bottom: 20, left: 20, background: "rgba(255,255,255,.95)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "12px 16px", fontSize: ".78rem", boxShadow: "0 4px 16px rgba(0,0,0,.12)", zIndex: 400, border: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>Légende</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff4757", border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
            <span style={{ color: "var(--text-muted)" }}>Profil disponible</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#999", border: "2px solid #fff" }} />
            <span style={{ color: "var(--text-muted)" }}>Profil indispo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, background: "#ff4757", border: "2px solid #fff" }} />
            <span style={{ color: "var(--text-muted)" }}>Urgence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
