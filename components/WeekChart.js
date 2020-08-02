import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
} from "victory-native";
import moment from "moment";

import myFirebase from "../configFiles/firebase";
import categoriesArray from "../utilities/categories";

const WeekChart = ({ item }) => {
  const dbh = myFirebase.firestore();
  const { yearWeek } = item;
  const [weekSpending, setWeekSpending] = useState();

  const getWeekSpending = () => {
    dbh
      .collection("dayTotal")
      .where("yearWeek", "==", yearWeek)
      .orderBy("timestamp", "asc")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setWeekSpending(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getWeekSpending();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {weekSpending ? (
          <VictoryChart
            domainPadding={{ x: 16 }}
            height={200}
            padding={{ top: 40, left: 30, right: 40, bottom: 60 }}
          >
            <VictoryStack colorScale={["#72C7EC", "#1FBBD7", "#117DAC"]}>
              {categoriesArray.map((category) => {
                return (
                  <VictoryBar
                    key={category}
                    data={weekSpending}
                    x={(d) => {
                      return (
                        moment(d.date).format("ddd") +
                        "\n" +
                        moment(d.date).format("DD")
                      );
                    }}
                    y={(d) => {
                      return d[category];
                    }}
                    barWidth={25}
                    // cornerRadius={index === 2 ? 5 : 0}
                    animate={{
                      duration: 500,
                      onLoad: { duration: 500 },
                    }}
                  />
                );
              })}
            </VictoryStack>
            <VictoryAxis />
            <VictoryAxis dependentAxis />
          </VictoryChart>
        ) : null}
      </View>
    </View>
  );
};

export default WeekChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eee",
  },
  chartContainer: {
    height: 200,
  },
});
