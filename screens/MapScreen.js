// RAPHAEL

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
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPosition } from "../reducers/user";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { current } from "@reduxjs/toolkit";
import Carousel from "react-native-snap-carousel";
import { fetchAddress } from "../components/FetchAddress";
import { FormatDistance } from "../components/FormatDistance";
import { FormatTitleCarousel } from "../components/FormatTitleCarousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

export default function MapScreen({ navigation }) {
  // Récupération du dispatch Redux et des infos utilisateur
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // RAPHAEL - Map
  //Position par défaut de la carte si pas d'autorisation ou si pas de GPS: centré sur Toulouse
  const defaultPosition = {
    latitude: 43.604082,
    longitude: 1.433805,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // États locaux pour la position, la recherche, les markers, etc.
  const [currentPosition, setCurrentPosition] = useState(user.position); // Position affichée sur la carte (grâce au store persistant on garde la dernière géolocalisation de l'utilisateur et par défaut null dans le store)
  const [modalVisible, setModalVisible] = useState(false); // Contrôle de la modale pour les filtres
  const [placesFiltered, setPlacesFiltered] = useState([]); // Données des lieux filtrés reçues par le backend
  const [city, setCity] = useState(""); // Ville saisie dans la barre de recherche
  const [gpsPosition, setGpsPosition] = useState(null); // Position GPS réelle de l'utilisateur
  const mapRef = useRef(null); // Référence à la MapView

  //CLAIRE - Carrousel
  const carouselRef = useRef(null); //référence pour le carrousel
  const [activeSlide, setActiveSlide] = useState(0); //slide actif du carrousel
  const [carouselTitle, setCarouselTitle] = useState(""); // Titre du carrousel en fonction de la position ou du lieu sélectionné
  const [artitemsFiltered, setArtitemsFiltered] = useState([]); // Toutes les données des oeuvres filtrées reçues par le backend
  const [artitemsReduced, setArtitemsReduced] = useState([]); // Seulement les 15 premières oeuvres issues de artitemsFiltered

  // RAPHAEL - Map
  // Demande la permission de géolocalisation et met à jour la position GPS en temps réel
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setGpsPosition(location.coords); // Position GPS réelle
          setCurrentPosition(location.coords); // Position affichée (peut être modifiée par recherche)
          dispatch(addPosition(location.coords)); // Met à jour la géolocation de l'utilisateur dans Redux persistant (tant que pas déconnecté on garde l'info)
        });
      }
    })();
  }, []);

  // Centre la carte sur la position GPS réelle de l'utilisateur
  const centerOnCurrentPosition = () => {
    if (gpsPosition && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: gpsPosition.latitude,
          longitude: gpsPosition.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
      setCurrentPosition(gpsPosition); // Optionnel : déplace aussi le marker principal
    }
  };

  // Recherche une ville via l'API et centre la carte sur cette ville
  const handleSearchCity = () => {
    setActiveSlide(0); // Réinitialise l'index du carrousel à 0
    carouselRef.current?.snapToItem(0); // Force le carrousel à se repositionner sur l'index 0

    if (city.length === 0) {
      return;
    }

    fetch(`https://api-adresse.data.gouv.fr/search/?q=${city}`)
      .then((response) => response.json())
      .then((data) => {
        const firstCity = data.features[0];
        const searchedCity = {
          latitude: firstCity.geometry.coordinates[1],
          longitude: firstCity.geometry.coordinates[0],
        };
        setCurrentPosition(searchedCity);
        dispatch(addPosition(searchedCity)); // Met à jour les données de position de l'utilisateur dans Redux persistant en fonction de sa recherche

        mapRef.current?.animateToRegion(
          {
            latitude: searchedCity.latitude,
            longitude: searchedCity.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000
        );
        setCity(""); // Réinitialise la barre de recherche
      });
  };

  // Récupère les données des lieux à afficher autour de la position courante
  useEffect(() => {
    if (currentPosition) {
      const data = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      };
      fetch(`${fetchAddress}/places/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setPlacesFiltered(data.placesList);
        });
    }
  }, [currentPosition]);

  // Génère les markers à afficher sur la carte
  const markers = placesFiltered.map((data, i) => {
    let pinImage;
    if (data.type === "Atelier") {
      pinImage = require("../assets/redmarker.png");
    } else if (data.type === "Relay") {
      pinImage = require("../assets/greenmarker.png");
    }
    return (
      <Marker
        key={i}
        coordinate={{
          latitude: data.latitude,
          longitude: data.longitude,
        }}
        title={data.name}
        image={pinImage}
        onPress={() => locationMarkerPress(data._id, data.name)}
      />
    );
  });

  // CLAIRE - Oeuvres et carrousel
  // Récupère les oeuvres autour de la position courante
  useEffect(() => {
    if (currentPosition) {
      const data = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      };
      fetch(`${fetchAddress}/artitems/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setActiveSlide(0); // Réinitialise l'index du carrousel à 0
          carouselRef.current?.snapToItem(0); // Force le carrousel à se repositionner sur l'index 0
          setArtitemsFiltered(data.artitemsList);
          setArtitemsReduced(data.artitemsList.slice(0, 15)); // Limite à 15 oeuvres
          setCarouselTitle("Oeuvres à proximité");
        });
    }
  }, [currentPosition]);

  //Récupère les oeuvres à partir du marker cliqué
  const locationMarkerPress = (id, name) => {
    setActiveSlide(0); // Réinitialise l'index du carrousel à 0
    carouselRef.current?.snapToItem(0); // Force le carrousel à se repositionner sur l'index 0
    const itemsInThisLocation = artitemsFiltered.filter(
      (artitem) => artitem.artothequePlace._id === id
    );
    setArtitemsReduced(itemsInThisLocation.slice(0, 15)); // met à jour en une seule fois le carrousel avec toutes les 15 premières oeuvres du lieu
    setCarouselTitle(FormatTitleCarousel(name)); // Met à jour le titre du carrousel en fonction du lieu sélectionné
  };

  //Render pour le carrousel
  const renderItem = ({ item }) => {
    // Formate la distance de l'oeuvre par rapport à la position courante

    return (
      <View style={styles.slide}>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={() =>
            navigation.navigate("Stack", {
              screen: "Art",
              params: { artitemData: item }, // quand on clique sur l'image, on va sur la page de l'oeuvre et on fournit l'id de l'oeuvre pour le fetch
            })
          }
        >
          <Image source={{ uri: item.imgMain }} style={styles.image} />
          <View style={styles.overlayImage}>
            <Text style={[globalStyles.h4, { textAlign: "left" }]}>
              {item.title}
            </Text>
            <Text style={globalStyles.p}>{item.authors.join(", ")}</Text>
            <Text style={globalStyles.p}>
              <FontAwesome name="location-arrow" size={16} /> Distance:{" "}
              {FormatDistance(item.distance)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // RAPHAEL - Map
  // Rendu principal : carte, barre de recherche, bouton GPS
  return (
    <ScrollView style={styles.container}>
      {/* Carte principale */}
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          mapType="standard"
          style={StyleSheet.absoluteFill}
          region={
            currentPosition
              ? {
                  latitude: currentPosition.latitude,
                  longitude: currentPosition.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : defaultPosition
          } // Par défaut centré sur Toulouse, sinon s'actualise avec currentPosition
        >
          {gpsPosition && (
            <Marker coordinate={gpsPosition} title="Ma position">
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={30}
                color="#222"
              />
            </Marker>
          )}
          {markers}
        </MapView>

        {/* Bouton GPS positionné sur la carte */}
        <TouchableOpacity
          style={styles.gpsButtonOnMap}
          onPress={centerOnCurrentPosition}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            size={26}
            color="#222"
          />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche en haut */}
      <View style={styles.searchContainer}>
        <View
          style={[
            globalStyles.input,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 0,
            },
          ]}
        >
          <TextInput
            style={[globalStyles.buttonWhiteText, { textAlign: "left" }]}
            placeholder="Rechercher..."
            value={city}
            onChangeText={(value) => setCity(value)}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={handleSearchCity}>
            <FontAwesome
              name="search"
              size={27}
              style={[globalStyles.lightred, { marginBottom: 3 }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CLAIRE - Carrousel d'oeuvres */}
      {/* Carrousel ou message si pas d'oeuvre à proximité */}
      {artitemsFiltered.length === 0 ? (
        <View
          style={{
            marginTop: "15%",
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center",
            height: 150,
          }}
        >
          <Text style={[globalStyles.h3, { textAlign: "center" }]}>
            <Text style={globalStyles.darkred}>A</Text>UCUNE OEUVRE À PROXIMITÉ
          </Text>
          <Text style={globalStyles.p}>
            Rechercher une nouvelle localisation.
          </Text>
        </View>
      ) : (
        <>
          <Text style={[globalStyles.h3, { textAlign: "center" }]}>
            {carouselTitle}
          </Text>

          {artitemsReduced.length === 0 ? (
            <Text
              style={[
                globalStyles.p,
                { textAlign: "center", marginTop: 40, paddingHorizontal: 30 },
              ]}
            >
              <Text style={globalStyles.darkred}>
                Aucune œuvre n'est actuellement associée à ce lieu.
              </Text>
              {"\n"}
              {"\n"}
              Choisissez un autre lieu ou recherchez une nouvelle localisation.
            </Text>
          ) : (
            <View style={styles.carouselWrapper}>
              <Carousel
                key={artitemsReduced.length}
                ref={carouselRef}
                data={artitemsReduced}
                renderItem={renderItem}
                sliderWidth={screenWidth}
                itemWidth={screenWidth * 0.8}
                layout="default"
                onSnapToItem={(index) => setActiveSlide(index)}
                loop={artitemsReduced.length > 2}
                extraData={activeSlide}
              />
              {/* Pagination du carrousel */}
              <View style={styles.paginationContainer}>
                {artitemsReduced.map((_, index) => (
                  <View
                    key={`dot-${index}`}
                    style={[
                      styles.dotStyle,
                      index === activeSlide ? styles.activeDot : null,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

// Styles pour la carte, la barre de recherche et le bouton GPS
const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "white",
  },
  //STYLE MAP
  map: {
    height: screenHeight * 0.45,
    marginBottom: 10,
  },
  searchContainer: {
    position: "absolute",
    top: 10,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  gpsButtonOnMap: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 2,
  },
  //STYLE CARROUSEL
  carouselWrapper: {
    height: screenHeight * 0.24, // hauteur totale image + pagination (permet aussi de gérer espacement entre image et pagination)
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 5,
  },
  slide: {
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
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.21,
    borderRadius: 10,
  },
  overlayImage: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderColor: "white", //nécessaire que le shadow soit visible
    borderWidth: 1, //nécessaire que le shadow soit visible
  },
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
