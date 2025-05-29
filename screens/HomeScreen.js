import { globalStyles } from "../globalStyles";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
//react-native-safe-area-context provides a flexible API for accessing device safe area inset information.
// This allows you to position your content appropriately around notches, status bars, home indicators, and other such device and operating system interface elements

const { width: screenWidth } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

export default function HomeScreen({ navigation }) {
  const darkgray = globalStyles.darkgray.color;
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
    <SafeAreaView style={styles.mainContainer}>
      <SafeAreaProvider>
        <ScrollView
          contentContainerStyle={styles.scrollviewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Button
              title="Sub Screen"
              onPress={() => navigation.navigate("Stack", { screen: "Sub" })}
            />
            <Button
              title="Price Screen"
              onPress={() => navigation.navigate("Stack", { screen: "Price" })}
            />
            <Button
              title="Cart Screen"
              onPress={() => navigation.navigate("Stack", { screen: "Cart" })}
            />
            <Button
              title="Payment Screen"
              onPress={() =>
                navigation.navigate("Stack", { screen: "Payment" })
              }
            />
          </View>
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
              source={require("../assets/fake-map-1.png")}
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
                  { textAlign: "center", marginHorizontal: 25 },
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
              { marginTop: 60 },
            ]}
          >
            2
          </Text>
          <Text
            style={[
              globalStyles.h4,
              globalStyles.darkred,
              {
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
                marginHorizontal: 20,
              },
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
                  name={!showTarifsNormal ? "angle-right" : "angle-down"}
                  size={32}
                  color={!showTarifsNormal ? darkgray : darkred}
                />
                <Text style={[globalStyles.h4, { marginLeft: 12 }]}>
                  <Text style={globalStyles.darkred}>P</Text>articulier (tarif
                  normal)
                </Text>
              </TouchableOpacity>
            </View>

            {showTarifsNormal && (
              <View>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>100 € / an =</Text> 1
                  œuvre tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>180 € / an =</Text> 2
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>250 € / an =</Text> 3
                  œuvres tous les 3 mois
                </Text>
              </View>
            )}

            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={toggleTarifsSpecial}
              >
                <FontAwesome
                  name={!showTarifsSpecial ? "angle-right" : "angle-down"}
                  size={32}
                  color={!showTarifsSpecial ? darkgray : darkred}
                />
                <Text style={[globalStyles.h4, { marginLeft: 12 }]}>
                  <Text style={globalStyles.darkred}>P</Text>articulier (tarif
                  spécial)
                </Text>
              </TouchableOpacity>
            </View>

            {showTarifsSpecial && (
              <View>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>75 € / an =</Text> 1 œuvre
                  tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>130 € / an =</Text> 2
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>180 € / an =</Text> 3
                  œuvres tous les 3 mois
                </Text>
              </View>
            )}

            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={toggleTarifsPublic}
              >
                <FontAwesome
                  name={!showTarifsPublic ? "angle-right" : "angle-down"}
                  size={32}
                  color={!showTarifsPublic ? darkgray : darkred}
                />
                <Text style={[globalStyles.h4, { marginLeft: 12 }]}>
                  <Text style={globalStyles.darkred}>É</Text>tablissements
                  publics
                </Text>
              </TouchableOpacity>
            </View>

            {showTarifsPublic && (
              <View>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>350 € / an =</Text> 3
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>420 € / an =</Text> 4
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>500 € / an =</Text> 5
                  œuvres tous les 3 mois
                </Text>
                <Text style={[globalStyles.p]}>
                  +100 € / an / œuvre supplémentaire
                </Text>
              </View>
            )}

            <View>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={toggleTarifsBusiness}
              >
                <FontAwesome
                  name={!showTarifsBusiness ? "angle-right" : "angle-down"}
                  size={32}
                  color={!showTarifsBusiness ? darkgray : darkred}
                />
                <Text style={[globalStyles.h4, { marginLeft: 12 }]}>
                  <Text style={globalStyles.darkred}>E</Text>ntreprises
                </Text>
              </TouchableOpacity>
            </View>

            {showTarifsBusiness && (
              <View>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>500 € / an =</Text> 3
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>600 € / an =</Text> 4
                  œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={globalStyles.lightred}>700 € / an =</Text> 5
                  œuvres tous les 3 mois
                </Text>
                <Text style={[globalStyles.p]}>
                  +130 € / an / œuvre supplémentaire
                </Text>
              </View>
            )}
          </View>
          <Text
            style={[
              globalStyles.nunitoBold,
              globalStyles.darkredback,
              styles.roundedNumber,
              { marginTop: 60 },
            ]}
          >
            3
          </Text>
          <Text
            style={[
              globalStyles.h4,
              globalStyles.darkred,
              { textAlign: "center", marginTop: 10, marginBottom: 20 },
            ]}
          >
            VALIDER VOTRE PROFIL
          </Text>
          <Text
            style={[
              globalStyles.p,
              { textAlign: "center", fontSize: 15, marginHorizontal: 20 },
            ]}
          >
            {/* {"\n"} pour un saut à la ligne */}
            Afin de valider votre emprunt, vous devez nous envoyer les documents
            suivants: {"\n"}
            {"\n"}• Copie de votre pièce d'identité {"\n"}• Justificatif de
            domicile (de moins de 3 mois){"\n"}• Attestation d'assurance
            logement / de Responsabilité Civile {"\n"}
            {"\n"} Ces documents couvrent les potentiels dommages de l'œuvre
            pendant la durée de l'emprunt.
          </Text>
          <Text
            style={[
              globalStyles.nunitoBold,
              globalStyles.darkredback,
              styles.roundedNumber,
              { marginTop: 60 },
            ]}
          >
            4
          </Text>
          <Text
            style={[
              globalStyles.h4,
              globalStyles.darkred,
              {
                textAlign: "center",
                marginTop: 10,
                marginBottom: 20,
                marginHorizontal: 20,
              },
            ]}
          >
            ALLEZ CHERCHER L'ŒUVRE DIRECTEMENT DANS L'ATELIER DE L'ARTISTE /
            DANS LE POINT RELAIS
          </Text>
          <Image
            source={require("../assets/fake-map-2.png")}
            style={styles.fakeMap}
          />
          <Text
            style={[
              globalStyles.nunitoBold,
              globalStyles.darkredback,
              styles.roundedNumber,
              { marginTop: 60 },
            ]}
          >
            5
          </Text>
          <Text
            style={[
              globalStyles.h4,
              globalStyles.darkred,
              { textAlign: "center", marginTop: 10, marginBottom: 20 },
            ]}
          >
            RETOUR DE L'ŒUVRE
          </Text>
          <Text
            style={[
              globalStyles.p,
              {
                textAlign: "center",
                fontSize: 15,
                marginHorizontal: 20,
              },
            ]}
          >
            {/* {"\n"} pour un saut à la ligne */}
            Au bout de <Text style={{ fontWeight: 800 }}>3 mois</Text>, vous
            pouvez : {"\n"}
            {"\n"}• ramener l'œuvre et en emprunter une nouvelle.{"\n"}•
            demander à renouveler l'emprunt de cette même œuvre pour 3 mois
            supplémentaires (pour une durée totale de 6 mois maximum).
          </Text>
        </ScrollView>
        <View style={styles.loginBtnContainer}>
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
      </SafeAreaProvider>
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
    textAlign: "center",
  },
  logo: {
    width: "100",
    height: "100",
    marginTop: 20,
  },
  title: {
    letterSpacing: 8,
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 60,
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
  fakeMap: {
    width: 300,
    height: 116,
    resizeMode: "cover",
  },
  loginBtnContainer: {
    marginTop: 20,
    marginBottom: -30,
    marginHorizontal: 30,
  },
});
