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
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "../globalStyles";

export default function AccountLoansScreen({ route }) {
  // On récupère les prêts en cours depuis les params
  const ongoingLoans = route?.params?.userData?.ongoingLoans || [];

  const statusLabels = {
    INIT_DEMAND_DISPO: "Demande d'emprunt en attente de confirmation",
    PROPOSAL_OTHER_ARTITEM: "Œuvre non disponible",
    WAITING_ABONNEMENT: "En attente de souscription à un abonnement",
    WAITING_ABONNEMENT_DOCUMENTS: "En attente des documents de garantie",
    WAITING_ABONNEMENT_CREDIT:
      "Crédit d'emprunt insuffisant, modification d'abonnement nécessaire",
    READY_LOAN: "Rendez-vous à prévoir pour effectuer l'emprunt",
    CONDITION_REPORT_DONE: "Etat des lieux d'emprunt en attente",
    LOAN_ONGOING: "Emprunt en cours",
    RETURN_ASKED: "Retour demandé par l'artiste",
    RETURN_TIME: "Durée de l'emprunt terminée",
    RETURN_TIME_URGENT: "Délai de retour dépassé",
    RETURN_CONDITION_REPORT: "Etat des lieux retour en attente",
    LOAN_DONE: "Emprunt terminé",
  };

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
              {/* Affiche ici le type d'abonnement si besoin */}
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
                <Text style={globalStyles.p}>
                  {statusLabels[loan.requestStatus] || loan.requestStatus}
                </Text>
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
    height: 250,
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
