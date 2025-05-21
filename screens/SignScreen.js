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

export default function SigninScreen({ navigation }) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate("TabNavigator")}
      />
      <Text>Connection Screen</Text>
      <Button
        title="Go to Connection"
        onPress={() => navigation.navigate("ConnectionScreen")}
      />
    </View>
  );
}
