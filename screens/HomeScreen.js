import { globalStyles } from "../globalStyles";
import React, { useRef, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  Dimensions,
  Animated as RNAnimated,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
//react-native-safe-area-context provides a flexible API for accessing device safe area inset information.
// This allows you to position your content appropriately around notches, status bars, home indicators, and other such device and operating system interface elements

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const darkgray = globalStyles.darkgray.color;
  const darkred = globalStyles.darkred.color;
  const [showTarifsNormal, setShowTarifsNormal] = useState(false);
  const [showTarifsSpecial, setShowTarifsSpecial] = useState(false);
  const [showTarifsPublic, setShowTarifsPublic] = useState(false);
  const [showTarifsBusiness, setShowTarifsBusiness] = useState(false);
  const scrollViewRef = useRef(null);
  const scrollY = useRef(new RNAnimated.Value(0)).current;

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

  // Animation du chevron
  const chevronAnim = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(chevronAnim, {
          toValue: 10,
          duration: 500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(chevronAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [chevronAnim]);

  const handleChevronPress = () => {
    if (scrollViewRef.current) {
      //scrollY.setValue(0); // Remet la valeur à 0 avant chaque scroll animé
      RNAnimated.timing(scrollY, {
        toValue: screenHeight * 0.8,
        duration: 1200,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: value, animated: false });
      }
    });
    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SafeAreaProvider>
        {!user.token && (
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
        )}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            ...styles.scrollviewContainer,
            ...(user.token ? { paddingTop: 70 } : {}),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* <View
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
          </View> */}
          <View style={styles.introContainer}>
            <Image
              source={require("../assets/logo-picto.png")}
              style={styles.logo}
            />
            <Text style={[globalStyles.big, styles.title]}>
              <Text style={globalStyles.darkred}>A</Text>RTLINKER
            </Text>
            <Text
              style={[globalStyles.p, globalStyles.darkred, styles.subtitle]}
            >
              L'artothèque sociale et solidaire
            </Text>

            <Text style={[globalStyles.h3, { marginVertical: 10 }]}>
              COMMENT ÇA MARCHE ?
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleChevronPress}>
              <RNAnimated.View
                style={{ transform: [{ translateY: chevronAnim }] }}
              >
                <FontAwesome
                  name="angle-down" // plus arrondi que "chevron-down"
                  size={92}
                  color={darkred}
                  style={{ marginBottom: 70 }}
                />
              </RNAnimated.View>
            </TouchableOpacity>
          </View>
          <View>
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
            <Image
              source={require("../assets/fake-map-1.png")}
              style={styles.backgroundMap}
            />
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
          <View style={{ width: "100%", paddingHorizontal: 30 }}>
            <View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={toggleTarifsNormal}
              >
                <FontAwesome
                  name={!showTarifsNormal ? "angle-right" : "angle-down"}
                  size={32}
                  color={!showTarifsNormal ? darkgray : darkred}
                />
                <Text style={[globalStyles.h4, { marginLeft: 12 }]}>
                  <Text style={[globalStyles.darkred, { lineHeight: 32 }]}>
                    P
                  </Text>
                  articulier (tarif normal)
                </Text>
              </TouchableOpacity>
            </View>

            {showTarifsNormal && (
              <View style={{ marginBottom: 20 }}>
                <Text style={globalStyles.p}>
                  <Text style={[globalStyles.darkred, { fontWeight: 700 }]}>
                    100 € / an =
                  </Text>{" "}
                  1 œuvre tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={[globalStyles.darkred, { fontWeight: 700 }]}>
                    180 € / an =
                  </Text>{" "}
                  2 œuvres tous les 3 mois
                </Text>
                <Text style={globalStyles.p}>
                  <Text style={[globalStyles.darkred, { fontWeight: 700 }]}>
                    250 € / an =
                  </Text>{" "}
                  3 œuvres tous les 3 mois
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
                marginBottom: 45,
              },
            ]}
          >
            {/* {"\n"} pour un saut à la ligne */}
            Au bout de <Text style={{ fontWeight: 800 }}>3 mois</Text> : {"\n"}
            {"\n"}• vous ramenez l'œuvre et vous pouvez en emprunter une
            nouvelle (au même artiste ou à un·e autre artiste){"\n"}
            {"\n"}OU{"\n"}
            {"\n"}• vous demandez à l'artiste de prolonger l'emprunt pour 3 mois
            supplémentaires (pour une durée totale de 6 mois maximum).
          </Text>
        </ScrollView>
      </SafeAreaProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: -50,
  },
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: "center",
    textAlign: "center",
  },
  introContainer: {
    alignItems: "center",
    paddingTop: screenHeight * 0.5 - 250,
    height: screenHeight - 125,
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
    marginBottom: 20,
  },
  backgroundMap: {
    width: screenWidth,
    height: screenWidth * 0.8,
    resizeMode: "cover",
    opacity: 1,
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
    marginBottom: 50,
    // position: "absolute",
    // top: "25%",
  },
  fakeMap: {
    width: 300,
    height: 116,
    resizeMode: "cover",
  },
  loginBtnContainer: {
    bottom: 0,
    marginHorizontal: 30,
    marginTop: 10, // espace avec le bord bas
    alignItems: "center",
    backgroundColor: "transparent", // pour que le fond soit transparent
    // zIndex: 10, // optionnel si tu veux être sûr qu'il passe au-dessus
  },
});
