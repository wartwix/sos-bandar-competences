import coordonnees from './geo';

const villes = Object.entries(coordonnees).map(([nom, { lat, lon }]) => ({ nom, lat, lon }));
export default villes;
