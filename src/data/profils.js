import bandar from "../assets/bandar.jpg";
import bandarmuscle from "../assets/bandarmuscle.jpg";
import boir from "../assets/boir.jpg";
import fenetre from "../assets/fenetre.jpg";
import ruy from "../assets/ruy.jpg";
import sourir from "../assets/sourir.jpg";
import tkt from "../assets/tkt.jpg";

const profils = [
  {
    id: 1,
    prenom: "Sofiane",
    age: 27,
    ville: "Paris",
    disponible: true,
    tarif: "Gratuit",
    competences: ["Cours de maths", "Soutien scolaire", "Physique"],
    bio: "Étudiant en ingénierie, je donne des cours de maths et physique du collège au lycée. Pédagogue et patient !",
    photos: [bandar, sourir]
  },
  {
    id: 2,
    prenom: "Lina",
    age: 31,
    ville: "Lyon",
    disponible: true,
    tarif: "10€/h",
    competences: ["Rénovation", "Bricolage", "Peinture", "Plomberie"],
    bio: "Bricoleuse passionnée, je peux vous aider à repeindre ou monter vos meubles. 5 ans d'expérience.",
    photos: [bandarmuscle, tkt]
  },
  {
    id: 3,
    prenom: "Karim",
    age: 24,
    ville: "Paris",
    disponible: false,
    tarif: "20€/h",
    competences: ["Coach sportif", "Course à pied", "Musculation"],
    bio: "Coach sportif diplômé, séances de remise en forme et prépa course à pied. Premiers pas ou compétition.",
    photos: [bandarmuscle]
  },
  {
    id: 4,
    prenom: "Emma",
    age: 29,
    ville: "Bordeaux",
    disponible: true,
    tarif: "15€/h",
    competences: ["Cours de guitare", "Solfège", "Ukulele"],
    bio: "Musicienne, je propose des cours de guitare pour débutants et intermédiaires. Ambiance décontractée garantie.",
    photos: [sourir, fenetre]
  },
  {
    id: 5,
    prenom: "Yacine",
    age: 35,
    ville: "Marseille",
    disponible: true,
    tarif: "Gratuit",
    competences: ["Cuisine", "Pâtisserie", "Cuisine orientale"],
    bio: "Chef amateur, j'adore partager des recettes et des ateliers cuisine. Spécialité tajine et pâtisseries marocaines.",
    photos: [boir, tkt]
  },
  {
    id: 6,
    prenom: "Chloé",
    age: 26,
    ville: "Lyon",
    disponible: true,
    tarif: "12€/h",
    competences: ["Cours d'anglais", "Traduction", "Espagnol"],
    bio: "Bilingue anglais-espagnol, je donne des cours et aide à la traduction de documents officiels ou pros.",
    photos: [fenetre, sourir]
  },
  {
    id: 7,
    prenom: "Lucas",
    age: 22,
    ville: "Lille",
    disponible: true,
    tarif: "Gratuit",
    competences: ["Informatique", "Dépannage PC", "Linux", "Réseaux"],
    bio: "Étudiant en info, je dépanne PC/Mac, configure réseaux et installe Linux. Geek disponible et sympa.",
    photos: [ruy, tkt]
  },
  {
    id: 8,
    prenom: "Amira",
    age: 33,
    ville: "Nantes",
    disponible: true,
    tarif: "8€/h",
    competences: ["Jardinage", "Permaculture", "Compostage"],
    bio: "Passionnée de jardinage et permaculture, j'aide à créer potagers, jardins naturels et systèmes de compostage.",
    photos: [fenetre]
  }
];

export default profils;
