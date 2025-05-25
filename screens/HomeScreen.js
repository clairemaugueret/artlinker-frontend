import { globalStyles } from "../globalStyles";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

export default function HomeScreen({ navigation }) {
  const darkred = globalStyles.darkred.color;
  const [showTarifsNormal, setShowTarifsNormal] = useState(false);
  const [showTarifsSpecial, setShowTarifsSpecial] = useState(false);
  const [showTarifsPublic, setShowTarifsPublic] = useState(false);
  const [showTarifsBusiness, setShowTarifsBusiness] = useState(false);

  const toggleTarifsNormal = () => {
    setShowTarifsNormal(!showTarifsNormal);
    setShowTarifsSpecial(false);
    setShowTarifsPublic(false);
    setShowTarifsBusiness(false);
  };

  const toggleTarifsSpecial = () => {
    setShowTarifsSpecial(!showTarifsSpecial);
    setShowTarifsNormal(false);
    setShowTarifsPublic(false);
    setShowTarifsBusiness(false);
  };

  const toggleTarifsPublic = () => {
    setShowTarifsPublic(!showTarifsPublic);
    setShowTarifsNormal(false);
    setShowTarifsSpecial(false);
    setShowTarifsBusiness(false);
  };

  const toggleTarifsBusiness = () => {
    setShowTarifsBusiness(!showTarifsBusiness);
    setShowTarifsNormal(false);
    setShowTarifsSpecial(false);
    setShowTarifsPublic(false);
  };
  return (
    //     <View style={styles.container}>
    //       <Text style={[globalStyles.h1, globalStyles.darkred]}>Home Screen</Text>
    //       <View style={{ width: "70%", height: "70%", gap: 20 }}>
    //         <Button
    //           title="Go to Art Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Art" })}
    //         />
    //         <Button
    //           title="Go to Cart Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Cart" })}
    //         />
    //         <Button
    //           title="Go to Connection Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Connection" })}
    //         />
    //         <Button
    //           title="Go to List Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "List" })}
    //         />
    //         <Button
    //           title="Go to Payment Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Payment" })}
    //         />
    //         <Button
    //           title="Go to Price Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Price" })}
    //         />
    //         <Button
    //           title="Go to Sub Screen"
    //           onPress={() => navigation.navigate("Stack", { screen: "Sub" })}
    //         />
    //       </View>
    //     </View>

    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollviewContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require("../assets/logo-picto.png")}
          style={styles.logo}
        />
        <Text style={[globalStyles.big, styles.title]}>
          <Text style={globalStyles.darkred}>A</Text>RTLINKER
        </Text>
        <Text style={[globalStyles.p, globalStyles.darkred, styles.subtitle]}>
          L'artothèque sociale et solidaire
        </Text>
        <Text style={[globalStyles.h3, { marginVertical: 10 }]}>
          COMMENT ÇA MARCHE ?
        </Text>
        <View>
          <Image
            source={require("../assets/fake-map.png")}
            style={styles.backgroundMap}
          />
          <View style={styles.containerOne}>
            <Text
              style={[
                globalStyles.nunitoBold,
                globalStyles.darkredback,
                styles.roundedNumber,
              ]}
            >
              1
            </Text>
            <Text
              style={[
                globalStyles.h4,
                globalStyles.darkred,
                { textAlign: "center" },
              ]}
            >
              TROUVEZ DES ŒUVRES À EMPRUNTER SUR NOTRE CARTE INTÉRACTIVE
            </Text>
          </View>
        </View>
        <Text
          style={[
            globalStyles.nunitoBold,
            globalStyles.darkredback,
            styles.roundedNumber,
          ]}
        >
          2
        </Text>
        <Text
          style={[
            globalStyles.h4,
            globalStyles.darkred,
            { textAlign: "center" },
          ]}
        >
          CHOISISSEZ UN ABONNEMENT
        </Text>
        <View>
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={toggleTarifsNormal}
            >
              <FontAwesome
                name="angle-left"
                size={32}
                color={darkred}
                style={{
                  transform: [{ rotate: showTarifsNormal ? "-90deg" : "0deg" }],
                  transition: "transform 0.2s",
                }}
              />
              <Text
                style={[
                  styles.buttonText,
                  globalStyles.lightred,
                  { marginLeft: 12, marginBottom: 0 },
                ]}
              >
                Particulier (tarif normal)
              </Text>
            </TouchableOpacity>
          </View>

          {showTarifsNormal && (
            <View style={styles.tarifsContainer}>
              <Text style={globalStyles.lightred}>
                100 € ={" "}
                <Text style={globalStyles.darkgray}>
                  1 œuvre tous les 3 mois (soit 4 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                180 € ={" "}
                <Text style={globalStyles.darkgray}>
                  2 œuvres tous les 3 mois (soit 8 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                250 € ={" "}
                <Text style={globalStyles.darkgray}>
                  3 œuvres tous les 3 mois (soit 12 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
            </View>
          )}

          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={toggleTarifsSpecial}
            >
              <FontAwesome
                name="angle-left"
                size={32}
                color={darkred}
                style={{
                  transform: [
                    { rotate: showTarifsSpecial ? "-90deg" : "0deg" },
                  ],
                  transition: "transform 0.2s",
                }}
              />
              <Text
                style={[
                  styles.buttonText,
                  globalStyles.lightred,
                  { marginLeft: 12, marginBottom: 0 },
                ]}
              >
                Particulier (tarif Special)
              </Text>
            </TouchableOpacity>
          </View>

          {showTarifsSpecial && (
            <View style={styles.tarifsContainer}>
              <Text style={globalStyles.lightred}>
                75 € ={" "}
                <Text style={globalStyles.darkgray}>
                  1 œuvre tous les 3 mois (soit 4 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                130 € ={" "}
                <Text style={globalStyles.darkgray}>
                  2 œuvres tous les 3 mois (soit 8 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                180 € ={" "}
                <Text style={globalStyles.darkgray}>
                  3 œuvres tous les 3 mois (soit 12 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
            </View>
          )}

          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={toggleTarifsPublic}
            >
              <FontAwesome
                name="angle-left"
                size={32}
                color={darkred}
                style={{
                  transform: [{ rotate: showTarifsPublic ? "-90deg" : "0deg" }],
                  transition: "transform 0.2s",
                }}
              />
              <Text
                style={[
                  styles.buttonText,
                  globalStyles.lightred,
                  { marginLeft: 12, marginBottom: 0 },
                ]}
              >
                Établissements publics
              </Text>
            </TouchableOpacity>
          </View>

          {showTarifsPublic && (
            <View style={styles.tarifsContainer}>
              <Text style={globalStyles.lightred}>
                350 € ={" "}
                <Text style={globalStyles.darkgray}>
                  3 œuvre tous les 3 mois (soit 12 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                420 € ={" "}
                <Text style={globalStyles.darkgray}>
                  4 œuvres tous les 3 mois (soit 16 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                500 € ={" "}
                <Text style={globalStyles.darkgray}>
                  5 œuvres tous les 3 mois (soit 20 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                +100 € / œuvre supplémentaire
              </Text>
            </View>
          )}

          <View>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={toggleTarifsBusiness}
            >
              <FontAwesome
                name="angle-left"
                size={32}
                color={darkred}
                style={{
                  transform: [
                    { rotate: showTarifsBusiness ? "-90deg" : "0deg" },
                  ],
                  transition: "transform 0.2s",
                }}
              />
              <Text
                style={[
                  styles.buttonText,
                  globalStyles.lightred,
                  { marginLeft: 12, marginBottom: 0 },
                ]}
              >
                Entreprises
              </Text>
            </TouchableOpacity>
          </View>

          {showTarifsBusiness && (
            <View style={styles.tarifsContainer}>
              <Text style={globalStyles.lightred}>
                500 € ={" "}
                <Text style={globalStyles.darkgray}>
                  3 œuvre tous les 3 mois (soit 12 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                600 € ={" "}
                <Text style={globalStyles.darkgray}>
                  4 œuvres tous les 3 mois (soit 16 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                700 € ={" "}
                <Text style={globalStyles.darkgray}>
                  5 œuvres tous les 3 mois (soit 20 œuvres différentes dans
                  l'année)
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                +130 € / œuvre supplémentaire
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.loginBtnContainer}>
        <TouchableOpacity
          style={globalStyles.buttonRed}
          onPress={() => navigation.navigate("Stack", { screen: "Connection" })}
        >
          <Text style={globalStyles.buttonRedText}>
            Se connecter / Créer un compte
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: "center",
    marginTop: 60,
    textAlign: "center",
  },
  logo: {
    width: "100",
    height: "100",
  },
  title: {
    letterSpacing: 8,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 50,
  },
  backgroundMap: {
    width: screenWidth,
    height: screenWidth,
    resizeMode: "cover",
    opacity: 0.15,
  },
  roundedNumber: {
    paddingHorizontal: 35,
    paddingVertical: 20,
    color: "white",
    borderRadius: 50,
    fontSize: 38,
    marginBottom: 10,
  },
  containerOne: {
    alignItems: "center",
    position: "absolute",
    top: "25%",
  },
  loginBtnContainer: {
    margin: 20,
  },
});
