import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DaySummary from "../components/DaySummary";
import generateWeekData from "../utilities/generateWeekData";
import generateTotalSpending from "../utilities/generateTotalSpending";
import myFirebase from "../configFiles/firebase";

const WeekScreen = ({ navigation }) => {
  const [weeklySpendings, setWeeklySpendings] = useState();
  const dbh = myFirebase.firestore();

  const getAllSpendings = async () => {
    const snapshot = await dbh.collection("spendings").get();
    const data = snapshot.docs.map((doc) => doc.data());
    setWeeklySpendings(generateWeekData(data));
  };

  useEffect(() => {
    getAllSpendings();
    // console.log(weeklySpendings);
  }, []);

  const renderDays = ({ item }) => {
    // console.log(item);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("Daily", {
            timestamp: item.timestamp,
          })
        }
      >
        <DaySummary item={item} />
      </TouchableOpacity>
    );
  };

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
            {weeklySpendings &&
              generateTotalSpending(weeklySpendings, "totalSpending").toFixed(
                2
              )}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>This week's activity</Text>
          <FlatList
            data={weeklySpendings}
            renderItem={renderDays}
            keyExtractor={(item) => item.timestamp.toString()}
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
