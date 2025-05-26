import { globalStyles } from "../globalStyles";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddress } from "../components/FetchAddress";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Button,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function PaymentScreen({ navigation }) {
  const subscription = useSelector((state) => state.subscription) || {};
  const user = useSelector((state) => state.user) || {};
  const [emailSignIn, setEmailSignIn] = useState("");
  const [focusedField, setFocusedField] = useState(null); // pour pouvoir gérer l'état focus des inputs afin de pouvoir changer le style quand l'input est actif/focusé
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  const validate = () => {
    const body = {
      token: user.value?.token,
      subscriptionType: subscription.type,
      count: futurBorrowCapacity,
      price,
    };

    console.log(body);

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
      <Text style={[globalStyles.h2, { textAlign: "center" }]}>Paiement</Text>
      <Text style={[globalStyles.h3, { textAlign: "center" }]}>
        (A remplacer par Stripe)
      </Text>
      <TextInput
        onChangeText={(value) => setEmailSignIn(value)}
        value={emailSignIn}
        onFocus={() => setFocusedField("emailSignIn")}
        onBlur={() => setFocusedField(false)}
        style={[
          globalStyles.input,
          focusedField === "emailSignIn" && globalStyles.inputIsFocused,
        ]}
        placeholder="Card Number"
        autoCapitalize="none"
        keyboardType="email-address"
        textContenType="emailAddress"
      />
      <View style={styles.inline}>
        <TextInput
          onChangeText={setExpiration}
          value={expiration}
          onFocus={() => setFocusedField("expiration")}
          onBlur={() => setFocusedField(false)}
          style={[
            globalStyles.input,
            focusedField === "expiration" && globalStyles.inputIsFocused,
            styles.inputHalf, // <-- Place ce style EN DERNIER
          ]}
          placeholder="MM/AA"
          keyboardType="numeric"
          maxLength={5}
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={setCvc}
          value={cvc}
          onFocus={() => setFocusedField("cvc")}
          onBlur={() => setFocusedField(false)}
          style={[
            globalStyles.input,
            focusedField === "cvc" && globalStyles.inputIsFocused,
            styles.inputHalf, // <-- Place ce style EN DERNIER
          ]}
          placeholder="CVC"
          keyboardType="numeric"
          maxLength={4}
          autoCapitalize="none"
          secureTextEntry
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  inline: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  inputHalf: {
    width: "48%",
  },
});
