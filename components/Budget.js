import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const Budget = () => {
  const [value, onChangeText] = useState("Name");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>My Spendings Today</Text>
      <TextInput
        onChangeText={(text) => onChangeText(text)}
        placeholder={value}
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
    fontSize: 16,
    marginTop: 10,
  },

  text: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default Budget;
