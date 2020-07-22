import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  RefreshControl,
  Modal,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DaySummary from "../components/DaySummary";
import SpendingItemForm from "../components/SpendingItemForm";
import generateTotalSpending from "../utilities/generateTotalSpending";
import myFirebase from "../configFiles/firebase";
import addSpending from "../utilities/addSpending";
import generateWeekDates from "../utilities/generateWeekDates";

const WeekScreen = ({ navigation, route }) => {
  const [weekSpending, setWeekSpending] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dbh = myFirebase.firestore();

  // Date variables
  const { yearWeek } = route.params;
  const year = yearWeek.substring(0, 4);
  const week = yearWeek.substring(4);
  const weekDates = generateWeekDates(year, week);
  // console.log(yearWeek, year, week);

  const getWeekSpending = () => {
    dbh
      .collection("dayTotal")
      .where("yearweek", "==", yearWeek)
      .orderBy("timestamp", "asc")
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot.docs.length);
        const data = querySnapshot.docs.map((doc) => {
          return doc.data();
        });
        // console.log(data);
        setWeekSpending(data);
        setIsRefreshing(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (yearWeek) getWeekSpending();
  }, []);

  const renderDays = ({ item }) => {
    // console.log(item);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("Day", {
            timestamp: item.timestamp,
          })
        }
      >
        <DaySummary item={item} />
      </TouchableOpacity>
    );
  };

  const handleRefresh = () => {
    // console.log(isRefreshing);
    setIsRefreshing(true);
    // getAllSpendings();
    getWeekSpending();
  };

  const openAddSpendingForm = () => {
    // console.log("open");
    setModalVisible(true);
  };

  // Form handler
  const addSpendingItem = (spendingItem) => {
    addSpending(spendingItem);
    setModalVisible(false);
  };

  // Set title of top bar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: weekDates.start + " - " + weekDates.end,
    });
  }, [navigation]);

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
            {weekSpending &&
              generateTotalSpending(weekSpending, "totalSpending").toFixed(2)}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>This week's activity</Text>
          <FlatList
            data={weekSpending}
            renderItem={renderDays}
            keyExtractor={(item) => item.timestamp.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            }
          />
          <TouchableOpacity
            style={styles.openButtonContainer}
            onPress={openAddSpendingForm}
            activeOpacity={0.8}
          >
            <Text style={styles.openButtonText}>+</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent="true"
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setModalVisible(false);
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <SpendingItemForm
                    addSpendingItem={addSpendingItem}
                    date={new Date()}
                  />
                  <Button
                    onPress={() => setModalVisible(false)}
                    title="Close"
                  />
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
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

  openButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "dodgerblue",
    position: "absolute",
    bottom: 25,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  openButtonText: {
    color: "#fff",
    fontSize: 30,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // position: "absolute",
    width: "100%",
    top: 20,
    // bottom: 25,
  },
});
