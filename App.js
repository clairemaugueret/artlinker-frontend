import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  createTopTabNavigator,
} from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AccountScreen from "./screens/AccountScreen";
import MapScreen from "./screens/MapScreen";
import SubScreen from "./screens/SubScreen";
import SigninScreen from "./screens/SignScreen";
import PriceScreen from "./screens/PriceScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ListScreen from "./screens/ListScreen";
import CartScreen from "./screens/CartScreen";
import ArtScreen from "./screens/ArtScreen";
import ConnectionScreen from "./screens/ConnectionScreen";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";

const store = configureStore({
  reducer: { user },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TabTop = createTopTabNavigator();

const TabTopNavigator = () => {
  return (
    <TabTop.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "";

          if (route.name === "Connection") {
            iconName = "sign-in";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ec6e5b",
        tabBarInactiveTintColor: "#335561",
        headerShown: false,
      })}
    >
      <TabTop.Screen name="Connection" component={ConnectionScreen} />
    </TabTop.Navigator>
  );
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TabTopNavigator" component={TabTopNavigator} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
