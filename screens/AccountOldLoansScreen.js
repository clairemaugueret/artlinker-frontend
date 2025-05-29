import { Image, StyleSheet, View, Text, ScrollView } from "react-native";
import { globalStyles } from "../globalStyles";

export default function AccountOldLoansScreen({ route }) {
  const previousLoans = route?.params?.userData?.previousLoans || [];

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
        flexGrow: 1,
        backgroundColor: "white",
        width: "100%",
      }}
    >
      <View style={styles.container}>
        <Text
          style={[globalStyles.h1, { textAlign: "center", marginBottom: 15 }]}
        >
          Historique des œuvres empruntées
        </Text>
        <View style={styles.shadowLine} />
        {previousLoans.length === 0 ? (
          <Text
            style={[
              globalStyles.h3,
              globalStyles.darkred,
              { textAlign: "center", marginTop: 20 },
            ]}
          >
            Aucun prêt terminé
          </Text>
        ) : (
          previousLoans.map((loan) => (
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
                <Text style={[globalStyles.p, globalStyles.darkred]}>
                  Début d'emprunt :{" "}
                  <Text style={globalStyles.p}>
                    {new Date(loan.startDate).toLocaleDateString()}
                  </Text>
                </Text>
                <Text style={[globalStyles.p, globalStyles.darkred]}>
                  Fin d'emprunt :{" "}
                  <Text style={globalStyles.p}>
                    {loan.endDate
                      ? new Date(loan.endDate).toLocaleDateString()
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
            </View>
          ))
        )}
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
});
