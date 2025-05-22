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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPlace, addPlaces } from "../reducers/user";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { current } from "@reduxjs/toolkit";
import Carousel from "react-native-snap-carousel";

const { width: screenWidth } = Dimensions.get("window"); // pour récupérer la largeur de l'écran

const fetchAddress = "192.168.1.32:3000"; //changer par notre adresse IP

export default function MapScreen() {
  //CLAIRE
  const carouselRef = useRef(null); //référence pour le carrousel
  const [activeSlide, setActiveSlide] = useState(0); //slide actif du carrousel
  const [artitemsFiltered, setArtitemsFiltered] = useState([]); // Toutes les données des oeuvres filtrées reçues par le backend
  const [artitemsReduced, setArtitemsReduced] = useState([]); // Seulement les 15 premières oeuvres issues de artitemsFiltered

  //Position par défaut de la carte si pas d'autorisation ou si pas de GPS: centré sur Toulouse
  const defaultPosition = {
    latitude: 43.604082,
    longitude: 1.433805,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // RAPHAEL
  // Récupération du dispatch Redux et des infos utilisateur
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // États locaux pour la position, la recherche, les markers, etc.
  const [currentPosition, setCurrentPosition] = useState(null); // Position affichée sur la carte
  const [modalVisible, setModalVisible] = useState(false); // Contrôle de la modale pour les filtres
  const [placesFiltered, setPlacesFiltered] = useState([]); // Données des lieux filtrés reçues par le backend
  const [city, setCity] = useState(""); // Ville saisie dans la barre de recherche
  const [gpsPosition, setGpsPosition] = useState(null); // Position GPS réelle de l'utilisateur
  const mapRef = useRef(null); // Référence à la MapView

  // Demande la permission de géolocalisation et met à jour la position GPS en temps réel
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setGpsPosition(location.coords); // Position GPS réelle
          setCurrentPosition(location.coords); // Position affichée (peut être modifiée par recherche)
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
      fetch(`http://${fetchAddress}/places/all`, {
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
        onPress={() => locationMarkerPress(data._id)}
      />
    );
  });

  // Récupère les oeuvres autour de la position courante
  useEffect(() => {
    if (currentPosition) {
      const data = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      };
      fetch(`http://${fetchAddress}/artitems/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setArtitemsFiltered(data.artitemsList);
          setArtitemsReduced(data.artitemsList.slice(0, 15)); // Limite à 15 oeuvres
        });
    }
  }, [currentPosition]);

  //Récupère les oeuvres à partir du marker cliqué
  const locationMarkerPress = (id) => {
    const itemsInThisLocation = artitemsFiltered.filter(
      (artitem) => artitem.artothequePlace._id === id
    );
    setArtitemsReduced(itemsInThisLocation.slice(0, 15)); // met à jour en une seule fois le carrousel avec toutes les 15 premières oeuvres du lieu
    console.log(itemsInThisLocation);
  };

  //Render pour le carrousel
  const renderItem = ({ item }) => {
    const isActive = item.uri === artitemsReduced[activeSlide].imgMain; // vérifie si l'image est active et permet d'afficher le texte

    return (
      <View style={styles.slide}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.imgMain }} style={styles.image} />
          {isActive && (
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText}>{item.title}</Text>
              <Text style={styles.overlayText}>{item.authors.join(", ")}</Text>
              <Text style={styles.overlayText}>Distance: {item.distance}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Rendu principal : carte, barre de recherche, bouton GPS
  return (
    <View style={styles.container}>
      {/* Carte principale */}
      <View style={{ height: "55%" }}>
        <MapView
          ref={mapRef}
          onLongPress={(e) => handleLongPress(e)} //PAS EXPLOITER POUR LE MOMENT A VOIR SI ON EN A BESOIN
          mapType="hybrid"
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
                color="#F5F5F5"
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
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={city}
            onChangeText={(value) => setCity(value)}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={handleSearchCity}>
            <FontAwesome name="search" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Carrousel d'oeuvres */}
      {artitemsFiltered.length === 0 ? (
        <Text>Pas d'oeuvre</Text>
      ) : (
        <View style={styles.carouselWrapper}>
          <Carousel
            ref={carouselRef}
            data={artitemsReduced}
            renderItem={renderItem}
            sliderWidth={screenWidth}
            itemWidth={screenWidth * 0.8}
            layout="default"
            onSnapToItem={(index) => setActiveSlide(index)}
            loop={true}
            extraData={activeSlide}
          />
          <View style={styles.paginationContainer}>
            {artitemsFiltered.map((_, index) => (
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
    </View>
  );
}

// Styles pour la carte, la barre de recherche et le bouton GPS
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: "55%",
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    width: 150,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#ec6e5b",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  searchContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "#F5F5F5",
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  gpsButton: {
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
  carouselWrapper: {
    height: 275, // hauteur totale image + pagination (permet aussi de gérer espacement entre image et pagination)
    justifyContent: "flex-start",
    alignItems: "center",
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
    height: 250,
    borderRadius: 10,
  },
  textOverlay: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  overlayText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#111",
  },
});
