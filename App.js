import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import * as firebase from "firebase";
// import "firebase/firestore";

// Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyC0jvZNdYvolKwoULls3XClaxk0K7XHS6s",
//   authDomain: "spendings-138e4.firebaseapp.com",
//   databaseURL: "https://spendings-138e4.firebaseio.com",
//   projectId: "spendings-138e4",
//   storageBucket: "spendings-138e4.appspot.com",
//   messagingSenderId: "396385506960",
//   appId: "1:396385506960:web:21272430c5fc20039fea15",
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const dbh = firebase.firestore();
// dbh.collection("test").doc("mario").set({
//   employment: "plumber",
//   outfitColor: "red",
//   specialAttack: "fireball",
// });

// Navigation
import DayScreen from "./screens/DayScreen";
import WeekScreen from "./screens/WeekScreen";

const WeekStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const WeekStackScreen = () => {
  return (
    <WeekStack.Navigator initialRouteName="Weekly">
      <WeekStack.Screen
        name="Weekly"
        component={WeekScreen}
        options={{ title: "Week" }}
      />
      <WeekStack.Screen
        name="Daily"
        component={DayScreen}
        options={{ title: "Day" }}
      />
    </WeekStack.Navigator>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Week">
          <Drawer.Screen name="Week" component={WeekStackScreen} />
          {/* <Drawer.Screen name="Today" component={DayScreen} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
});
