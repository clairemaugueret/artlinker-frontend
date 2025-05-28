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
import { ScrollView } from "react-native";

export default function AccountLoansScreen({ route }) {
  // On récupère les prêts en cours depuis les params
  const ongoingLoans = route?.params?.userData?.ongoingLoans || [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: "center",
        paddingBottom: 40,
        margin: 20,
      }}
    >
      <Text style={globalStyles.h1}>Œuvres en cours d'emprunt</Text>
      {ongoingLoans.length === 0 ? (
        <Text style={globalStyles.h1}>Aucune œuvre en cours d'emprunt</Text>
      ) : (
        ongoingLoans.map((loan) => (
          <View key={loan._id} style={styles.cardsContainer}>
            <Image
              source={{ uri: loan.artItem.imgMain }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.card}>
              <Text style={globalStyles.h3}>{loan.artItem.title}</Text>
              <Text style={globalStyles.p}>
                {loan.artItem.authors?.join(", ")}
              </Text>
              <Text style={globalStyles.lightred}>
                Début :{" "}
                <Text style={globalStyles.p}>
                  {new Date(loan.startDate).toLocaleDateString()}
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                Retour prévu :{" "}
                <Text style={globalStyles.p}>
                  {loan.artItem.expectedReturnDate
                    ? new Date(
                        loan.artItem.expectedReturnDate
                      ).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                Lieu :{" "}
                <Text style={globalStyles.p}>
                  {loan.artItem.artothequePlace?.name}
                </Text>
              </Text>
              <Text style={globalStyles.lightred}>
                Statut :{" "}
                <Text style={globalStyles.p}>{loan.requestStatus}</Text>
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  cardsContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: "100%",
  },
  card: {
    flex: 1,
  },
});
