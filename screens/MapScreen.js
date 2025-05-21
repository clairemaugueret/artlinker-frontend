// RAPHAEL

import { useEffect, useState, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPlace, addPlaces } from "../reducers/user";
import MapView, { Marker } from "react-native-maps";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";

export default function MapScreen() {
  // Récupération du dispatch Redux et des infos utilisateur
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // États locaux pour la position, la recherche, les markers, etc.
  const [currentPosition, setCurrentPosition] = useState(null); // Position affichée sur la carte
  const [modalVisible, setModalVisible] = useState(false); // Contrôle de la modale pour les filtres
  const [filteredData, setFilteredData] = useState([]); // Données des lieux filtrés reçues par le backend
  const [city, setCity] = useState(""); // Ville saisie dans la barre de recherche
  const [gpsPosition, setGpsPosition] = useState(null); // Position GPS réelle de l'utilisateur
  const mapRef = useRef(null); // Référence à la MapView

  // Demande la permission de géolocalisation et met à jour la position GPS en temps réel
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;
      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setGpsPosition(location.coords); // Position GPS réelle
          setCurrentPosition(location.coords); // Position affichée (peut être modifiée par recherche)
        });
      }
    })();
  }, []);

  // Récupère les données des lieux à afficher autour de la position courante
  useEffect(() => {
    if (currentPosition) {
      const data = {
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
      };
      fetch("http://192.168.1.23:3000/places/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setFilteredData(data.placesList);
        });
    }
  }, [currentPosition]);

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
      });
  };

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

  // Génère les markers à afficher sur la carte
  const markers = filteredData.map((data, i) => {
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
      />
    );
  });

  // Rendu principal : carte, barre de recherche, bouton GPS
  return (
    <View style={styles.container}>
      {/* Carte principale */}
      <View style={{ height: "55%" }}>
        <MapView
          ref={mapRef}
          onLongPress={(e) => handleLongPress(e)}
          mapType="hybrid"
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 43.604082,
            longitude: 1.433805,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Markers */}
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
});
