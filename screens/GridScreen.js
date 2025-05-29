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
        <Image
          source={{ uri: item.imgMain }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={[globalStyles.h3]}>{item.title}</Text>
        <Text style={[globalStyles.h4, Montserrat_300Light]}>
          {item.authors}
        </Text>
        <Text style={globalStyles.p}>
          <FontAwesome name="location-arrow" size={20} /> Distance:{" "}
          {FormatDistance(item.distance)}{" "}
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
  },
});
