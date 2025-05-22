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
      {/* <TouchableOpacity
        style={globalStyles.button}
        onPress={() => navigation.navigate("TabNavigator")}
      >
        <Text style={globalStyles.button}>Go to Home</Text>
      </TouchableOpacity> */}
      <Text style={[globalStyles.h1, globalStyles.darkred]}>Home Screen</Text>
      <View style={{ width: "70%", height: "70%", gap: 20 }}>
        <Button
          title="Go to Art Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Art" })}
        />
        <Button
          title="Go to Cart Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Cart" })}
        />
        <Button
          title="Go to Connection Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Connection" })}
        />
        <Button
          title="Go to List Screen"
          onPress={() => navigation.navigate("Stack", { screen: "List" })}
        />
        <Button
          title="Go to Payment Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Payment" })}
        />
        <Button
          title="Go to Price Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Price" })}
        />
        <Button
          title="Go to Sub Screen"
          onPress={() => navigation.navigate("Stack", { screen: "Sub" })}
        />
      </View>
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
