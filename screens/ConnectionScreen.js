import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { login } from "../reducers/user";

export default function ConnectionScreen() {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleConnection = () => {
    fetch("http://localhost:3000/user/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(
            login({
              email: data.Email,
              token: data.token,
              firstname: data.firstname,
              lastname: data.lastname,
              favoriteItems: data.favoriteItems,
            })
          );
          setEmail("");
          setPassword("");
        }
      });
  };

  return (
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
          autoComplete="password"
        />
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
          onChangeText={(value) => setFirstname(value)}
          value={firstname}
          style={styles.input}
          placeholder="Firstname"
          autoCapitalize="none"
          textContentType="firstname"
          autoComplete="firstname"
        />
        <TextInput
          onChangeText={(value) => setLastname(value)}
          value={lastname}
          style={styles.input}
          placeholder="Lastname"
          autoCapitalize="none"
          textContentType="lasttname"
          autoComplete="lastname"
        />
        <TextInput
          onChangeText={(value) => setPhoneNumber(value)}
          value={phoneNumber}
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          autoComplete="tel"
        />
        <TextInput
          onChangeText={(value) => setAddress(value)}
          value={address}
          style={styles.input}
          placeholder="Address"
          autoCapitalize="none"
          autoComplete="address"
        />
        <TextInput
          onChangeText={(value) => setPassword(value)}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          textContentType="password"
          autoComplete="password"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleInscription()}
        >
          <Text style={styles.textButton}>Connection</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
    alignItems: "center",
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
});
