import { globalStyles } from "../globalStyles";
import { useSelector, useDispatch } from "react-redux";
import { setSubscriptionCount } from "../reducers/subscription";
import { removeFromCart, clearCart } from "../reducers/cart";
import { updateOnGoingLoans, updateSubscription } from "../reducers/user";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { fetchAddress } from "../components/FetchAddress";
import { FontAwesome } from "@expo/vector-icons";
import { FormatDistance } from "../components/FormatDistance";
import { useStripe, PaymentSheetError } from "@stripe/stripe-react-native";
// import {
//   initPaymentSheet,
//   presentPaymentSheet,
// } from "@stripe/stripe-react-native";

// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
import CustomModal from "../components/CustomModal";

const typeLabels = {
  INDIVIDUAL_BASIC_COST: "Particulier",
  INDIVIDUAL_REDUCT_COST: "Particulier (tarif réduit)",
  PUBLIC_ESTABLISHMENT: "Etablissement public",
  LIBERAL_PRO: "Entreprise",
};

const priceGrids = {
  INDIVIDUAL_BASIC_COST: { 1: 100, 2: 180, 3: 250 },
  INDIVIDUAL_REDUCT_COST: { 1: 80, 2: 150, 3: 200 },
  PUBLIC_ESTABLISHMENT: { 3: 350, 4: 420, 5: 500 },
  LIBERAL_PRO: { 3: 500, 4: 600, 5: 700 },
};

