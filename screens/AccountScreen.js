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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Screen</Text>
      <TouchableOpacity onPress={() => AsyncStorage.clear()}>
        <Text>Vider le storage</Text>
      </TouchableOpacity>
      <Button
        title="Info personnelles"
        onPress={() => navigation.navigate("Stack", { screen: "AccountInfo" })}
      />
      <Button
        title="Abonnement"
        onPress={() => navigation.navigate("Stack", { screen: "AccountSub" })}
      />
      <Button
        title="Emprunts en cours"
        onPress={() => navigation.navigate("Stack", { screen: "AccountLoans" })}
      />
      <Button
        title="Emprunts passés"
        onPress={() =>
          navigation.navigate("Stack", { screen: "AccountOldLoans" })
        }
      />
      <Button
        title="Favoris"
        onPress={() =>
          navigation.navigate("Stack", { screen: "AccountFavorites" })
        }
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
    gap: 30,
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
