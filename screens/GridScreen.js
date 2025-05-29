import { globalStyles } from "../globalStyles";
import { useEffect, useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function GridScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GridScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
});
