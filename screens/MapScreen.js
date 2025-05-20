import { useEffect, useState } from "react";
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
import * as Location from "expo-location";

export default function MapScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [currentPosition, setCurrentPosition] = useState(null);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState("");

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }
    })();
  }, []);

  // useEffect(() => {
  //   fetch(`https://locapic-two.vercel.app/places/${user.nickname}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data.places);
  //       dispatch(addPlaces(data.places));
  //     });
  // }, []);

  // const markers = user.places.map((data, i) => {
  //   return (
  //     <Marker
  //       key={i}
  //       coordinate={{ latitude: data.latitude, longitude: data.longitude }}
  //       title={data.name}
  //     />
  //   );
  // });

  return (
    <View style={styles.container}>
      <MapView
        onLongPress={(e) => handleLongPress(e)}
        mapType="hybrid"
        style={styles.map}
        initialRegion={{
          latitude: 43.604082,
          longitude: 1.433805,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {currentPosition && (
          <Marker
            coordinate={currentPosition}
            title="My position"
            pinColor="#fecb2d"
          />
        )}
        {/* {markers} */}
      </MapView>
    </View>
  );
}

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
});
