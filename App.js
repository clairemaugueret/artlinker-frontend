import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, Image, Text } from "react-native";
import AccountScreen from "./screens/AccountScreen";
import ArtScreen from "./screens/ArtScreen";
import CartScreen from "./screens/CartScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import MapScreen from "./screens/MapScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PriceScreen from "./screens/PriceScreen";
import SubScreen from "./screens/SubScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import {
  useFonts,
  Dosis_400Regular,
  Dosis_600SemiBold,
} from "@expo-google-fonts/dosis";
import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from "@expo-google-fonts/nunito";
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";

const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const StackHeader = ({ navigation }) => ({
  headerShown: true,
  headerTitle: "",
  headerLeft: () => (
    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
      <Text style={{ marginLeft: 10 }}>Home</Text>
    </TouchableOpacity>
  ),
});

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Art" component={ArtScreen} options={StackHeader} />
      <Stack.Screen name="Cart" component={CartScreen} options={StackHeader} />
      <Stack.Screen
        name="Connection"
        component={ConnectionScreen}
        options={StackHeader}
      />
      <Stack.Screen name="List" component={ListScreen} options={StackHeader} />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={StackHeader}
      />
      <Stack.Screen
        name="Price"
        component={PriceScreen}
        options={StackHeader}
      />
      <Stack.Screen name="Sub" component={SubScreen} options={StackHeader} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    // Dosis
    Dosis_400Regular,
    Dosis_600SemiBold,
    // Nunito
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    // Montserrat
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return null; // ou <View><ActivityIndicator /></View>
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === "Map") {
                return <FontAwesome name="map-pin" size={size} color={color} />;
              } else if (route.name === "Account") {
                return <FontAwesome name="user" size={size} color={color} />;
              }
              return null; // Du coup si route = "Stack", alors bouton caché mais bouton existant et actif
            },
            tabBarButton: (props) =>
              route.name === "Stack" ? null : <TouchableOpacity {...props} />, // En complément de tabBarIcon, si route = "Stack" alors bouton désactivé, sinon on peut cliquer sur les autres boutons existants
            tabBarActiveTintColor: "#ec6e5b",
            tabBarInactiveTintColor: "#335561",
            headerShown: false,
            tabBarShowLabel: false,
          })}
        >
          <Tab.Screen name="Stack" component={StackNavigator} />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={({ navigation }) => StackHeader({ navigation })} //déclaration du header différente par rapport à la stack car tab navigation
          />
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={({ navigation }) => StackHeader({ navigation })} //déclaration du header différente par rapport à la stack car tab navigation
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
