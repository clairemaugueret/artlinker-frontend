import { useEffect, useState } from "react";
import { globalStyles } from "../globalStyles";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { fetchAddress } from "../components/FetchAddress";
import { SafeAreaView } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";

//FATOUMATA
export default function ArtScreen({ navigation, route }) {
  const [works, setWorks] = useState([]);
  const [artitemData, setArtitemData] = useState(route.params?.artitemData); // navigation est toujours disponible;

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

  // Filtrer l'œuvre principale du carrousel
  const worksCarousel = works.filter((work) => work._id !== artitemData._id);

  //CAROUSEL
  const renderItem = ({ item }) => {
    if (worksCarousel.length === 0) {
      return; // Si aucun travail n'est disponible, ne rien afficher
    }
    return (
      <View style={styles.slide}>
        <TouchableOpacity onPress={() => setArtitemData(item)}>
          <Image source={{ uri: item.imgMain }} style={styles.imageSlide} />
          <View style={styles.textOverlay}>
            <Text style={globalStyles.overlayText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Affichage conditionné de la disponibilité de l'oeuvre
  function renderAvailability(disponibility) {
    return (
      <Text
        style={[
          globalStyles.p,
          { color: disponibility ? "#609E72" : "#D27E75" },
        ]}
      >
        {disponibility
          ? "Disponible"
          : `Indisponible (Retour le: ${formatDate(
              artitemData.expectedReturnDate
            )} )`}
      </Text>
    );
  }
  // solution 2 voir avec le groupe pour le component ou module????????
  //de meme pour formate distance de Claire ??????????????????????????????????
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  }

  function formatDistance(distance) {
    if (typeof distance !== "number") return "";
    return `${distance.toFixed(2)} km`;
  }

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
          <View style={globalStyles.row}>
            <FontAwesome name="location-arrow" size={20} />
            <Text style={[globalStyles.p, { marginLeft: 5 }]}>
              Distance: {formatDistance(artitemData.distance)}
            </Text>
          </View>

          {/* <Text style={styles.title}>{artitemData.info}</Text> */}
          <Text>{renderAvailability(artitemData.disponibility)}</Text>
          <TouchableOpacity
            style={[globalStyles.button, { width: "100%", marginTop: 15 }]}
            onPress={() => navigation.navigate("Sub", { artitemData })} // Pass the artitemData to the Sub screen
          >
            <Text style={globalStyles.buttonText}>Emprunter</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollviewContainer}>
          <Text style={globalStyles.h3}>Autres œuvres de l’artiste :</Text>
          <Carousel
            data={worksCarousel}
            renderItem={renderItem}
            sliderWidth={350} // largeur du carrousel
            itemWidth={250} // largeur d'un slide
            layout="default"
            layoutCardOffset={9} // pour un effet de profondeur
          />
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
    marginTop: 20,
    marginLeft: 15,
  },
  cart: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 35,
    alignItems: "flex-start",
    padding: 5,
    backgroundColor: "#f0f0f0",
  },
  image: {
    alignItems: "center",
    resizeMode: "cover",
    height: 240,
    width: "85%",
    marginTop: 5,
    marginLeft: 25,
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

    padding: 15,
  },
  imageSlide: {
    width: 250,
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: "cover", // pour que l'image remplisse tout le conteneur
  },
  textOverlay: {
    position: "absolute",
    bottom: 15,
    left: 5,
    backgroundColor: "rgba(250, 250, 250, 0.5)", // fond semi-transparent
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
