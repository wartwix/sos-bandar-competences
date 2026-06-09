import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarteProfil from "../components/CarteProfil";
import { useApp } from "../data/AppContext";
import villes from "../data/villes";
import { distanceKm, villeLaPlusProche } from "../data/geo";

export default function Accueil() {
  const { profils, position, setPosition, urgencesOuvertes, proposerAide, noteMoyenne, estEnLigne, derniereActivite, avis } = useApp();
  const navigate = useNavigate();
  const [rayon, setRayon] = useState(500);
  const [statutGeo, setStatutGeo] = useState("init");
  const [index, setIndex] = useState(0);
  const [filtreCompetence, setFiltreCompetence] = useState("");
  const [recherche, setRecherche] = useState("");
  const [filtreDisponible, setFiltreDisponible] = useState(false);
  const [filtresAvances, setFiltresAvances] = useState(false);
  const [tarifMax, setTarifMax] = useState(100);
  const [noteMin, setNoteMin] = useState(0);
  const [ageMin, setAgeMin] = useState(16);
  const [ageMax, setAgeMax] = useState(99);
  const [tri, setTri] = useState("proches"); // proches | notes | actifs | nouveaux
  const [aideEnvoyee, setAideEnvoyee] = useState({});

  useEffect(() => {
    if (position) { setStatutGeo("ok"); return; }
    if (!navigator.geolocation) { setStatutGeo("refus"); return; }
    setStatutGeo("chargement");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ville = villeLaPlusProche(pos.coords.latitude, pos.coords.longitude);
        setPosition({ ville: ville.nom, lat: ville.lat, lon: ville.lon });
        setStatutGeo("ok");
      },
      () => setStatutGeo("refus"),
      { timeout: 8000 }
    );
  }, [position, setPosition]);

  const choisirVille = (nom) => {
    const v = villes.find(x => x.nom === nom);
    if (v) { setPosition({ ville: v.nom, lat: v.lat, lon: v.lon }); setStatutGeo("ok"); setIndex(0); }
  };

  const competencesDispo = useMemo(() => {
    const set = new Set();
    profils.forEach(p => p.competences.forEach(c => set.add(c)));
    return [...set].sort();
  }, [profils]);

  // Extraire tarif numérique d'une chaîne comme "15€/h"
  const tarifNum = (p) => {
    if (!p.tarif || p.tarif === "Gratuit") return 0;
    const m = String(p.tarif).match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  };

  const profilsFiltres = useMemo(() => {
    let liste = profils
      .map(p => {
        const v = villes.find(x => x.nom === p.ville);
        const distance = position && v ? distanceKm(position.lat, position.lon, v.lat, v.lon) : null;
        return { ...p, distance, _note: noteMoyenne(p.id), _enLigne: estEnLigne(p.id), _activite: derniereActivite(p.id) || 0 };
      })
      .filter(p => position ? p.distance != null && p.distance <= rayon : true)
      .filter(p => filtreCompetence ? p.competences.some(c => c.toLowerCase().includes(filtreCompetence.toLowerCase())) : true)
      .filter(p => filtreDisponible ? p.disponible : true)
      .filter(p => tarifNum(p) <= tarifMax)
      .filter(p => p._note >= noteMin)
      .filter(p => p.age >= ageMin && p.age <= ageMax)
      .filter(p => recherche.trim() ? (
        p.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.competences.some(c => c.toLowerCase().includes(recherche.toLowerCase())) ||
        p.ville.toLowerCase().includes(recherche.toLowerCase())
      ) : true);

    // Tri
    if (tri === "proches") liste.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    else if (tri === "notes") liste.sort((a, b) => b._note - a._note);
    else if (tri === "actifs") liste.sort((a, b) => b._activite - a._activite);
    else if (tri === "nouveaux") liste.sort((a, b) => Number(b.id) - Number(a.id));

    return liste;
  }, [profils, position, rayon, filtreCompetence, filtreDisponible, recherche, tarifMax, noteMin, ageMin, ageMax, tri, avis]);

  const profilCourant = profilsFiltres[index];
  const handleAide = (id) => {
    proposerAide(id);
    setAideEnvoyee(prev => ({ ...prev, [id]: true }));
  };
  const urgencesWidget = urgencesOuvertes.slice(0, 3);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="hero-title mb-2">
          Trouvez la bonne <span>compétence</span><br />près de chez vous
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 20px" }}>
          Cours, sport, rénovation, cuisine... échangez avec des personnes autour de vous.
        </p>
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          <input
            className="form-control"
            style={{ paddingLeft: 44, borderRadius: 30, fontSize: "1rem", padding: "12px 44px" }}
            placeholder="Chercher une compétence, un prénom..."
            value={recherche}
            onChange={e => { setRecherche(e.target.value); setIndex(0); }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Filtres */}
          <div className="sbc-filtres mb-4 p-3">
            <div className="row g-2 align-items-end">
              <div className="col-sm-3">
                <select className="form-select form-select-sm" value={position?.ville || ""} onChange={e => choisirVille(e.target.value)}>
                  <option value="" disabled>Ville</option>
                  {villes.map(v => <option key={v.nom} value={v.nom}>{v.nom}</option>)}
                </select>
              </div>
              <div className="col-sm-3">
                <div style={{ fontSize: ".7rem", color: "var(--text-muted)", marginBottom: 2, fontWeight: 600 }}>Rayon : {rayon} km</div>
                <input type="range" className="form-range" min="10" max="600" step="10" value={rayon}
                  onChange={e => { setRayon(Number(e.target.value)); setIndex(0); }} style={{ accentColor: "var(--rose)" }} />
              </div>
              <div className="col-sm-2">
                <select className="form-select form-select-sm" value={filtreCompetence}
                  onChange={e => { setFiltreCompetence(e.target.value); setIndex(0); }}>
                  <option value="">Compétences</option>
                  {competencesDispo.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-sm-2">
                <select className="form-select form-select-sm" value={tri} onChange={e => setTri(e.target.value)}>
                  <option value="proches">Plus proches</option>
                  <option value="notes">Mieux notés</option>
                  <option value="actifs">Plus actifs</option>
                  <option value="nouveaux">Nouveaux</option>
                </select>
              </div>
              <div className="col-sm-2 d-flex gap-1">
                <button onClick={() => { setFiltreDisponible(v => !v); setIndex(0); }} title="Disponibles uniquement"
                  style={{ flex: 1, background: filtreDisponible ? "var(--gradient)" : "var(--bg)", border: `1.5px solid ${filtreDisponible ? "transparent" : "var(--border)"}`, borderRadius: 8, padding: "5px 8px", cursor: "pointer", fontSize: ".75rem", color: filtreDisponible ? "#fff" : "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Dispo
                </button>
                <button onClick={() => setFiltresAvances(v => !v)} title="Filtres avancés"
                  style={{ background: filtresAvances ? "var(--rose)" : "var(--bg)", border: `1.5px solid ${filtresAvances ? "transparent" : "var(--border)"}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: filtresAvances ? "#fff" : "var(--text-muted)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="8" y1="18" x2="16" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filtres avancés */}
            {filtresAvances && (
              <div className="row g-2 mt-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="col-sm-4">
                  <div style={{ fontSize: ".7rem", color: "var(--text-muted)", fontWeight: 600 }}>Tarif max : {tarifMax}€/h</div>
                  <input type="range" className="form-range" min="0" max="100" step="5" value={tarifMax}
                    onChange={e => setTarifMax(Number(e.target.value))} style={{ accentColor: "var(--rose)" }} />
                </div>
                <div className="col-sm-4">
                  <div style={{ fontSize: ".7rem", color: "var(--text-muted)", fontWeight: 600 }}>Note min : {noteMin}/5</div>
                  <input type="range" className="form-range" min="0" max="5" step="0.5" value={noteMin}
                    onChange={e => setNoteMin(Number(e.target.value))} style={{ accentColor: "var(--rose)" }} />
                </div>
                <div className="col-sm-4">
                  <div style={{ fontSize: ".7rem", color: "var(--text-muted)", fontWeight: 600 }}>Âge : {ageMin}-{ageMax} ans</div>
                  <div className="d-flex gap-1">
                    <input type="number" min="16" max="99" className="form-control form-control-sm" value={ageMin} onChange={e => setAgeMin(Number(e.target.value))} style={{ fontSize: ".8rem" }} />
                    <input type="number" min="16" max="99" className="form-control form-control-sm" value={ageMax} onChange={e => setAgeMax(Number(e.target.value))} style={{ fontSize: ".8rem" }} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: 8, fontSize: ".78rem", color: "var(--text-muted)" }}>
              {profilsFiltres.length} profil{profilsFiltres.length !== 1 ? "s" : ""} trouvé{profilsFiltres.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="d-flex flex-column align-items-center">
            {profilCourant ? (
              <>
                <CarteProfil profil={profilCourant} distance={profilCourant.distance} />
                <div className="mt-4 d-flex gap-4">
                  <button className="btn-rond btn-light shadow-sm" onClick={() => setIndex(i => i + 1)}
                    style={{ background: "var(--bg-card)", color: "#aaa", border: "1.5px solid var(--border)", fontSize: "1.3rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <button className="btn-rond sbc-btn shadow-sm" onClick={() => setIndex(i => i + 1)} style={{ fontSize: "1.3rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: ".82rem", marginTop: 12 }}>
                  {index + 1} / {profilsFiltres.length}
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "48px 0" }}>
                <p style={{ fontSize: "1rem", marginBottom: 16 }}>Aucun profil trouvé.</p>
                <button className="sbc-btn btn px-4 py-2" onClick={() => { setIndex(0); setRecherche(""); setFiltreCompetence(""); setFiltreDisponible(false); setTarifMax(100); setNoteMin(0); setAgeMin(16); setAgeMax(99); }}>
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Widget urgences */}
        <div className="col-lg-4">
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 20, overflow: "hidden", boxShadow: "var(--shadow-sm)", position: "sticky", top: 80 }}>
            <div style={{ background: "var(--gradient)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1rem" }}>SOS Urgences</div>
                <div style={{ color: "rgba(255,255,255,.75)", fontSize: ".78rem" }}>{urgencesOuvertes.length} demande{urgencesOuvertes.length !== 1 ? "s" : ""}</div>
              </div>
              <button onClick={() => navigate("/urgences")} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: 8, color: "#fff", fontSize: ".78rem", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                Voir tout
              </button>
            </div>
            <div>
              {urgencesWidget.length === 0 ? (
                <div style={{ padding: "24px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: ".88rem" }}>
                  Aucune urgence en ce moment.
                </div>
              ) : urgencesWidget.map((u, i) => (
                <div key={u.id} style={{ padding: "14px 20px", borderBottom: i < urgencesWidget.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <h6 style={{ fontWeight: 700, marginBottom: 2, fontSize: ".9rem" }}>{u.titre}</h6>
                  <p style={{ color: "var(--text-muted)", fontSize: ".78rem", margin: "0 0 8px" }}>À {u.distance} km · {u.temps}</p>
                  {!aideEnvoyee[u.id] ? (
                    <button className="sbc-btn-outline btn" style={{ padding: "4px 12px", fontSize: ".8rem" }} onClick={() => handleAide(u.id)}>
                      Proposer mon aide
                    </button>
                  ) : <span style={{ color: "#f59e0b", fontSize: ".8rem", fontWeight: 600 }}>Aide proposée</span>}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
              <button className="sbc-btn btn w-100 py-2" style={{ fontSize: ".88rem" }} onClick={() => navigate("/urgences")}>
                Publier une urgence
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => navigate("/carte")} style={{
              width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14,
              padding: "12px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
              color: "var(--text)",
            }} className="sbc-filtres">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="1 6 8 3 16 6 23 3 23 18 16 21 8 18 1 21 1 6" />
                <line x1="8" y1="3" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="21" />
              </svg>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem" }}>Voir la carte</div>
                <div style={{ fontSize: ".78rem", color: "var(--text-muted)" }}>Profils et urgences près de vous</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// test 
