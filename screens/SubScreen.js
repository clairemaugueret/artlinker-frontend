import React, { useState } from "react";
import { globalStyles } from "../globalStyles";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

export default function SubScreen({ navigation }) {
  const [selectedTarif, setSelectedTarif] = useState(null);
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

  const handleValidation = () => {
    if (selectedTarif) {
      alert(`Abonnement validé : ${selectedTarif}`);
      // Ajoutez ici la logique pour traiter la validation de l'abonnement
    } else {
      alert("Veuillez sélectionner un tarif.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisir un abonnement</Text>

      <TouchableOpacity style={styles.button} onPress={toggleTarifsNormal}>
        <Text style={styles.buttonText}>Particulier (tarif normal)</Text>
      </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.validationButton}
            onPress={handleValidation}
          >
            <Text style={styles.buttonText}>Choisir cet abonnement</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={toggleTarifsSpecial}>
        <Text style={styles.buttonText}>Particulier (tarif spécial)</Text>
      </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.validationButton}
            onPress={handleValidation}
          >
            <Text style={styles.buttonText}>Choisir cet abonnement</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={toggleTarifsPublic}>
        <Text style={styles.buttonText}>Établissements publics</Text>
      </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.validationButton}
            onPress={handleValidation}
          >
            <Text style={styles.buttonText}>Choisir cet abonnement</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={toggleTarifsBusiness}>
        <Text style={styles.buttonText}>Entreprises</Text>
      </TouchableOpacity>

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

          <TouchableOpacity
            style={styles.validationButton}
            onPress={handleValidation}
          >
            <Text style={styles.buttonText}>Choisir cet abonnement</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#393837",
    padding: 15,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  tarifsContainer: {
    width: "80%",
    marginBottom: 20,
  },
  tarifText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#D27E75",
  },
  validationButton: {
    backgroundColor: "#D27E75",
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
});
