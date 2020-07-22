import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import myFirebase from "../configFiles/firebase";
import moment from "moment";

const groupByWeek = (data) => {
  // console.log(data);
};

const YearScreen = ({ navigation }) => {
  const dbh = myFirebase.firestore();
  const [spendings, setSpendings] = useState();

  const getAllSpendings = () => {
    dbh
      .collection("spendings")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        setSpendings(groupByWeek(data));
      })
      .catch((err) => console.log(err));
  };

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
    // getAllSpendings();
    foo();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text>Summary</Text>
      <Button title="week" onPress={() => navigation.push("Week")} />
      <Text>{moment("1595314800", "X").week()}</Text>
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
});
