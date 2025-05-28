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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddress } from "../components/FetchAddress";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../reducers/user";
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

  //FETCH DE TOUTES LES DONNEES UTILISATEURS
  useEffect(() => {
    if (isFocused) {
      // utilisation de isFocused pour re-mount l'écran Account à chaque fois qu'on clique dessus
      if (isConnected) {
        fetch(`${fetchAddress}/users/${user.token}`)
          .then((response) => response.json())
          .then((data) => {
            // console.log("User data fetched:", data);
            setUserData(data.userData);
          });
      }
    }
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
  // Bouton mes informations personnelles
  const handleInfoScreen = () => {
    //console.log("handleInfoScreen called with userData:", userData);
    const combinedUserData = {
      _id: userData._id,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      token: userData.token,
      phone: userData.phone,
      address: userData.address,
      avatar: userData.avatar,
    };

    navigation.navigate("Stack", {
      screen: "AccountInfo",
      params: { userData: combinedUserData },
    });
  };

  // Bouton mon abonnement
  const handleSubScreen = () => {
    const combinedUserData = {
      _id: userData._id,
      token: userData.token,
      subscription: userData.subscription,
    };

    navigation.navigate("Stack", {
      screen: "AccountSub",
      params: { userData: combinedUserData },
    });
  };

  // Bouton oeuvres en cours d'emprunt
  const handleLoansScreen = () => {
    const combinedUserData = {
      _id: userData._id,
      token: userData.token,
      ongoingLoans: userData.ongoingLoans,
    };

    navigation.navigate("Stack", {
      screen: "AccountLoans",
      params: { userData: combinedUserData },
    });
  };

  // Bouton historiques des emprunts
  const handleOldLoansScreen = () => {
    const combinedUserData = {
      _id: userData._id,
      token: userData.token,
      previousLoans: userData.previousLoans,
    };

    navigation.navigate("Stack", {
      screen: "AccountOldLoans",
      params: { userData: combinedUserData },
    });
  };

  // Bouton mes favoris
  const handleFavoritesScreen = () => {
    const combinedUserData = {
      _id: userData._id,
      token: userData.token,
      favoriteItems: userData.favoriteItems,
    };

    navigation.navigate("Stack", {
      screen: "AccountFavorites",
      params: { userData: combinedUserData },
    });
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
          <TouchableOpacity
            style={globalStyles.buttonRed}
            onPress={() =>
              navigation.navigate("Stack", { screen: "Connection" })
            }
          >
            <Text style={globalStyles.buttonRedText}>
              Se connecter / Créer un compte
            </Text>
          </TouchableOpacity>
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
                <TouchableOpacity
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
                </TouchableOpacity>
              </View>
              <View style={styles.documentsUserInfo}>
                <Text style={[globalStyles.h3, { textAlign: "center" }]}>
                  Documents de garantie
                </Text>
                {/* Bouton Piece Identité */}
                <TouchableOpacity
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
              style={globalStyles.buttonRed}
              onPress={() => handleLogout()}
            >
              <Text style={globalStyles.buttonRedText}>Me déconnecter</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollviewContainer: {
    flexGrow: 1,
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
  },
  userImage: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15, // pour un cercle
    borderColor: "white",
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
});
