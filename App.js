import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
