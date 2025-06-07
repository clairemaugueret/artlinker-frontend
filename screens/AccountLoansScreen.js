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
import { updateOnGoingLoans } from "../reducers/user";
import { FormatDate } from "../components/FormatDate";

const { getDistanceInKm } = require("../components/getDistanceInKm");

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
        dispatch(updateOnGoingLoans(user.ongoingLoans - 1));
      });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <View style={styles.container}>
        <Text
          style={[globalStyles.h1, { textAlign: "center", marginBottom: 15 }]}
        >
          Œuvres en cours d'emprunt
        </Text>
        <View style={styles.shadowLine} />
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
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.image}
                onPress={() => {
                  // Comme la distance initiale est envoyée depuis la MapScreen mais uniquement pour l'oeuvre principale
                  // on doit recalculer la distance de l'oeuvre cliquée par rapport à la position enregistrée dans le store Redux
                  const distance = getDistanceInKm(
                    user.position.latitude,
                    user.position.longitude,
                    loan.artItem.artothequePlace.latitude,
                    loan.artItem.artothequePlace.longitude
                  );

                  navigation.push("Art", {
                    artitemData: {
                      ...loan.artItem,
                      distance,
                    },
                  });
                }}
              >
                <Image
                  source={{ uri: loan.artItem.imgMain }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </TouchableOpacity>
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
                <Text style={[globalStyles.p, globalStyles.darkred]}>
                  Début d'emprunt :{" "}
                  <Text style={globalStyles.p}>
                    {FormatDate(loan.startDate)}
                  </Text>
                </Text>
                <Text style={[globalStyles.p, globalStyles.darkred]}>
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
                      ? FormatDate(loan.artItem.expectedReturnDate)
                      : "N/A"}
                  </Text>
                </Text>
                <Text style={[globalStyles.p, globalStyles.darkred]}>
                  Lieu :{" "}
                  <Text style={globalStyles.p}>
                    {loan.artItem.artothequePlace?.name}
                  </Text>
                </Text>
                <Text style={[globalStyles.p, globalStyles.darkred]}>
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
                    activeOpacity={0.8}
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
                activeOpacity={0.8}
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 40,
    marginTop: 20,
    marginHorizontal: 25,
  },
  shadowLine: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
    marginBottom: 20,
    width: "70%",
    marginHorizontal: "15%",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    borderColor: "transparent", //nécessaire que le shadow soit visible
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
    backgroundColor: "#fdfdfd",
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
