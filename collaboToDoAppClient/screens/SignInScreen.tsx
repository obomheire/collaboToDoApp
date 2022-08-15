import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, gql } from "@apollo/client";

const SIGN_IN_MUTATION = gql`
  mutation signIn($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      token
      user {
        id
        name
      }
    }
  }
`;

const SignInScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigation = useNavigation();

  const [signIn, { data, error, loading }] = useMutation(SIGN_IN_MUTATION);

  useEffect(() => {
    if (error) {
      Alert.alert("Invalid credentials. please try again");
    }

  }, [error]);

      if (data) {
        AsyncStorage.setItem("token", data.signIn.token).then(() =>
          navigation.navigate("Home")
        );
      }

  const onSubmit = () => {
    signIn({ variables: { email, password } });
  };


  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="example@email.com"
        value={email}
        onChangeText={setEmail}
        style={{
          color: "black",
          fontSize: 18,
          width: "100%",
          marginVertical: 25,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          color: "black",
          fontSize: 18,
          width: "100%",
          marginVertical: 25,
        }}
      />
      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: "#e33062",
          height: 50,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
          Sign In
        </Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("SignUp")}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ color: "#e33062", fontSize: 18, fontWeight: "bold" }}>
          New here? Sign Up
        </Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({});
