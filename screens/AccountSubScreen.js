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
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../globalStyles";

export default function AccountSubScreen({ navigation, route }) {
  const [subscription, setSubscription] = useState(
    route?.params?.userData.subscription || null
  );

  const typeLabels = {
    INDIVIDUAL_BASIC_COST: "Particulier",
    INDIVIDUAL_REDUCT_COST: "Particulier (tarif réduit)",
    PUBLIC_ESTABLISHMENT: "Etablissement public",
    LIBERAL_PRO: "Entreprise",
  };

  return (
    <View style={styles.container}>
      <Text style={[globalStyles.h1, { textAlign: "center" }]}>
        Mon abonnement
      </Text>
      {subscription ? (
        <>
          <Text style={globalStyles.lightred}>
            Type :{" "}
            <Text style={globalStyles.p}>
              {typeLabels[subscription.subscriptiontype]}
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            Nombre d'œuvres :{" "}
            <Text style={globalStyles.p}>{subscription.worksCount}</Text>
          </Text>
          <Text style={globalStyles.lightred}>
            Prix : <Text style={globalStyles.p}>{subscription.price} €</Text>
          </Text>
          <Text style={globalStyles.lightred}>
            Début :{" "}
            <Text style={globalStyles.p}>
              {new Date(subscription.createdAt).toLocaleDateString()}
            </Text>
          </Text>
          <Text style={globalStyles.lightred}>
            Fin :{" "}
            <Text style={globalStyles.p}>
              {new Date(subscription.calculatedEndDate).toLocaleDateString()}
            </Text>
          </Text>
        </>
      ) : (
        <Text style={globalStyles.lightred}>Aucun abonnement</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
