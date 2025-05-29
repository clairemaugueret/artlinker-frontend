import { Image, StyleSheet, View, Text, ScrollView } from "react-native";

export default function AccountOldLoansScreen({ route }) {
  const previousLoans = route?.params?.userData?.previousLoans || [];

  const statusLabels = {
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
      <Text style={styles.title}>Historique des œuvres empruntées</Text>
      {previousLoans.length === 0 ? (
        <Text style={styles.title}>Aucun prêt terminé</Text>
      ) : (
        previousLoans.map((loan) => (
          <View key={loan._id} style={styles.cardsContainer}>
            <Image
              source={{ uri: loan.artItem.imgMain }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.card}>
              <Text style={styles.artTitle}>{loan.artItem.title}</Text>
              <Text style={styles.artAuthor}>
                {loan.artItem.authors?.join(", ")}
              </Text>
              <Text style={styles.label}>
                Début :{" "}
                <Text style={styles.value}>
                  {new Date(loan.startDate).toLocaleDateString()}
                </Text>
              </Text>
              <Text style={styles.label}>
                Fin :{" "}
                <Text style={styles.value}>
                  {loan.endDate
                    ? new Date(loan.endDate).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Text>
              <Text style={styles.label}>
                Lieu :{" "}
                <Text style={styles.value}>
                  {loan.artItem.artothequePlace?.name}
                </Text>
              </Text>
              <Text style={styles.label}>
                Statut :{" "}
                <Text style={styles.value}>
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
    borderRadius: 10,
    marginBottom: 12,
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
    width: "100%",
  },
  title: {
    width: "80%",
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  artTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  artAuthor: {
    fontSize: 15,
    color: "#B85449",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginTop: 2,
  },
  value: {
    fontWeight: "500",
    color: "#222",
  },
});
