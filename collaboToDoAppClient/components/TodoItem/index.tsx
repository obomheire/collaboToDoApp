import React, {useEffect, useState, useRef} from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Checkbox from "../Checkbox";

interface TodoItemProps { 
  todo: {
    id: string;
    content: string;
    isCompleted: boolean;
  },
  onSubmit: () => void;
}

const TodoItem = ({todo, onSubmit}: TodoItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!todo) return
    setIsChecked(todo.isCompleted)
    setContent(todo.content)
  }, [todo]);

  useEffect(() => { 
if (inputRef.current) {
  inputRef.current.focus();
}
  }, [inputRef]);

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
      <Checkbox isChecked={true} onPress={() => setIsChecked(!isChecked)} />
      <TextInput
        ref={inputRef}
        value={content}
        onChangeText={setContent}
        style={{ flex: 1, fontSize: 18, color: "black", marginLeft: 12 }}
        multiline={false} //NB: onSubmitEditing is not fired when multiline is true
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onKeyPress={onKeyPress}
      />
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({});
