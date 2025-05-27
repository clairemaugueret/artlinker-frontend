import { useEffect, useState, useRef } from "react";
import { globalStyles } from "../globalStyles";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { fetchAddress } from "../components/FetchAddress";
import Carousel from "react-native-snap-carousel";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../reducers/cart";

import { FormatDistance } from "../components/FormatDistance";
const { getDistanceInKm } = require("../components/getDistanceInKm");

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

//FATOUMATA
export default function ArtScreen({ navigation, route }) {
  const user = useSelector((state) => state.user.value);
  const subscription = useSelector((state) => state.subscription);
  const artworks = useSelector((state) => state.cart.artWorkInCart);
  const dispatch = useDispatch();

  //NB: on récupère les informations sur l'oeuvre principale depuis la route.params
  const [works, setWorks] = useState([]);
  const [artitemData, setArtitemData] = useState(route.params?.artitemData); // navigation est toujours disponible (à revoir car pas sûre qu'on l'utilise)
  const [artitemAllImages, setArtitemAllImages] = useState([]);
  const carouselAllImagesRef = useRef(null); //référence pour le carrousel de l'oeuvre principale
  const carouselItemsAuthorRef = useRef(null); //référence pour le carrousel des autres oeuvres de l'artiste
  const [activeItemsAuthorSlide, setActiveItemsAuthorSlide] = useState(0); //slide actif du carrousel autres oeuvres de l'artiste (pour la pagination)

  const isAlreadyInCart = artworks.some((art) => art.id === artitemData._id);

  const isButtonDisabled =
    !artitemData?.disponibility || !user?.token || isAlreadyInCart; // le bouton est désactivé si l'oeuvre n'est pas disponible, si l'utilisateur n'est pas connecté ou si l'oeuvre est déjà dans le panier

  useEffect(() => {
    setArtitemData(route.params?.artitemData);
  }, [route.params?.artitemData]); // Met à jour artitemData si les paramètres de la route changent (quand on revient sur cette page depuis la Map)

  //BOUTON EMPRUNTER
  const handleLoanButtonPress = () => {
    if (artitemData.disponibility && user.token && !isAlreadyInCart) {
      // double vérification avec isButtonDisable: les actions de validation ne se font que si l'oeuvre est disponible, si l'utilisateur est inscrit/connecté et si l'oeuvre n'est pas déjà dans le panier
      dispatch(
        addToCart({
          id: artitemData._id,
          image: artitemData.imgMain,
          title: artitemData.title,
          artist: artitemData.authors,
          distance: artitemData.distance,
        })
      );
      if (user.hasSubcribed || subscription.subscriptionState) {
        // Si l'utilisateur a un abonnement, on navigue vers la page du panier
        navigation.navigate("Cart");
      } else {
        // Si l'utilisateur n'a pas d'abonnement, on navigue vers la page de choix d'abonnement
        navigation.navigate("Sub");
      }
    }
  };

  //LIGNE DE CODE POUR L'OEUVRE PRINCIPALE
  //À l'initialisation, on récupère toutes les images de l'oeuvre principale dans un seul et même tableau
  useEffect(() => {
    const combinedImages = [
      artitemData.imgMain,
      ...(artitemData.imgList || []),
    ];
    const objCombinedImages = combinedImages.map((img, index) => {
      return {
        id: `img-${index}`,
        uri: img,
      };
    });
    // On vérifie si artitemData.imgList existe avant de l'utiliser et on le combine avec imgMain
    setArtitemAllImages(objCombinedImages);
  }, [artitemData]);

  //CAROUSEL imgList de l'oeuvre
  const renderArtitemAllImages = ({ item }) => {
    if (!item?.uri) return null;
    return (
      <View style={styles.slideArtitemAllImages}>
        <Image
          source={{ uri: item.uri }}
          style={styles.imageArtitemAllImages}
        />
      </View>
    );
  };

  // Affichage conditionné de la disponibilité de l'oeuvre
  function renderAvailability(disponibility) {
    return (
      <Text
        style={[
          globalStyles.p,
          disponibility ? globalStyles.darkgreen : globalStyles.darkred,
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

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  }

  //LIGNES DE CODE POUR LES AUTRES OEUVRES DE L'ARTISTE
  //GET Artitems by the Same Author (only first author)
  useEffect(() => {
    setActiveItemsAuthorSlide(0); // Réinitialiser le slide actif à 0 lors du changement de l'oeuvre principale

    if (artitemData && artitemData.authors && artitemData.authors.length > 0) {
      const author = Array.isArray(artitemData.authors)
        ? artitemData.authors[0] // on prend le premier auteur si c'est un tableau
        : artitemData.authors;

      fetch(`${fetchAddress}/artItems/${author}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result) {
            setWorks(data.worksList);
          } else {
            setWorks([]);
          }
        });
    }
  }, [artitemData]);

  // Filtrer l'œuvre principale pour l'enlever du carrousel des autres oeuvres de cet artiste
  const worksCarousel = works.filter((work) => work._id !== artitemData._id);

  //CAROUSEL autres oeuvres de l'artiste
  const renderItemsAuthor = ({ item }) => {
    if (!item) return null;
    return (
      <View key={item._id} style={styles.slideItemsAuthor}>
        <TouchableOpacity
          style={styles.imageWrapperItemsAuthor}
          onPress={() => {
            // Comme la distance initiale est envoyée depuis la MapScreen mais uniquement pour l'oeuvre principale
            // on doit recalculer la distance de l'oeuvre cliquée par rapport à la position enregistrée dans le store Redux
            const distance = getDistanceInKm(
              user.position.latitude,
              user.position.longitude,
              item.artothequePlace.latitude,
              item.artothequePlace.longitude
            );

            navigation.push("Art", {
              artitemData: {
                ...item,
                distance,
              },
            });
          }}
        >
          <Image
            source={{ uri: item.imgMain }}
            style={styles.imageItemsAuthor}
          />
          <View style={styles.overlayImageItemsAuthor}>
            <Text style={[globalStyles.p, { textAlign: "left" }]}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  //JSX de ArtScreen
  return (
    <ScrollView
      style={styles.scrollviewContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.mainContainer}>
        <View style={styles.artitemAllImagesCarousel}>
          <Carousel
            ref={carouselAllImagesRef}
            data={artitemAllImages}
            renderItem={renderArtitemAllImages}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.75}
            layout="default"
            loop={artitemAllImages.length > 2}
          />
        </View>

        <View style={styles.artitemInfo}>
          <Text style={globalStyles.h3}>{artitemData.title}</Text>
          <Text style={globalStyles.h4}>{artitemData.authors.join(", ")}</Text>
          <Text style={globalStyles.p}>{artitemData.dimensions}</Text>
          <Text style={[globalStyles.p, { marginLeft: 5 }]}>
            <FontAwesome name="location-arrow" size={20} /> Distance:{" "}
            {FormatDistance(artitemData.distance)}
          </Text>
          <Text>{renderAvailability(artitemData.disponibility)}</Text>
          <TouchableOpacity
            style={[
              globalStyles.buttonRed,
              { width: "100%", marginTop: 15 },
              isButtonDisabled && { opacity: 0.5 }, // si oeuvre pas dispo ou user pas inscrit/connecté, on rend le bouton moins opaque
            ]}
            onPress={() => handleLoanButtonPress()}
            disabled={isButtonDisabled} // désactive le bouton si l'oeuvre n'est pas disponible ou si l'utilisateur n'est pas connecté
          >
            <Text
              style={[
                globalStyles.buttonRedText,
                isButtonDisabled && globalStyles.darkgray, // si oeuvre pas dispo ou user pas inscrit/connecté, on rend le bouton moins opaque
              ]}
            >
              Emprunter
            </Text>
          </TouchableOpacity>
          {isAlreadyInCart && ( // si oeuvre déjà dans la panier, on affiche un message
            <Text
              style={[
                globalStyles.p,
                globalStyles.darkred,
                { fontSize: 14, textAlign: "center" },
              ]}
            >
              Œuvre déjà sélectionnée.
            </Text>
          )}
          {artitemData?.disponibility &&
            !user?.token && ( // si oeuvre dispo mais user pas inscrit/connecté, on affiche message pour lui demander de se inscrire ou se connecter
              <Text
                style={[globalStyles.p, { fontSize: 14, textAlign: "center" }]}
              >
                Veuillez vous{" "}
                <Text
                  style={globalStyles.darkred}
                  onPress={() => navigation.navigate("Connection")}
                >
                  inscrire / connecter
                </Text>{" "}
                pour emprunter.
              </Text>
            )}
        </View>
        <View style={styles.itemsAuthorCarousel}>
          <Text style={[globalStyles.h3, { textAlign: "center" }]}>
            Autres œuvres de l'artiste :
          </Text>
          <Carousel
            ref={carouselItemsAuthorRef}
            data={worksCarousel}
            renderItem={renderItemsAuthor}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.5}
            layout="default"
            loop={worksCarousel.length > 2}
          />
          {/* Pagination du carrousel */}
          <View style={styles.paginationContainer}>
            {worksCarousel.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.dotStyle,
                  index === activeItemsAuthorSlide ? styles.activeDot : null,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollviewContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Style carousel oeuvre principale
  artitemAllImagesCarousel: {
    width: "100%",
    height: screenHeight * 0.22,
    marginTop: 25, // à revoir et enlever dans dur dans carousel
  },
  slideArtitemAllImages: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white", // pour mieux voir l'ombre
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  imageArtitemAllImages: {
    width: screenWidth * 0.75,
    height: screenHeight * 0.22,
    borderRadius: 10,
  },
  // Style info oeuvre principale
  artitemInfo: {
    width: "85%",
    height: screenHeight * 0.3,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  // Style carousel autres oeuvres de l'artiste
  itemsAuthorCarousel: {
    width: "100%",
    height: screenHeight * 0.21,
    gap: 5,
  },
  slideItemsAuthor: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "white", // pour mieux voir l'ombre
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // équivalent shadowRadius mais pour Android
  },
  imageWrapperItemsAuthor: {
    position: "relative",
  },
  imageItemsAuthor: {
    width: screenWidth * 0.5,
    height: screenHeight * 0.14,
    borderRadius: 10,
  },
  overlayImageItemsAuthor: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderColor: "white", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
    width: "90%",
  },
  //Style communs aux deux carrousels
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "grey",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#B85449",
  },
});
