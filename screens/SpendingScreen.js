import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { StatusBar } from "expo-status-bar";
import SpendingItem from "../components/SpendingItem";

const ItemData = [
  {
    name: "Chipotle",
    price: 7.85,
    id: "1",
  },
  {
    name: "Banana",
    price: 1.65,
    id: "2",
  },
  {
    name: "Chicken Thighs",
    price: 5.0,
    id: "3",
  },
];

const SpendingScreen = () => {
  const renderSpending = ({ item }) => <SpendingItem item={item} />;

  const calculateTotalSpending = (items) => {
    let sum = 0;
    Object.values(items).forEach((item) => (sum += item.price));
    return sum;
  };

  return (
    <>
      <StatusBar style="auto" />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.totalSpendingsTitle}>Total spendings</Text>
          <Text style={styles.totalSpendings}>
            ${calculateTotalSpending(ItemData).toFixed(2)}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.recentSpendingsTitle}>Recent spendings</Text>
          <FlatList
            data={ItemData}
            renderItem={renderSpending}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    backgroundColor: "#fff",
    padding: 30,
  },
  midContainer: {
    backgroundColor: "#eee",
    borderRadius: 20,
    borderColor: "#eee",
    padding: 30,
    flex: 1,
  },

  totalSpendingsTitle: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 20,
  },
  totalSpendings: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 40,
  },

  recentSpendingsTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#999",
    marginBottom: 10,
  },
});

export default SpendingScreen;
