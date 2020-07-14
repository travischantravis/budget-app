import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

const SpendingItem = ({ item }) => {
  // console.log(item);
  return (
    <View style={styles.container}>
      <Text style={styles.spendingName}>{item.name}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );
};

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
  spendingName: {
    flex: 3,
    fontSize: 16,
  },
  price: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
});

export default SpendingItem;
