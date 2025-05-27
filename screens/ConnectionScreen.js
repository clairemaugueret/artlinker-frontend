import { globalStyles } from "../globalStyles";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAndUpdate } from "../reducers/user";
import { fetchAddress } from "../components/FetchAddress";

// Grabbed from emailregex.com
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [emailSignIn, setEmailSignIn] = useState("");
  const [emailSignUp, setEmailSignUp] = useState(""); // deux états différents entre SignIn et SignUp pour éviter que les champs se remplissent en même temps
  const [address, setAddress] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [passwordSignIn, setPasswordSignIn] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState(""); // deux états différents entre SignIn et SignUp pour éviter que les champs se remplissent en même temps
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [inscriptionError, setInscriptionError] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null); // pour pouvoir gérer l'état focus des inputs afin de pouvoir changer le style quand l'input est actif/focusé
  const [emailSignInError, setEmailSignInError] = useState(false);
  const [emailSignUpError, setEmailSignUpError] = useState(false);

  const handleConnection = () => {
    if (EMAIL_REGEX.test(emailSignIn)) {
      fetch(`${fetchAddress}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailSignIn, password: passwordSignIn }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.result) {
            dispatch(loginAndUpdate(data.userInfo));
            setEmailSignIn("");
            setPasswordSignIn("");
            navigation.navigate("Map");
          } else {
            setConnectionError(true);
            setError(data.error);
          }
        });
    } else {
      setEmailSignInError(true);
    }
  };

  const handleInscription = () => {
    if (EMAIL_REGEX.test(emailSignUp)) {
      fetch(`${fetchAddress}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailSignUp,
          password: passwordSignUp,
          firstname,
          lastname,
          phone: phoneNumber,
          address,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            dispatch(loginAndUpdate(data.userInfo));
            setEmailSignUp("");
            setPasswordSignUp("");
            setFirstname("");
            setLastname("");
            setPhoneNumber("");
            setAddress("");
            navigation.navigate("Map");
          } else {
            setInscriptionError(true);
            setError(data.error);
          }
        });
    } else {
      setEmailSignUpError(true);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollviewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.connectionContain}>
            <Text style={[globalStyles.h1, { textAlign: "center" }]}>
              <Text style={globalStyles.darkred}>V</Text>ous avez déjà un compte
              ?
            </Text>
            <TextInput
              onChangeText={(value) => setEmailSignIn(value)}
              value={emailSignIn}
              onFocus={() => setFocusedField("emailSignIn")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "emailSignIn" && globalStyles.inputIsFocused,
              ]}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              textContenType="emailAddress"
            />
            <TextInput
              onChangeText={(value) => setPasswordSignIn(value)}
              value={passwordSignIn}
              onFocus={() => setFocusedField("passwordSignIn")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "passwordSignIn" &&
                  globalStyles.inputIsFocused,
              ]}
              placeholder="Mot de passe"
              autoCapitalize="none"
              secureTextEntry
            />
            {connectionError && (
              <Text style={[globalStyles.p, globalStyles.darkred]}>
                {error}
              </Text>
            )}
            {emailSignInError && (
              <Text style={[globalStyles.p, globalStyles.darkred]}>
                Email invalide
              </Text>
            )}
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleConnection}
            >
              <Text style={globalStyles.buttonRedText}>Connexion</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inscriptionContain}>
            <Text
              style={[globalStyles.h1, { fontSize: 40, textAlign: "center" }]}
            >
              <Text style={globalStyles.darkred}>B</Text>ienvenue dans
              l'artothèque
            </Text>
            <TextInput
              onChangeText={(value) => setEmailSignUp(value)}
              value={emailSignUp}
              onFocus={() => setFocusedField("emailSignUp")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "emailSignUp" && globalStyles.inputIsFocused,
              ]}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              onChangeText={(value) => setFirstname(value)}
              value={firstname}
              onFocus={() => setFocusedField("firstname")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "firstname" && globalStyles.inputIsFocused,
              ]}
              placeholder="Prénom"
            />
            <TextInput
              onChangeText={(value) => setLastname(value)}
              value={lastname}
              onFocus={() => setFocusedField("lastname")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "lastname" && globalStyles.inputIsFocused,
              ]}
              placeholder="Nom"
            />
            <TextInput
              onChangeText={(value) => setPhoneNumber(value)}
              value={phoneNumber}
              onFocus={() => setFocusedField("phoneNumber")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "phoneNumber" && globalStyles.inputIsFocused,
              ]}
              placeholder="Numéro de téléphone"
              keyboardType="phone-pad"
            />
            <TextInput
              onChangeText={(value) => setAddress(value)}
              value={address}
              onFocus={() => setFocusedField("address")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "address" && globalStyles.inputIsFocused,
              ]}
              placeholder="Adresse"
            />
            <TextInput
              onChangeText={(value) => setPasswordSignUp(value)}
              value={passwordSignUp}
              onFocus={() => setFocusedField("passwordSignUp")}
              onBlur={() => setFocusedField(false)}
              style={[
                globalStyles.input,
                focusedField === "passwordSignUp" &&
                  globalStyles.inputIsFocused,
              ]}
              placeholder="Mot de passe"
              autoCapitalize="none"
              secureTextEntry
            />
            {inscriptionError && (
              <Text style={[globalStyles.p, globalStyles.darkred]}>
                {error}
              </Text>
            )}
            {emailSignUpError && (
              <Text style={[globalStyles.p, globalStyles.darkred]}>
                Email invalide
              </Text>
            )}
            <TouchableOpacity
              style={globalStyles.buttonRed}
              onPress={handleInscription}
            >
              <Text style={globalStyles.buttonRedText}>Inscription</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollviewContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 50, // pour pouvoir scroller même après le dernier bouton
  },
  connectionContain: {
    alignItems: "center",
    width: "80%",
    borderRadius: 5,
    marginTop: 20,
    padding: 15,
    gap: 10,
  },
  inscriptionContain: {
    alignItems: "center",
    width: "80%",
    borderRadius: 5,
    marginTop: 30,
    padding: 15,
    gap: 10,
  },
});
