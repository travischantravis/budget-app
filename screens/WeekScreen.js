import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import DaySummary from "../components/DaySummary";

const WeekScreen = () => {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>
            Total spendings this week
          </Text>
          <Text style={styles.totalSpendings}>$15.80</Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>This week's activity</Text>
          <DaySummary dayInfo={{ day: "Sunday", totalSpendings: 15.8 }} />
          <DaySummary dayInfo={{ day: "Monday", totalSpendings: 7.5 }} />
        </View>
      </View>
    </>
  );
};

export default WeekScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  midContainer: {
    backgroundColor: "#eee",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,

    flex: 1,
  },

  topContainerTitle: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 20,
  },
  totalSpendings: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 40,
  },
  midContainerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#999",
    marginBottom: 10,
  },
});
