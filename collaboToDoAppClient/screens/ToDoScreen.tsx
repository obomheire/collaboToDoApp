import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, View } from "../components/Themed";
import TodoItem from "../components/TodoItem";

interface items {
  id: string;
  content: string;
  isCompleted: boolean;
}

// let id = '4';

export default function ToDoScreen() {
  const [titile, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<items[]>([
    {
      id: "1",
      content: "Buy Milk",
      isCompleted: true,
    },
    {
      id: "2",
      content: "Buy Cereals",
      isCompleted: true,
    },
    {
      id: "3",
      content: "Pour Milk",
      isCompleted: true,
    },
  ]);

  const createNewItem = (atIndex: number) => {
    // console.warn("createNewItem atIndex: ", atIndex);
    const newTodos = [...todos];
    newTodos.splice(atIndex, 0, {
      id: todos.map((todo) => parseInt(todo.id) + 1).toString(),
      content: "",
      isCompleted: false,
    });

    setTodos(newTodos);
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
          data={todos}
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
