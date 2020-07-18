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
import dummyData from "../utilities/dummyData";
import generateWeekData from "../utilities/generateWeekData";
import generateWeekData1 from "../utilities/generateWeekData1";
import generateTotalSpending from "../utilities/generateTotalSpending";
import myFirebase from "../configFiles/firebase";

const WeekScreen = ({ navigation }) => {
  // const [weeklySpendings, setweeklySpendings] = useState(
  //   generateWeekData(dummyData)
  // );
  // console.log(weeklySpendings);
  const [weeklySpendings, setweeklySpendings] = useState();

  // Firebase
  const dbh = myFirebase.firestore();

  const getAllSpendings = async () => {
    const snapshot = await dbh.collection("spendings").get();
    const data = snapshot.docs.map((doc) => doc.data());
    setweeklySpendings(generateWeekData1(data));
  };
  useEffect(() => {
    getAllSpendings();
    console.log(weeklySpendings);
  }, []);

  const renderDays = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.push("Daily", { date: item.timestamp })}
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
