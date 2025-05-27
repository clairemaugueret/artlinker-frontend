import { useEffect, useState, useRef, use } from "react";
import { globalStyles } from "../globalStyles";
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

// export default function AccountScreen({ navigation }) {
//   const user = useSelector((state) => state.user.value);
//   const subscription = useSelector((state) => state.subscription);
//   return (
//     <View style={styles.container}>
//       <Text>
//         Reducer User:
//         {"\n"}Email: {user.email}
//         {"\n"}Name: {user.firstname} {user.lastname}
//         {"\n"}Token: {user.token}
//         {"\n"}Position:{" "}
//         {user.position
//           ? user.position.latitude + ", " + user.position.longitude
//           : "Not set"}
//         {"\n"}Ongoing Loans: {user.ongoingLoans}
//         {"\n"}Authorised Loans: {user.authorisedLoans}
//         {"\n"}Has Subscribed: {user.hasSubcribed ? "True" : "False"}
//       </Text>
//       <Text>
//         Reducer Sub:
//         {"\n"}Type: {subscription.type}
//         {"\n"}Count: {subscription.count}
//         {"\n"}Price: {subscription.price}
//         {"\n"}State: {subscription.subscriptionState ? "True" : "False"}
//       </Text>

//       <Text style={styles.title}>Account Screen</Text>
//       <TouchableOpacity onPress={() => AsyncStorage.clear()}>
//         <Text>Vider le storage</Text>
//       </TouchableOpacity>
//       <Button
//         title="Info personnelles"
//         onPress={() => navigation.navigate("Stack", { screen: "AccountInfo" })}
//       />
//       <Button
//         title="Abonnement"
//         onPress={() => navigation.navigate("Stack", { screen: "AccountSub" })}
//       />
//       <Button
//         title="Emprunts en cours"
//         onPress={() => navigation.navigate("Stack", { screen: "AccountLoans" })}
//       />
//       <Button
//         title="Emprunts passés"
//         onPress={() =>
//           navigation.navigate("Stack", { screen: "AccountOldLoans" })
//         }
//       />
//       <Button
//         title="Favoris"
//         onPress={() =>
//           navigation.navigate("Stack", { screen: "AccountFavorites" })
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 20,
//   },
//   image: {
//     width: "100%",
//     height: "50%",
//   },
//   title: {
//     width: "80%",
//     fontSize: 38,
//     fontWeight: "600",
//   },
// });

export default function AccountScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const subscription = useSelector((state) => state.subscription);
  const cart = useSelector((state) => state.cart.artWorkInCart);
  const [userData, setUserData] = useState(null);

  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);

  const handleLogout = () => {
    AsyncStorage.clear();
    dispatch(logout());
    dispatch(clearSubscription());
    dispatch(clearCart());
    navigation.navigate("Stack", { screen: "Home" });
  };

  //FETCH DE TOUTES LES DONNEES UTILISATEURS
  useEffect(() => {
    if (user.token) {
      setIsConnected(true);

      fetch(`${fetchAddress}/users/${user.token}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.userData);
        });
    }
  }, [user.token]);

  //VERIFICATION SI PANIER EN COURS
  const hasOngoingCart = Boolean(cart.length > 0);

  //GESTION DES BOUTONS
  // Bouton mes informations personnelles
  const handleInfoScreen = () => {
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

    console.log("handleInfoScreen called with userData:", combinedUserData);
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

    console.log("handleSubScreen called with userData:", combinedUserData);
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

    console.log("handleLoansScreen called with userData:", combinedUserData);
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

    console.log("handleOldLoansScreen called with userData:", combinedUserData);
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

    console.log(
      "handleFavoritesScreen called with userData:",
      combinedUserData
    );
  };

  return (
    <View style={styles.mainContainer}>
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
              <Text style={globalStyles.darkred}>{userData?.firstname}</Text>
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
              <Text style={globalStyles.buttonRedText}>Voir mon panier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.buttonWhite,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
              onPress={() => handleInfoScreen()}
            >
              <Text style={globalStyles.buttonWhiteText}>
                Mes informations personnelles
              </Text>
              <FontAwesome
                name="angle-right"
                size={30}
                style={globalStyles.darkgreen}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.buttonWhite,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
              onPress={() => handleSubScreen()}
            >
              <Text style={globalStyles.buttonWhiteText}>Mon abonnement</Text>
              <FontAwesome
                name="angle-right"
                size={30}
                style={globalStyles.darkgreen}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.buttonWhite,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
              onPress={() => handleLoansScreen()}
            >
              <Text style={globalStyles.buttonWhiteText}>
                Œuvres en cours d'emprunt
              </Text>
              <FontAwesome
                name="angle-right"
                size={30}
                style={globalStyles.darkgreen}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.buttonWhite,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
              onPress={() => handleOldLoansScreen()}
            >
              <Text style={globalStyles.buttonWhiteText}>
                Historique des œuvres empruntées
              </Text>
              <FontAwesome
                name="angle-right"
                size={30}
                style={globalStyles.darkgreen}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                globalStyles.buttonWhite,
                { flexDirection: "row", justifyContent: "space-between" },
              ]}
              onPress={() => handleFavoritesScreen()}
            >
              <Text style={globalStyles.buttonWhiteText}>Mes favoris</Text>
              <FontAwesome
                name="angle-right"
                size={30}
                style={globalStyles.darkgreen}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.documentsUserInfo}>
            <Text>documentsUserInfo</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
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
    height: screenHeight * 0.15,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    // height: screenHeight * 0.4, à revoir
    gap: 15,
    padding: 10,
  },
  documentsUserInfo: {
    width: "100%",
    height: screenHeight * 0.15,
    backgroundColor: "green",
  },
  loginBtnContainer: {
    marginTop: 10,
    marginBottom: -10,
    marginHorizontal: 50,
  },
});
