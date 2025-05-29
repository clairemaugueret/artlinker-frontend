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
  FlatList,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { FormatDistance } from "../components/FormatDistance";
import {
  Montserrat_300Light,
  Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";

const ITEM_MARGIN = 8;
const OUTER_MARGIN = 18; // marge extérieure gauche/droite
const ITEM_WIDTH =
  (Dimensions.get("window").width - OUTER_MARGIN * 2 - ITEM_MARGIN) / 2;

export default function GridScreen({ navigation, route }) {
  // On récupère les données passées en paramètre
  const artworks = route.params?.artData || [];

  const renderItem = ({ item }) => {
    //let formattedDistance = getDistanceInKm(item.distance);
    return (
      <View key={item._id} style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Stack", {
              screen: "Art",
              params: { artitemData: item }, // quand on clique sur l'image, on va sur la page de l'oeuvre et on fournit l'id de l'oeuvre pour le fetch
            })
          }
        >
          <Image
            source={{ uri: item.imgMain }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={[globalStyles.h3, { textAlign: "left", fontSize: 18 }]}>
          {item.title}
        </Text>
        <Text style={[globalStyles.h4, Montserrat_300Light, { fontSize: 16 }]}>
          {item.authors.join(", ")}
        </Text>
        <Text style={[globalStyles.p, { fontSize: 14 }]}>
          <FontAwesome name="location-arrow" size={15} /> Distance:{" "}
          {FormatDistance(item.distance)}{" "}
        </Text>
        <Text style={[globalStyles.p, { fontSize: 12 }]}>
          {item.artothequePlace.name}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={artworks}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{
          paddingHorizontal: OUTER_MARGIN, // marge à gauche et à droite
          paddingTop: ITEM_MARGIN,
          paddingBottom: ITEM_MARGIN,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: ITEM_MARGIN,
  },
  card: {
    width: ITEM_WIDTH,
    borderRadius: 10,
    padding: 10,
    alignItems: "flex-start",
    marginBottom: ITEM_MARGIN,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#eee",
    borderColor: "transparent", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
});
