import { StyleSheet } from "react-native";
import {
  useFonts as useNunito,
  Nunito_400Regular,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import {
  useFonts as useMontserrat,
  Montserrat_400Regular,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";

export const globalStyles = StyleSheet.create({
  darkred: {
    color: "#B85449",
  },
  darkredback: {
    backgroundColor: "#B85449",
  },
  lightred: {
    color: "#D27E75",
  },
  lightredback: {
    backgroundColor: "#D27E75",
  },
  darkgray: {
    color: "#393837",
  },
  darkgrayback: {
    backgroundColor: "#393837",
  },
  lightgray: {
    color: "#F5F5F5",
  },
  lightgrayback: {
    backgroundColor: "#F5F5F5",
  },
  darkgreen: {
    color: "#609E72",
  },
  darkgreenback: {
    backgroundColor: "#609E72",
  },
  lightgreen: {
    color: "#A6CCB1",
  },
  lightgreen: {
    backgroundColor: "#A6CCB1",
  },
  h1: {
    fontFamily: "Dosis",
    fontSize: 64, // exemple, ajuste selon ton besoin
    fontWeight: "semi-bold",
    color: "#393837",
  },
});
