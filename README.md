# SOS Bandar Competences

Application web interactive de mise en relation par competences (cours, sport, renovation, cuisine...),
inspiree des applications de rencontre : profils avec photos et etiquettes de competences,
decouverte des profils autour de soi selon un rayon en km, notation par etoiles et commentaires.

## Technologies
- **React** (composants, logique, interactivite)
- **React Router** (navigation entre pages)
- **Bootstrap 5** (mise en page, navbar, grille, composants)
- **CSS** personnalise (theme, cartes style Tinder, responsive)
- **localStorage** pour la persistance des profils, notes et commentaires

## Structure
```
sos-bandar-competences/
├── public/
│   └── index.html
└── src/
    ├── index.js          # point d'entree React
    ├── App.js            # structure globale + routes
    ├── components/       # Navbar, CarteProfil, Etoiles
    ├── pages/            # Accueil, CreerProfil, DetailProfil, APropos
    ├── styles/           # style.css
    └── data/             # profils.json, villes.js, geo.js, AppContext.js
```

## Fonctionnalites
- Creation de profil avec plusieurs photos, age, ville, bio et etiquettes de competences
- Decouverte des profils sous forme de cartes "swipe" (style Tinder, sans match mutuel)
- Localisation simulee via la geolocalisation du navigateur -> grande ville la plus proche
  (avec selection manuelle de ville en repli si la geoloc est refusee)
- Filtrage des profils par rayon (km) et par competence
- Systeme de notes en etoiles + commentaires sur chaque profil
- Persistance des donnees dans le navigateur (localStorage)

## Installation et lancement
```bash
npm install
npm start
```
L'application demarre sur http://localhost:3000

## Build de production
```bash
npm run build
```

## Versionnage (consigne)
Initialiser un depot Git, le pousser sur GitHub et ajouter le professeur (`helaRaj`) comme collaborateur :
```bash
git init
git add .
git commit -m "Initial commit - SOS Bandar Competences"
git branch -M main
git remote add origin <url-du-depot>
git push -u origin main
```
