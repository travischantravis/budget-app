import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import Budget from "./components/Budget";

export default function App() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Travis' Weekly Spending</Text>
        <Budget />
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    textAlign: "left",
    backgroundColor: "lightblue",
    paddingHorizontal: 10,
  },
});
