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

export default function CartScreen({ navigation }) {
  return (
    <View>
      <Text>Cart Screen</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate("TabNavigator")}
      />
    </View>
  );
}
