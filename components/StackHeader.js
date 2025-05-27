import { TouchableOpacity, View, Image } from "react-native";

// l'affichage du header est différent entre les écrans TabNavigation et StackNavigation
// height et margin ci-dessous représentent les valuers par défaut utilisées dans la StackNavigation
// pour les écrans TabNavigation, on peut passer des props height et margin différentes
export const StackHeader = ({ navigation, height = 55, margin = 8 }) => ({
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
    height, // ici juste height car on utilise soit valuer par défaut soit props
  },
  headerLeft: () => (
    <View
      style={{
        margin, // ici juste margin car on utilise soit valuer par défaut soit props
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
          style={{ width: "43", height: "43" }}
        />
        <Image
          source={require("../assets/logo-lettres-red.png")}
          style={{ width: "93", height: "38" }}
        />
      </TouchableOpacity>
    </View>
  ),
});
