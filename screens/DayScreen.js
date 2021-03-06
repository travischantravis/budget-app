import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import moment from "moment";

import SpendingItem from "../components/SpendingItem";
import SpendingItemForm from "../components/SpendingItemForm";
import myFirebase from "../configFiles/firebase";
import generateTotalSpending from "../utilities/generateTotalSpending";
import addSpending from "../utilities/addSpending";

const DayScreen = ({ route, navigation }) => {
  const timestamp = route.params.timestamp;
  const date = new Date(timestamp * 1000);

  const [modalVisible, setModalVisible] = useState(false);
  const [dailySpendings, setDailySpendings] = useState();
  const [isMounted, setIsMounted] = useState(true); // Mount status

  const dbh = myFirebase.firestore();

  const getDaySpendings = () => {
    dbh
      .collection("spendings")
      .where("date", "==", date)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          // Flatten the object
          let tempData = doc.data();
          tempData.date = tempData.date.seconds;
          tempData.id = doc.id.toString();
          return tempData;
        });
        if (isMounted) {
          setDailySpendings(data);
        }
      });
  };

  useEffect(() => {
    setIsMounted(true);
    getDaySpendings();

    // Clean up function
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Set title of top bar
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: moment(timestamp, "X").format("D MMMM"),
    });
  }, [navigation, timestamp]);

  const openAddSpendingForm = () => {
    setModalVisible(true);
  };

  // Form handler
  const addSpendingItem = (spendingItem) => {
    addSpending(spendingItem);
    setModalVisible(false);
  };

  const renderSpending = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("Item", {
            item,
          })
        }
      >
        <SpendingItem item={item} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar style="auto" />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>
            Total spendings on {moment(timestamp, "X").format("ddd, D MMM")}
          </Text>
          <Text style={styles.totalSpending}>
            $
            {dailySpendings &&
              generateTotalSpending(dailySpendings, "price").toFixed(2)}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>Recent spendings</Text>
          <FlatList
            data={dailySpendings}
            renderItem={renderSpending}
            keyExtractor={(item) => item.id}
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
                    date={date}
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
    // bottom: 0,
  },
});

export default DayScreen;
