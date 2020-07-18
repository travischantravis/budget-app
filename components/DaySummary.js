import React from "react";
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";

const DaySummary = ({ item }) => {
  console.log(item);
  return (
    <View style={styles.container}>
      <Text style={styles.dayTitle}>
        {moment(item.timestamp, "X").format("ddd, D MMM")}
      </Text>
      <Text style={styles.totalSpending}>
        ${parseFloat(item.totalSpending).toFixed(2)}
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
  totalSpending: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
});
