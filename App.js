import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AccountScreen from "./screens/AccountScreen";
import MapScreen from "./screens/MapScreen";
import { TouchableOpacity, Image } from "react-native";
import SubScreen from "./screens/SubScreen";
import SigninScreen from "./screens/SignScreen";
import PriceScreen from "./screens/PriceScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ListScreen from "./screens/ListScreen";
import CartScreen from "./screens/CartScreen";
import ArtScreen from "./screens/ArtScreen";
import HomeScreen from "./screens/HomeScreen";
import ConnectionScreen from "./screens/ConnectionScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Header = ({ navigation }) => {
  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
    <Image
      // source={require("logo-lettres-red.png")}
      style={{ width: 40, height: 40, marginRight: 15 }}
    />
  </TouchableOpacity>;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Map") {
            iconName = "location-arrow";
          } else if (route.name === "Account") {
            iconName = "map-pin";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ec6e5b",
        tabBarInactiveTintColor: "#335561",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={({ navigation }) => ({
              headerShown: false,
              title: "ArtLinker",
              headerRight: () => <Header navigation={navigation} />,
            })}
            name="Home"
            component={HomeScreen}
          />
          <Stack.Screen
            options={({ navigation }) => ({
              headerShown: true,
              title: "ArtLinker",
              headerRight: () => <Header navigation={navigation} />,
            })}
            name="TabNavigator"
            component={TabNavigator}
          />
          <Stack.Screen
            options={({ navigation }) => ({
              headerShown: true,
              title: "ArtLinker",
              headerRight: () => <Header navigation={navigation} />,
            })}
            name="ConnectionScreen"
            component={ConnectionScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
