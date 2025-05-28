import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker"; //module expo pour permettre à l'utilisateur de choisir un fichier dans son téléphone
import { globalStyles } from "../globalStyles";
import { fetchAddress } from "./FetchAddress";
import { isStrictValidISODate } from "./StrictValidISODate";

//FONCTION POUR AJOUTER 3 MOIS A LA DATE D'EMISSION DU DOC - POUR CONNAITRE SON EXPIRATION DATE
function addMonthsToDate(dateString, monthsToAdd = 3) {
  // On ajoute 3 mois par défaut car un justificatif doit dater de moins de 3 mois

  const date = new Date(dateString);

  // Si la date est invalide (ex: mauvaise chaîne), retourne null
  if (isNaN(date)) return null;

  // Copie de la date d'origine pour la modifier sans altérer l'originale
  const newDate = new Date(date);

  // Ajoute le nombre de mois voulu à la date
  newDate.setMonth(newDate.getMonth() + monthsToAdd);

  // Certains jours en fin de mois peuvent causer un dépassement de mois
  // Exemple : 31 janvier + 1 mois → 3 mars (car février n'a pas 31 jours)
  // Ce test permet de détecter ce cas
  if (newDate.getDate() !== date.getDate()) {
    // Si les jours ne correspondent plus, on force le jour à 0
    // => cela revient au dernier jour du mois précédent
    newDate.setDate(0);
  }

  // Retourne la nouvelle date au format ISO (YYYY-MM-DD), sans l'heure
  return newDate.toISOString().split("T")[0];
}

export default function ProofResidencyModal({ isOpen, onClose, userToken }) {
  // Composant reçoit en props :
  // isOpen : booléen qui contrôle l'affichage du modal
  // onClose : fonction pour fermer le modal
  // userToken : token utilisateur pour authentifier la requête d'upload

  const [file, setFile] = useState(null); // Etat local pour stocker le fichier sélectionné (null au départ)
  const [issueDate, setIssueDate] = useState("");
  const [uploading, setUploading] = useState(false); // Etat pour indiquer si un upload est en cours (pour afficher un loader
  const [successMessage, setSuccessMessage] = useState(""); // Etat pour afficher un message de succès après upload
  const [errorMessage, setErrorMessage] = useState(""); // Etat pour afficher un message d'erreur si problème

  //UPLOAD DU DOC PAR USER
  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"], // On autorise uniquement les images et les fichiers PDF
      copyToCacheDirectory: true, // grâce au module document-picker permet de copier automatiquement le fichier sélectionné dans le répertoire temporaire (cache) de l'app.
      multiple: false, //on n'autorise le choix que d'un doc
    });

    if (result.assets && result.assets.length > 0) {
      setFile(result.assets[0]); // Si l'utilisateur a bien choisi un fichier (result.assets existe et n'est pas vide) alors on sauvegarde le premier fichier sélectionné
    }
  };

  //ENVOI DU DOC AVEC FETCH
  const handleUpload = async () => {
    if (!file || !issueDate) {
      setErrorMessage("Veuillez ajouter un fichier et une date.");
      return; // Si pas de fichier ou pas de date d'expiration renseignée, on affiche un message d'erreur
    }

    const isValidIssueDate = isStrictValidISODate(issueDate);

    if (!isValidIssueDate) {
      setErrorMessage(
        `Date invalide, utilisez le format suivant : AAAA-MM-JJ\n(année-mois-jour)`
      );
      return;
    }

    const expirationDate = addMonthsToDate(issueDate);
    const isValidExpirationDate = isStrictValidISODate(expirationDate);

    if (!isValidExpirationDate) {
      setErrorMessage("Date invalide");
      return;
    }

    // si tous les champs remplis
    setUploading(true); // On active le loader (upload en cours)
    setErrorMessage(""); // On réinitialise le message d'erreur
    const formData = new FormData();
    formData.append("userDocument", {
      // "userDocument" est le nom de la propriété qu'on va récupérer dans le backend
      uri: file.uri,
      name: "proofOfResidency",
      type: file.mimeType || "application/pdf", // Type MIME du fichier (ex: image/jpeg, application/pdf) ou application/pdf par défaut
    });
    formData.append("expirationDate", expirationDate);
    formData.append("userToken", userToken);

    try {
      const response = await fetch(`${fetchAddress}/users/addproofresidency`, {
        method: "PUT",
        body: formData, // Corps de la requête : le FormData contenant fichier + infos
        headers: {
          "Content-Type": "multipart/form-data", // Indique au serveur que les données sont envoyées en multipart/form-data
        },
      });

      const data = await response.json();
      if (data.result) {
        // Si le serveur confirme que l’upload a réussi
        setSuccessMessage("Document envoyé avec succès !"); // Affiche un message de succès
        setTimeout(() => {
          setErrorMessage("");
          setSuccessMessage("");
          setIssueDate("");
          setFile(null);
          onClose();
        }, 2000); // Après 2 secondes, on efface le message et on ferme la modale
      } else {
        setErrorMessage(data.error || "Erreur lors de l'envoi"); // Sinon on affiche l’erreur retournée ou un message par défaut
      }
    } catch (error) {
      setErrorMessage("Erreur réseau");
    } finally {
      setUploading(false);
    }
  };

  //FERMETURE
  const handleClose = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIssueDate("");
    setFile(null);
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[globalStyles.h4, { textAlign: "center" }]}>
            Ajouter un{" "}
            <Text
              style={[
                globalStyles.nunitoSemiBold,
                globalStyles.darkred,
                { fontSize: 22 },
              ]}
            >
              justificatif de domicile
            </Text>{" "}
            <Text style={[globalStyles.p, { fontSize: 16 }]}>
              (de moins de 3 mois)
            </Text>
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Date d'émission (ex. 2025-05-28)"
            value={issueDate}
            onChangeText={setIssueDate}
          />

          <TouchableOpacity
            style={[globalStyles.buttonRed, { width: "65%" }]}
            onPress={handleFilePick}
          >
            <Text style={globalStyles.buttonRedText}>
              {file ? file.name : "Choisir un fichier"}
            </Text>
          </TouchableOpacity>

          {uploading ? (
            <ActivityIndicator />
          ) : (
            <TouchableOpacity
              style={[globalStyles.buttonRed, { width: "65%" }]}
              onPress={handleUpload}
            >
              <Text style={globalStyles.buttonRedText}>Envoyer</Text>
            </TouchableOpacity>
          )}

          {successMessage ? (
            <Text
              style={[
                globalStyles.p,
                globalStyles.darkgreen,
                { marginTop: 8, textAlign: "center" },
              ]}
            >
              {successMessage}
            </Text>
          ) : null}
          {errorMessage ? (
            <Text
              style={[
                globalStyles.p,
                globalStyles.darkred,
                { marginTop: 8, textAlign: "center" },
              ]}
            >
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text
              style={[
                globalStyles.h3,
                { textAlign: "center", fontSize: 20, marginTop: 10 },
              ]}
            >
              Fermer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  closeBtn: {
    marginTop: 10,
  },
});
