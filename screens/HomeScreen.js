import { globalStyles } from "../globalStyles";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Button,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={globalStyles.h1}>Signin Screen</Text>
      <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <Text style={globalStyles.button}>Go to Home</Text>
      </TouchableOpacity>
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
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
  },
});
