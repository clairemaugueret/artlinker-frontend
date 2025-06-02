import { globalStyles } from "../globalStyles";
import React, { useState, useEffect } from "react";
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
import { useStripe, PaymentSheetError } from "@stripe/stripe-react-native";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// const stripePromise = loadStripe(
//   "pk_test_51RTf2lCNwXyXTuFi9zIm4MjghdFy8m8BMkdqyXbNwLhFXtq8VeMFWtokocQOvZxOdM5qP5G5ciM8TykSZVRWKjy500yCtV6zOR"
// );

export default function PaymentScreen({ navigation }) {
  const subscriptionInfos = useSelector((state) => state.subscription) || {};
  const user = useSelector((state) => state.user) || {};
  const artworks = useSelector((state) => state.cart.artWorkInCart) || [];
  const dispatch = useDispatch();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const validate = async () => {
    try {
      // 1. Créer le Customer
      const createCustomer = await fetch(
        `${fetchAddress}/payments/create-customer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "raphael.bgere@hotmail.fr",
            name: "Raph",
          }),
        }
      );
      if (createCustomer.status === 200) {
        const customer = await createCustomer.json();
        // 2. Créer l'abonnement
        const createSubscription = await fetch(
          `${fetchAddress}/payments/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              priceId: "price_1RVTy1CRuiuQazlKnLCYqs2I",
              customerId: customer.customerId,
            }),
          }
        );
        if (createSubscription.status === 200) {
          const subscription = await createSubscription.json();
          // 3. Initialiser le PaymentSheet
          const { error: initError } = await initPaymentSheet({
            paymentIntentClientSecret: subscription.clientSecret,
            merchantDisplayName: "Artlinker",
            returnURL: "stripe-example://payment-sheet",
            allowsDelayedPaymentMethods: true,
          });
          if (initError) {
            alert("Erreur lors de l'initialisation du paiement.");
            return;
          }
          // 4. Présenter le PaymentSheet
          const { error: presentError } = await presentPaymentSheet();
          if (presentError) {
            if (presentError.code === PaymentSheetError.Failed) {
              alert("Le paiement a échoué.");
            } else if (presentError.code === PaymentSheetError.Canceled) {
              alert("Paiement annulé.");
            }
            return;
          }
          // 5. Paiement réussi, suite du process
          alert("Paiement réussi !");
          // Création de l'abonnement
          const body = {
            token: user.value?.token,
            subscriptionType: subscriptionInfos.type,
            count: subscriptionInfos.count,
            price: subscriptionInfos.price,
          };
          try {
            const response = await fetch(
              `${fetchAddress}/subscriptions/create`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              }
            );
            const data = await response.json();
            if (!data.result) {
              alert(
                data.error || "Erreur lors de la création de l'abonnement."
              );
              return;
            }
          } catch (err) {
            alert(
              "Erreur réseau ou serveur lors de la création de l'abonnement."
            );
            return;
          }
          // Création des emprunts
          for (const art of artworks) {
            try {
              const body = {
                token: user.value.token,
                artitemId: art.id,
              };
              const response = await fetch(
                `${fetchAddress}/artitems/createloan`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              );
              const data = await response.json();
              if (!data.result) {
                alert(
                  data.error ||
                    `Erreur lors de la création du prêt pour l'œuvre ${art.title}`
                );
                return;
              }
            } catch (err) {
              alert("Erreur réseau ou serveur.");
              return;
            }
          }
          // Tout est OK
          dispatch(updateOnGoingLoans(artworks.length));
          dispatch(updateSubscription(subscriptionInfos.count));
          dispatch(clearCart());
          navigation.navigate("Account");
        }
      }
    } catch (error) {
      alert("Erreur lors du paiement.");
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.container}>
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
