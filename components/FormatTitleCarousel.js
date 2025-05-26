export const FormatTitleCarousel = (name) => {
  const lowerName = name.toLowerCase();

  // Cas où le nom commence déjà par "l'" ou "L'"
  if (lowerName.startsWith("l'")) {
    return `Œuvres de ${name}`;
  }

  // Cas voyelle ou h muet supposé : "de l'"
  const voyelles = ["a", "e", "i", "o", "u", "y", "h"];
  if (voyelles.includes(lowerName[0])) {
    return `Œuvres de l'${name}`;
  }

  // Tentative basique de reconnaissance des mots masculins (Cas spécifiques masculins avec "du" → compléter la liste si nécessaire)
  const motsMasculins = ["relais", "musée", "centre", "studio"];
  const premierMot = lowerName.split(" ")[0];
  if (motsMasculins.includes(premierMot)) {
    return `Œuvres du ${name}`;
  }

  // Cas par défaut : pas d’article → "de"
  return `Œuvres de ${name}`;
};
