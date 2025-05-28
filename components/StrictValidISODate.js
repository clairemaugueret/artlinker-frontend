//FONCTION POUR VERIFIER LA VALIDITE DE LA DATE (le back le vérifie aussi mais comme ça double vérif)

export const isStrictValidISODate = (dateStr) => {
  // Expression régulière pour vérifier que bien au format AAAA-MM-JJ
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  const match = dateStr.match(regex);
  if (!match) return false;

  // Convertit les chaînes capturées (année, mois, jour) en nombres
  const [_, year, month, day] = match.map(Number);
  // Remarque : match se compose d'un tableau ["AAAA-MM-JJ", "AAAA", "MM", "JJ"] donc le "_" du début est utilisé ici pour ignorer le 1er élément du tableau

  // Crée une date JS à partir des composantes extraites
  const date = new Date(year, month - 1, day);
  // Remarque : les mois dans JavaScript vont de 0 (janvier) à 11 (décembre) d'où le "month-1"

  // Vérifie que les composantes d'origine (year, month, day)
  // correspondent exactement à celles de l'objet Date créé.
  // Cela permet d'éviter les cas où JS corrige une date invalide (ex : 2025-02-30 devient 2025-03-02)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};
