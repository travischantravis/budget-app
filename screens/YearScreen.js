import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import myFirebase from "../configFiles/firebase";

import generateWeekDates from "../utilities/generateWeekDates";

const YearScreen = ({ navigation }) => {
  const [dayTotals, setdayTotals] = useState();
  const [yearWeeks, setYearWeeks] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dbh = myFirebase.firestore();

  const renderWeeks = ({ item }) => {
    const year = item.yearWeek.substring(0, 4);
    const week = item.yearWeek.substring(4);
    const weekDates = generateWeekDates(year, week);

    return (
      <TouchableOpacity
        style={styles.weekButton}
        onPress={() =>
          navigation.push("Week", {
            yearWeek: item.yearWeek,
          })
        }
      >
        <Text>{weekDates.start + " - " + weekDates.end}</Text>
        <Text>Total: ${item.totalSpending}</Text>
      </TouchableOpacity>
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    getAllTotals();
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

        // Group data by week
        const uniqueYearWeek = [...new Set(data.map((item) => item.yearWeek))];
        let formattedYearWeek = uniqueYearWeek.map((d, i) => {
          return { yearWeek: d, id: i.toString(), totalSpending: 0 };
        });

        // Compute each week's spending
        data.forEach((dayTotal) => {
          let index = formattedYearWeek.findIndex(
            (d) => d.yearWeek === dayTotal.yearWeek
          );
          formattedYearWeek[index].totalSpending += dayTotal.totalSpending;
          formattedYearWeek[index].totalSpending = parseFloat(
            formattedYearWeek[index].totalSpending.toFixed(2)
          );
        });
        console.log(formattedYearWeek);
        setYearWeeks(formattedYearWeek);
        setIsRefreshing(false);
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
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text>Select a week</Text>
      <FlatList
        data={yearWeeks}
        renderItem={renderWeeks}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
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
