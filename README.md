# 🤝 SOS Bandar — Skills Matching Platform

A React web application that connects people through their skills — find someone nearby to help you with tutoring, DIY, sports coaching, and more.

## 🌐 Live Demo

👉 **[https://wartwix.github.io/sos-bandar-competences/](https://wartwix.github.io/sos-bandar-competences/)**

No download required — open the link and use it directly in your browser.

## 📋 Description

Users can:

- Browse profiles and filter by skill, availability, price, rating, and distance
- View a profile in detail with photos, reviews, and badges
- See helpers on an interactive map (geolocation)
- Send help requests and manage favorites
- Access an emergency assistance section
- Toggle between light and dark mode

> All data is managed client-side — no database or backend required.

## 🛠️ Tech Stack

- [React](https://react.dev/) — components, state, routing
- [React Router](https://reactrouter.com/) — client-side navigation
- [React Leaflet](https://react-leaflet.js.org/) — interactive map
- [Bootstrap 5](https://getbootstrap.com/) — responsive layout and UI components
- [Create React App](https://create-react-app.dev/) — build tooling

## 🚀 Run Locally

```bash
git clone https://github.com/wartwix/sos-bandar-competences.git
cd sos-bandar-competences
npm install
npm start
```

App will be available at `http://localhost:3000`.

## 📁 Project Structure

```
src/
├── assets/         # Profile images
├── components/     # Reusable components (Navbar, CarteProfil, Badges, ...)
├── data/           # Mock data (profils, villes, geo, AppContext)
├── pages/          # Main pages (Accueil, Carte, Favoris, Urgences, ...)
├── styles/         # Global CSS
├── App.js
└── index.js
```

---

# 🤝 SOS Bandar — Plateforme de mise en relation par compétences

Application web React qui connecte des personnes grâce à leurs compétences — trouvez quelqu'un près de chez vous pour du soutien scolaire, du bricolage, du coaching sportif, et plus encore.

## 🌐 Démo en ligne

👉 **[https://wartwix.github.io/sos-bandar-competences/](https://wartwix.github.io/sos-bandar-competences/)**

Aucun téléchargement nécessaire — ouvrez le lien et utilisez l'application directement dans votre navigateur.

## 📋 Description

Les utilisateurs peuvent :

- Parcourir des profils et filtrer par compétence, disponibilité, tarif, note et distance
- Consulter le détail d'un profil avec photos, avis et badges
- Voir les helpers sur une carte interactive (géolocalisation)
- Envoyer des demandes d'aide et gérer ses favoris
- Accéder à une section d'urgences
- Basculer entre le mode clair et sombre

> Les données sont gérées entièrement côté front-end — pas de base de données ni de back-end.

## 🛠️ Technologies

- [React](https://react.dev/) — composants, state, routing
- [React Router](https://reactrouter.com/) — navigation entre les pages
- [React Leaflet](https://react-leaflet.js.org/) — carte interactive
- [Bootstrap 5](https://getbootstrap.com/) — mise en page responsive et composants UI
- [Create React App](https://create-react-app.dev/) — outils de build

## 🚀 Lancer en local

```bash
git clone https://github.com/wartwix/sos-bandar-competences.git
cd sos-bandar-competences
npm install
npm start
```

L'application sera accessible sur `http://localhost:3000`.

## 📁 Structure du projet

```
src/
├── assets/         # Images des profils
├── components/     # Composants réutilisables (Navbar, CarteProfil, Badges, ...)
├── data/           # Données mockées (profils, villes, geo, AppContext)
├── pages/          # Pages principales (Accueil, Carte, Favoris, Urgences, ...)
├── styles/         # CSS global
├── App.js
└── index.js
```
