import { TouchableOpacity, View, Image } from "react-native";

// dans App.js, pour les écrans tab navigation, on a envoyé des props height et margin spécifiques pour le header
// pour le header de la stack, on n'a pas besoin de ces props, donc on les met par défaut à 60 et 10 par défaut
export const StackHeader = ({ navigation, height = 60, margin = 10 }) => ({
  headerShown: true,
  headerTitle: "",
  headerStyle: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    height, // ici seulement height car on récupère soit la props soit la valeur par défaut
  },
  headerLeft: () => (
    <View
      style={{
        margin, // ici seulement margin car on récupère soit la props soit la valeur par défaut
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Image
          source={require("../assets/logo-picto.png")}
          style={{ width: "50", height: "50" }}
        />
        <Image
          source={require("../assets/logo-lettres-red.png")}
          style={{ width: "110", height: "45" }}
        />
      </TouchableOpacity>
    </View>
  ),
});
