import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { fetchAddress } from "../components/FetchAddress";

export default function AccountInfoScreen({ navigation, route }) {
  const userData = route.params?.userData || {};
  const [firstname, setFirstname] = useState(userData.firstname || "");
  const [lastname, setLastname] = useState(userData.lastname || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [email, setEmail] = useState(userData.email || "");
  const [address, setAddress] = useState(userData.address || "");
  const [avatar, setAvatar] = useState(userData.avatar || "");
  const [password, setPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("User Data from AccountScreen:", userData);

  const handleSave = async () => {
    setLoading(true);
    const response = await fetch(`${fetchAddress}/users/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: userData.token,
        firstname,
        lastname,
        phone,
        address,
        avatar,
        password: password ? password : undefined,
        email, // si tu veux permettre la modification de l'email
      }),
    });
    const data = await response.json();
    setLoading(false);

    if (data.result) {
      Alert.alert("Succès", data.message || "Informations modifiées !");
      setIsEditing(false);
    } else {
      Alert.alert(
        "Erreur",
        data.error || data.message || "Une erreur est survenue."
      );
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.infoContainer}>
          {/* Avatar + nom/prénom */}
          <View style={styles.idContainer}>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  Alert.prompt(
                    "Modifier l'avatar",
                    "Entrez l'URL de votre nouvelle photo de profil :",
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "OK",
                        onPress: (url) => {
                          if (url) setAvatar(url);
                        },
                      },
                    ],
                    "plain-text",
                    avatar
                  );
                }
              }}
            >
              <Image
                source={{ uri: avatar || "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.nameBlock}>
              {isEditing ? (
                <>
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "lastname" && styles.inputIsFocused,
                    ]}
                    value={lastname}
                    onChangeText={setLastname}
                    placeholder="Nom"
                    onFocus={() => setFocusedField("lastname")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      focusedField === "firstname" && styles.inputIsFocused,
                    ]}
                    value={firstname}
                    onChangeText={setFirstname}
                    placeholder="Prénom"
                    onFocus={() => setFocusedField("firstname")}
                    onBlur={() => setFocusedField(null)}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.nameText}>{lastname}</Text>
                  <Text style={styles.firstnameText}>{firstname}</Text>
                </>
              )}
            </View>
          </View>

          {/* Email */}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                focusedField === "email" && styles.inputIsFocused,
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.valueText}>Email : {email}</Text>
          )}

          {/* Téléphone */}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                focusedField === "phone" && styles.inputIsFocused,
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={styles.valueText}>Téléphone : {phone}</Text>
          )}

          {/* Adresse */}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                focusedField === "address" && styles.inputIsFocused,
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder="Adresse"
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={styles.valueText}>Adresse : {address}</Text>
          )}

          {/* Mot de passe */}
          {isEditing ? (
            <TextInput
              style={[
                styles.input,
                focusedField === "password" && styles.inputIsFocused,
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry={true}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={styles.valueText}>Mot de passe : ******</Text>
          )}

          {/* Bouton */}
          <TouchableOpacity
            style={styles.button}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? "Enregistrement..."
                : isEditing
                ? "Enregistrer"
                : "Modifier mes informations"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardviewContainer: {
    flex: 1,
  },
  infoContainer: {
    alignItems: "flex-start",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    padding: 15,
    gap: 20,
  },
  idContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 20,
  },
  nameBlock: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  firstnameText: {
    fontSize: 18,
    color: "#555",
  },
  valueText: {
    fontSize: 16,
    color: "#222",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    width: "100%",
  },
  inputIsFocused: {
    borderColor: "#B85449",
    backgroundColor: "#fff8f6",
  },
  button: {
    backgroundColor: "#B85449",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
