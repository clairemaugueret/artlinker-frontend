import { globalStyles } from "../globalStyles";
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  setSubscriptionType,
  setSubscriptionCount,
  setSubscriptionPrice,
  setSubscriptionState,
} from "../reducers/subscription";

const priceGrids = {
  INDIVIDUAL_BASIC_COST: { 1: 100, 2: 180, 3: 250 },
  INDIVIDUAL_REDUCT_COST: { 1: 80, 2: 150, 3: 200 },
  PUBLIC_ESTABLISHMENT: {
    3: 350,
    4: 420,
    5: 500,
    6: 600,
    7: 700,
    8: 800,
    9: 900,
    10: 1000,
  },
  LIBERAL_PRO: {
    3: 500,
    4: 600,
    5: 700,
    6: 830,
    7: 960,
    8: 1090,
    9: 1220,
    10: 1350,
  },
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
  const maxCount = isPublicOrEntreprise ? 10 : 3; // On définit le nombre maximum d'œuvres à 5 pour les abonnements Public et Entreprise, sinon c'est 3

  // Selon ne type d'abonnement, on s'assure que le compteur ne soit pas en dehors du nombre minimum ou maximum
  useEffect(() => {
    setCount((actualValue) => {
      if (actualValue < minCount) return minCount; // Si la valeur actuelle est inférieure au minimum possible par l'abonnement, on la met à jour avec cette valeur minimum
      if (actualValue > maxCount) return maxCount; // Si la valeur actuelle est supérieure au maximum possible par l'abonnement, on la met à jour avec cette valeur maximale
      return actualValue; // Sinon, on garde la valeur actuelle
    });
  }, [subscription.type]); // On fait en sorte que le useEffect se déclenche à chaque fois que le type d'abonnement change

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
    dispatch(setSubscriptionState(true));
    navigation.navigate("Stack", { screen: "Cart" });
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.h1, styles.title]}>
        Choisir le nombre d'œuvres
      </Text>
      <View style={styles.counterRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={decrement}
          disabled={count === minCount} // Désactive le bouton si le compteur est au minimum
        >
          <FontAwesome
            name="angle-left"
            size={64}
            color={count === minCount ? lightgray : darkred} // Change la couleur du bouton si le compteur est au minimum
          />
        </TouchableOpacity>
        <Text style={[globalStyles.h1, styles.counterValue]}>{count}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={increment}
          disabled={count === maxCount} // Désactive le bouton si le compteur est au maximum
        >
          <FontAwesome
            name="angle-right"
            size={64}
            color={count === maxCount ? lightgray : darkred} // Change la couleur du bouton si le compteur est au maximum
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.priceText}>
        Prix : <Text style={{ fontWeight: "bold" }}>{price} €</Text>
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        style={globalStyles.buttonRed}
        onPress={validate}
      >
        <Text style={globalStyles.buttonRedText}>Valider</Text>
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
    fontSize: 46,
    textAlign: "center",
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
