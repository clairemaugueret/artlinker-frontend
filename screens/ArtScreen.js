import { useEffect, useState } from "react";
import { globalStyles } from "../globalStyles";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { fetchAddress } from "../components/FetchAddress";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArtScreen({ navigation, route }) {
  const [works, setWorks] = useState([]);
  const { artitemData } = route.params || {};
  // navigation est toujours disponible;
  console.log("artitemData", artitemData);
  //GET Works by the Same Author
  useEffect(() => {
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
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image source={{ uri: artitemData.imgMain }} style={styles.image} />
        <View style={styles.cart}>
          <Text style={[globalStyles.h3, styles.title]}>
            {artitemData.title}
          </Text>
          <Text style={globalStyles.h4}>{artitemData.authors.join(", ")}</Text>
          <Text style={globalStyles.p}>{artitemData.dimensions}</Text>

          {/* <Text style={styles.title}>{artitemData.info}</Text> */}
        </View>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => navigation.navigate("Sub", { artitemData })} // Pass the artitemData to the Sub screen
        >
          <Text style={styles.textButton}>Emprunter</Text>
        </TouchableOpacity>
        <View style={styles.oeuvres}>{worksFound}</View>
        <Text style={styles.title}>Art Screen</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardviewContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollviewContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  cart: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
  },

  image: {
    alignItems: "center",
    resizeMode: "cover",
    width: "80%",
    height: "40%",
    marginTop: 5,
    marginLeft: 35,
    borderRadius: 15,
  },

  oeuvres: {
    width: "100%",
    height: "40%",
    backgroundColor: "#f0f0f0",
  },
  title: {
    padding: 10,
  },
});
