import { globalStyles } from "../globalStyles";
import { useSelector } from "react-redux";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { fetchAddress } from "../components/FetchAddress";

export default function CartScreen({ navigation }) {
  const subscription = useSelector((state) => state.subscription);
  const user = useSelector((state) => state.user);
  console.log(user);

  const validate = () => {
    // Préparer les données à envoyer
    const body = {
      token: user.value.token,
      subscriptionType: subscription.type,
      count: subscription.count,
      price: subscription.price,
    };

    //console.log(body);

    fetch(`${fetchAddress}/subscriptions/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          navigation.navigate("Stack", { screen: "Payment" });
        } else {
          // Gérer l'erreur (affichage, alert, etc.)
          alert(data.error || "Erreur lors de la mise à jour de l'abonnement.");
        }
      })
      .catch((err) => {
        alert("Erreur réseau ou serveur.");
        console.error(err);
      });
  };

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
        style={globalStyles.buttonRed}
        onPress={() => navigation.navigate("Stack", { screen: "Art" })}
      >
        <Text style={globalStyles.buttonRedText}>Ajouter d'autres œuvres</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.buttonRed} onPress={validate}>
        <Text style={globalStyles.buttonRedText}>Terminer</Text>
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
