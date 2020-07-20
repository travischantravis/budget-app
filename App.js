import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import moment from "moment";

// Screens
import DayScreen from "./screens/DayScreen";
import WeekScreen from "./screens/WeekScreen";
import ItemScreen from "./screens/ItemScreen";

const WeekStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const WeekStackScreen = () => {
  return (
    <WeekStack.Navigator initialRouteName="Week">
      <WeekStack.Screen
        name="Week"
        component={WeekScreen}
        options={{ title: "Week" }}
      />
      <WeekStack.Screen
        name="Day"
        component={DayScreen}
        options={({ route }) => ({
          title: moment(route.params.timestamp, "X").format("D MMMM"),
        })}
      />
      <WeekStack.Screen
        name="Item"
        component={ItemScreen}
        options={({ route }) => ({
          title: route.params.item.itemName,
        })}
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
          {/* <Drawer.Screen name="Item" component={ItemScreen} /> */}
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
