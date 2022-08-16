import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Checkbox from "../Checkbox";
import { useMutation, gql } from "@apollo/client";

interface TodoItemProps { 
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  },
  onSubmit: () => void;
}

const UPDATE_TODO = gql`
  mutation updateToDo($id: ID!, $content: String, $isCompleted: Boolean) {
    updateToDo(id: $id, content: $content, isCompleted: $isCompleted) {
      id
      content
      isCompleted

      taskList {
        title
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

const TodoItem = ({todo, onSubmit}: TodoItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  // const inputRef = useRef<TextInput>(null);

  const [updateItem] = useMutation(UPDATE_TODO);

  const input = useRef<TextInput>(null);

  const callUpdateItem = () => {
    updateItem({
      variables: {
        id: todo.id,
        content,
        isCompleted: isChecked  
      }
    })
  }

  useEffect(() => {
    if (!todo) return
    setIsChecked(todo.isCompleted)
    setContent(todo.content)
  }, [todo]);

   useEffect(() => {
     if (input.current) {
       input?.current?.focus();
     }
   }, [input]);

  const onKeyPress = ({nativeEvent}: any) => { 
if (nativeEvent.key === "Backspace" && content === "") {
  console.log("Deleted item");
}
    // console.log(nativeEvent)
  }
  
  // const onSubmit = () => { 
  //   console.warn("onSubmit Fired");
  // }

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 3 }}
    >
      <Checkbox
        isChecked={isChecked}
        onPress={() => {
          setIsChecked(!isChecked);
          callUpdateItem();
        }}
      />
      <TextInput
        ref={input}
        value={content}
        onChangeText={setContent}
        style={{
          flex: 1,
          fontSize: 18,
          color: "black",
          marginLeft: 12,
        }}
        multiline
        onEndEditing={callUpdateItem}
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({});
