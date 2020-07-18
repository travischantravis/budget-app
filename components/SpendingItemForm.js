import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";

const spendingItemSchema = yup.object({
  name: yup.string().required().min(2),

  price: yup
    .string()
    .required()
    .test("is-num", "Price must be a number", (val) => {
      return parseFloat(val) > 0;
    }),
});

const SpendingItemForm = ({ addSpendingItem }) => {
  return (
    <>
      <Formik
        initialValues={{ itemName: "", price: "" }}
        // validationSchema={spendingItemSchema}
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
            <TextInput
              style={{ ...styles.textInput, ...styles.priceInput }}
              placeholder="Price"
              onChangeText={props.handleChange("price")}
              value={props.values.price}
              keyboardType="numeric"
            />
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
});
