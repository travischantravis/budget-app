import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import myFirebase from "../configFiles/firebase";

const HomeScreen = ({ navigation }) => {
  const [dayTotals, setdayTotals] = useState();
  const [yearWeeks, setYearWeeks] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dbh = myFirebase.firestore();

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
          return {
            yearWeek: d,
            id: i.toString(),
            totalSpending: 0,
            grocery: 0,
            dining: 0,
            others: 0,
          };
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
          formattedYearWeek[index].grocery += dayTotal.grocery;
          formattedYearWeek[index].grocery = parseFloat(
            formattedYearWeek[index].grocery.toFixed(2)
          );
          formattedYearWeek[index].dining += dayTotal.dining;
          formattedYearWeek[index].dining = parseFloat(
            formattedYearWeek[index].dining.toFixed(2)
          );
          formattedYearWeek[index].others += dayTotal.others;
          formattedYearWeek[index].others = parseFloat(
            formattedYearWeek[index].others.toFixed(2)
          );
        });

        // Sort yearWeek in ascending order
        formattedYearWeek.sort(
          (a, b) => parseInt(a.yearWeek) - parseInt(b.yearWeek)
        );
        console.log(formattedYearWeek);
        setYearWeeks(formattedYearWeek);
        setIsRefreshing(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllTotals();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.topTitle}>My Spendings</Text>
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
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
  },
});
