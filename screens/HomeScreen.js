import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text style={styles.title}>Travis' Weekly Spending</Text>
      <Button title="About" onPress={() => navigation.navigate("About")} />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    textAlign: "left",
    backgroundColor: "lightblue",
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
