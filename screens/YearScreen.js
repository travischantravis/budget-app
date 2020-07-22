import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from "react-native";
import myFirebase from "../configFiles/firebase";

import generateWeekDates from "../utilities/generateWeekDates";

const YearScreen = ({ navigation }) => {
  const dbh = myFirebase.firestore();
  const [dayTotals, setdayTotals] = useState();
  const [yearWeek, setYearWeek] = useState();

  const renderWeek = ({ item }) => {
    const year = item.substring(0, 4);
    const week = item.substring(4);
    const weekDates = generateWeekDates(year, week);

    return (
      <TouchableOpacity
        style={styles.weekButton}
        onPress={() =>
          navigation.push("Week", {
            yearWeek: item,
          })
        }
      >
        <Text>{weekDates.start + " - " + weekDates.end}</Text>
      </TouchableOpacity>
    );
  };

  const getAllTotals = () => {
    dbh
      .collection("dayTotal")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setdayTotals(data);
        const uniqueYearWeek = [...new Set(data.map((item) => item.yearweek))];
        setYearWeek(uniqueYearWeek);
      })
      .catch((err) => console.log(err));
  };

  // [One-time] Run code in firebase functions
  const foo = () => {
    fetch(
      "http://localhost:5000/spendings-138e4/us-central1/app/api/day/total/listen"
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getAllTotals();
    // foo();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text>Select a week</Text>
      {/* <Button title="week" onPress={() => navigation.push("Week")} /> */}
      <FlatList
        data={yearWeek}
        renderItem={renderWeek}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default YearScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  weekButton: {
    margin: 10,
    fontSize: 16,
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
});
