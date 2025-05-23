import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { fetchAddress } from "./componentFetchAddress";

export default function ArtScreen({ navigation, route }) {
  const [works, setWorks] = useState([]);
  const { artitemData } = route.params || {};
  // navigation est toujours disponible;
  console.log("artitemData", artitemData);
  //GET Works by the Same Author
  useEffect(() => {
    console.log("artitemData", artitemData);
    if (artitemData && artitemData.authors && artitemData.authors.length > 0) {
      const author = Array.isArray(artitemData.authors)
        ? artitemData.authors[0]
        : artitemData.authors;

      fetch(`${fetchAddress}/artItems/${author}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            console.log("data from back", data);
            setWorks(data.worksList);
          } else {
            setWorks([]);
          }
        });
    }
  }, [artitemData]);

  const worksFound = works.map((work) => {
    return (
      <View key={work._id}>
        <Text>{work.title}</Text>
        <Text>{work.authors.join(", ")}</Text>
      </View>
    );
  });
  console.log("works", worksFound);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.cart}>
        <Image source={{ uri: artitemData.imgMain }} style={styles.image} />
        <View>
          <View>
            <Text style={styles.title}>{artitemData.title}</Text>
            <Text style={styles.title}>{artitemData.authors.join(", ")}</Text>
          </View>
          <Image source={{ uri: artitemData.imgMain }} />
        </View>
        <Text style={styles.title}>{artitemData.dimensions}</Text>
        <Text style={styles.title}>{artitemData.description}</Text>
        {/* <Text style={styles.title}>{artitemData.info}</Text> */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Sub", { artitemData })} // Pass the artitemData to the Sub screen
        >
          <Text style={styles.textButton}>Emprunter</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.oeuvres}>{worksFound}</View>
      <Text style={styles.title}>Art Screen</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
  },
  cart: {
    width: "80%",
    height: "60%",
    backgroundColor: "#f0f0f0",

    alignItems: "center",
  },
  oeuvres: {
    width: "100%",
    height: "40%",
    backgroundColor: "#f0f0f0",
  },
});
