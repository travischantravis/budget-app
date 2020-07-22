import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import myFirebase from "../configFiles/firebase";
import moment from "moment";

import ItemTransaction from "../components/ItemTransaction";

const ItemScreen = ({ route, navigation }) => {
  const { item } = route.params;
  // console.log(item);
  const [items, setItems] = useState();
  const dbh = myFirebase.firestore();

  const deleteItem = () => {
    dbh
      .collection("spendings")
      .doc(item.id)
      .delete()
      .then(() => {
        console.log("Item deleted with id ", item.id);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const deleteAlert = () => {
    Alert.alert(
      "Do you want to delete this item?",
      "You cannot undo this action",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("");
          },
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteItem();
            navigation.goBack();
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  // Add a button in the header
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button color="red" onPress={() => deleteAlert()} title="Delete" />
      ),
    });
  }, [navigation]);

  const getData = () => {
    dbh
      .collection("spendings")
      .where("itemName", "==", item.itemName)
      .orderBy("date", "desc")
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { ...doc.data(), ...{ id: doc.id.toString() } };
        });

        setItems(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  const renderSpending = ({ item }) => {
    return <ItemTransaction item={item} />;
  };

  return (
    <>
      <View style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{item.itemName}</Text>
          <Text style={styles.itemDescription}>
            Date: {moment(item.date.seconds, "X").format("ddd, D MMM")}
          </Text>
          <Text style={styles.itemDescription}>Price: ${item.price}</Text>
        </View>
        <View style={styles.midContainer}>
          <Text style={styles.smallTitle}>
            Recent transactions of {item.itemName}
          </Text>

          <FlatList
            data={items}
            renderItem={renderSpending}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

export default ItemScreen;

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
  title: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 30,
    paddingBottom: 5,
  },
  itemDescription: {
    fontSize: 16,
    color: "#555",
  },
  smallTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#999",
    marginBottom: 10,
  },
});
