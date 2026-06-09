import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import profilsInitiaux from "./profils";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const K = {
  profils:   "sbc_profils",
  avis:      "sbc_avis",
  messages:  "sbc_messages",
  urgences:  "sbc_urgences",
  monProfil: "sbc_mon_profil",
  favoris:   "sbc_favoris",
  notifs:    "sbc_notifs",
  activite:  "sbc_activite",   // { profilId: timestamp dernière activité }
  brouillons:"sbc_brouillons",  // { profilId: texte non envoyé }
  reactions: "sbc_reactions",   // { msgId: ["heart", "thumb", ...] }
  aides:     "sbc_aides",       // { profilId: { urgences: [...], cours: [...] } }
  theme:     "sbc_theme",       // "clair" | "sombre"
};

function charger(cle, defaut) {
  try { const v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; }
  catch { return defaut; }
}

export const MOI_ID = "moi";
export function convId(a, b) { return [String(a), String(b)].sort().join("_"); }

const URGENCES_DEFAUT = [
  { id: "u1", titre: "Fuite d'eau importante", categorie: "Plomberie", distance: 2, temps: "Il y a 10 min", date: new Date(Date.now()-10*60000).toISOString(), statut: "ouvert", ville: "Paris", description: "Joint qui lâche sous le lavabo, ça coule beaucoup." },
  { id: "u2", titre: "Panne batterie voiture", categorie: "Transport", distance: 5, temps: "Il y a 45 min", date: new Date(Date.now()-45*60000).toISOString(), statut: "ouvert", ville: "Paris", description: "Besoin de quelqu'un avec des pinces pour démarrer." },
  { id: "u3", titre: "Aide déménagement urgent", categorie: "Bricolage", distance: 3, temps: "Il y a 2 h", date: new Date(Date.now()-2*3600000).toISOString(), statut: "ouvert", ville: "Lyon", description: "Cherche un coup de main pour porter un canapé samedi." },
];

// Activité simulée des profils initiaux (pour avoir des statuts en ligne au démarrage)
function activiteInitiale() {
  const a = {};
  // Quelques profils "en ligne" récemment, d'autres plus anciens
  a["1"] = Date.now() - 2 * 60000;       // 2 min
  a["2"] = Date.now() - 30 * 60000;      // 30 min
  a["3"] = Date.now() - 3 * 3600000;     // 3 h
  a["4"] = Date.now() - 60000;           // 1 min
  a["6"] = Date.now() - 24 * 3600000;    // 1 j
  a["7"] = Date.now() - 4 * 60000;       // 4 min
  return a;
}

