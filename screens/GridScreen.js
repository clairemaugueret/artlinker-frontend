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

const ITEM_MARGIN = 12;
const ITEM_WIDTH = (Dimensions.get("window").width - ITEM_MARGIN * 3) / 2;

export default function GridScreen({ navigation, route }) {
  console.log("recu:", route.params);
  // On récupère les données passées en paramètre
  const artworks = route.params?.ArtData || [];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={globalStyles.h4}>{item.title}</Text>
      <Text style={styles.artist}>{item.artist}</Text>
      <Text style={styles.distance}>{item.distance} km</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ padding: ITEM_MARGIN }}
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  artist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
    textAlign: "center",
  },
  distance: {
    fontSize: 13,
    color: "#B85449",
    fontWeight: "600",
    textAlign: "center",
  },
});
