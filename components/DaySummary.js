import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DaySummary = ({ dayInfo }) => {
  console.log(dayInfo);
  return (
    <View style={styles.container}>
      <Text style={styles.dayTitle}>{dayInfo.day}</Text>
      <Text style={styles.totalSpendings}>
        ${parseFloat(dayInfo.totalSpendings).toFixed(2)}
      </Text>
    </View>
  );
};

export default DaySummary;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    height: 60,
    alignItems: "center",
  },
  dayTitle: {
    flex: 3,
    fontSize: 16,
  },
  totalSpendings: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
});
