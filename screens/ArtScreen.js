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
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchAddress } from "../components/FetchAddress";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";

//FATOUMATA
export default function ArtScreen({ navigation, route }) {
  const [works, setWorks] = useState([]);
  const { artitemData } = route.params || {}; // navigation est toujours disponible;

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

  //CAROUSEL
  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <TouchableOpacity onPress={console.log("Item pressed")}>
          <Image source={{ uri: item.imgMain }} style={styles.imageSlide} />
          <Text style={styles.title}>{item.titleSlide}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  console.log("works", worksFound);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollviewContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image source={{ uri: artitemData.imgMain }} style={styles.image} />
        <View style={styles.cart}>
          <Text style={globalStyles.h3}>{artitemData.title}</Text>
          <Text style={globalStyles.h4}>{artitemData.authors.join(", ")}</Text>
          <Text style={globalStyles.p}>{artitemData.dimensions}</Text>
          <FontAwesome name="location-arrow" size={16} /> Distance:{" "}
          {formattedDistance}
          {/* <Text style={styles.title}>{artitemData.info}</Text> */}
          <TouchableOpacity
            style={[globalStyles.buttonRed, { width: "100%" }]}
            onPress={() => navigation.navigate("Sub", { artitemData })} // Pass the artitemData to the Sub screen
          >
            <Text style={globalStyles.buttonRedText}>Emprunter</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollviewContainer}>
          {/* ...autres composants... */}
          <Text style={globalStyles.h3}>Œuvres du même auteur :</Text>
          <Carousel
            data={works}
            renderItem={renderItem}
            sliderWidth={350} // largeur du carrousel (à adapter à ton écran)
            itemWidth={250} // largeur d'un slide
            layout="default"
            keyExtractor={(item) => item._id}
          />
          {/* ...autres composants... */}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollviewContainer: {
    flexGrow: 1,
  },
  cart: {
    marginLeft: 35,
    marginRight: 35,
    alignItems: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  image: {
    alignItems: "center",
    resizeMode: "cover",
    height: 240,
    width: "85%",
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
    color: "red",
  },
  titleSlide: {
    color: "red",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  imageSlide: {
    width: 220,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  formattedDistance: {
    fontSize: 16,
    color: "#333",
  },
});
