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
    fontSize: 48,
    color: DARK_GRAY,
  },

  // TITRE 1
  h1: {
    fontFamily: Platform.select({
      android: "Dosis_600SemiBold",
      ios: "Dosis-SemiBold",
    }),
    fontSize: 40,
    lineHeight: 52,
    marginBottom: 10,
    color: DARK_GRAY,
  },
  // TITRE 2
  h2: {
    fontFamily: Platform.select({
      android: "Montserrat_600SemiBold",
      ios: "Montserrat-SemiBold",
    }),
    fontSize: 36,
    color: DARK_GRAY,
  },
  // TITRE 3
  h3: {
    fontFamily: Platform.select({
      android: "Montserrat_400Regular",
      ios: "Montserrat-Regular",
    }),
    fontSize: 24,
    color: DARK_GRAY,
  },
  // TITRE 4
  h4: {
    fontFamily: Platform.select({
      android: "Montserrat_600SemiBold",
      ios: "Montserrat-SemiBold",
    }),
    fontSize: 20,
    color: DARK_GRAY,
  },
  // PARAGRAPGE
  p: {
    fontFamily: Platform.select({
      android: "Nunito_300Light",
      ios: "Nunito-Light",
    }),
    fontSize: 18,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  // BOUTONS
  buttonRed: {
    fontFamily: Platform.select({
      android: "Nunito_600SemiBold",
      ios: "Nunito-SemiBold",
    }),
    fontSize: 18,
    color: "white",
    backgroundColor: DARK_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRedText: {
    fontFamily: Platform.select({
      android: "Nunito_600SemiBold",
      ios: "Nunito-SemiBold",
    }),
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  buttonWhite: {
    fontFamily: Platform.select({
      android: "Nunito_600SemiBold",
      ios: "Nunito-SemiBold",
    }),
    fontSize: 18,
    color: DARK_GRAY,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  buttonWhiteText: {
    fontFamily: Platform.select({
      android: "Nunito_600SemiBold",
      ios: "Nunito-SemiBold",
    }),
    fontSize: 18,
    color: DARK_GRAY,
    textAlign: "center",
  },
});
