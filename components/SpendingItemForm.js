import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";

const spendingItemSchema = yup.object({
  itemName: yup.string().required().min(2).label("Item name"),

  category: yup.string().required().min(2).label("Category"),

  price: yup
    .string()
    .required()
    .test("is-num", "Price must be a non-negative number", (val) => {
      return parseFloat(val) >= 0;
    })
    .label("Price"),
});

const SpendingItemForm = ({ addSpendingItem, date }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleDatepicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  return (
    <>
      <Formik
        initialValues={{
          itemName: "",
          category: "",
          price: "",
          date: date,
        }}
        validationSchema={spendingItemSchema}
        onSubmit={(values, actions) => {
          actions.resetForm();
          console.log(values);
          addSpendingItem(values);
        }}
      >
        {(props) => (
          <View style={styles.container}>
            <TextInput
              style={{ ...styles.textInput, ...styles.nameInput }}
              placeholder="Item"
              onChangeText={props.handleChange("itemName")}
              value={props.values.itemName}
            />
            {props.errors.itemName && props.touched.itemName ? (
              <Text style={styles.errorMsg}>{props.errors.itemName}</Text>
            ) : null}

            <TextInput
              style={{ ...styles.textInput, ...styles.nameInput }}
              placeholder="Category"
              onChangeText={props.handleChange("category")}
              value={props.values.category}
            />
            {props.errors.category && props.touched.category ? (
              <Text style={styles.errorMsg}>{props.errors.category}</Text>
            ) : null}

            <TextInput
              style={{ ...styles.textInput, ...styles.priceInput }}
              placeholder="Price"
              onChangeText={props.handleChange("price")}
              value={props.values.price}
              keyboardType="numeric"
            />
            {props.errors.price && props.touched.price ? (
              <Text style={styles.errorMsg}>{props.errors.price}</Text>
            ) : null}

            <Button onPress={toggleDatepicker} title="Select date" />

            {showDatePicker && (
              <DateTimePicker
                style={{ width: "100%", backgroundColor: "white" }}
                value={props.values.date}
                mode="date"
                display="default"
                onChange={(e, dateString) => {
                  props.setFieldValue("date", new Date(dateString));
                }}
              />
            )}
            <Button title="Add item" onPress={props.handleSubmit} />
          </View>
        )}
      </Formik>
    </>
  );
};

export default SpendingItemForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
  },
  textInput: {
    fontSize: 16,
    backgroundColor: "#efefef",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  nameInput: {
    width: "100%",
  },
  priceInput: {
    width: 100,
  },
  errorMsg: {
    color: "red",
  },
});
