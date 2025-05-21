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
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate("TabNavigator")}
      />
      <Button
        title="Go to Screen"
        onPress={() => navigation.navigate("Payment")}
      />
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
