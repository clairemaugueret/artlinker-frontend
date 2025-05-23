import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

export const StackHeader = ({ navigation, margin = 10 }) => ({
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
    height: 80,
  },
  headerLeft: () => (
    <View
      style={{
        margin,
        gap: 5,
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={{
          flexDirection: "row",
          alignItems: "center",
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
