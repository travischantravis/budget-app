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
    <View>
      <Formik
        initialValues={{ name: "", price: "" }}
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
              onChangeText={props.handleChange("name")}
              value={props.values.name}
            />
            <TextInput
              style={{ ...styles.textInput, flex: 1 }}
              placeholder="Price"
              onChangeText={props.handleChange("price")}
              value={props.values.price}
              keyboardType="numeric"
            />
            <Button title="Add" onPress={props.handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
};

export default SpendingItemForm;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
  },
  textInput: {
    fontSize: 16,
    backgroundColor: "#efefef",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },

  nameInput: {
    flex: 4,
    marginRight: 10,
  },
});
