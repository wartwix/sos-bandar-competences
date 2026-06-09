// Coordonnées GPS des villes de référence
const coordonnees = {
  "Paris": { lat: 48.8566, lon: 2.3522 },
  "Lyon": { lat: 45.7640, lon: 4.8357 },
  "Marseille": { lat: 43.2965, lon: 5.3698 },
  "Toulouse": { lat: 43.6047, lon: 1.4442 },
  "Bordeaux": { lat: 44.8378, lon: -0.5792 },
  "Lille": { lat: 50.6292, lon: 3.0573 },
  "Nantes": { lat: 47.2184, lon: -1.5536 },
  "Strasbourg": { lat: 48.5734, lon: 7.7521 },
  "Nice": { lat: 43.7102, lon: 7.2620 },
  "Rennes": { lat: 48.1173, lon: -1.6778 },
  "Montpellier": { lat: 43.6108, lon: 3.8767 },
  "Grenoble": { lat: 45.1885, lon: 5.7245 },
};

// Formule Haversine exacte (depuis le 2e projet) pas sur
export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Distance entre deux noms de villes
export function distanceEntreVilles(ville1, ville2) {
  const c1 = coordonnees[ville1];
  const c2 = coordonnees[ville2];
  if (!c1 || !c2) return null;
  return distanceKm(c1.lat, c1.lon, c2.lat, c2.lon);
}

// Ville la plus proche d'une position GPS
export function villeLaPlusProche(lat, lon) {
  let proche = null;
  let min = Infinity;
  for (const [nom, c] of Object.entries(coordonnees)) {
    const d = distanceKm(lat, lon, c.lat, c.lon);
    if (d < min) { min = d; proche = { nom, ...c }; }
  }
  return proche;
}

// test test 

export default coordonnees;
