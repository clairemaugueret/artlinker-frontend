import { globalStyles } from "../globalStyles";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setSubscriptionCount,
  setSubscriptionPrice,
} from "../reducers/subscription";

const priceGrids = {
  INDIVIDUAL_BASIC_COST: { 1: 100, 2: 180, 3: 250 },
  INDIVIDUAL_REDUCT_COST: { 1: 80, 2: 150, 3: 200 },
  PUBLIC_ESTABLISHMENT: { 3: 350, 4: 420, 5: 500 },
  LIBERAL_PRO: { 3: 500, 4: 600, 5: 700 },
};

export default function PriceScreen({ navigation }) {
  // Récupère tout l'état subscription
  const subscription = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  // Utilise subscription.type pour calculer le nombre minimum et maximum d'œuvres à emprunter
  const isPublicOrEntreprise =
    subscription.type === "PUBLIC_ESTABLISHMENT" ||
    subscription.type === "LIBERAL_PRO";
  const minCount = isPublicOrEntreprise ? 3 : 1; // On définit le nombre minimum d'œuvres à 3 pour les abonnements Public et Entreprise, sinon c'est 1
  const maxCount = isPublicOrEntreprise ? 5 : 3; // On définit le nombre maximum d'œuvres à 5 pour les abonnements Public et Entreprise, sinon c'est 3

  // Si le type d'abonnement change, réinitialiser le compteur au cas où il est en dehors du nombre minimum ou maximum
  useEffect(() => {
    setCount((actualValue) => {
      if (actualValue < minCount) return minCount; // Si la valeur actuelle est inférieure au minimum possible par l'abonnement, on la met à jour avec cette valeur minimum
      if (actualValue > maxCount) return maxCount; // Si la valeur actuelle est supérieure au maximum possible par l'abonnement, on la met à jour avec cette valeur maximale
      return actualValue; // Sinon, on garde la valeur actuelle
    });
  }, [subscription.type]); // On fait en sorte que le
  // Initialiser le compteur selon le type d'abonnement

  //Création de la variable qui stocke le nombre d'œuvres sélectionnées par l'utilisateur
  const [count, setCount] = useState(minCount); // Ne pas déplacer !!

  // Sélectionne la grille de prix selon l'abonnement ou par défaut l'abonnement particulier
  const priceGrid =
    priceGrids[subscription.type] || priceGrids["INDIVIDUAL_BASIC_COST"];
  const price = priceGrid[count];

  // Récupère les valeurs des styles globaux à l'intérieur de variables (pour pouvoir les utiliser dans les attribut color de Fontawesome)
  const darkred = globalStyles.darkred.color;
  const lightgray = globalStyles.lightgray.color;

  // Fonctions pour incrémenter et décrémenter le compteur sans dépasser le nombre minimumu ou le nombre maximum
  const increment = () => setCount((c) => (c < maxCount ? c + 1 : c));
  const decrement = () => setCount((c) => (c > minCount ? c - 1 : c));

  // Fonction de validation qui met à jour le store Redux avec le nombre d'œuvres et le prix
  // et navigue vers l'écran du panier
  const validate = () => {
    dispatch(setSubscriptionCount(count));
    dispatch(setSubscriptionPrice(price));
    navigation.navigate("Stack", { screen: "Cart" });
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.h1, styles.title]}>
        Choisir le nombre d'œuvres
      </Text>
      <View style={styles.counterRow}>
        <TouchableOpacity onPress={decrement} disabled={count === minCount}>
          <FontAwesome
            name="angle-left"
            size={64}
            color={count === minCount ? lightgray : darkred}
          />
        </TouchableOpacity>
        <Text style={[globalStyles.h1, styles.counterValue]}>{count}</Text>
        <TouchableOpacity onPress={increment} disabled={count === maxCount}>
          <FontAwesome
            name="angle-right"
            size={64}
            color={count === maxCount ? lightgray : darkred}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.priceText}>
        Prix : <Text style={{ fontWeight: "bold" }}>{price} €</Text>
      </Text>
      <TouchableOpacity style={globalStyles.button} onPress={validate}>
        <Text style={globalStyles.buttonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 30,
  },
  counterValue: {
    marginHorizontal: 20,
    color: "#393837",
    minWidth: 40,
    textAlign: "center",
  },
  priceText: {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 28,
    color: "#393837",
  },
});
