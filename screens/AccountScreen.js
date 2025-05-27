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

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.scrollviewAlignment}>
          <View style={styles.headerUserInfo}>
            <Text>headerUserInfo</Text>
          </View>
          <View style={styles.buttonsUserInfo}>
            <TouchableOpacity
              style={globalStyles.buttonWhite}
              onPress={() =>
                navigation.navigate("Stack", {
                  screen: "AccountInfo",
                  params: { userData: userData },
                })
              }
            >
              <Text
                style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
              >
                Mes informations personnelles
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonWhite}
              onPress={() =>
                navigation.navigate("Stack", {
                  screen: "AccountSub",
                  params: { userData: userData },
                })
              }
            >
              <Text
                style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
              >
                Mon abonnement
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonWhite}
              onPress={() =>
                navigation.navigate("Stack", {
                  screen: "AccountLoans",
                  params: { userData: userData },
                })
              }
            >
              <Text
                style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
              >
                Œuvres en cours d'emprunt
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonWhite}
              onPress={() =>
                navigation.navigate("Stack", {
                  screen: "AccountOldLoans",
                  params: { userData: userData },
                })
              }
            >
              <Text
                style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
              >
                Historiques des oeuvres empruntées
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonWhite}
              onPress={() =>
                navigation.navigate("Stack", {
                  screen: "AccountFavorites",
                  params: { userData: userData },
                })
              }
            >
              <Text
                style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
              >
                Mes favoris
              </Text>
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
          <Text style={globalStyles.buttonRedText}>Déconnexion</Text>
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
    backgroundColor: "red",
  },
  buttonsUserInfo: {
    width: "100%",
    // height: screenHeight * 0.4, à revoir
    gap: 15,
  },
  documentsUserInfo: {
    width: "100%",
    height: screenHeight * 0.15,
    backgroundColor: "green",
  },
  loginBtnContainer: {
    marginTop: 10,
    marginBottom: -10,
    marginHorizontal: 30,
  },
});
