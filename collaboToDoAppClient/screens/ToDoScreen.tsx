import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, View } from "../components/Themed";
import TodoItem from "../components/TodoItem";
import { useQuery, gql, useMutation } from "@apollo/client";
import { RouteProp, useRoute } from "@react-navigation/native";

interface Items {
  id: string;
  content: string;
  isCompleted: boolean;
}

type ParamList = {
  ToDoScreen: {
    id: string;
  };
};

const GET_PROJECT = gql`
  query getTaskList($id: ID!) {
    getTaskList(id: $id) {
      id
      title
      createdAt
      todos {
        id
        content
        isCompleted
      }
    }
  }
`;

const CREATE_TODO = gql`
  mutation createToDo($content: String!, $taskListId: ID!) {
    createToDo(content: $content, taskListId: $taskListId) {
      id
      content
      isCompleted

      taskList {
        id
        progress
        todos {
          id
          content
          isCompleted
        }
      }
    }
  }
`;

// let id = '4';

export default function ToDoScreen() {
  const [titile, setTitle] = useState<string>("");
    const [project, setProject] = useState<any>(null);
  // const [todos, setTodos] = useState<Items[]>([
  //   {
  //     id: "1",
  //     content: "Buy Milk",
  //     isCompleted: true,
  //   },
  //   {
  //     id: "2",
  //     content: "Buy Cereals",
  //     isCompleted: true,
  //   },
  //   {
  //     id: "3",
  //     content: "Pour Milk",
  //     isCompleted: true,
  //   },
  // ]);

  const route = useRoute<RouteProp<ParamList, "ToDoScreen">>();
  // const route = useRoute<RouteParams>();
  const id = route?.params?.id;

  const { data, error, loading } = useQuery(GET_PROJECT, {
    variables: { id },
  });

  const [createToDo, { data: createTodoData, error: createTodoError }] =
    useMutation(CREATE_TODO, {
      awaitRefetchQueries: true,
       refetchQueries: [{ query: GET_PROJECT, variables: {id} }],
    });

  useEffect(() => {
    if (error) {
      Alert.alert("Error fetcching project", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProject(data.getTaskList);
      setTitle(data.getTaskList.title);
    }
  }, [data]);

  const createNewItem = (atIndex: number) => {
    // console.warn("createNewItem atIndex: ", atIndex);
    // const newTodos = [...todos];
    // newTodos.splice(atIndex, 0, {
    //   id: todos.map((todo) => parseInt(todo.id) + 1).toString(),
    //   content: "",
    //   isCompleted: false,
    // });
    // setTodos(newTodos);

    createToDo({
      variables: {content: '', taskListId: id}
    })
  };

  useEffect(() => {});
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 130 : 0}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.title}
          value={titile}
          onChangeText={setTitle}
          placeholder="Title"
        />

        <FlatList
          data={project?.todos}
          // keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TodoItem todo={item} onSubmit={() => createNewItem(index + 1)} />
          )}
          style={{ width: "100%" }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  title: {
    width: "100%",
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    marginBottom: 12,
  },
});
