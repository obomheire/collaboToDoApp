import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      if (await isAuthenticated()) navigation.navigate("Home");
      else navigation.navigate("SignIn");
    };

    checkUser();
  }, []);

  const isAuthenticated = async () => {
    // await await AsyncStorage.removeItem("token");
    const token = await AsyncStorage.getItem("token");
    return !!token;
  };
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
