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
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "../globalStyles";

//FATOUMATA
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

  // Fonction pour changer l'avatar
  // Utilise ImagePicker pour choisir une image depuis la galerie ou prendre une photo
  // Envoie l'image au backend pour mise à jour
  const handleAvatarChange = async () => {
    console.log("handleAvatarChange called");
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission refusée",
        "Autorisez l'accès à la galerie pour choisir une image."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true, // Convertit l'image en string
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      const formData = new FormData();
      formData.append("avatar", {
        uri: base64Img,
        name: `avatar-${Date.now()}.jpg`, // Nom de fichier unique
        type: "image/jpeg",
      });
      formData.append("token", userData.token);
      // Envoie au backend
      const response = await fetch(`${fetchAddress}/users/updateAvatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      const data = await response.json();
      if (data.result) {
        setAvatar(data.userInfo.avatar); // Met à jour l'affichage local
        Alert.alert("Succès", "Avatar modifié !");
      } else {
        Alert.alert("Erreur", data.error || "Impossible de modifier l'avatar");
      }
    }
  };

  //console.log("User Data from AccountScreen:", userData);

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
        password: password ? password : undefined,
        email,
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
            <TouchableOpacity onPress={() => handleAvatarChange()}>
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : require("../assets/user-default-picture.png")
                }
                style={styles.userImage}
              />
            </TouchableOpacity>
            <View style={styles.nameBlock}>
              {isEditing ? (
                <>
                  <TextInput
                    style={[
                      globalStyles.input,
                      focusedField === "firstname" &&
                        globalStyles.inputIsFocused,
                    ]}
                    value={firstname}
                    onChangeText={setFirstname}
                    placeholder="Prénom"
                    onFocus={() => setFocusedField("firstname")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TextInput
                    style={[
                      globalStyles.input,
                      focusedField === "lastname" &&
                        globalStyles.inputIsFocused,
                      { marginTop: 10 },
                    ]}
                    value={lastname}
                    onChangeText={setLastname}
                    placeholder="Nom"
                    onFocus={() => setFocusedField("lastname")}
                    onBlur={() => setFocusedField(null)}
                  />
                </>
              ) : (
                <>
                  <Text style={[globalStyles.h1, globalStyles.darkred]}>
                    {firstname}
                  </Text>
                  <Text style={globalStyles.h1}>{lastname}</Text>
                </>
              )}
            </View>
          </View>

          {/* Email */}
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { marginTop: 10 },
                focusedField === "firstname" && globalStyles.inputIsFocused,
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
            <Text style={[globalStyles.h3, { marginTop: 20 }]}>
              <Text style={{ fontWeight: "bold" }}>Email :</Text>
              <Text> </Text>
              <Text style={[globalStyles.h4, globalStyles.montserrat]}>
                {email}
              </Text>
            </Text>
          )}

          {/* Téléphone */}
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { marginTop: 20 },
                focusedField === "firstname" && globalStyles.inputIsFocused,
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Téléphone"
              keyboardType="phone-pad"
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={[globalStyles.h4, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "bold" }}>Téléphone :</Text>
              <Text> </Text>
              <Text style={[globalStyles.h4, globalStyles.montserrat]}>
                {phone}
              </Text>
            </Text>
          )}

          {/* Adresse */}
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { marginTop: 20 },
                focusedField === "firstname" && globalStyles.inputIsFocused,
              ]}
              value={address}
              onChangeText={setAddress}
              placeholder="Adresse"
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={globalStyles.h3}>
              <Text style={{ fontWeight: "bold" }}>Adresse :</Text>
              {"\n"}
              <Text style={[globalStyles.h4, globalStyles.montserrat]}>
                {address}
              </Text>
            </Text>
          )}

          {/* Mot de passe */}
          {isEditing ? (
            <TextInput
              style={[
                globalStyles.input,
                { marginTop: 20 },
                focusedField === "firstname" && globalStyles.inputIsFocused,
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Nouveau mot de passe"
              secureTextEntry={true}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          ) : (
            <Text style={[globalStyles.h3, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "bold" }}>Mot de passe :</Text>
              <Text> </Text>
              <Text style={[globalStyles.h3, { letterSpacing: 3 }]}>
                ******
              </Text>
            </Text>
          )}

          {/* Bouton */}
          {isEditing ? (
            <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
              <TouchableOpacity
                style={[
                  globalStyles.buttonRed,
                  { marginTop: 30 },
                  { flex: 1, backgroundColor: "#aaa" },
                ]}
                onPress={() => {
                  Alert.alert(
                    "Annuler les modifications",
                    "Voulez-vous abandonner vos modifications ?",
                    [
                      { text: "Non", style: "cancel" },
                      {
                        text: "Oui",
                        style: "destructive",
                        onPress: () => setIsEditing(false),
                      },
                    ]
                  );
                }}
                disabled={loading}
              >
                <Text style={globalStyles.buttonWhiteText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.buttonRed, { marginTop: 30 }, { flex: 1 }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={[globalStyles.buttonRedText]}>
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                globalStyles.buttonRed,
                { alignSelf: "center" },
                { marginTop: 30 },
              ]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={globalStyles.buttonRedText}>
                Modifier mes informations
              </Text>
            </TouchableOpacity>
          )}
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
    alignItems: "flex-Space",
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    padding: 15,
    gap: 20,
  },
  idContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  userImage: {
    width: 100,
    height: 100,
    marginRight: 100,
    borderRadius: 45,
    marginRight: 50,
    marginLeft: 40,
  },
  nameBlock: {
    flex: 1,
    justifyContent: "center",
  },

  inputIsFocused: {
    borderColor: "#B85449",
    backgroundColor: "#fff8f6",
  },
});
