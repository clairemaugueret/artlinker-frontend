import { useState } from "react";
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
} from "react-native";
import { useSelector } from "react-redux";
import { globalStyles } from "../globalStyles";

export default function AccountSubScreen({ navigation, route }) {
  const [subscription, setSubscription] = useState(
    route?.params?.userData.subscription || null
  );
  const userReduxSubInfo = useSelector((state) => state.user.value);
  const loansCredit =
    userReduxSubInfo.authorisedLoans - userReduxSubInfo.ongoingLoans;

  const typeLabels = {
    INDIVIDUAL_BASIC_COST: "Particulier",
    INDIVIDUAL_REDUCT_COST: "Particulier (tarif réduit)",
    PUBLIC_ESTABLISHMENT: "Etablissement public",
    LIBERAL_PRO: "Entreprise",
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.h1, { textAlign: "center", marginTop: 20 }]}>
        Mon abonnement
      </Text>
      <View style={styles.shadowLine} />
      {subscription ? (
        <View style={styles.subInfoContainer}>
          <Text style={[globalStyles.p, { marginTop: 20 }]}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Type :
            </Text>{" "}
            {typeLabels[subscription.subscriptionType]}
          </Text>
          <Text style={globalStyles.p}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Prix :
            </Text>{" "}
            {subscription.price} € / an
          </Text>
          <Text style={[globalStyles.p, { marginTop: 20 }]}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Nombre d'emprunts autorisés :
            </Text>{" "}
            {subscription.worksCount} œuvre
            {subscription.worksCount > 1 ? "s" : ""} tous les 3 mois
          </Text>
          <Text style={globalStyles.p}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Crédit d'emprunts restant :
            </Text>{" "}
            {loansCredit > 0
              ? `${loansCredit} emprunt${loansCredit > 1 ? "s" : ""} restant${
                  loansCredit > 1 ? "s" : ""
                }`
              : "Capacité d'emprunt maximum atteinte"}
          </Text>
          <Text style={[globalStyles.p, { marginTop: 20 }]}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Date de souscription :
            </Text>{" "}
            {new Date(subscription.createdAt).toLocaleDateString()}
          </Text>
          <Text style={globalStyles.p}>
            <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
              Date de fin d'abonnement :
            </Text>{" "}
            {new Date(subscription.calculatedEndDate).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <Text style={[globalStyles.lightred, globalStyles.nunitoSemiBold]}>
          Aucun abonnement
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  shadowLine: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0.3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
    marginBottom: 20,
    width: "70%",
    marginHorizontal: "15%",
  },
  subInfoContainer: {
    width: "85%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
  },
});
