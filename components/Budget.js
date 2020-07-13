import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const Budget = () => {
  const [value, onChangeText] = useState("Name");

  return (
    <View style={styles.container}>
      <Text>My Budget</Text>
      <TextInput
        onChangeText={(text) => onChangeText(text)}
        value={value}
        style={styles.textInput}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },

  textInput: {
    backgroundColor: "#eee",
  },
});

export default Budget;
