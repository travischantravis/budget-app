import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import myFirebase from "../configFiles/firebase";
import moment from "moment";
import generateTotalSpending from "../utilities/generateTotalSpending";

const HomeScreen = ({ navigation }) => {
  const [dayTotals, setdayTotals] = useState();
  const [weekTotal, setWeekTotal] = useState(0);
  const currentYearWeek =
    moment(new Date()).year().toString() + moment(new Date()).week().toString();

  const dbh = myFirebase.firestore();

  const getAllTotals = () => {
    dbh
      .collection("dayTotal")
      .where("yearWeek", "==", "202031") //currentYearWeek
      .orderBy("timestamp")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setdayTotals(data);
        setWeekTotal(generateTotalSpending(data, "totalSpending"));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllTotals();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.topTitle}>This week's spending</Text>
        <Text style={styles.weekTotal}>${weekTotal}</Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  topTitle: {
    color: "#999",
    fontWeight: "bold",
    fontSize: 20,
  },
  weekTotal: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
  },
});
