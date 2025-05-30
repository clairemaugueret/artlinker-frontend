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
  Dimensions,
  ScrollView,
} from "react-native";
import { fetchAddress } from "../components/FetchAddress";
import * as ImagePicker from "expo-image-picker";
import { globalStyles } from "../globalStyles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import { loginAndUpdate } from "../reducers/user";
import CustomModal from "../components/CustomModal";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

//FATOUMATA
export default function AccountInfoScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
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

  // Modale personnalisée grâce au composant CustomModal pour tous les messages d'erreur ou de succès de la page
  // car le module "Alert" de react-native n'est pas personnalisable en style
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    buttons: [],
  });
  const showModal = (title, message, buttons = []) => {
    //pour personnaliser la modale, on lui envoie les informations suivantes : le titre, le message, et les boutons
    setModalContent({ title, message, buttons });
    setModalVisible(true);
  };

  // Fonction pour changer l'avatar
  // Utilise ImagePicker pour choisir une image depuis la galerie ou prendre une photo
  // Envoie l'image au backend pour mise à jour
  const handleAvatarChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      showModal(
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
      }),
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
        showModal("Succès", "Avatar modifié !");
      } else {
        showModal("Erreur", data.error || "Impossible de modifier l'avatar.");
      }
    }
  };

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
      dispatch(loginAndUpdate({ email, firstname, lastname }));
      showModal("Succès", data.message || "Informations modifiées.");
      setIsEditing(false);
    } else {
      showModal(
        "Erreur",
        data.error || data.message || "Une erreur est survenue."
      );
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <Text
          style={[globalStyles.h1, { textAlign: "center", marginBottom: 15 }]}
        >
          Mes informations personnelles
        </Text>
        <View style={styles.shadowLine} />
        <View style={styles.infoContainer}>
          {/* Avatar + nom/prénom */}
          <View style={styles.idContainer}>
            <View>
              <TouchableOpacity onPress={() => handleAvatarChange()}>
                <Image
                  source={
                    avatar
                      ? { uri: avatar }
                      : require("../assets/user-default-picture.png")
                  }
                  style={styles.userImage}
                />
                <FontAwesome
                  name="pencil"
                  size={18}
                  style={styles.editPictureIcon}
                />
              </TouchableOpacity>
            </View>
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
                  <Text
                    style={[
                      globalStyles.h1,
                      globalStyles.darkred,
                      { marginBottom: 0, lineHeight: 50 },
                    ]}
                  >
                    {firstname}
                  </Text>
                  <Text style={[globalStyles.h1, { marginBottom: 0 }]}>
                    {lastname}
                  </Text>
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
            <Text style={[globalStyles.h4, { marginTop: 20 }]}>
              <Text style={{ fontWeight: "bold" }}>Email : {"\n"}</Text>
              <Text style={[globalStyles.p, globalStyles.montserrat]}>
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
              <Text style={{ fontWeight: "bold" }}>Téléphone : </Text>
              <Text style={[globalStyles.p, globalStyles.montserrat]}>
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
            <Text style={globalStyles.h4}>
              <Text style={{ fontWeight: "bold" }}>Adresse : </Text>
              {"\n"}
              <Text style={[globalStyles.p, globalStyles.montserrat]}>
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
            <Text style={[globalStyles.h4, { marginTop: 10 }]}>
              <Text style={{ fontWeight: "bold" }}>Mot de passe : </Text>
              <Text style={[globalStyles.p, { letterSpacing: 3 }]}>******</Text>
            </Text>
          )}

          {/* Bouton */}
          {isEditing ? (
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  globalStyles.buttonRed,
                  { marginTop: 30 },
                  { flex: 1, backgroundColor: "#aaa" },
                ]}
                onPress={() => {
                  showModal(
                    "Annuler les modifications",
                    "Voulez-vous abandonner vos modifications ?",
                    [
                      {
                        text: "Non",
                        onPress: () => setModalVisible(false),
                        style: "cancel",
                      },
                      {
                        text: "Oui",
                        onPress: () => {
                          setModalVisible(false);
                          setIsEditing(false);
                        },
                      },
                    ]
                  );
                }}
                disabled={loading}
              >
                <Text style={globalStyles.buttonRedText}>Annuler</Text>
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
              <Text style={[globalStyles.buttonRedText]}>
                Modifier mes informations
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Modale personnalisée grâce au composant CustomModal pour tous les messages d'erreur ou de succès de la page */}
        <CustomModal
          visible={modalVisible}
          title={modalContent.title}
          message={modalContent.message}
          buttons={modalContent.buttons}
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 50,
  },
  keyboardviewContainer: {
    flex: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  infoContainer: {
    alignItems: "flex-Space",
    width: "95%",
    alignSelf: "center",
    padding: 15,
    gap: 5,
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
  idContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 25,
  },
  userImage: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.15, // pour un cercle
    borderColor: "transparent",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  editPictureIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#B85449",
    borderRadius: screenWidth * 0.15, // pour un cercle
    borderColor: "#B85449",
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
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
