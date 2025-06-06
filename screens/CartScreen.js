// RAPHAEL

// ===== IMPORTS =====

import { globalStyles } from "../globalStyles";
import { useSelector, useDispatch } from "react-redux";
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
import CustomModal from "../components/CustomModal";

// ===== CONSTANTES =====
// Mapping des types d'abonnement avec leurs labels d'affichage
const typeLabels = {
  INDIVIDUAL_BASIC_COST: "Particulier",
  INDIVIDUAL_REDUCT_COST: "Particulier (tarif réduit)",
  PUBLIC_ESTABLISHMENT: "Etablissement public",
  LIBERAL_PRO: "Entreprise",
};

// Grille de prix en fonction du type d'abonnement et du nombre d'œuvres
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

// ===== COMPOSANT PRINCIPAL =====
export default function CartScreen({ navigation }) {
  // ===== HOOKS REDUX =====
  // Récupération des données depuis le store Redux
  const subscriptionInfos = useSelector((state) => state.subscription) || {}; // Informations de l'abonnement sélectionné
  const artworks = useSelector((state) => state.cart.artWorkInCart) || []; // Œuvres dans le panier
  const user = useSelector((state) => state.user) || {}; // Informations utilisateur
  const dispatch = useDispatch(); // Pour dispatcher des actions Redux

  // ===== HOOKS STRIPE =====
  // Récupération des méthodes Stripe pour gérer les paiements
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // ===== STATES LOCAUX =====

  // Calcul du prix en fonction du type d'abonnement et du nombre d'œuvres
  const [price, setPrice] = useState(
    (priceGrids[subscriptionInfos.type] || priceGrids["INDIVIDUAL_BASIC_COST"])[
      subscriptionInfos.count
    ]
  );

  // Capacité d'emprunt future (après validation du panier)
  const [futurBorrowCapacity, setFuturBorrowCapacity] = useState(0);

  //CLAIRE

  // Gestion de la modale personnalisée pour afficher les messages à l'utilisateur
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });

  // Fonction utilitaire pour afficher la modale avec un contenu personnalisé
  const showModal = (title, message, buttons = []) => {
    setModalContent({ title, message, buttons });
    setModalVisible(true);
  };

  //RAPHAEL

  // ===== AUTRES VARIABLES =====

  // Nombre d'œuvres dans le panier
  const cartCount = artworks.length;

  // ===== VARIABLES CONDITIONNELLES =====

  // Nombre maximum d'œuvres autorisées
  let maximum;
  if (user.value.hasSubscribed) {
    maximum = user.value.authorisedLoans; // Utilise l'abonnement existant
  } else {
    maximum = subscriptionInfos.count; // Utilise l'abonnement sélectionné
  }

  let borrowCapacity;
  // Calcul de la capacité d'emprunt actuelle
  if (user.value.hasSubscribed) {
    // Si l'utilisateur a déjà un abonnement, sa capacité d'emprunt est égale au nombre total autorisé - le nombre en cours
    borrowCapacity = user.value.authorisedLoans - user.value.ongoingLoans;
  } else {
    // Sinon, on utilise la capacité de l'abonnement sélectionné
    borrowCapacity = subscriptionInfos.count;
  }

  // ===== EFFECTS =====

  useEffect(() => {
    // Met à jour la capacité d'emprunt future quand le panier est mis à jour (œuvre ajoutée ou retirée)
    setFuturBorrowCapacity(borrowCapacity - cartCount); // Capacité future = capacité actuelle - nombre d'œuvres dans le panier
  }, [cartCount, borrowCapacity]);

  // Désactive le bouton "Terminer" si le crédit est insuffisant
  const isDisabled = cartCount > borrowCapacity;

  // ===== FONCTION PRINCIPALE DE VALIDATION POUR PASSER AU PAIEMENT =====
  const validate = async () => {
    // ===== CAS 1: UTILISATEUR SANS ABONNEMENT =====
    // Doit passer par le processus de paiement Stripe
    if (!user.value.hasSubscribed) {
      //CAS 1: l'utilisateur souscrit à un abonnement
      //Cascade d'action → souscription abonnement avec paiement par Stripe puis fetch pour mettre à jour base de données
      try {
        // ÉTAPE 1: Requête pour création du client Stripe
        const createCustomer = await fetch(
          `${fetchAddress}/payments/create-customer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.value.email,
              name: user.value.firstname,
            }),
          }
        );

        // Si la requête a réussi, on récupère les informations du client dans la variable customer
        if (createCustomer.status === 200) {
          const customer = await createCustomer.json();

          // ÉTAPE 2: Création de l'abonnement Stripe
          const createSubscription = await fetch(
            `${fetchAddress}/payments/create-subscription`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subscriptionType: subscriptionInfos.type,
                quantity: subscriptionInfos.count, // Nombre d'œuvres autorisées par l'abonnement
                customerId: customer.customerId,
              }),
            }
          );

          // Si la requête a réussi, on récupère les informations de l'abonnement dans la variable subscription
          if (createSubscription.status === 200) {
            const subscription = await createSubscription.json();

            // ÉTAPE 3: Initialisation du PaymentSheet Stripe
            const { error: initError } = await initPaymentSheet({
              paymentIntentClientSecret: subscription.clientSecret, // Clé secrète pour le paiement
              merchantDisplayName: "Artlinker", // Nom affiché lors du paiement
              returnURL: "stripe-example://payment-sheet", // URL de retour après paiement
              allowsDelayedPaymentMethods: false, // Autorise les méthodes de paiement différé
            });

            if (initError) {
              showModal(
                "Erreur",
                "Erreur lors de l'initialisation du paiement."
              );
              return;
            }

            // ÉTAPE 4: Présentation du PaymentSheet (page de collecte des informations de paiement) à l'utilisateur
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
              // Gestion des différents types d'erreurs de paiement
              if (presentError.code === PaymentSheetError.Failed) {
                showModal("Erreur", "Le paiement a échoué.");
              } else if (presentError.code === PaymentSheetError.Canceled) {
                showModal("Erreur", "Paiement annulé.");
              }
              return;
            }

            // ÉTAPE 5: Création de l'abonnement dans la base de données locale
            // Cette étape enregistre l'abonnement côté serveur après validation du paiement Stripe
            const body = {
              token: user.value?.token, // Token JWT de l'utilisateur pour l'authentification
              subscriptionType: subscriptionInfos.type, // Type d'abonnement (INDIVIDUAL_BASIC_COST, etc.)
              count: subscriptionInfos.count, // Nombre d'œuvres autorisées par l'abonnement
              price: subscriptionInfos.price, // Prix payé pour l'abonnement
              stripeSubscriptionId: subscription.subscriptionId, // ID de l'abonnement Stripe pour traçabilité et gestion future
            };

            try {
              // Appel API pour créer l'abonnement dans notre base de données
              const response = await fetch(
                `${fetchAddress}/subscriptions/create`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                }
              );

              const data = await response.json();

              // Vérification que la création de l'abonnement s'est bien passée
              if (!data.result) {
                // Si erreur côté serveur, on affiche le message d'erreur et on arrête le processus
                showModal(
                  "Erreur",
                  data.error || "Erreur lors de la création de l'abonnement."
                );
                return; // Arrêt de la fonction, aucune œuvre ne sera empruntée
              }
            } catch (err) {
              // Gestion des erreurs réseau (pas de connexion, serveur down, etc.)
              console.error(
                "Erreur réseau lors de la création de l'abonnement:",
                err
              );
              showModal(
                "Erreur",
                "Erreur réseau ou serveur lors de la création de l'abonnement."
              );
              return; // Arrêt de la fonction
            }

            // ÉTAPE 6: Création des emprunts pour chaque œuvre du panier
            // Maintenant que l'abonnement est validé et enregistré, on peut créer les emprunts

            // Boucle séquentielle pour traiter chaque œuvre une par une
            for (const art of artworks) {
              try {
                // Préparation des données pour créer l'emprunt
                const body = {
                  token: user.value.token, // Token utilisateur pour l'authentification
                  artitemId: art.id, // ID de l'œuvre à emprunter
                };

                // Appel API pour créer l'emprunt de cette œuvre spécifique
                const response = await fetch(
                  `${fetchAddress}/artitems/createloan`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }
                );

                const data = await response.json();

                // Vérification que la création de l'emprunt s'est bien passée
                if (!data.result) {
                  // Si erreur pour cette œuvre, on affiche l'erreur avec le nom de l'œuvre
                  console.error(
                    `Erreur lors de la création de l'emprunt pour ${art.title}:`,
                    data.error
                  );
                  showModal(
                    "Erreur",
                    data.error ||
                      `Erreur lors de la création du prêt pour l'œuvre ${art.title}`
                  );
                  return; // Arrêt complet du processus si une œuvre échoue
                }
              } catch (err) {
                // Gestion des erreurs réseau pour cette œuvre spécifique
                console.error(`Erreur réseau pour l'œuvre ${art.title}:`, err);
                showModal("Erreur", "Erreur réseau ou serveur");
                return; // Arrêt complet si erreur réseau
              }
            }

            // ÉTAPE 7: Mise à jour du store Redux
            // Mise à jour des données utilisateur dans l'état global de l'application
            dispatch(updateOnGoingLoans(artworks.length)); // Incrémente le nombre d'emprunts en cours
            dispatch(
              updateSubscription({ authorisedLoans: subscriptionInfos.count })
            ); // Met à jour les informations d'abonnement

            //CLAIRE

            // ÉTAPE 8: Paiement réussi - Affichage du message de confirmation
            // Affichage du message de succès final avec redirection
            showModal(
              "Paiement confirmé", // Titre de la modale
              "Votre abonnement ainsi que vos emprunts ont été enregistrés avec succès.", // Message de confirmation
              [
                {
                  text: "OK", // Texte du bouton
                  onPress: () => {
                    navigation.navigate("Account"); // Redirection vers la page compte utilisateur
                    dispatch(clearCart()); // Vide complètement le panier
                  },
                },
              ]
            );
          }
        }
      } catch (error) {
        showModal("Erreur", "Erreur lors du paiement.");
        console.error("Error:", error);
      }
    } else {
      //RAPHAEL

      // ===== CAS 2: UTILISATEUR AVEC ABONNEMENT EXISTANT =====
      // Création directe des emprunts sans paiement

      // Boucle de création des emprunts pour chaque œuvre du panier
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

      // Si tout s'est bien passé pour toutes les œuvres
      dispatch(updateOnGoingLoans(user.value.ongoingLoans + cartCount)); // Mise à jour du nombre d'emprunts en cours

      // Affichage du message de confirmation et redirection
      showModal(
        "Confirmation d'emprunt",
        "Votre emprunt a été enregistré avec succès.",
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Account");
              dispatch(clearCart());
            },
          },
        ]
      );
    }
  };

  // ===== FONCTION DE SUPPRESSION D'UNE ŒUVRE DU PANIER =====
  const handleDelete = (id) => {
    dispatch(removeFromCart({ id })); // Supprime l'œuvre du panier via Redux
  };

  // ===== RENDU DU COMPOSANT =====
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Titre de la page */}
      <Text style={[globalStyles.h2, styles.title]}>Récapitulatif</Text>

      {/* Section des cartes d'œuvres */}
      <View style={StyleSheet.card}>
        <View style={styles.cardsContainer}>
          {artworks.map((art) => (
            <View key={art.id} style={styles.card}>
              {/* Image de l'œuvre avec bouton de suppression */}
              <View style={styles.cardImageWrapper}>
                <Image source={{ uri: art.image }} style={styles.cardImage} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.trashIcon}
                  onPress={() => handleDelete(art.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Zone cliquable élargie
                >
                  <FontAwesome
                    name="times-circle"
                    size={20}
                    color={globalStyles.darkred.color}
                  />
                </TouchableOpacity>
              </View>

              {/* Informations de l'œuvre */}
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

              {/* Distance */}
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

      {/* Section des informations récapitulatives */}
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
        <Text style={{ fontWeight: "bold" }}>{cartCount}</Text>
      </Text>
      <Text style={styles.info}>
        Crédit(s) restant(s) après emprunt:{" "}
        <Text style={{ fontWeight: "bold" }}>{futurBorrowCapacity}</Text>
      </Text>

      {/* Affichage du prix uniquement pour les nouveaux utilisateurs */}
      {!user.value?.hasSubscribed && (
        <Text style={styles.info}>
          Prix total : <Text style={{ fontWeight: "bold" }}>{price} €</Text>
        </Text>
      )}

      {/* Boutons d'action */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={globalStyles.buttonRed}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={globalStyles.buttonRedText}>Ajouter d'autres œuvres</Text>
      </TouchableOpacity>

      {/* Bouton de validation principal - désactivé si le crédit est insuffisant */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[globalStyles.buttonRed, isDisabled && { opacity: 0.5 }]}
        onPress={validate}
        disabled={isDisabled}
      >
        <Text style={globalStyles.buttonRedText}>Terminer</Text>
      </TouchableOpacity>

      {/* Message d'erreur si le crédit est insuffisant */}
      {isDisabled && (
        <Text style={{ color: globalStyles.darkred.color, marginTop: 10 }}>
          Crédit insuffisant, veuillez réduire le nombre d'œuvres.
        </Text>
      )}

      {/* Bouton pour vider le panier */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={globalStyles.buttonRed}
        onPress={() => dispatch(clearCart())}
      >
        <Text style={globalStyles.buttonRedText}>Vider le panier</Text>
      </TouchableOpacity>

      {/* Modale personnalisée pour les messages d'alerte et de confirmation */}
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

// ===== STYLES =====
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
    width: "48%", // 2 cartes par ligne
    columnGap: 10, // Espace entre les deux colonnes
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  // Pour éviter un marginRight sur la dernière carte de chaque ligne
  lastCardInRow: {
    marginRight: 0,
  },
  cardImageWrapper: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 5,
    position: "relative",
    borderColor: "transparent", // Nécessaire pour que l'ombre soit visible
    borderWidth: 1, // Nécessaire pour que l'ombre soit visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // Équivalent shadowRadius mais pour Android
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#666",
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
