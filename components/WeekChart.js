import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
} from "victory-native";
import moment from "moment";
import { groupBy } from "lodash";

import myFirebase from "../configFiles/firebase";

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
        // console.log(data[0]);
        setWeekSpending(data);

        // console.log(_.groupBy());
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
            <VictoryBar
              name="myBarChart2"
              data={weekSpending}
              x={(d) => {
                return (
                  moment(d.date).format("ddd") +
                  "\n" +
                  moment(d.date).format("DD")
                );
              }}
              y={(d) => d.totalSpending}
              barWidth={16}
              cornerRadius={5}
              style={{ data: { fill: "lightblue" } }}
              animate={{
                duration: 500,
                onLoad: { duration: 500 },
              }}
            />
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
