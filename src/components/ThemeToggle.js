import React from "react";
import { useApp } from "../data/AppContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === "sombre";
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Mode clair" : "Mode sombre"}
      style={{
        width: 34, height: 34, borderRadius: "50%",
        background: "var(--bg)", border: "1.5px solid var(--border)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text)", transition: "background .2s",
      }}
    >
      {isDark ? (
        // Soleil (mode clair)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="3" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21" />
          <line x1="3" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21" y2="12" />
          <line x1="5.6" y1="5.6" x2="7" y2="7" /><line x1="17" y1="17" x2="18.4" y2="18.4" />
          <line x1="5.6" y1="18.4" x2="7" y2="17" /><line x1="17" y1="7" x2="18.4" y2="5.6" />
        </svg>
      ) : (
        // Lune (mode sombre)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
