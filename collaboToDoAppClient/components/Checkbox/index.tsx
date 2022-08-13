import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

interface CheckBoxProps { 
  isChecked: boolean;
  onPress: () => void;
}

const Checkbox = (props: CheckBoxProps) => {
const { isChecked, onPress } = props;
  const name = isChecked ? "checkbox-marked-outline" : "checkbox-blank-outline";
  return (
    <View>
      <Pressable onPress={onPress}>
        <MaterialCommunityIcons name={name} size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default Checkbox;

const styles = StyleSheet.create({});
