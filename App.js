import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity, Image, Text, View } from "react-native";
import AccountScreen from "./screens/AccountScreen";
import AccountInfoScreen from "./screens/AccountInfoScreen";
import AccountFavoritesScreen from "./screens/AccountFavoritesScreen";
import AccountLoansScreen from "./screens/AccountLoansScreen";
import AccountSubScreen from "./screens/AccountSubScreen";
import AccountOldLoansScreen from "./screens/AccountOldLoansScreen";
import ArtScreen from "./screens/ArtScreen";
import CartScreen from "./screens/CartScreen";
import ConnectionScreen from "./screens/ConnectionScreen";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import MapScreen from "./screens/MapScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PriceScreen from "./screens/PriceScreen";
import SubScreen from "./screens/SubScreen";
import { StackHeader } from "./components/StackHeader";
import { StripeProvider } from "@stripe/stripe-react-native";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import subscription from "./reducers/subscription";
import cart from "./reducers/cart";
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

//CLAIRE
//redux store persist
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage"; // module de stockage asynchrone spécifique à react native pour le store persistant
import { ActivityIndicator } from "react-native"; // pour le logo "loader" de la page de chargement le temps que le store se charge

const reducers = combineReducers({ user, subscription, cart });
const persistConfig = { key: "artlinker", storage: AsyncStorage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen
        name="AccountInfo"
        component={AccountInfoScreen}
        options={StackHeader}
      />
      <Stack.Screen
        name="AccountFavorites"
        component={AccountFavoritesScreen}
        options={StackHeader}
      />
      <Stack.Screen
        name="AccountLoans"
        component={AccountLoansScreen}
        options={StackHeader}
      />
      <Stack.Screen
        name="AccountOldLoans"
        component={AccountOldLoansScreen}
        options={StackHeader}
      />
      <Stack.Screen
        name="AccountSub"
        component={AccountSubScreen}
        options={StackHeader}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  //RAPH : IMPORT POLICES
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

  //RAPH : IMPORT STRIPE

  const [publishableKey, setPublishableKey] = useState(
    "pk_test_51RTf2lCNwXyXTuFi9zIm4MjghdFy8m8BMkdqyXbNwLhFXtq8VeMFWtokocQOvZxOdM5qP5G5ciM8TykSZVRWKjy500yCtV6zOR"
  );

  const fetchPublishableKey = async () => {
    const key = await fetchKey(); // fetch key from your server here
    setPublishableKey(key);
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  //FIN RAPH IMPORT STRIPE

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            {/* logo de chargement pendant que le store se charge / personnalisable */}
            <ActivityIndicator size="large" color="#e8be4b" />
          </View>
        }
      >
        {" "}
        <StripeProvider
          publishableKey={publishableKey}
          // merchantIdentifier="merchant.identifier" // required for Apple Pay
          // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => {
                  if (route.name === "Map") {
                    return (
                      <FontAwesome name="map-marker" size={45} color={color} />
                    );
                  } else if (route.name === "Account") {
                    return (
                      <FontAwesome
                        name="user-circle-o"
                        size={40}
                        color={color}
                      />
                    );
                  }
                  return null; // Du coup si route = "Stack", alors bouton caché mais bouton existant et actif
                },
                tabBarButton: (props) =>
                  route.name === "Stack" ? null : (
                    <TouchableOpacity {...props} />
                  ), // En complément de tabBarIcon, si route = "Stack" alors bouton désactivé, sinon on peut cliquer sur les autres boutons existants
                tabBarActiveTintColor: "#B85449",
                tabBarInactiveTintColor: "#393837",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                  backgroundColor: "#f5f5f5",
                  borderTopWidth: 1,
                  borderTopColor: "#ccc",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  height: 110,
                },
              })}
            >
              <Tab.Screen name="Stack" component={StackNavigator} />
              <Tab.Screen
                name="Map"
                component={MapScreen}
                options={({ navigation }) =>
                  StackHeader({ navigation, height: 110, margin: 25 })
                } //déclaration du header différente par rapport à la stack car tab navigation
                // affichage différent du header sur les écrans TabNavigation par rapport aux écrans StackNavigation donc on passe en props une height et une margin spécifiques
              />
              <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={({ navigation }) =>
                  StackHeader({ navigation, height: 110, margin: 25 })
                } //déclaration du header différente par rapport à la stack car tab navigation
                // affichage différent du header sur les écrans TabNavigation par rapport aux écrans StackNavigation donc on passe en props une height et une margin spécifiques
              />
            </Tab.Navigator>
          </NavigationContainer>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
}
