import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { fetchAddress } from "./componentFetchAddress";

export default function ConnectionScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [connectionError, setConnectionError] = useState(false);
  const [inscriptionError, setInscriptionError] = useState(false);
  const [error, setError] = useState("");

  const handleConnection = () => {
    fetch(`${fetchAddress}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("data", data);
          dispatch(
            login({
              email: data.email,
              token: data.token,
              firstname: data.firstname,
              lastname: data.lastname,
              favoriteItems: data.favoriteItems,
            })
          );
          setEmail("");
          setPassword("");
          navigation.navigate("Map");
        } else {
          setConnectionError(true);
          setError(data.error);
        }
      });
  };

  const handleInscription = () => {
    fetch(`${fetchAddress}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstname,
        lastname,
        phoneNumber,
        address,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          console.log("data", data);
          dispatch(login(data.userInfo));
          setEmail("");
          setPassword("");
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
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.connectionContain}>
          <Text style={styles.title}>Connection</Text>
          <TextInput
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <TextInput
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            textContentType="password"
            autoComplete="none"
            secureTextEntry={true}
          />
          {connectionError && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleConnection()}
          >
            <Text style={styles.textButton}>Connection</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inscriptionContain}>
          <Text style={styles.title}>Inscription</Text>
          <TextInput
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
          />
          <TextInput
            onChangeText={(value) => setFirstname(value)}
            value={firstname}
            style={styles.input}
            placeholder="Firstname"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
          />
          <TextInput
            onChangeText={(value) => setLastname(value)}
            value={lastname}
            style={styles.input}
            placeholder="Lastname"
            autoCapitalize="words"
            autoComplete="name-family"
            textContentType="familyName"
          />
          <TextInput
            onChangeText={(value) => setPhoneNumber(value)}
            value={phoneNumber}
            style={styles.input}
            placeholder="Phone number"
            keyboardType="phone-pad"
            autoComplete="tel"
            textContentType="telephoneNumber"
          />
          <TextInput
            onChangeText={(value) => setAddress(value)}
            value={address}
            style={styles.input}
            placeholder="Address"
            autoCapitalize="words"
            textContentType="streetAddressLine1"
            autoComplete="street-address"
          />
          <TextInput
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
            placeholder="Password"
            autoCapitalize="none"
            textContentType="password"
            autoComplete="none"
            secureTextEntry={true}
          />
          {inscriptionError && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleInscription()}
          >
            <Text style={styles.textButton}>Inscription</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    marginBottom: 150,
  },
  connectionContain: {
    alignItems: "center",
    width: "80%",
    backgroundColor: "#d9d9d9",
    borderRadius: 1,
    marginBottom: 30,
  },
  inscriptionContain: {
    alignItems: "center",
    width: "80%",
    backgroundColor: "#d9d9d9",
    borderRadius: 1,
  },
  text: {},
  input: {
    width: "80%",
    alignItems: "center",
    fontSize: 16,
    margin: 10,
    backgroundColor: "#f3edf7",
  },
  button: {
    alignItems: "center",
    paddingTop: 6,
    backgroundColor: "#64558e",
    borderRadius: 30,
    width: "80%",
    marginTop: 25,
    height: 50,
    marginBottom: 30,
  },
  textButton: {
    paddingTop: 6,
    height: 30,
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
});
