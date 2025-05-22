import React, { useState } from "react";
import { globalStyles } from "../globalStyles";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewBase,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import {
  setSubscriptionCount,
  setSubscriptionPrice,
  setSubscriptionType,
} from "../reducers/subscription";
import { useDispatch, useSelector } from "react-redux";

export default function SubScreen({ navigation }) {
  const darkred = globalStyles.darkred.color;
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.subscription);
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

  const handleValidationNormal = () => {
    dispatch(setSubscriptionCount("Particulier"));
  };
  const handleValidationSpecial = () => {
    dispatch(setSubscriptionCount("ParticulierReduit"));
  };
  const handleValidationPublic = () => {
    dispatch(setSubscriptionCount("EtablissementPublic"));
  };
  const handleValidationBusiness = () => {
    dispatch(setSubscriptionCount("Entreprise"));
  };

  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      > */}
      <Text style={globalStyles.h1}>Choisir un abonnement</Text>

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
              { marginLeft: 12, marginBottom: 0 }, // On annule le marginBottom ici
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
              1 œuvre tous les 3 mois (soit 4 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            180 € ={" "}
            <Text style={globalStyles.darkgray}>
              2 œuvres tous les 3 mois (soit 8 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            250 € ={" "}
            <Text style={globalStyles.darkgray}>
              3 œuvres tous les 3 mois (soit 12 œuvres différentes dans l'année)
            </Text>
          </Text>

          <TouchableOpacity onPress={handleValidationNormal}>
            <Text style={globalStyles.button}>Choisir cet abonnement</Text>
          </TouchableOpacity>
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
              transform: [{ rotate: showTarifsSpecial ? "-90deg" : "0deg" }],
              transition: "transform 0.2s",
            }}
          />
          <Text
            style={[
              styles.buttonText,
              globalStyles.lightred,
              { marginLeft: 12, marginBottom: 0 }, // On annule le marginBottom ici
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
              1 œuvre tous les 3 mois (soit 4 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            130 € ={" "}
            <Text style={globalStyles.darkgray}>
              2 œuvres tous les 3 mois (soit 8 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            180 € ={" "}
            <Text style={globalStyles.darkgray}>
              3 œuvres tous les 3 mois (soit 12 œuvres différentes dans l'année)
            </Text>
          </Text>

          <TouchableOpacity onPress={handleValidationSpecial}>
            <Text style={globalStyles.button}>Choisir cet abonnement</Text>
          </TouchableOpacity>
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
              { marginLeft: 12, marginBottom: 0 }, // On annule le marginBottom ici
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
              3 œuvre tous les 3 mois (soit 12 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            420 € ={" "}
            <Text style={globalStyles.darkgray}>
              4 œuvres tous les 3 mois (soit 16 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            500 € ={" "}
            <Text style={globalStyles.darkgray}>
              5 œuvres tous les 3 mois (soit 20 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            +100 € / œuvre supplémentaire
          </Text>

          <TouchableOpacity onPress={handleValidationPublic}>
            <Text style={globalStyles.button}>Choisir cet abonnement</Text>
          </TouchableOpacity>
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
              transform: [{ rotate: showTarifsBusiness ? "-90deg" : "0deg" }],
              transition: "transform 0.2s",
            }}
          />
          <Text
            style={[
              styles.buttonText,
              globalStyles.lightred,
              { marginLeft: 12, marginBottom: 0 }, // On annule le marginBottom ici
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
              3 œuvre tous les 3 mois (soit 12 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            600 € ={" "}
            <Text style={globalStyles.darkgray}>
              4 œuvres tous les 3 mois (soit 16 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            700 € ={" "}
            <Text style={globalStyles.darkgray}>
              5 œuvres tous les 3 mois (soit 20 œuvres différentes dans l'année)
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            +130 € / œuvre supplémentaire
          </Text>

          <TouchableOpacity onPress={handleValidationBusiness}>
            <Text style={globalStyles.button}>Choisir cet abonnement</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 50,
  },

  // buttonText: {
  //   fontSize: 18,
  //   marginBottom: 20,
  // },
  // tarifsContainer: {
  //   width: "80%",
  //   marginBottom: 20,
  // },
  // validationButton: {
  //   backgroundColor: "#D27E75",
  //   padding: 15,
  //   width: "100%",
  //   alignItems: "center",
  //   borderRadius: 5,
  //   marginTop: 20,
  // },
});
