import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../data/AppContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { totalNonLus, urgencesOuvertes, favoris, notifNonLues, monProfil } = useApp();
  const nonLus = totalNonLus();
  const nbUrgences = urgencesOuvertes.length;

  return (
    <nav className="sbc-navbar navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="sbc-logo">SOS</span> Bandar
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
          style={{ border: "1.5px solid #eee" }}>
          <span className="navbar-toggler-icon" style={{ filter: "invert(1) brightness(0)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item"><NavLink className="nav-link" to="/">Découvrir</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/carte">Carte</NavLink></li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/urgences" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 5 }}>
                Urgences
                {nbUrgences > 0 && (
                  <span style={{ background: "var(--rose)", color: "#fff", borderRadius: 10, padding: "0 6px", fontSize: ".68rem", fontWeight: 700 }}>{nbUrgences}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/favoris">
                Favoris {favoris.length > 0 && <span style={{ color: "var(--text-muted)", fontSize: ".78rem" }}>({favoris.length})</span>}
              </NavLink>
            </li>
            <li className="nav-item"><NavLink className="nav-link" to="/stats">Stats</NavLink></li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link nav-dm-btn ${isActive ? "active" : ""}`} to="/messages">
                Messages
                {nonLus > 0 && <span className="nav-dm-badge">{nonLus}</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/notifications" style={{ position: "relative", paddingLeft: 10, paddingRight: 10 }} title="Notifications">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
                {notifNonLues > 0 && (
                  <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--rose)", display: "block" }} />
                )}
              </NavLink>
            </li>
            <li className="nav-item ms-1"><ThemeToggle /></li>
            <li className="nav-item ms-1">
              <NavLink to="/mon-profil" style={{ textDecoration: "none" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  border: "2px solid var(--border)", overflow: "hidden", cursor: "pointer",
                  background: monProfil?.photoProfil ? `url(${monProfil.photoProfil}) center/cover` : "var(--gradient)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: ".9rem",
                }}>
                  {!monProfil?.photoProfil && (monProfil?.prenom?.[0]?.toUpperCase() || "?")}
                </div>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
