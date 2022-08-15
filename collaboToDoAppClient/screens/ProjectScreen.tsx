import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet } from "react-native";
import ProjetItem from "../components/ProjectItem";
import { Text, View } from "../components/Themed";
import { useQuery, gql } from "@apollo/client";

const MY_PROJECT = gql`
  query myTaskLists {
    myTaskLists {
      id
      title
      createdAt
    }
  }
`;

export default function ProjectScreen() {
  // const [project, setProject] = useState([
  //   {
  //     id: "1",
  //     title: "Project 1",
  //     createdAt: "2020-01-01",
  //   },
  //   {
  //     id: "2",
  //     title: "Project 2",
  //     createdAt: "2020-01-01",
  //   },
  //   {
  //     id: "3",
  //     title: "Project 3",
  //     createdAt: "2020-01-01",
  //   },
  // ]);
  const [project, setProject] = useState([]);

  const { loading, error, data } = useQuery(MY_PROJECT);

    useEffect(() => {
      if (error) {
        Alert.alert("Error fetcching project", error.message);
      }
    }, [error]);

  useEffect(() => { 
    if (data) {
      setProject(data.myTaskLists);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <FlatList
        data={project}
        // keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProjetItem project={item} />}
        style={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#404040",
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    marginRight: 5,
  },
  time: {
    color: "darkgrey",
  },
});
