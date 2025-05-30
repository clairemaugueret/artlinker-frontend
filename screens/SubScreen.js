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
    dispatch(setSubscriptionType("INDIVIDUAL_BASIC_COST"));
    navigation.navigate("Price");
  };
  const handleValidationSpecial = () => {
    dispatch(setSubscriptionType("INDIVIDUAL_REDUCT_COST"));
    navigation.navigate("Price");
  };
  const handleValidationPublic = () => {
    dispatch(setSubscriptionType("PUBLIC_ESTABLISHMENT"));
    navigation.navigate("Price");
  };
  const handleValidationBusiness = () => {
    dispatch(setSubscriptionType("LIBERAL_PRO"));
    navigation.navigate("Price");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "flex-start",
          paddingBottom: 40,
          gap: 40,
          margin: 20,
        }}
      >
        <View style={{ alignItems: "center", width: "100%" }}>
          <Text style={[globalStyles.h1, { textAlign: "center" }]}>
            Choisir un abonnement
          </Text>
        </View>

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
              color={darkred}
            />
            <Text
              style={[
                globalStyles.h3,
                globalStyles.lightred,
                { marginLeft: 12 },
              ]}
            >
              Particulier (tarif normal)
            </Text>
          </TouchableOpacity>
        </View>

        {showTarifsNormal && (
          <View style={{ width: "95%", marginTop: -35, gap: 8 }}>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>100 € / an =</Text>
              </Text>{" "}
              1 œuvre tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 4 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>180 € / an =</Text>
              </Text>{" "}
              2 œuvres tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 8 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>250 € / an =</Text>
              </Text>{" "}
              3 œuvres tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 12 œuvres différentes dans l'année)
              </Text>
            </Text>
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleValidationNormal}
            >
              <Text style={globalStyles.buttonRedText}>
                Choisir cet abonnement
              </Text>
            </TouchableOpacity>
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
              color={darkred}
            />
            <Text
              style={[
                globalStyles.h3,
                globalStyles.lightred,
                { marginLeft: 12 },
              ]}
            >
              Particulier (tarif spécial)
            </Text>
          </TouchableOpacity>
        </View>

        {showTarifsSpecial && (
          <View style={{ width: "95%", marginTop: -35, gap: 8 }}>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>75 € / an =</Text>
              </Text>{" "}
              1 œuvre tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 4 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>130 € / an =</Text>
              </Text>{" "}
              2 œuvres tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 8 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>180 € / an =</Text>
              </Text>{" "}
              3 œuvres tous les 3 mois{"\n"}{" "}
              <Text style={{ fontSize: 16 }}>
                (soit 12 œuvres différentes dans l'année)
              </Text>
            </Text>
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleValidationSpecial}
            >
              <Text style={globalStyles.buttonRedText}>
                Choisir cet abonnement
              </Text>
            </TouchableOpacity>
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
              color={darkred}
            />
            <Text
              style={[
                globalStyles.h3,
                globalStyles.lightred,
                { marginLeft: 12, marginBottom: 0 },
              ]}
            >
              Établissements publics
            </Text>
          </TouchableOpacity>
        </View>

        {showTarifsPublic && (
          <View style={{ width: "95%", marginTop: -35, gap: 8 }}>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>350 € / an =</Text>
              </Text>{" "}
              3 œuvre tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 12 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>420 € / an =</Text>
              </Text>{" "}
              4 œuvres tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 16 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>500 € / an =</Text>
              </Text>{" "}
              5 œuvres tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 20 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={[globalStyles.p, globalStyles.lightred]}>
              +100 € / an / œuvre supplémentaire
            </Text>
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleValidationPublic}
            >
              <Text style={globalStyles.buttonRedText}>
                Choisir cet abonnement
              </Text>
            </TouchableOpacity>
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
              color={darkred}
            />
            <Text
              style={[
                globalStyles.h3,
                globalStyles.lightred,
                { marginLeft: 12 },
              ]}
            >
              Entreprises
            </Text>
          </TouchableOpacity>
        </View>

        {showTarifsBusiness && (
          <View style={{ width: "95%", marginTop: -35, gap: 8 }}>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>500 € / an =</Text>
              </Text>{" "}
              3 œuvre tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 12 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>600 € / an =</Text>
              </Text>{" "}
              4 œuvres tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 16 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={globalStyles.p}>
              <Text style={globalStyles.lightred}>
                <Text style={globalStyles.nunitoSemiBold}>700 € / an =</Text>
              </Text>{" "}
              5 œuvres tous les 3 mois{"\n"}
              <Text style={{ fontSize: 16 }}>
                (soit 20 œuvres différentes dans l'année)
              </Text>
            </Text>
            <Text style={[globalStyles.p, globalStyles.lightred]}>
              +130 € / an / œuvre supplémentaire
            </Text>
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleValidationBusiness}
            >
              <Text style={globalStyles.buttonRedText}>
                Choisir cet abonnement
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignContent: "center",
    justifyContent: "flex-start",
  },
});
