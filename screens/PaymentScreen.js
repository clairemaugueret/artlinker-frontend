import { globalStyles } from "../globalStyles";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOnGoingLoans, updateSubscription } from "../reducers/user";
import { clearCart } from "../reducers/cart";
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
import CustomModal from "../components/CustomModal";

export default function PaymentScreen({ navigation }) {
  const subscription = useSelector((state) => state.subscription) || {};
  const user = useSelector((state) => state.user) || {};
  const artworks = useSelector((state) => state.cart.artWorkInCart) || [];
  const dispatch = useDispatch();

  const [emailSignIn, setEmailSignIn] = useState("");
  const [focusedField, setFocusedField] = useState(null); // pour pouvoir gérer l'état focus des inputs afin de pouvoir changer le style quand l'input est actif/focusé
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");

  // Modale personnalisée grâce au composant CustomModal pour tous les messages d'erreur ou de succès de la page
  // car le module "Alert" de react-native n'est pas personnalisable en style
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const showModal = (title, message, buttons = []) => {
    //pour personnaliser la modale, on lui envoie les informations suivantes : le titre, le message, et les boutons
    setModalContent({ title, message, buttons });
    setModalVisible(true);
  };

  const validate = async () => {
    const body = {
      token: user.value?.token,
      subscriptionType: subscription.type,
      count: subscription.count,
      price: subscription.price,
    };

    try {
      const response = await fetch(`${fetchAddress}/subscriptions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.result) {
        showModal(
          "Erreur",
          data.error || "Erreur lors de la création de l'abonnement."
        );
        return;
      }

      dispatch(clearCart());
      // navigation.navigate("Account");
      //en attente de la mise en place de Stripe, on redirige vers l'écran Account après l'affichage de la modale "Succès"
      showModal(
        "Paiement confirmé",
        "Votre abonnement ainsi que vos emprunts ont été enregistrés avec succès.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Account");
            },
          },
        ]
      );
    } catch (err) {
      showModal(
        "Erreur",
        "Erreur réseau ou serveur lors de la création de l'abonnement."
      );
      console.error(err);
      return;
    }

    for (const art of artworks) {
      try {
        const body = {
          token: user.value.token,
          artitemId: art.id,
        };

        const response = await fetch(`${fetchAddress}/artitems/createloan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!data.result) {
          showModal(
            "Erreur",
            data.error ||
              `Erreur lors de la création du prêt pour l'œuvre ${art.title}`
          );
          return; // Arrête la boucle si une erreur survient
        }
      } catch (err) {
        showModal("Erreur", "Erreur réseau ou serveur");
        console.error(err);
        return;
      }
    }
    // Si tout s'est bien passé pour toutes les œuvres, on met à jour le reducer user avec les oeuvres empruntrées
    dispatch(updateOnGoingLoans(artworks.length));
    // Si tout s'est bien passé pour l'abonnement, on met à jour le reducer user avec le nouvel abonnement et sa capacité d'emprunt
    dispatch(updateSubscription(subscription.count));
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.h2, { textAlign: "center" }]}>Paiement</Text>
      {/* <Text style={[globalStyles.h3, { textAlign: "center" }]}>
        (A remplacer par Stripe)
      </Text> */}
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
          placeholder="MM / AA"
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
      <TouchableOpacity style={globalStyles.buttonRed} onPress={validate}>
        <Text style={globalStyles.buttonRedText}>Payer</Text>
      </TouchableOpacity>
      {/* Modale personnalisée grâce au composant CustomModal pour les messages d'alerte */}
      <CustomModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
        onClose={() => setModalVisible(false)}
      />
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
    gap: 20,
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
