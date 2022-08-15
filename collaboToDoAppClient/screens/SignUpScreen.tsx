import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";

import { useMutation, gql } from "@apollo/client";

const SIGN_UP_MUTATION = gql`
  mutation signUp($email: String!, $password: String!, $name: String!) {
    signUp(input: { email: $email, password: $password, name: $name }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const SignUpScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  //What we get back from SIGN_UP_MUTATION
  //mutation[0]: a funtion to triger the mutation (mutation signUp)
  //mutation[1]: a object that contains the data that we get back from the server { data, error, loading}

  const [signUp, { data, error, loading }] = useMutation(SIGN_UP_MUTATION);

  if (error) { 
    Alert.alert("Error signing up. please try again");
  }
  if (data) { 
    AsyncStorage.setItem("token", data.signUp.token).then(() => navigation.navigate("Home"));
  }

  // console.log(data);
  // console.log(error);

  const onSubmit = () => {
    signUp({ variables: { email, password, name } });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="name"
        value={name}
        onChangeText={setName}
        style={{
          color: "black",
          fontSize: 18,
          width: "100%",
          marginVertical: 25,
        }}
      />
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
        style={{
          backgroundColor: "#e33062",
          height: 50,
          borderRadius: 5,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        {loading && <ActivityIndicator />}
        <Text style={{ color: "black", fontSize: 18, fontWeight: "bold" }}>
          Sign Up
        </Text>
      </Pressable>
      <Pressable
        disabled={loading}
        onPress={() => navigation.navigate("SignIn")}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 30,
        }}
      >
        <Text style={{ color: "#e33062", fontSize: 18, fontWeight: "bold" }}>
          Already have an account? Sign In
        </Text>
      </Pressable>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({});
