import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DaySummary from "../components/DaySummary";
import dummyData from "../utilities/dummyData";
import generateWeekData from "../utilities/generateWeekData";
import generateTotalSpending from "../utilities/generateTotalSpending";

const WeekScreen = ({ navigation }) => {
  const [weeklySpendings, setweeklySpendings] = useState(
    generateWeekData(dummyData)
  );
  // console.log(weeklySpendings);

  async function getFromApi() {
    fetch("http://localhost:5000/spendings-138e4/us-central1/app/test")
      // .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  getFromApi();

  const renderDays = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.push("Daily", { date: item.date })}
    >
      <DaySummary item={item} />
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>
            Total spendings this week
          </Text>
          <Text style={styles.totalSpending}>
            $
            {generateTotalSpending(weeklySpendings, "totalSpending").toFixed(2)}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>This week's activity</Text>
          <FlatList
            data={weeklySpendings}
            renderItem={renderDays}
            keyExtractor={(item) => item.date.toString()}
          />
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
  totalSpending: {
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
