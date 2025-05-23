import { globalStyles } from "../globalStyles";
import { useSelector } from "react-redux";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function CartScreen({ navigation }) {
  const subscription = useSelector((state) => state.subscription);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Récapitulatif</Text>
      <Text style={styles.info}>
        Type d'abonnement :{" "}
        <Text style={{ fontWeight: "bold" }}>{subscription.type}</Text>
      </Text>
      <Text style={styles.info}>
        Nombre d'œuvres :{" "}
        <Text style={{ fontWeight: "bold" }}>{subscription.count}</Text>
      </Text>
      <Text style={styles.info}>
        Prix total :{" "}
        <Text style={{ fontWeight: "bold" }}>{subscription.price} €</Text>
      </Text>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("Stack", { screen: "Art" })}
      >
        <Text style={globalStyles.buttonText}>Ajouter d'autres œuvres</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("Stack", { screen: "Payment" })}
      >
        <Text style={globalStyles.buttonText}>Terminer</Text>
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
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
    marginBottom: 30,
    textAlign: "center",
  },
  info: {
    fontSize: 22,
    marginVertical: 10,
    textAlign: "center",
  },
});
