import { useEffect, useState, useRef, use } from "react";
import { useIsFocused } from "@react-navigation/native";
import { globalStyles } from "../globalStyles";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddress } from "../components/FetchAddress";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  logout,
  setReminderUpcomingEndLoan,
  setReminderExpiredLoan,
} from "../reducers/user";
import { clearSubscription } from "../reducers/subscription";
import { clearCart } from "../reducers/cart";

import { FormatDate } from "../components/FormatDate";

import IdentityCardModal from "../components/IdentityCardModal";
import ProofResidencyModal from "../components/ProofResidencyModal";
import CertificateModal from "../components/CertificateModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

export default function AccountScreen({ navigation }) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const cart = useSelector((state) => state.cart.artWorkInCart);

  const [userData, setUserData] = useState(null);
  const isConnected = Boolean(user.token);

  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showProofResidencyModal, setShowProofResidencyModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const [showModalEndLoan, setShowModalEndLoan] = useState(false);
  const [upcomingReturnsTitles, setUpcomingReturnsTitles] = useState([]);
  const [expiredLoansTitles, setExpiredLoansTitles] = useState([]);

  // FETCH DE TOUTES LES DONNEES UTILISATEUR
  useEffect(() => {
    // Ce code se lance quand l'écran devient actif (grâce à useIsFocused)
    if (isFocused) {
      // Si l'utilisateur est connecté
      if (isConnected) {
        // Requête GET vers l'API pour récupérer les données de l'utilisateur connecté
        fetch(`${fetchAddress}/users/${user.token}`)
          .then((response) => response.json())
          .then((data) => {
            setUserData(data.userData);

            // Définition des dates de comparaison pour rappels de fin d'emprunt
            const today = new Date(); // aujourd'hui
            const inTwoWeeks = new Date(); // dans 14 jours
            inTwoWeeks.setDate(today.getDate() + 14);

            // Tableaux pour stocker les titres à rappeler
            const newUpcomingTitles = []; // pour les prêts à rendre bientôt
            const newExpiredTitles = []; // pour les prêts expirés

            // On parcourt tous les prêts en cours
            data.userData.ongoingLoans.forEach((loan) => {
              const title = loan.artItem.title; // titre de l'œuvre
              const endDate = new Date(loan.artItem.expectedReturnDate); // date de retour prévue

              // Si l'œuvre a déjà été rappelée (proche ou expirée = et donc titre stocké dans le reducer user), on l'ignore
              if (
                user.reminderUpcomingEndLoans.includes(title) ||
                user.reminderExpiredLoans.includes(title)
              ) {
                return;
              }

              // Sinon, si la date de retour est passée ou aujourd’hui → prêt expiré
              if (endDate <= today) {
                newExpiredTitles.push(title);
              }
              // Sinon, si la date est dans les 14 prochains jours → prêt à rendre bientôt
              else if (endDate <= inTwoWeeks) {
                newUpcomingTitles.push(title);
              }
            });

            // Si on a détecté de nouveaux prêts à rendre bientôt
            if (newUpcomingTitles.length > 0) {
              // On les enregistre dans le reducer pour éviter un second rappel
              dispatch(setReminderUpcomingEndLoan(newUpcomingTitles));
              // Et on les stocke localement pour les afficher dans la modale
              setUpcomingReturnsTitles(newUpcomingTitles);
            }

            // Idem pour les prêts expirés
            if (newExpiredTitles.length > 0) {
              dispatch(setReminderExpiredLoan(newExpiredTitles));
              setExpiredLoansTitles(newExpiredTitles);
            }

            // Si au moins un nouveau rappel a été détecté, on affiche la modale
            if (newUpcomingTitles.length > 0 || newExpiredTitles.length > 0) {
              setShowModalEndLoan(true);
            }
          });
      }
    }
    // Ce useEffect se relance quand :
    // - l'écran est re-focus (isFocused)
    // - une des 3 modales (pièces justificatives) est fermée ou ouverte
  }, [
    isFocused,
    showIdentityModal,
    showProofResidencyModal,
    showCertificateModal,
  ]);

  //VERIFICATION SI PANIER EN COURS
  const hasOngoingCart = Boolean(cart.length > 0);

  //POUR LES DOCUMENTS
  const hasValidId =
    userData?.identityCard &&
    new Date(userData?.identityCard.expirationDate) > new Date();

  const hasValidProofResidency =
    userData?.proofOfResidency &&
    new Date(userData?.proofOfResidency.expirationDate) > new Date();

  const hasValidCertificate =
    userData?.civilLiabilityCertificate &&
    new Date(userData?.civilLiabilityCertificate.expirationDate) > new Date();

  //GESTION DE LA DECONNEXION
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearSubscription());
    dispatch(clearCart());
    AsyncStorage.clear();
    navigation.navigate("Stack", { screen: "Home" });
  };

  //GESTION DES BOUTONS
  // Fonction réutilisable pour naviguer vers un écran avec des champs spécifiques de userData
  const navigateWithUserData = (screen, fields) => {
    if (!userData) return; // Si les données utilisateur ne sont pas disponibles, on ne fait rien

    // Création d'un objet contenant uniquement les champs nécessaires de userData
    const selectedData = fields.reduce((acc, field) => {
      // Pour chaque champ demandé, on ajoute une propriété correspondante de userData dans l'objet acc (accumulateur)
      acc[field] = userData[field];
      return acc; // On retourne l'accumulateur mis à jour pour l'itération suivante
    }, {}); // On initialise l'accumulateur comme un objet vide

    // Navigation vers l'écran cible en passant les données sélectionnées en paramètres
    navigation.navigate("Stack", {
      screen,
      params: { userData: selectedData },
    });
  };

  // Bouton : Mes informations personnelles
  const handleInfoScreen = () => {
    navigateWithUserData("AccountInfo", [
      "_id",
      "firstname",
      "lastname",
      "email",
      "password",
      "token",
      "phone",
      "address",
      "avatar",
    ]);
  };

  // Bouton : Mon abonnement
  const handleSubScreen = () => {
    navigateWithUserData("AccountSub", ["_id", "token", "subscription"]);
  };

  // Bouton : Œuvres en cours d'emprunt
  const handleLoansScreen = () => {
    navigateWithUserData("AccountLoans", ["_id", "token", "ongoingLoans"]);
  };

  // Bouton : Historique des emprunts
  const handleOldLoansScreen = () => {
    navigateWithUserData("AccountOldLoans", ["_id", "token", "previousLoans"]);
  };

  // Bouton : Mes favoris
  const handleFavoritesScreen = () => {
    navigateWithUserData("AccountFavorites", ["_id", "token", "favoriteItems"]);
  };

  return (
    <View style={styles.mainContainer}>
      {!isConnected ? (
        // Si pas connecté alors pas d'affichage autre que bouton connexion/inscription
        <View>
          <Text
            style={[globalStyles.h1, { textAlign: "center", marginBottom: 20 }]}
          >
            <Text style={globalStyles.darkred}>C</Text>
            onnectez-vous pour accéder à votre profil.
          </Text>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[globalStyles.buttonRed, { width: "80%" }]}
              onPress={() =>
                navigation.navigate("Stack", { screen: "Connection" })
              }
            >
              <Text style={globalStyles.buttonRedText}>
                Se connecter / Créer un compte
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollviewContainer}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.scrollviewAlignment}>
              <View style={styles.headerUserInfo}>
                <Image
                  source={
                    userData?.avatar // vérification si l'avatar existe sinon image par défaut
                      ? { uri: userData.avatar }
                      : require("../assets/user-default-picture.png")
                  }
                  style={styles.userImage}
                />
                <Text style={[globalStyles.h1, { marginBottom: 0 }]}>
                  <Text style={globalStyles.darkred}>
                    {userData?.firstname}
                  </Text>
                  {"\n"}
                  {userData?.lastname}
                </Text>
              </View>
              <View style={styles.buttonsUserInfo}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonRed,
                    { marginBottom: 0, marginTop: 0, paddingVertical: 12 },
                    !hasOngoingCart && { opacity: 0.5 },
                  ]}
                  onPress={() =>
                    navigation.navigate("Stack", {
                      screen: "Cart",
                    })
                  }
                  disabled={!hasOngoingCart} // désactive le bouton si pas de panier
                >
                  <Text style={globalStyles.buttonRedText}>
                    Voir mon panier
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => handleInfoScreen()}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Mes informations personnelles
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    style={globalStyles.darkgray}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => handleSubScreen()}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Mon abonnement
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    style={globalStyles.darkgray}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => handleLoansScreen()}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Œuvres en cours d'emprunt
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    style={globalStyles.darkgray}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => handleOldLoansScreen()}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Historique des œuvres empruntées
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    style={globalStyles.darkgray}
                  />
                </TouchableOpacity>
                {/* Bouton favoris pour plus tard */}
                {/* <TouchableOpacity activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => handleFavoritesScreen()}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Mes favoris
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={20}
                    style={globalStyles.darkgray}
                  />
                </TouchableOpacity> */}
              </View>
              <View style={styles.documentsUserInfo}>
                <Text style={[globalStyles.h3, { textAlign: "center" }]}>
                  Documents de garantie
                </Text>
                {/* Bouton Piece Identité */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => setShowIdentityModal(true)}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Pièce d'identité
                  </Text>
                  <FontAwesome
                    name={hasValidId ? "check" : "plus"}
                    size={20}
                    style={
                      hasValidId ? globalStyles.darkgreen : globalStyles.darkred
                    }
                  />
                </TouchableOpacity>
                {hasValidId ? (
                  <Text
                    style={[
                      globalStyles.p,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Document valide jusqu'au :{" "}
                    {FormatDate(userData.identityCard.expirationDate)}
                  </Text>
                ) : (
                  <Text
                    style={[
                      globalStyles.p,
                      globalStyles.darkred,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Veuillez ajouter le document manquant.
                  </Text>
                )}
                <IdentityCardModal
                  isOpen={showIdentityModal}
                  onClose={() => setShowIdentityModal(false)}
                  userToken={userData?.token} // on passe le token pour la modale
                />
                {/* Bouton Justificatif Domicile */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => setShowProofResidencyModal(true)}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Justificatif de domicile
                  </Text>
                  <FontAwesome
                    name={hasValidProofResidency ? "check" : "plus"}
                    size={20}
                    style={
                      hasValidProofResidency
                        ? globalStyles.darkgreen
                        : globalStyles.darkred
                    }
                  />
                </TouchableOpacity>
                {hasValidProofResidency ? (
                  <Text
                    style={[
                      globalStyles.p,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Document valide jusqu'au :{" "}
                    {FormatDate(userData.proofOfResidency.expirationDate)}
                  </Text>
                ) : (
                  <Text
                    style={[
                      globalStyles.p,
                      globalStyles.darkred,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Veuillez ajouter le document manquant.
                  </Text>
                )}
                <ProofResidencyModal
                  isOpen={showProofResidencyModal}
                  onClose={() => setShowProofResidencyModal(false)}
                  userToken={userData?.token} // on passe le token pour la modale
                />
                {/* Bouton Responsabilité Civile */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    globalStyles.buttonWhite,
                    { flexDirection: "row", justifyContent: "space-between" },
                  ]}
                  onPress={() => setShowCertificateModal(true)}
                >
                  <Text
                    style={[
                      globalStyles.buttonWhiteText,
                      { marginLeft: -5, marginRight: 10 },
                    ]}
                  >
                    Attestation de Responsabilité Civile
                  </Text>
                  <FontAwesome
                    name={hasValidCertificate ? "check" : "plus"}
                    size={20}
                    style={
                      hasValidCertificate
                        ? globalStyles.darkgreen
                        : globalStyles.darkred
                    }
                  />
                </TouchableOpacity>
                {hasValidCertificate ? (
                  <Text
                    style={[
                      globalStyles.p,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Document valide jusqu'au :{" "}
                    {FormatDate(
                      userData.civilLiabilityCertificate.expirationDate
                    )}
                  </Text>
                ) : (
                  <Text
                    style={[
                      globalStyles.p,
                      globalStyles.darkred,
                      { marginTop: -10, marginLeft: 5, fontSize: 15 },
                    ]}
                  >
                    Veuillez ajouter le document manquant.
                  </Text>
                )}
                <CertificateModal
                  isOpen={showCertificateModal}
                  onClose={() => setShowCertificateModal(false)}
                  userToken={userData?.token} // on passe le token pour la modale
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.loginBtnContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={globalStyles.buttonRed}
              onPress={() => handleLogout()}
            >
              <Text style={globalStyles.buttonRedText}>Me déconnecter</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {/* Modal pour notification de fin d'emprunt */}
      <Modal transparent={true} visible={showModalEndLoan} animationType="fade">
        <View style={styles.endLoanModalView}>
          <View style={styles.endLoanModalContainer}>
            {upcomingReturnsTitles.length > 0 && (
              <Text
                style={[
                  globalStyles.h4,
                  { textAlign: "center", marginVertical: 5 },
                ]}
              >
                Emprunt(s) à retourner d'ici 2 semaines :
              </Text>
            )}
            {upcomingReturnsTitles.map((title, index) => (
              <Text key={index} style={globalStyles.p}>
                • {title}
              </Text>
            ))}
            {expiredLoansTitles.length > 0 && (
              <Text
                style={[
                  globalStyles.h4,
                  { textAlign: "center", marginVertical: 5 },
                ]}
              >
                Emprunt(s) à retourner dès maintenant :
              </Text>
            )}
            {expiredLoansTitles.map((title, index) => (
              <Text key={index} style={globalStyles.p}>
                • {title}
              </Text>
            ))}
            <View
              style={{ marginTop: 20, width: "100%", alignItems: "center" }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[globalStyles.buttonRed, { width: "40%" }]}
                onPress={() => {
                  setShowModalEndLoan(false);
                  setUpcomingReturnsTitles([]);
                  setExpiredLoansTitles([]);
                  handleLoansScreen();
                }}
              >
                <Text style={globalStyles.buttonRedText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollviewContainer: {
    flexGrow: 1,
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  scrollviewAlignment: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headerUserInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: 20,
    paddingRight: 20,
  },
  userImage: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15, // pour un cercle
    borderColor: "transparent",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  buttonsUserInfo: {
    width: "100%",
    gap: 15,
    padding: 10,
    paddingTop: 25,
  },
  documentsUserInfo: {
    width: "100%",
    gap: 15,
    padding: 10,
    paddingTop: 25,
  },
  loginBtnContainer: {
    marginTop: 0,
    marginBottom: 5,
    marginHorizontal: 50,
  },
  endLoanModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  endLoanModalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