export default function CartScreen({ navigation }) {
  const subscriptionInfos = useSelector((state) => state.subscription) || {};
  const artworks = useSelector((state) => state.cart.artWorkInCart) || [];
  const user = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();

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
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const count = artworks.length;
  // State local pour le prix
  const [price, setPrice] = useState(
    (priceGrids[subscriptionInfos.type] || priceGrids["INDIVIDUAL_BASIC_COST"])[
      subscriptionInfos.count
    ]
  );
  // State local pour la capacité future
  const [futurBorrowCapacity, setFuturBorrowCapacity] = useState(0);

  // Met à jour futurBorrowCapacity dynamiquement
  useEffect(() => {
    let borrowCapacity;
    if (user.value?.hasSubscribed) {
      borrowCapacity = user.value.authorisedLoans - user.value.ongoingLoans;
    } else {
      borrowCapacity = subscriptionInfos.count || 0; // Utilise le count de l'abonnement si l'utilisateur n'est pas abonné
    }
    setFuturBorrowCapacity(borrowCapacity - count);
  }, [count, user]);

  let maximum;
  if (user.value?.hasSubscribed) {
    maximum = user.value.authorisedLoans;
  } else {
    maximum = subscriptionInfos.count || 0;
  }

  // Calcul de la capacité d'emprunt actuelle
  let borrowCapacity;
  if (user.value?.hasSubscribed) {
    borrowCapacity = user.value.authorisedLoans - user.value.ongoingLoans;
  } else {
    borrowCapacity = subscriptionInfos.count || 0;
  }

  // Désactive le bouton si le nombre d'œuvres dépasse la capacité
  const isDisabled = count > borrowCapacity;
  const markerImage = require("../assets/redmarker.png");

  const validate = async () => {
    if (!user.value.hasSubcribed) {
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
              stripeSubscriptionId: subscription.subscriptionId, // Ajoutez l'ID Stripe
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
            dispatch(updateSubscription(subscription.count));
            dispatch(clearCart());
            navigation.navigate("Account");
          }
        }
      } catch (error) {
        alert("Erreur lors du paiement.");
        console.error("Error:", error);
      }
    } else {
      // Pour chaque œuvre du panier, on effectue un fetch vers /createloan
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
            alert(
              data.error ||
                `Erreur lors de la création du prêt pour l'œuvre ${art.title}`
            );
            return; // Arrête la boucle si une erreur survient
          }
        } catch (err) {
          alert("Erreur réseau ou serveur.");
          console.error(err);
          return;
        }
      }
      // Si tout s'est bien passé pour toutes les œuvres
      dispatch(updateOnGoingLoans(user.value.ongoingLoans + count)); // Mise à jour du nombre d'emprunts en cours dans le store user

      // Ensuite, on vide le panier et navigue vers l'écran Account

      //On redirige vers l'écran Account après l'affichage de la modale "Succès"
      showModal(
        "Confirmation d'emprunt",
        "Votre emprunt a été enregistré avec succès.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Account");
            },
          },
        ]
      );
      dispatch(clearCart());
    }
  };

  // Fonction de suppression
  const handleDelete = (id) => {
    dispatch(removeFromCart({ id }));
    //setArtworks((prev) => prev.filter((art) => art.id !== id));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[globalStyles.h2, styles.title]}>Récapitulatif</Text>
      <View style={StyleSheet.card}>
        <View style={styles.cardsContainer}>
          {artworks.map((art) => (
            <View key={art.id} style={styles.card}>
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: art.image }} style={styles.cardImage} />
                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() => handleDelete(art.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome
                    name="times-circle"
                    size={20}
                    color={globalStyles.darkred.color}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={styles.cardTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {art.title}
              </Text>
              <Text
                style={styles.cardSubtitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {art.artist}
              </Text>
              <View style={styles.cardDistanceRow}>
                <FontAwesome name="location-arrow" size={15} />
                <Text style={styles.cardDistanceText}>
                  {" "}
                  Distance : {FormatDistance(art.distance)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.info}>
        Type d'abonnement :{" "}
        <Text style={{ fontWeight: "bold" }}>
          {typeLabels[subscriptionInfos.type]}
        </Text>
      </Text>
      <Text style={styles.info}>
        Nombre d'œuvres maximum :{" "}
        <Text style={{ fontWeight: "bold" }}>{maximum}</Text>
      </Text>
      <Text style={styles.info}>
        Œuvre(s) en cours d'emprunt :{" "}
        <Text style={{ fontWeight: "bold" }}>{user.value.ongoingLoans}</Text>
      </Text>
      <Text style={styles.info}>
        Œuvres sélectionnées :{" "}
        <Text style={{ fontWeight: "bold" }}>{count}</Text>
      </Text>
      <Text style={styles.info}>
        Crédit restant après emprunt:{" "}
        <Text style={{ fontWeight: "bold" }}>{futurBorrowCapacity}</Text>
      </Text>
      {!user.value?.hasSubscribed && (
        <Text style={styles.info}>
          Prix total : <Text style={{ fontWeight: "bold" }}>{price} €</Text>
        </Text>
      )}
      <TouchableOpacity
        style={globalStyles.buttonRed}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={globalStyles.buttonRedText}>Ajouter d'autres œuvres</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[globalStyles.buttonRed, isDisabled && { opacity: 0.5 }]}
        onPress={validate}
        disabled={isDisabled}
      >
        <Text style={globalStyles.buttonRedText}>Terminer</Text>
      </TouchableOpacity>
      {isDisabled && (
        <Text style={{ color: globalStyles.darkred.color, marginTop: 10 }}>
          Crédit insuffisant, veuillez réduire le nombre d'œuvres.
        </Text>
      )}
      <TouchableOpacity
        style={globalStyles.buttonRed}
        onPress={() => dispatch(clearCart())}
      >
        <Text style={globalStyles.buttonRedText}>Vider le panier</Text>
      </TouchableOpacity>
      {/* Modale personnalisée grâce au composant CustomModal pour les messages d'alerte */}
      <CustomModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        buttons={modalContent.buttons}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "left",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: "48%", // 2 cards par ligne
    columnGap: 10, // espace entre les deux colonnes
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  // Pour éviter un marginRight sur la dernière card de chaque ligne :
  lastCardInRow: {
    marginRight: 0,
  },
  cardImageWrapper: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 5,
    position: "relative",
    borderColor: "transparent", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    //marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
    //marginBottom: 10,
  },
  cardDistanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardDistanceIcon: {
    height: 15,
    width: 11,
    resizeMode: "contain",
    marginRight: 5,
  },
  cardDistanceText: {
    fontSize: 12,
    color: "#333",
  },
  trashIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
});
