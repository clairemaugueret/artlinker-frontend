//RAPHAEL

import { StyleSheet, Platform } from "react-native";

// Définition des variables de couleurs
const DARK_RED = "#B85449";
const LIGHT_RED = "#D27E75";
const DARK_GRAY = "#393837";
const LIGHT_GRAY = "#F5F5F5";
const DARK_GREEN = "#609E72";
const LIGHT_GREEN = "#A6CCB1";

export const globalStyles = StyleSheet.create({
  // Définition des styles de couleurs
  darkred: { color: DARK_RED },
  darkredback: { backgroundColor: DARK_RED },
  lightred: { color: LIGHT_RED },
  lightredback: { backgroundColor: LIGHT_RED },
  darkgray: { color: DARK_GRAY },
  darkgrayback: { backgroundColor: DARK_GRAY },
  lightgray: { color: LIGHT_GRAY },
  lightgrayback: { backgroundColor: LIGHT_GRAY },
  darkgreen: { color: DARK_GREEN },
  darkgreenback: { backgroundColor: DARK_GREEN },
  lightgreen: { color: LIGHT_GREEN },
  lightgreenback: { backgroundColor: LIGHT_GREEN },

  // Nunito
  nunitoLight: {
    fontFamily: Platform.select({
      android: "Nunito_300Light",
      ios: "Nunito-Light",
    }),
  },
  nunito: {
    fontFamily: Platform.select({
      android: "Nunito_400Regular",
      ios: "Nunito-Regular",
    }),
  },
  nunitoSemiBold: {
    fontFamily: Platform.select({
      android: "Nunito_600SemiBold",
      ios: "Nunito-SemiBold",
    }),
  },
  nunitoBold: {
    fontFamily: Platform.select({
      android: "Nunito_700Bold",
      ios: "Nunito-Bold",
    }),
  },

  // Montserrat
  montserratLight: {
    fontFamily: Platform.select({
      android: "Montserrat_300Light",
      ios: "Montserrat-Light",
    }),
  },
  montserrat: {
    fontFamily: Platform.select({
      android: "Montserrat_400Regular",
      ios: "Montserrat-Regular",
    }),
  },
  montserratSemiBold: {
    fontFamily: Platform.select({
      android: "Montserrat_600SemiBold",
      ios: "Montserrat-SemiBold",
    }),
  },
  montserratBold: {
    fontFamily: Platform.select({
      android: "Montserrat_700Bold",
      ios: "Montserrat-Bold",
    }),
  },

  // Dosis
  dosis: {
    fontFamily: Platform.select({
      android: "Dosis_400Regular",
      ios: "Dosis-Regular",
    }),
  },
  dosisSemiBold: {
    fontFamily: Platform.select({
      android: "Dosis_600SemiBold",
      ios: "Dosis-SemiBold",
    }),
  },

  // GROS TEXTE (EX: ACCUEIL)
  big: {
    fontFamily: Platform.select({
      android: "Dosis_600SemiBold",
      ios: "Dosis-SemiBold",
    }),
    fontSize: 72,
    color: DARK_GRAY,
    textAlign: "center", // Centrage du texte
  },

  // TITRE 1
  h1: {
    fontFamily: Platform.select({
      android: "Dosis_600SemiBold",
      ios: "Dosis-SemiBold",
    }),
    fontSize: 56,
    color: DARK_GRAY,
    textAlign: "center", // Centrage du texte
  },
  // TITRE 2
  h2: {
    fontFamily: Platform.select({
      android: "Montserrat_600SemiBold",
      ios: "Montserrat-SemiBold",
    }),
    fontSize: 40,
    color: DARK_GRAY,
    textAlign: "center", // Centrage du texte
  },
  // TITRE 3
  h3: {
    fontFamily: Platform.select({
      android: "Montserrat_400Regular",
      ios: "Montserrat-Regular",
    }),
    fontSize: 32,
    color: DARK_GRAY,
    //textAlign: "center", Centrage du texte
  },
  // TITRE 4
  h4: {
    fontFamily: Platform.select({
      android: "Montserrat_600SemiBold",
      ios: "Montserrat-SemiBold",
    }),
    fontSize: 24,
    color: DARK_GRAY,
    //textAlign: "center", Centrage du texte
  },
  // PARAGRAPGE
  p: {
    fontFamily: Platform.select({
      android: "Nunito_300Light",
      ios: "Nunito-Light",
    }),
    fontSize: 20,
    color: DARK_GRAY,
  },
  // INPUTS
  input: {
    fontFamily: Platform.select({
      android: "Nunito_400Regular",
      ios: "Nunito-Regular",
    }),
    fontSize: 18,
    color: DARK_GRAY,
    backgroundColor: "#f5f5f5",
    width: "100%",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 10,
    borderColor: DARK_GRAY,
    borderWidth: 1,
  },
  inputIsFocused: {
    fontFamily: Platform.select({
      android: "Nunito_400Regular",
      ios: "Nunito-Regular",
    }),
    fontSize: 18,
    color: DARK_GRAY,
    backgroundColor: "#f5f5f5",
    width: "100%",
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 10,
    borderColor: DARK_GREEN,
    borderWidth: 1,
  },
  // BOUTONS
  button: {
    fontFamily: Platform.select({
      android: "Nunito_400Regular",
      ios: "Nunito-Regular",
    }),
    fontSize: 18,
    color: "white",
    backgroundColor: DARK_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Platform.select({
      android: "Nunito_400Regular",
      ios: "Nunito-Regular",
    }),
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
});
