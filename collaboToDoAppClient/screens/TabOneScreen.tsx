import React, {useState} from "react";
import { StyleSheet, TextInput } from "react-native";
import Checkbox from "../components/Checkbox";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {

  const [value, setValue] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={{flexDirection: "row", alignItems: 'center'}}>
        <Checkbox isChecked={true} onPress={() => setValue(!value)} />
        <TextInput style={{flex: 1, fontSize: 18, color: 'black', marginLeft: 12}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
