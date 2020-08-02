import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import myFirebase from "../configFiles/firebase";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
} from "victory-native";

import generateWeekDates from "../utilities/generateWeekDates";
import WeekChart from "../components/WeekChart";
import categoriesArray from "../utilities/categories";

const AnalyticsScreen = ({ navigation }) => {
  const [dayTotals, setdayTotals] = useState();
  const [yearWeeks, setYearWeeks] = useState();
  const [selectedYearWeek, setSelectedYearWeek] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dbh = myFirebase.firestore();

  const WeekSummary = ({ item }) => {
    const year = item.yearWeek.substring(0, 4);
    const week = item.yearWeek.substring(4);
    const weekDates = generateWeekDates(year, week);

    return (
      <View style={styles.weekSummaryContainer}>
        <View style={styles.weekSummaryDesc}>
          <View style={styles.weekTitles}>
            <Text style={styles.weekDate}>
              {weekDates.start + " - " + weekDates.end}
            </Text>
            <Text style={styles.weekTotal}>Total: ${item.totalSpending}</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Week", {
                yearWeek: item.yearWeek,
              })
            }
          >
            <Text style={styles.learnMore}>{">"}</Text>
          </TouchableOpacity>
        </View>
        <WeekChart item={item} />
      </View>
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
        setYearWeeks(formattedYearWeek);
        setIsRefreshing(false);
      })
      .catch((err) => console.log(err));
  };

  // [One-time] Run code in firebase functions
  const foo = () => {
    fetch(
      "http://localhost:5000/spendings-138e4/us-central1/app/api/day/total/new"
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
      <View style={styles.topContainer}>
        <Text style={styles.topTitle}>My Analytics</Text>
      </View>
      <View style={styles.chartContainer}>
        {yearWeeks ? (
          <VictoryChart
            domainPadding={{ x: 16 }}
            height={220}
            padding={{ top: 40, left: 40, right: 40, bottom: 60 }}
            events={[
              {
                childName: "myBarChart",
                target: "data",
                eventHandlers: {
                  onPress: () => {
                    return [
                      {
                        childName: "myBarChart",
                        target: "data",
                        eventKey: "all",
                        mutation: () => {
                          return { style: { fill: "lightblue" } };
                        },
                      },
                      {
                        childName: "myBarChart",
                        target: "data",
                        mutation: ({ datum }) => {
                          setSelectedYearWeek(datum);
                          return { style: { fill: "#62AEC4" } };
                        },
                      },
                    ];
                  },
                },
              },
            ]}
          >
            {/* <VictoryStack
              name="myBarChart"
              colorScale={["#72C7EC", "#1FBBD7", "#117DAC"]}
            >
              {categoriesArray.map((category) => {
                return (
                  <VictoryBar
                    key={category}
                    data={yearWeeks}
                    x={(d) => {
                      const year = d.yearWeek.substring(0, 4);
                      const week = d.yearWeek.substring(4);
                      const weekDates = generateWeekDates(year, week);
                      return weekDates.start;
                    }}
                    y={(d) => {
                      return d[category];
                    }}
                    barWidth={25}
                  />
                );
              })}
            </VictoryStack> */}
            <VictoryBar
              name="myBarChart"
              data={yearWeeks}
              x={(d) => {
                const year = d.yearWeek.substring(0, 4);
                const week = d.yearWeek.substring(4);
                const weekDates = generateWeekDates(year, week);
                return weekDates.start;
              }}
              y={(d) => d.totalSpending}
              barWidth={25}
              cornerRadius={5}
              style={{ data: { fill: "lightblue" } }}
            />
            <VictoryAxis />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        ) : null}
      </View>
      <View>
        {selectedYearWeek ? <WeekSummary item={selectedYearWeek} /> : null}
      </View>
    </View>
  );
};

export default AnalyticsScreen;

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
  chartContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  weekSummaryContainer: {
    backgroundColor: "#eee",
    marginTop: 10,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  weekSummaryDesc: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDate: {
    fontWeight: "bold",
    fontSize: 20,
  },
  weekTotal: {
    fontSize: 15,
    paddingTop: 5,
  },
  learnMore: {
    fontSize: 25,
    color: "#999",
    fontWeight: "bold",
    padding: 5,
  },
});
