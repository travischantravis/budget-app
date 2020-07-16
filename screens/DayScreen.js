import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import SpendingItem from "../components/SpendingItem";
import SpendingItemForm from "../components/SpendingItemForm";

const SpendingData = [
  {
    name: "Chipotle",
    price: 7.85,
    id: "1",
  },
  {
    name: "Banana",
    price: 1.65,
    id: "2",
  },
  {
    name: "Chicken Thighs",
    price: 5.0,
    id: "3",
  },
];

const DayScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [spendings, setSpendings] = useState(SpendingData);

  const openAddSpendingForm = () => {
    // console.log("open");
    setModalVisible(true);
  };

  const addSpendingItem = (spendingItem) => {
    spendingItem.id = Math.random().toString();
    setSpendings((currentItems) => {
      return [spendingItem, ...currentItems];
    });
    setModalVisible(false);
  };

  const renderSpending = ({ item }) => <SpendingItem item={item} />;

  const calculateTotalSpending = (items) => {
    let sum = 0;
    Object.values(items).forEach((item) => (sum += parseFloat(item.price)));
    return sum;
  };

  return (
    <>
      <StatusBar style="auto" />

      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.topContainerTitle}>Total spendings today</Text>
          <Text style={styles.totalSpendings}>
            ${calculateTotalSpending(spendings).toFixed(2)}
          </Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.midContainerTitle}>Recent spendings</Text>
          <FlatList
            data={spendings}
            renderItem={renderSpending}
            keyExtractor={(item) => item.id}
          />
          <TouchableHighlight
            style={styles.openButtonContainer}
            onPress={openAddSpendingForm}
            underlayColor="dodgerblue"
            activeOpacity={0.2}
          >
            <Text style={styles.openButtonText}>+</Text>
          </TouchableHighlight>
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
                  <SpendingItemForm addSpendingItem={addSpendingItem} />
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
  totalSpendings: {
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
  modalCenterView: {
    opacity: 0,
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

export default DayScreen;
