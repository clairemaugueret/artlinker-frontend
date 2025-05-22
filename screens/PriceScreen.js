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
  Particulier: { 1: 100, 2: 180, 3: 250 },
  ParticulierReduit: { 1: 80, 2: 150, 3: 200 },
  EtablissementPublic: { 3: 350, 4: 420, 5: 500 },
  Entreprise: { 3: 500, 4: 600, 5: 700 },
};

export default function PriceScreen({ navigation }) {
  // Récupère tout l'état subscription
  const subscription = useSelector((state) => state.subscription);
  const dispatch = useDispatch();

  // Utilise subscription.type pour la logique
  const isPublicOrEntreprise =
    subscription.type === "EtablissementPublic" ||
    subscription.type === "Entreprise";
  const minCount = isPublicOrEntreprise ? 3 : 1;
  const maxCount = isPublicOrEntreprise ? 5 : 3;

  // Initialiser le compteur selon le type d'abonnement
  const [count, setCount] = useState(minCount);

  // Si le type d'abonnement change, réinitialiser le compteur si hors bornes
  useEffect(() => {
    setCount((prev) => {
      if (prev < minCount) return minCount;
      if (prev > maxCount) return maxCount;
      return prev;
    });
  }, [subscription.type]);

  // Sélectionne la grille de prix selon l'abonnement
  const priceGrid = priceGrids[subscription.type] || priceGrids["Particulier"];
  const price = priceGrid[count];

  const darkred = globalStyles.darkred.color;
  const lightgray = globalStyles.lightgray.color;

  const increment = () => setCount((c) => (c < maxCount ? c + 1 : c));
  const decrement = () => setCount((c) => (c > minCount ? c - 1 : c));

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
      {/* Affichage du prix */}
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
