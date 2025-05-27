import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Button,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const subscription = useSelector((state) => state.subscription);
  return (
    <View style={styles.container}>
      <Text>
        Reducer User:
        {"\n"}Email: {user.email}
        {"\n"}Name: {user.firstname} {user.lastname}
        {"\n"}Token: {user.token}
        {"\n"}Position:{" "}
        {user.position
          ? user.position.latitude + ", " + user.position.longitude
          : "Not set"}
        {"\n"}Ongoing Loans: {user.ongoingLoans}
        {"\n"}Authorised Loans: {user.authorisedLoans}
        {"\n"}Has Subscribed: {user.hasSubcribed ? "Yes" : "No"}
      </Text>
      <Text>
        Reducer Sub:
        {"\n"}Type: {subscription.type}
        {"\n"}Count: {subscription.count}
        {"\n"}Price: {subscription.price}
        {"\n"}State: {subscription.subscriptionState}
      </Text>

      <Text style={styles.title}>Account Screen</Text>
      <TouchableOpacity onPress={() => AsyncStorage.clear()}>
        <Text>Vider le storage</Text>
      </TouchableOpacity>
      <Button
        title="Info personnelles"
        onPress={() => navigation.navigate("Stack", { screen: "AccountInfo" })}
      />
      <Button
        title="Abonnement"
        onPress={() => navigation.navigate("Stack", { screen: "AccountSub" })}
      />
      <Button
        title="Emprunts en cours"
        onPress={() => navigation.navigate("Stack", { screen: "AccountLoans" })}
      />
      <Button
        title="Emprunts passés"
        onPress={() =>
          navigation.navigate("Stack", { screen: "AccountOldLoans" })
        }
      />
      <Button
        title="Favoris"
        onPress={() =>
          navigation.navigate("Stack", { screen: "AccountFavorites" })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  image: {
    width: "100%",
    height: "50%",
  },
  title: {
    width: "80%",
    fontSize: 38,
    fontWeight: "600",
  },
});
