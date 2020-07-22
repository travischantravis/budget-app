import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
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

  useEffect(() => {
    getAllSpendings();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text>Summary</Text>
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