export function AppProvider({ children }) {
  const [profils,    setProfils]    = useState(() => charger(K.profils, profilsInitiaux));
  const [avis,       setAvis]       = useState(() => charger(K.avis, {}));
  const [messages,   setMessages]   = useState(() => charger(K.messages, {}));
  const [urgences,   setUrgences]   = useState(() => charger(K.urgences, URGENCES_DEFAUT));
  const [monProfil,  setMonProfil]  = useState(() => charger(K.monProfil, null));
  const [favoris,    setFavoris]    = useState(() => charger(K.favoris, []));
  const [notifs,     setNotifs]     = useState(() => charger(K.notifs, []));
  const [activite,   setActivite]   = useState(() => charger(K.activite, activiteInitiale()));
  const [brouillons, setBrouillons] = useState(() => charger(K.brouillons, {}));
  const [reactions,  setReactions]  = useState(() => charger(K.reactions, {}));
  const [aides,      setAides]      = useState(() => charger(K.aides, {}));
  const [theme,      setTheme]      = useState(() => charger(K.theme, "clair"));
  const [position,   setPosition]   = useState(null);
  const [ecritDans,  setEcritDans]  = useState(null); // profilId en train d'écrire (simulé)

  // ── Persistance ──
  useEffect(() => { localStorage.setItem(K.profils,    JSON.stringify(profils));    }, [profils]);
  useEffect(() => { localStorage.setItem(K.avis,       JSON.stringify(avis));       }, [avis]);
  useEffect(() => { localStorage.setItem(K.messages,   JSON.stringify(messages));   }, [messages]);
  useEffect(() => { localStorage.setItem(K.urgences,   JSON.stringify(urgences));   }, [urgences]);
  useEffect(() => { localStorage.setItem(K.monProfil,  JSON.stringify(monProfil));  }, [monProfil]);
  useEffect(() => { localStorage.setItem(K.favoris,    JSON.stringify(favoris));    }, [favoris]);
  useEffect(() => { localStorage.setItem(K.notifs,     JSON.stringify(notifs));     }, [notifs]);
  useEffect(() => { localStorage.setItem(K.activite,   JSON.stringify(activite));   }, [activite]);
  useEffect(() => { localStorage.setItem(K.brouillons, JSON.stringify(brouillons)); }, [brouillons]);
  useEffect(() => { localStorage.setItem(K.reactions,  JSON.stringify(reactions));  }, [reactions]);
  useEffect(() => { localStorage.setItem(K.aides,      JSON.stringify(aides));      }, [aides]);
  useEffect(() => {
    localStorage.setItem(K.theme, JSON.stringify(theme));
    document.body.className = theme === "sombre" ? "theme-sombre" : "";
  }, [theme]);

  // ── THEME ──
  const toggleTheme = () => setTheme(t => t === "clair" ? "sombre" : "clair");

  // ── PROFILS ──
  const ajouterProfil = (profil) => {
    const n = { ...profil, id: Date.now(), disponible: true };
    setProfils(p => [n, ...p]);
    return n.id;
  };
  const mettreAJourProfil = (id, updates) => {
    setProfils(p => p.map(x => String(x.id) === String(id) ? { ...x, ...updates } : x));
    if (monProfil && String(monProfil.id) === String(id)) {
      setMonProfil(prev => ({ ...prev, ...updates }));
    }
  };

  // ── ACTIVITE / STATUT EN LIGNE ──
  const marquerActif = useCallback((profilId) => {
    setActivite(prev => ({ ...prev, [String(profilId)]: Date.now() }));
  }, []);

  const estEnLigne = (profilId) => {
    const ts = activite[String(profilId)];
    if (!ts) return false;
    return (Date.now() - ts) < 5 * 60000; // 5 min
  };

  const derniereActivite = (profilId) => {
    const ts = activite[String(profilId)];
    if (!ts) return null;
    return ts;
  };

  // ── AVIS / NOTES ──
  const ajouterAvis = (profilId, item) => {
    setAvis(prev => {
      const liste = prev[profilId] ? [...prev[profilId]] : [];
      liste.push({ ...item, id: Date.now(), date: new Date().toISOString() });
      return { ...prev, [profilId]: liste };
    });
    ajouterNotif({ type: "avis", message: `Vous avez reçu un avis de ${item.auteur}`, profilId });
  };

  const noteMoyenne = (profilId) => {
    const liste = avis[profilId] || [];
    if (!liste.length) return 0;
    return Math.round((liste.reduce((s, a) => s + a.note, 0) / liste.length) * 10) / 10;
  };

  // ── FAVORIS ──
  const toggleFavori = (profilId) => {
    const id = String(profilId);
    setFavoris(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const estFavori = (profilId) => favoris.includes(String(profilId));

  // ── NOTIFICATIONS ──
  const ajouterNotif = (notif) => {
    setNotifs(prev => [{ ...notif, id: Date.now(), lu: false, date: new Date().toISOString() }, ...prev].slice(0, 30));
  };
  const marquerNotifsLues = () => setNotifs(prev => prev.map(n => ({ ...n, lu: true })));
  const notifNonLues = notifs.filter(n => !n.lu).length;

  // ── BROUILLONS ──
  const sauvegarderBrouillon = (profilId, texte) => {
    setBrouillons(prev => {
      if (!texte) { const c = { ...prev }; delete c[String(profilId)]; return c; }
      return { ...prev, [String(profilId)]: texte };
    });
  };
  const recupererBrouillon = (profilId) => brouillons[String(profilId)] || "";

  // ── REACTIONS ──
  const toggleReaction = (msgId, reaction) => {
    setReactions(prev => {
      const liste = prev[String(msgId)] || [];
      const sansMoi = liste.filter(r => !(r.par === MOI_ID && r.type === reaction));
      // Si on cliquait sur une réaction qu'on avait déjà → on la retire
      if (sansMoi.length < liste.length) return { ...prev, [String(msgId)]: sansMoi };
      return { ...prev, [String(msgId)]: [...sansMoi, { type: reaction, par: MOI_ID }] };
    });
  };

  // ── MESSAGES / DM ──
  const envoyerMessage = (profilId, texte) => {
    if (!texte.trim()) return;
    const cid = convId(MOI_ID, profilId);
    const msgId = Date.now();
    const msg = { id: msgId, expediteur: MOI_ID, texte: texte.trim(), date: new Date().toISOString(), lu: false, statut: "envoye" };
    setMessages(prev => ({ ...prev, [cid]: [...(prev[cid] || []), msg] }));
    sauvegarderBrouillon(profilId, ""); // efface le brouillon

    // Statut livré après 400ms
    setTimeout(() => {
      setMessages(prev => ({ ...prev, [cid]: (prev[cid] || []).map(m => m.id === msgId ? { ...m, statut: "livre" } : m) }));
    }, 400);

    // L'autre "est en train d'écrire" après 800ms
    setTimeout(() => setEcritDans(String(profilId)), 800);

    // Réponse + statuts "lu" après 2.5s
    const profil = profils.find(p => String(p.id) === String(profilId));
    const reponses = [
      `Bonjour ! Merci pour votre message.`,
      `Bien sûr, je suis disponible cette semaine.`,
      `Super, on peut en discuter. Quand seriez-vous libre ?`,
      `Avec plaisir, quel jour vous conviendrait ?`,
      `Je serais ravi(e) d'aider, donnez-moi plus de détails.`,
    ];
    setTimeout(() => {
      setEcritDans(null);
      setMessages(prev => {
        const liste = prev[cid] || [];
        const lus = liste.map(m => m.expediteur === MOI_ID ? { ...m, statut: "lu" } : m);
        const autoMsg = {
          id: Date.now() + 1, expediteur: String(profilId),
          texte: reponses[Math.floor(Math.random() * reponses.length)],
          date: new Date().toISOString(), lu: false,
        };
        return { ...prev, [cid]: [...lus, autoMsg] };
      });
      marquerActif(profilId);
      ajouterNotif({ type: "message", message: `Nouveau message de ${profil?.prenom || "quelqu'un"}`, profilId });
    }, 2500);
  };

  const conversations = () =>
    Object.entries(messages)
      .filter(([, msgs]) => msgs.length > 0)
      .map(([cid, msgs]) => {
        const autreId = cid.split("_").find(x => x !== MOI_ID) || cid.split("_")[0];
        const profil = profils.find(p => String(p.id) === autreId);
        const dernier = msgs[msgs.length - 1];
        const nonLus = msgs.filter(m => m.expediteur !== MOI_ID && !m.lu).length;
        return { cid, autreId, profil, dernier, nonLus, msgs };
      })
      .sort((a, b) => new Date(b.dernier.date) - new Date(a.dernier.date));

  const messagesConv = (profilId) => messages[convId(MOI_ID, profilId)] || [];

  const marquerLus = (profilId) => {
    const cid = convId(MOI_ID, profilId);
    setMessages(prev => ({ ...prev, [cid]: (prev[cid] || []).map(m => ({ ...m, lu: true })) }));
  };
  const totalNonLus = () => Object.values(messages).flat().filter(m => m.expediteur !== MOI_ID && !m.lu).length;

  // ── URGENCES ──
  const ajouterUrgence = (urgence) => {
    const n = { id: `u_${Date.now()}`, statut: "ouvert", date: new Date().toISOString(), temps: "À l'instant", ...urgence };
    setUrgences(prev => [n, ...prev]);
    return n.id;
  };
  const proposerAide = (urgenceId) => {
    setUrgences(prev => prev.map(u => u.id === urgenceId ? { ...u, statut: "en_cours", aideProposee: true } : u));
    setAides(prev => {
      const moi = prev[MOI_ID] || { urgences: [], cours: [] };
      return { ...prev, [MOI_ID]: { ...moi, urgences: [...new Set([...moi.urgences, urgenceId])] } };
    });
  };
  const cloturerUrgence = (urgenceId) => {
    setUrgences(prev => prev.filter(u => u.id !== urgenceId));
  };
  const urgencesOuvertes = urgences.filter(u => u.statut !== "cloture");

  // ── MATCHING INTELLIGENT URGENCE → PROFILS ──
  const profilsPourUrgence = (urgence) => {
    return profils
      .map(p => {
        let score = 0;
        // Match compétence
        const cats = (urgence.categorie || "").toLowerCase();
        if (p.competences.some(c => c.toLowerCase().includes(cats) || cats.includes(c.toLowerCase()))) score += 50;
        // Match mots du titre
        const mots = urgence.titre.toLowerCase().split(/\W+/).filter(m => m.length > 3);
        mots.forEach(m => { if (p.competences.some(c => c.toLowerCase().includes(m))) score += 15; });
        // Disponibilité
        if (p.disponible) score += 30;
        // Même ville
        if (p.ville === urgence.ville) score += 25;
        // En ligne
        if (estEnLigne(p.id)) score += 20;
        // Bonne note
        const note = noteMoyenne(p.id);
        if (note >= 4) score += 10;
        return { ...p, score };
      })
      .filter(p => p.score > 30)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  // ── HISTORIQUE D'AIDES ──
  const nombreAides = (profilId) => {
    const a = aides[String(profilId)] || { urgences: [], cours: [] };
    return a.urgences.length + a.cours.length;
  };
  const mesAides = () => aides[MOI_ID] || { urgences: [], cours: [] };

  // ── BADGES DE RÉPUTATION (calculés à la volée) ──
  const badgesProfil = (profilId) => {
    const liste = avis[profilId] || [];
    const note = noteMoyenne(profilId);
    const profil = profils.find(p => String(p.id) === String(profilId));
    const result = [];
    if (liste.length >= 10) result.push({ id: "top", label: "Top contributeur", desc: "10 avis ou plus", couleur: "#f59e0b" });
    if (note >= 4.5 && liste.length >= 3) result.push({ id: "etoile", label: "Excellence", desc: "Note 4.5+", couleur: "#ec4899" });
    if (estEnLigne(profilId)) result.push({ id: "actif", label: "Actif", desc: "En ligne récemment", couleur: "#22c55e" });
    if (profil?.troc) result.push({ id: "troc", label: "Échange", desc: "Pratique le troc", couleur: "#8b5cf6" });
    if (nombreAides(profilId) >= 5) result.push({ id: "aidant", label: "Aidant", desc: "5 personnes aidées", couleur: "#06b6d4" });
    // Profil créé récemment (par moi)
    if (profil?.estMoi && profil?.id && Date.now() - parseInt(String(profil.id).replace(/\D/g, "")) < 7 * 86400000) {
      result.push({ id: "nouveau", label: "Nouveau", desc: "Inscrit récemment", couleur: "#3b82f6" });
    }
    return result;
  };

  // ── MON PROFIL ──
  const sauvegarderMonProfil = (data) => {
    const profil = { ...data, id: monProfil?.id || `mon_${Date.now()}`, estMoi: true };
    setMonProfil(profil);
    setProfils(prev => {
      const existe = prev.find(p => p.estMoi);
      if (existe) return prev.map(p => p.estMoi ? profil : p);
      return [profil, ...prev];
    });
  };

  const valeur = {
    profils, avis, position, setPosition, messages, urgences, urgencesOuvertes,
    monProfil, favoris, notifs, notifNonLues, activite, theme, ecritDans,
    reactions, aides, brouillons,
    MOI_ID,
    ajouterProfil, mettreAJourProfil, sauvegarderMonProfil,
    ajouterAvis, noteMoyenne, badgesProfil,
    toggleFavori, estFavori,
    ajouterNotif, marquerNotifsLues,
    envoyerMessage, conversations, messagesConv, marquerLus, totalNonLus,
    ajouterUrgence, proposerAide, cloturerUrgence, profilsPourUrgence,
    marquerActif, estEnLigne, derniereActivite,
    sauvegarderBrouillon, recupererBrouillon,
    toggleReaction,
    nombreAides, mesAides,
    toggleTheme,
  };

  return <AppContext.Provider value={valeur}>{children}</AppContext.Provider>;
}
