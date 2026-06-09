import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import CreerProfil from "./pages/CreerProfil";
import DetailProfil from "./pages/DetailProfil";
import APropos from "./pages/APropos";
import Messages from "./pages/Messages";
import Urgences from "./pages/Urgences";
import Carte from "./pages/Carte";
import Favoris from "./pages/Favoris";
import MonProfil from "./pages/MonProfil";
import Notifications from "./pages/Notifications";
import Stats from "./pages/Stats";
import { useApp } from "./data/AppContext";

// Marque "moi" comme actif à chaque action de l'utilisateur
function ActivityTracker() {
  const { marquerActif, MOI_ID } = useApp();
  useEffect(() => {
    marquerActif(MOI_ID);
    const interval = setInterval(() => marquerActif(MOI_ID), 60000); // toutes les minutes
    const onActivity = () => marquerActif(MOI_ID);
    window.addEventListener("click", onActivity);
    window.addEventListener("keypress", onActivity);
    return () => {
      clearInterval(interval);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("keypress", onActivity);
    };
  }, [marquerActif]);
  return null;
}

export default function App() {
  return (
    <>
      <ActivityTracker />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/creer" element={<CreerProfil />} />
          <Route path="/profil/:id" element={<DetailProfil />} />
          <Route path="/apropos" element={<APropos />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:profilId" element={<Messages />} />
          <Route path="/urgences" element={<Urgences />} />
          <Route path="/carte" element={<Carte />} />
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/mon-profil" element={<MonProfil />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
      <footer className="text-center py-4">
        SOS Bandar Compétences — Projet web interactif © 2026
      </footer>
    </>
  );
}
