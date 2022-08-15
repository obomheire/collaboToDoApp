import React from "react";
import { Text, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ProjectItemProps {
  project: {
    id: string;
    title: string;
    createdAt: string;
  }
}

const ProjetItem = ({ project }: ProjectItemProps) => {

  const navigation = useNavigation()
  const onPress = () => {
    // console.warn("Open project: ", project.title);
    navigation.navigate("ToDoScreen", { id: project.id});
  };

  return (
    <Pressable onPress={onPress}>
      <View style={styles.root}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="file-outline" size={24} color="grey" />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{project.title}</Text>
          <Text style={styles.time}>{project.createdAt}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default ProjetItem;

// const styles = StyleSheet.create({})
