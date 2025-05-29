import { globalStyles } from "../globalStyles";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOnGoingLoans } from "../reducers/user";
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
const stripePromise = loadStripe(
  "pk_test_51RTf2lCNwXyXTuFi9zIm4MjghdFy8m8BMkdqyXbNwLhFXtq8VeMFWtokocQOvZxOdM5qP5G5ciM8TykSZVRWKjy500yCtV6zOR"
);

export default function PaymentScreen({ navigation }) {
  const stripe = useStripe();
  const [clientSecret, setClientSecret] = useState(null);
  const subscriptionInfos = useSelector((state) => state.subscription) || {};
  const user = useSelector((state) => state.user) || {};
  const artworks = useSelector((state) => state.cart.artWorkInCart) || [];
  const dispatch = useDispatch();

  const validate = async () => {
    try {
      // 1. Créer le Customer
      const createCustomer = await fetch(
        `${fetchAddress}/payments/create-customer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "raphael.bergere@hotmail.fr",
            name: "Raph",
          }),
        }
      );
      if (createCustomer.status === 200) {
        const customer = await createCustomer.json();
        console.log(customer);
        // 2. Créer l'abonnement
        const createSubscription = await fetch(
          `${fetchAddress}/payments/create-subscription`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              priceId: "price_1RU845CRuiuQazlKpm5ElDGr",
              customerId: customer.customerId,
            }),
          }
        );
        if (createSubscription.status === 200) {
          const subscription = await createSubscription.json();
          console.log(subscription);
          setClientSecret(subscription.clientSecret);
          console.log("ClientSecret mis à jour:", subscription.clientSecret);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // CREATION DE L'ABONNEMENT (A METTRE SI LE PAIEMENT EST VALIDE)
    // const body = {
    //   token: user.value?.token,
    //   subscriptionType: subscriptionInfos.type,
    //   count: subscriptionInfos.count,
    //   price: subscriptionInfos.price,
    // };
    // try {
    //   const response = await fetch(`${fetchAddress}/subscriptions/create`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(body),
    //   });

    //   const data = await response.json();

    //   if (!data.result) {
    //     alert(data.error || "Erreur lors de la création de l'abonnement.");
    //     return;
    //   }
    // } catch (err) {
    //   alert("Erreur réseau ou serveur lors de la création de l'abonnement.");
    //   console.error(err);
    //   return;
    // }

    // BOUCLE DE CREATION DES EMPRUNTS (A METTRE TOUT A LA FIN DU PROCESSUS)
    // for (const art of artworks) {
    //   try {
    //     const body = {
    //       token: user.value.token,
    //       artitemId: art.id,
    //     };

    //     const response = await fetch(`${fetchAddress}/artitems/createloan`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify(body),
    //     });

    //     const data = await response.json();

    //     if (!data.result) {
    //       alert(
    //         data.error ||
    //           `Erreur lors de la création du prêt pour l'œuvre ${art.title}`
    //       );
    //       return; // Arrête la boucle si une erreur survient
    //     }
    //   } catch (err) {
    //     alert("Erreur réseau ou serveur.");
    //     console.error(err);
    //     return;
    //   }
    // }
    // // Si tout s'est bien passé pour toutes les œuvres
    // dispatch(updateOnGoingLoans(artworks.length));
    // dispatch(clearCart());
    // navigation.navigate("Account");
  };

  function SubscribeView({ clientSecret }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    useEffect(() => {
      const initializePaymentSheet = async () => {
        if (!clientSecret) return;
        const { error } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Artlinker",
          returnURL: "stripe-example://payment-sheet",
          allowsDelayedPaymentMethods: true,
        });
        if (error) {
          console.error(
            "Erreur lors de l'initialisation du PaymentSheet :",
            error
          );
        }
      };
      initializePaymentSheet();
    }, [clientSecret, initPaymentSheet]);

    return (
      <View style={{ marginTop: 30 }}>
        <Button
          title="Entrer mes informations de paiement"
          onPress={async () => {
            const { error } = await presentPaymentSheet();
            if (error) {
              if (error.code === PaymentSheetError.Failed) {
                alert("Le paiement a échoué.");
              } else if (error.code === PaymentSheetError.Canceled) {
                alert("Paiement annulé.");
              }
            } else {
              alert("Paiement réussi !");
              // Ici tu peux déclencher la suite de ton process (vider le panier, navigation, etc.)
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!clientSecret && (
        <TouchableOpacity style={globalStyles.buttonRed} onPress={validate}>
          <Text style={globalStyles.buttonRedText}>Payer</Text>
        </TouchableOpacity>
      )}
      {clientSecret && <SubscribeView clientSecret={clientSecret} />}
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
