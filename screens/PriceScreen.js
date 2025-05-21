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

export default function PriceScreen({ navigation }) {
  return (
    <View>
      <Text>Price Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("TabNavigator")}
      />
    </View>
  );
}
