import React from "react";
import { StyleSheet, Text, View } from "react-native";
import moment from "moment";

const ItemTransaction = ({ item }) => {
  // console.log(item);
  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {moment(item.date.seconds, "X").format("ddd, D MMM")}
      </Text>
      <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
    </View>
  );
};

export default ItemTransaction;

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
  date: {
    flex: 3,
    fontSize: 16,
  },
  price: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
  },
});
