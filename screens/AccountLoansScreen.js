import { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { globalStyles } from "../globalStyles";
import { fetchAddress } from "../components/FetchAddress";
import { useSelector, useDispatch } from "react-redux";
import { updateSubscription } from "../reducers/user";

export default function AccountLoansScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

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

  //FIN D'EMPRUNT
  const [showModal, setShowModal] = useState(false);

  const handleEndLoan = (artitemId) => {
    fetch(`${fetchAddress}/artitems/endloan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: user.token, artitemId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShowModal(true);
        dispatch(updateSubscription(user.ongoingLoans - 1));
      });
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
      <Text
        style={[globalStyles.h1, { textAlign: "center", marginBottom: 15 }]}
      >
        Œuvres en cours d'emprunt
      </Text>
      {ongoingLoans.length === 0 ? (
        <Text
          style={[
            globalStyles.h3,
            globalStyles.darkred,
            { textAlign: "center", marginTop: 20 },
          ]}
        >
          Aucune œuvre en cours d'emprunt
        </Text>
      ) : (
        ongoingLoans.map((loan) => (
          <View key={loan._id} style={styles.cardsContainer}>
            <Image
              source={{ uri: loan.artItem.imgMain }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.card}>
              <Text style={[globalStyles.h3, { marginTop: 10 }]}>
                {loan.artItem.title}
              </Text>
              <Text
                style={[
                  globalStyles.h4,
                  { fontSize: 20, marginTop: -5, marginBottom: 5 },
                ]}
              >
                {loan.artItem.authors?.join(", ")}
              </Text>
              {/* Affiche ici le type d'abonnement si besoin */}
              <Text style={[globalStyles.p, globalStyles.lightred]}>
                Début :{" "}
                <Text style={globalStyles.p}>
                  {new Date(loan.startDate).toLocaleDateString()}
                </Text>
              </Text>
              <Text style={[globalStyles.p, globalStyles.lightred]}>
                Retour prévu :{" "}
                {/* Affichage conditionnel du style de la date en fonction de la date de fin d'emprunt */}
                <Text
                  style={[
                    globalStyles.p,
                    new Date(loan.artItem.expectedReturnDate) <= new Date()
                      ? [globalStyles.nunitoSemiBold, globalStyles.darkred]
                      : null,
                  ]}
                >
                  {loan.artItem.expectedReturnDate
                    ? new Date(
                        loan.artItem.expectedReturnDate
                      ).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Text>
              <Text style={[globalStyles.p, globalStyles.lightred]}>
                Lieu :{" "}
                <Text style={globalStyles.p}>
                  {loan.artItem.artothequePlace?.name}
                </Text>
              </Text>
              <Text style={[globalStyles.p, globalStyles.lightred]}>
                Statut :{" "}
                <Text style={globalStyles.p}>
                  {statusLabels[loan.requestStatus] || loan.requestStatus}
                </Text>
              </Text>
            </View>
            {/* Affichage conditionnel du bouton en fonction de la date de fin d'emprunt */}
            {new Date(loan.artItem.expectedReturnDate) <= new Date() && (
              <View style={{ alignItems: "center", width: "100%" }}>
                <TouchableOpacity
                  style={[globalStyles.buttonRed, { width: "60%" }]}
                  onPress={() => handleEndLoan(loan.artItem._id)}
                >
                  <Text style={globalStyles.buttonRedText}>
                    Terminer l'emprunt
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
      {/* Modal de notification de fin d'emprunt */}
      <Modal transparent={true} visible={showModal} animationType="fade">
        <View style={styles.endLoanModalView}>
          <View style={styles.endLoanModalContainer}>
            <Text style={globalStyles.p}>Retour de l'œuvre enregistré.</Text>
            <TouchableOpacity
              style={[globalStyles.buttonRed, { marginTop: 20 }]}
              onPress={() => {
                setShowModal(false);
                navigation.navigate("Account");
              }}
            >
              <Text style={globalStyles.buttonRedText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderRadius: 10,
    borderColor: "white", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  cardsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
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
  endLoanModalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  endLoanModalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
